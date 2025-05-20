package com.uor.group_14.touripearl_backend.service.serviceImpl;

import com.uor.group_14.touripearl_backend.dto.request.event.EventCreateRequestDto;
import com.uor.group_14.touripearl_backend.dto.response.event.EventDetailResponseDto;
import com.uor.group_14.touripearl_backend.entity.applicationUser.ApplicationUser;
import com.uor.group_14.touripearl_backend.entity.events.Event;
import com.uor.group_14.touripearl_backend.entity.events.EventImages;
import com.uor.group_14.touripearl_backend.entity.events.embeds.Accessibility;
import com.uor.group_14.touripearl_backend.entity.events.embeds.Restrictions;
import com.uor.group_14.touripearl_backend.entity.events.embeds.TicketPrice;
import com.uor.group_14.touripearl_backend.entity.events.entityEnum.CurrencyType;
import com.uor.group_14.touripearl_backend.entity.events.entityEnum.EventImageType;
import com.uor.group_14.touripearl_backend.exception.DuplicateEntryException;
import com.uor.group_14.touripearl_backend.exception.EntryNotFoundException;
import com.uor.group_14.touripearl_backend.repository.ApplicationUserRepository;
import com.uor.group_14.touripearl_backend.repository.event.EventRepository;
import com.uor.group_14.touripearl_backend.util.CommonFileSavedBinaryDataDto;
import com.uor.group_14.touripearl_backend.util.FileExtractor;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.mock.web.MockMultipartFile;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContext;
import org.springframework.security.core.context.SecurityContextHolder;

