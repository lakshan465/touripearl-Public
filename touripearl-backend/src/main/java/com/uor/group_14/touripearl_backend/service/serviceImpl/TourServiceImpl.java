package com.uor.group_14.touripearl_backend.service.serviceImpl;

import com.uor.group_14.touripearl_backend.dto.request.TourCreateRequestDto;
import com.uor.group_14.touripearl_backend.dto.response.TimelineResponseDto;
import com.uor.group_14.touripearl_backend.dto.response.TourViewResponseDto;
import com.uor.group_14.touripearl_backend.entity.applicationUser.ApplicationUser;
import com.uor.group_14.touripearl_backend.entity.destinations.Destination;
import com.uor.group_14.touripearl_backend.entity.guide.Guide;
import com.uor.group_14.touripearl_backend.entity.reservation.ReservationStatus;
import com.uor.group_14.touripearl_backend.entity.tour.Tour;
import com.uor.group_14.touripearl_backend.entity.tour.TourTimeline;
import com.uor.group_14.touripearl_backend.exception.EntryNotFoundException;
import com.uor.group_14.touripearl_backend.repository.ApplicationUserRepository;
import com.uor.group_14.touripearl_backend.repository.DestinationRepo;
import com.uor.group_14.touripearl_backend.repository.GuideRepo;
import com.uor.group_14.touripearl_backend.repository.TourRepo;
import com.uor.group_14.touripearl_backend.repository.reservation.ReservationRepository;
import com.uor.group_14.touripearl_backend.service.DestinationService;
import com.uor.group_14.touripearl_backend.service.TourService;
import com.uor.group_14.touripearl_backend.util.SecurityUtil;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.UUID;
import java.util.stream.Collectors;

@RequiredArgsConstructor
@Service
public class TourServiceImpl implements TourService {

    private final TourRepo tourRepo;
    private final DestinationRepo destinationRepo;
    private final DestinationService destinationService;
    private final ApplicationUserRepository applicationUserRepository;
    private final GuideRepo guideRepo;
    private final SecurityUtil securityUtil;
    private final ReservationRepository reservationRepository;

    @Override
    public Tour createTour(TourCreateRequestDto dto) {
        Guide guide = extractGuide();
        Tour tour = Tour.builder()
                .id(UUID.randomUUID().toString())
                .name(dto.getName())
                .description(dto.getDescription())
                .date(dto.getDate())
                .duration(dto.getDuration())
                .price(dto.getPrice())
                .availableSlots(dto.getAvailableSlots())
                .difficultyLevel(dto.getDifficultyLevel())
                .includesTransport(dto.isIncludesTransport())
                .includesMeals(dto.isIncludesMeals())
                .isAvailable(dto.isAvailable())
                .meetingPoint(dto.getMeetingPoint())
                .departureTime(dto.getDepartureTime())
                .timeline(dto.getTimeline())
                .createdAt(LocalDateTime.now())
                .guide(guide)
                .destinations(dto.getDestinations().stream().map(
                        destinationId -> {
                            Optional<Destination> destination = destinationRepo.findByDestinationId(destinationId);
                            if (destination.isPresent()){
                                return destination.get();
                            }
                            throw new EntryNotFoundException("Destination not found");
                        }
                        ).toList()
                )
                .build();
        List<TourTimeline> timelines = dto.getTimeline().stream()
                .map(
                        tourTimeline -> {
                            return TourTimeline.builder()
                                    .activity(tourTimeline.getActivity())
                                    .location(tourTimeline.getLocation())
                                    .sequenceOrder(tourTimeline.getSequenceOrder())
                                    .tour(tour)
                                    .time(tourTimeline.getTime())
                                    .id(UUID.randomUUID().toString())
                                    .build();
                        }
                )
                .toList();
        tour.setTimeline(timelines);
    return tourRepo.save(tour);
    }

    @Override
    public Page<TourViewResponseDto> getAllTours(int page, int size) {
        PageRequest pageable = PageRequest.of(page, size);
        return tourRepo.findAll(pageable).map(this::mapToTourViewResponseDto);
    }

    @Override
    public TourViewResponseDto getTourById(String id) {
        Optional<Tour> tourOptional = tourRepo.findById(id);
        if (tourOptional.isEmpty()) {
            throw new RuntimeException("Tour not found with ID: " + id);
        }
        Tour tour = tourOptional.get();
        return mapToTourViewResponseDto(tour);
    }

