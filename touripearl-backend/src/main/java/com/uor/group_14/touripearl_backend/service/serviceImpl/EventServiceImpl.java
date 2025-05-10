package com.uor.group_14.touripearl_backend.service.serviceImpl;

import com.uor.group_14.touripearl_backend.dto.request.event.EventCreateRequestDto;
import com.uor.group_14.touripearl_backend.dto.response.event.EventDetailResponseDto;
import com.uor.group_14.touripearl_backend.dto.response.event.EventImageResponseDto;
import com.uor.group_14.touripearl_backend.dto.response.search.StandardSearchResponseDto;
import com.uor.group_14.touripearl_backend.entity.applicationUser.ApplicationUser;
import com.uor.group_14.touripearl_backend.entity.events.Event;
import com.uor.group_14.touripearl_backend.entity.events.EventImages;
import com.uor.group_14.touripearl_backend.entity.events.embeds.Accessibility;
import com.uor.group_14.touripearl_backend.entity.events.embeds.Restrictions;
import com.uor.group_14.touripearl_backend.entity.events.embeds.TicketPrice;
import com.uor.group_14.touripearl_backend.entity.events.entityEnum.EventImageType;
import com.uor.group_14.touripearl_backend.exception.DuplicateEntryException;
import com.uor.group_14.touripearl_backend.exception.EntryNotFoundException;
import com.uor.group_14.touripearl_backend.repository.ApplicationUserRepository;
import com.uor.group_14.touripearl_backend.repository.event.EventRepository;
import com.uor.group_14.touripearl_backend.service.EventService;
import com.uor.group_14.touripearl_backend.util.CommonFileSavedBinaryDataDto;
import com.uor.group_14.touripearl_backend.util.FileExtractor;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.sql.SQLException;
import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class EventServiceImpl implements EventService {
    private final EventRepository eventRepository;
    private final FileServiceImpl fileServiceImpl;
    private final FileExtractor fileExtractor;
    private final ApplicationUserRepository applicationUserRepository;
    private static final String DIRECTORY = "uploads/events/";
    private static final String BUCKET = "touripearl-data";

    @Transactional
    @Override
    public EventDetailResponseDto createEvent(MultipartFile coverImage, MultipartFile mainImage, List<MultipartFile> subImages, EventCreateRequestDto requestDto) throws SQLException, IOException {
        ApplicationUser user = getCurrentUser();
        validateEventTitle(requestDto.getTitle());

        Event event = buildEvent(requestDto, user);
        Set<EventImages> images = processEventImages(coverImage, mainImage, subImages, event);

        event.setImages(images);
        event.setUpdatedBy(user);
        eventRepository.save(event);
        return null;
    }

    @Override
    public Page<EventDetailResponseDto> searchByKeywordAndFilters(int page, int size, LocalDateTime startDate, LocalDateTime endDate, String keyword) {
        PageRequest pageRequest = PageRequest.of(page, size);
        Page<Event> events = eventRepository.searchByKeywordAndFilters(keyword, startDate, endDate, pageRequest);
        return events.map(this::mapEvents);
    }

    @Override
    public Page<EventDetailResponseDto> findUpcomingEvents(int page, int size) {
        Pageable pageRequest = PageRequest.of(page, size);
        Page<Event> events = eventRepository.findUpcomingEvents(LocalDateTime.now(), pageRequest);
        return events.map(this::mapEvents);
    }

    @Override
    public EventDetailResponseDto getEventById(String id) {
        Event event = eventRepository.findById(id).orElseThrow(() -> new EntryNotFoundException("Event not found"));
        return mapEvents(event);
    }

    @Transactional
    @Override
    public EventDetailResponseDto updateEvent(String id, EventCreateRequestDto eventDetails) {
        ApplicationUser user = getCurrentUser();
        Event existingEvent = eventRepository.findById(id).orElseThrow(() -> new EntryNotFoundException("Event not found"));

        updateEventDetails(existingEvent, eventDetails, user);
        try {
            eventRepository.save(existingEvent);
        } catch (Exception e) {
            throw new DataIntegrityViolationException(e.getMessage());
        }
        return null;
    }

    @Override
    public Page<StandardSearchResponseDto> globalSearch(int page, int size, String keyword) {
        Pageable pageRequest = PageRequest.of(page, size);
        Page<Event> events = eventRepository.globalSearch(keyword, pageRequest);
        return events.map(event -> StandardSearchResponseDto.builder()
                .propertyId(event.getId())
                .propertyName(event.getTitle())
                .propertyImageUrl(event.getImages().stream()
                        .filter(eventImages -> eventImages.getEventImageType() == EventImageType.COVER_IMAGE)
                        .findFirst()
                        .map(eventImage -> fileExtractor.byteArrayToString(eventImage.getResourceUrl()))
                        .orElse(null))
                .build());
    }

    @Transactional
    @Override
    public void deleteEvent(String id) {
        Event event = eventRepository.findById(id).orElseThrow(() -> new EntryNotFoundException("event does not exist"));
        eventRepository.deleteById(id);
    }

    @Override
    public Map<String, Long> getEventCounts() {
        return Map.of(
                "ALL", eventRepository.countTotalEvents(),
                "UPCOMING", eventRepository.countUpcomingEvents(),
                "PAST", eventRepository.countPastEvents()
        );
    }

    private EventDetailResponseDto mapEvents(Event event) {
        return EventDetailResponseDto.builder()
                .id(event.getId())
                .startDateTime(event.getStartDateTime())
                .description(event.getDescription())
                .endDateTime(event.getEndDateTime())
                .updateAt(event.getUpdateAt())
                .updatedBy(event.getUpdatedBy().getEmail())
                .highlights(event.getHighlights())
                .title(event.getTitle())
                .venue(event.getVenue())
                .weatherSuitability(event.getWeatherSuitability())
                .location(event.getLocation())
                .shortDescription(event.getShortDescription())
                .foreignPrice(event.getTicketPrice().getForeignPrice())
                .currencyType(event.getTicketPrice().getCurrencyType())
                .localPrice(event.getTicketPrice().getLocalPrice())
                .wheelchairAccessible(event.getAccessibility().isWheelchairAccessible())
                .familyFriendly(event.getAccessibility().isFamilyFriendly())
                .seniorFriendly(event.getAccessibility().isSeniorFriendly())
                .dressCode(event.getRestrictions().getDressCode())
                .minimumAge(event.getRestrictions().getMinimumAge())
                .photography(event.getRestrictions().getPhotography())
                .images(event.getImages().stream().map(image -> EventImageResponseDto.builder()
                        .eventImageResourceUrl(fileExtractor.byteArrayToString(image.getResourceUrl()))
                        .eventImageType(image.getEventImageType())
                        .build()).collect(Collectors.toSet()))
                .build();
    }

    private ApplicationUser getCurrentUser() {
        return applicationUserRepository.findByEmail(SecurityContextHolder.getContext().getAuthentication().getName())
                .orElseThrow(() -> new EntryNotFoundException("Invalid user"));
    }

    private void validateEventTitle(String title) {
        if (eventRepository.existsEventByTitleIgnoreCase(title)) {
            throw new DuplicateEntryException("This Event Exist with this title");
        }
    }

    private Event buildEvent(EventCreateRequestDto requestDto, ApplicationUser user) {
        return Event.builder()
                .id(UUID.randomUUID().toString())
                .endDateTime(requestDto.getEndDateTime())
                .startDateTime(requestDto.getStartDateTime())
                .title(requestDto.getTitle())
                .description(requestDto.getDescription())
                .accessibility(Accessibility.builder()
                        .familyFriendly(requestDto.isFamilyFriendly())
                        .seniorFriendly(requestDto.isSeniorFriendly())
                        .wheelchairAccessible(requestDto.isWheelchairAccessible())
                        .build())
                .highlights(requestDto.getHighlights())
                .shortDescription(requestDto.getShortDescription())
                .ticketPrice(TicketPrice.builder()
                        .localPrice(requestDto.getLocalPrice())
                        .currencyType(requestDto.getCurrencyType())
                        .foreignPrice(requestDto.getForeignPrice())
                        .build())
                .location(requestDto.getLocation())
                .venue(requestDto.getVenue())
                .restrictions(Restrictions.builder()
                        .dressCode(requestDto.getDressCode())
                        .minimumAge(requestDto.getMinimumAge())
                        .photography(requestDto.getPhotography())
                        .build())
                .weatherSuitability(requestDto.getWeatherSuitability())
                .updateAt(LocalDateTime.now())
                .build();
    }

    private Set<EventImages> processEventImages(MultipartFile coverImage, MultipartFile mainImage, List<MultipartFile> subImages, Event event) throws IOException, SQLException {
        Set<EventImages> images = new HashSet<>();
        images.add(createEventImage(coverImage, EventImageType.COVER_IMAGE, event));
        images.add(createEventImage(mainImage, EventImageType.MAIN_IMAGE, event));
        for (MultipartFile subImage : subImages) {
            images.add(createEventImage(subImage, EventImageType.SUB_IMAGE, event));
        }
        return images;
    }

    private EventImages createEventImage(MultipartFile image, EventImageType imageType, Event event) throws IOException, SQLException {
        CommonFileSavedBinaryDataDto imageData = fileServiceImpl.createResource(image, DIRECTORY, BUCKET);
        return EventImages.builder()
                .propertyId(UUID.randomUUID().toString())
                .eventImageType(imageType)
                .directory(imageData.getDirectory().getBytes())
                .hash(fileExtractor.blobToByteArray(imageData.getHash()))
                .resourceUrl(fileExtractor.blobToByteArray(imageData.getResourceUrl()))
                .event(event)
                .build();
    }

    private void updateEventDetails(Event existingEvent, EventCreateRequestDto eventDetails, ApplicationUser user) {
        existingEvent.setDescription(eventDetails.getDescription());
        existingEvent.setUpdatedBy(user);
        existingEvent.setUpdateAt(LocalDateTime.now());
        existingEvent.setAccessibility(Accessibility.builder()
                .familyFriendly(eventDetails.isFamilyFriendly())
                .seniorFriendly(eventDetails.isSeniorFriendly())
                .wheelchairAccessible(eventDetails.isWheelchairAccessible())
                .build());
        existingEvent.setEndDateTime(eventDetails.getEndDateTime());
        existingEvent.setStartDateTime(eventDetails.getStartDateTime());
        existingEvent.setHighlights(eventDetails.getHighlights());
        existingEvent.setLocation(eventDetails.getLocation());
        existingEvent.setRestrictions(Restrictions.builder()
                .photography(eventDetails.getPhotography())
                .minimumAge(eventDetails.getMinimumAge())
                .dressCode(eventDetails.getDressCode())
                .build());
        existingEvent.setTicketPrice(TicketPrice.builder()
                .foreignPrice(eventDetails.getForeignPrice())
                .currencyType(eventDetails.getCurrencyType())
                .localPrice(eventDetails.getLocalPrice())
                .build());
        existingEvent.setShortDescription(eventDetails.getShortDescription());
        existingEvent.setWeatherSuitability(eventDetails.getWeatherSuitability());
        existingEvent.setTitle(eventDetails.getTitle());
        existingEvent.setVenue(eventDetails.getVenue());
    }
}