import java.time.LocalDateTime;
import java.util.*;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class EventServiceImplTest {

    @Mock
    private EventRepository eventRepository;

    @Mock
    private FileServiceImpl fileService;

    @Mock
    private FileExtractor fileExtractor;

    @Mock
    private ApplicationUserRepository applicationUserRepository;

    @Mock
    private SecurityContext securityContext;

    @Mock
    private Authentication authentication;

    @InjectMocks
    private EventServiceImpl eventService;

    private ApplicationUser testUser;
    private Event testEvent;
    private EventCreateRequestDto testEventDto;
    private MockMultipartFile testImage;
    private EventImages image;

    @BeforeEach
    void setUp() {
        testUser = new ApplicationUser();
        testUser.setEmail("test@example.com");

        testEvent = Event.builder()
                .id("test-id")
                .title("Test Event")
                .description("Test Description")
                .startDateTime(LocalDateTime.now())
                .endDateTime(LocalDateTime.now().plusDays(1))
                .ticketPrice(TicketPrice.builder()
                        .localPrice(1000)
                        .currencyType(CurrencyType.LKR)
                        .foreignPrice(1000)
                        .build())
                .restrictions(Restrictions.builder()
                        .dressCode("null")
                        .minimumAge(3)
                        .photography("null")
                        .build())
                .weatherSuitability("good")
                .venue("null")
                .location("null")
                .shortDescription("null")
                .highlights(Set.of("null","null2"))
                .accessibility(Accessibility.builder()
                        .wheelchairAccessible(true)
                        .seniorFriendly(true)
                        .familyFriendly(true)
                        .build())
                .build();

        testEventDto =EventCreateRequestDto.builder().build();
        testEventDto.setTitle("Test Event");
        testEventDto.setDescription("Test Description");
        testEventDto.setStartDateTime(LocalDateTime.now());
        testEventDto.setLocalPrice(1000);
        testEventDto.setCurrencyType(CurrencyType.LKR);
        testEventDto.setForeignPrice(1000);

        testImage = new MockMultipartFile(
                "image",
                "test.jpg",
                "image/jpeg",
                "test image content".getBytes()
        );
        image = EventImages.builder()
                .event(testEvent)
                .fileName("byte".getBytes())
                .hash("hash".getBytes())
                .resourceUrl("url".getBytes())
                .directory("directory".getBytes())
                .build();
    }

    @Test
    void createEvent_Success() throws Exception {
        when(securityContext.getAuthentication()).thenReturn(authentication);
        when(authentication.getName()).thenReturn("test@example.com");
        SecurityContextHolder.setContext(securityContext);
        // Arrange
        when(applicationUserRepository.findByEmail(any())).thenReturn(Optional.of(testUser));
        when(eventRepository.existsEventByTitleIgnoreCase(any())).thenReturn(false);
        when(fileService.createResource(any(), any(), any()))
                .thenReturn(CommonFileSavedBinaryDataDto.builder()
                        .directory("test/path")
                        .directory("url")
                        .build());

        // Act
        eventService.createEvent(testImage, testImage, new ArrayList<>(), testEventDto);

        // Assert
        verify(eventRepository, times(1)).save(any(Event.class));
    }

    @Test
    void createEvent_DuplicateTitle_ThrowsException() {
        when(securityContext.getAuthentication()).thenReturn(authentication);
        when(authentication.getName()).thenReturn("test@example.com");
        SecurityContextHolder.setContext(securityContext);
        // Arrange
        when(applicationUserRepository.findByEmail(any())).thenReturn(Optional.of(testUser));
        when(eventRepository.existsEventByTitleIgnoreCase(any())).thenReturn(true);

        // Act & Assert
        assertThrows(DuplicateEntryException.class, () ->
                eventService.createEvent(testImage, testImage, new ArrayList<>(), testEventDto)
        );
    }

    @Test
    void getEventById_Success() {
        // Arrange
        Set<EventImages> images = new HashSet<>();
        EventImages image = EventImages.builder()
                .eventImageType(EventImageType.COVER_IMAGE)
                .resourceUrl("test-url".getBytes())
                .build();
        images.add(image);
        testEvent.setImages(images);
        testEvent.setUpdatedBy(testUser);

        when(eventRepository.findById("test-id")).thenReturn(Optional.of(testEvent));
        when(fileExtractor.byteArrayToString(any())).thenReturn("test-url");

        // Act
        EventDetailResponseDto result = eventService.getEventById("test-id");

        // Assert
        assertNotNull(result);
        assertEquals(testEvent.getId(), result.getId());
        assertEquals(testEvent.getTitle(), result.getTitle());
    }

    @Test
    void getEventById_NotFound_ThrowsException() {
        // Arrange
        when(eventRepository.findById(any())).thenReturn(Optional.empty());

        // Act & Assert
        assertThrows(EntryNotFoundException.class, () ->
                eventService.getEventById("non-existent-id")
        );
    }

    @Test
    void searchByKeywordAndFilters_Success() {
        // Arrange
        LocalDateTime startDate = LocalDateTime.now();
        LocalDateTime endDate = LocalDateTime.now().plusDays(7);
        PageRequest pageRequest = PageRequest.of(0, 10);
        testEvent.setUpdatedBy(testUser);
        testEvent.setImages(Set.of(image));
        Page<Event> eventPage = new PageImpl<>(List.of(testEvent));

        when(eventRepository.searchByKeywordAndFilters(any(), any(), any(), any()))
                .thenReturn(eventPage);

        // Act
        Page<EventDetailResponseDto> result = eventService.searchByKeywordAndFilters(
                0, 10, startDate, endDate, "test"
        );

        // Assert
        assertNotNull(result);
        assertFalse(result.getContent().isEmpty());
        assertEquals(1, result.getTotalElements());
    }

    @Test
    void deleteEvent_Success() {
        // Arrange
        when(eventRepository.findById("test-id")).thenReturn(Optional.of(testEvent));

        // Act
        eventService.deleteEvent("test-id");

        // Assert
        verify(eventRepository, times(1)).deleteById("test-id");
    }

    @Test
    void deleteEvent_NotFound_ThrowsException() {
        // Arrange
        when(eventRepository.findById(any())).thenReturn(Optional.empty());

        // Act & Assert
        assertThrows(EntryNotFoundException.class, () ->
                eventService.deleteEvent("non-existent-id")
        );
    }

    @Test
    void updateEvent_Success() {
        when(securityContext.getAuthentication()).thenReturn(authentication);
        when(authentication.getName()).thenReturn("test@example.com");
        SecurityContextHolder.setContext(securityContext);
        // Arrange
        when(applicationUserRepository.findByEmail(any())).thenReturn(Optional.of(testUser));
        when(eventRepository.findById("test-id")).thenReturn(Optional.of(testEvent));

        // Act
        eventService.updateEvent("test-id", testEventDto);

        // Assert
        verify(eventRepository, times(1)).save(any(Event.class));
    }

    @Test
    void updateEvent_NotFound_ThrowsException() {
        when(securityContext.getAuthentication()).thenReturn(authentication);
        when(authentication.getName()).thenReturn("test@example.com");
        SecurityContextHolder.setContext(securityContext);
        // Arrange
        when(applicationUserRepository.findByEmail(any())).thenReturn(Optional.of(testUser));
        when(eventRepository.findById(any())).thenReturn(Optional.empty());

        // Act & Assert
        assertThrows(EntryNotFoundException.class, () ->
                eventService.updateEvent("non-existent-id", testEventDto)
        );
    }
}