    @Override
    @Transactional
    public Tour updateTour(String id, TourCreateRequestDto dto) {
        Tour existingTour = tourRepo.findById(id)
                .orElseThrow(() -> new RuntimeException("Tour not found with ID: " + id));

        //Update the fields
        existingTour.setName(dto.getName());
        existingTour.setDescription(dto.getDescription());
        existingTour.setDate(dto.getDate());
        existingTour.setDuration(dto.getDuration());
        existingTour.setPrice(dto.getPrice());
        existingTour.setAvailableSlots(dto.getAvailableSlots());
        existingTour.setDifficultyLevel(dto.getDifficultyLevel());
        existingTour.setIncludesTransport(dto.isIncludesTransport());
        existingTour.setIncludesMeals(dto.isIncludesMeals());
        existingTour.setAvailable(dto.isAvailable());
        existingTour.setMeetingPoint(dto.getMeetingPoint());
        existingTour.setDepartureTime(dto.getDepartureTime());
        existingTour.getTimeline().clear();
        existingTour.getTimeline().addAll(
                dto.getTimeline().stream().map(
                        time-> TourTimeline.builder()
                        .id(UUID.randomUUID().toString())
                        .sequenceOrder(time.getSequenceOrder())
                        .time(time.getTime())
                        .location(time.getLocation())
                        .activity(time.getActivity())
                                .tour(existingTour)
                        .build()
                ).toList()
        );
        existingTour.getDestinations().clear();
        existingTour.getDestinations().addAll(dto.getDestinations().stream().map(
                destinationId -> {
                    Optional<Destination> destination = destinationRepo.findByDestinationId(destinationId);
                    if (destination.isPresent()) {
                        return destination.get();
                    }
                    throw new EntryNotFoundException("Destination not found.");
                }
        ).toList());

        return tourRepo.save(existingTour);
    }

    @Override
    public void deleteTour(String id) {
        if (!tourRepo.existsById(id)) {
            throw new RuntimeException("Tour not found with ID: " + id);
        }
        tourRepo.deleteById(id);
    }

    @Override
    public Page<TourViewResponseDto> searchByKeywordAndFilters(int page, int size, String keyword, Boolean includeMeals, Boolean isAvailable) {
        Guide guide = extractGuide();
        PageRequest pageRequest = PageRequest.of(page, size);
        Page<Tour> applicationUsers = tourRepo.searchByKeywordAndFilters(keyword, includeMeals, isAvailable, pageRequest,guide);
        return applicationUsers.map(
                this::mapToTourViewResponseDto
        );
    }

    @Override
    public Map<String,Long> getToursMetricsByGuideId() {
        Guide guide = guideRepo.findByApplicationUser(securityUtil.getCurrentUser()).orElseThrow(() -> new EntryNotFoundException("guide not found"));
        return Map.of(
                "PENDING",reservationRepository.countReservationsByStatusAndTour_Guide(ReservationStatus.PENDING,guide),
                "CONFIRMED",reservationRepository.countReservationsByStatusAndTour_Guide(ReservationStatus.CONFIRMED,guide),
                "CANCELLED",reservationRepository.countReservationsByStatusAndTour_Guide(ReservationStatus.CANCELLED,guide),
                "PAID",reservationRepository.countReservationsByStatusAndTour_Guide(ReservationStatus.PAID,guide),
                "ALL", reservationRepository.countReservationsByTour_Guide(guide)
        );
    }

    private Guide extractGuide() {
        Optional<ApplicationUser> user = applicationUserRepository.findByEmail(SecurityContextHolder.getContext().getAuthentication().getName());
        if (user.isEmpty()) {
            throw new EntryNotFoundException("User not found");
        }
        Optional<Guide> guide = guideRepo.findByApplicationUser(user.get());
        if (guide.isEmpty()) {
            throw new EntryNotFoundException("Guide not found");
        }
        return guide.get();
    }

    public TourViewResponseDto mapToTourViewResponseDto(Tour tour) {
        return new TourViewResponseDto(
                tour.getId(),
                tour.getName(),
                tour.getDescription(),
                tour.getDate(),
                tour.getDuration(),
                tour.getPrice(),
                tour.getAvailableSlots(),
                tour.getDifficultyLevel(),
                tour.isIncludesTransport(),
                tour.isIncludesMeals(),
                tour.getMeetingPoint(),
                tour.getDepartureTime(),
                tour.getTimeline().stream().map(
                        timeline -> {
                            return TimelineResponseDto.builder()
                                    .sequenceOrder(timeline.getSequenceOrder())
                                    .time(timeline.getTime())
                                    .activity(timeline.getActivity())
                                    .location(timeline.getLocation())
                                    .build();
                        }
                ).collect(Collectors.toSet()),
                tour.getDestinations().stream().map(
                        destination -> {
                            return destinationService.findByDestinationId(destination.getDestinationId());
                        }
                ).collect(Collectors.toSet()),
                tour.isAvailable(),
                tour.getGuide().getPropertyId()
        );
    }

    public String getTouristIdByUserId(String userId) {
        ApplicationUser applicationUser = applicationUserRepository.findByUserId(userId);
        if (applicationUser != null && applicationUser.getTourist() != null) {
            return applicationUser.getTourist().getPropertyId();
        }
        return null;
    }
}




