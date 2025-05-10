package com.uor.group_14.touripearl_backend.service.serviceImpl;

import com.uor.group_14.touripearl_backend.dto.request.reservation.ReservationCreateRequestDto;
import com.uor.group_14.touripearl_backend.dto.request.reservation.ReservationUpdateRequestDto;
import com.uor.group_14.touripearl_backend.dto.response.reservation.ReservationResponseDto;
import com.uor.group_14.touripearl_backend.dto.response.reservation.TourPersonResponseDto;
import com.uor.group_14.touripearl_backend.entity.Tourist;
import com.uor.group_14.touripearl_backend.entity.guide.Guide;
import com.uor.group_14.touripearl_backend.entity.reservation.Reservation;
import com.uor.group_14.touripearl_backend.entity.reservation.ReservationStatus;
import com.uor.group_14.touripearl_backend.entity.reservation.TourPerson;
import com.uor.group_14.touripearl_backend.entity.tour.Tour;
import com.uor.group_14.touripearl_backend.exception.EntryNotFoundException;
import com.uor.group_14.touripearl_backend.repository.GuideRepo;
import com.uor.group_14.touripearl_backend.repository.TourRepo;
import com.uor.group_14.touripearl_backend.repository.TouristRepo;
import com.uor.group_14.touripearl_backend.repository.reservation.ReservationRepository;
import com.uor.group_14.touripearl_backend.service.ReservationService;
import com.uor.group_14.touripearl_backend.service.TourService;
import com.uor.group_14.touripearl_backend.service.TouristApplicationService;
import com.uor.group_14.touripearl_backend.util.SecurityUtil;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional
public class ReservationServiceImpl implements ReservationService {
    private final ReservationRepository reservationRepository;
    private final TourRepo tourRepo;
    private final SecurityUtil securityUtil;
    private final TouristRepo touristRepo;
    private final TouristApplicationService touristService;
    private final TourService tourService;
    private final GuideRepo guideRepo;

    @Override
    public ReservationResponseDto createReservation(ReservationCreateRequestDto reservationCreateRequestDto) {
        Reservation reservation = reservationRepository.save(mapToEntity(reservationCreateRequestDto));
        return mapToResponseDto(reservation);
    }

    @Override
    public ReservationResponseDto getReservationById(String id) {
        Reservation reservation = reservationRepository.findById(id).orElseThrow(() -> new RuntimeException("Reservation not found"));
        return mapToResponseDto(reservation);
    }

    @Override
    public List<ReservationResponseDto> getAllReservations() {
        return reservationRepository.findAll().stream().map(this::mapToResponseDto).collect(Collectors.toList());
    }

    @Override
    public ReservationResponseDto updateReservation(String id, ReservationUpdateRequestDto reservationUpdateRequestDto) {
        Reservation existReservation = reservationRepository.findById(id).orElseThrow(() -> new RuntimeException("Reservation not found"));
        if(reservationUpdateRequestDto.getStartDate()!=null) {
            existReservation.setStartDate(reservationUpdateRequestDto.getStartDate());
            existReservation.setEndDate(reservationUpdateRequestDto.getStartDate().plusDays(existReservation.getTour().getDuration()));
        }
        existReservation.setStatus(reservationUpdateRequestDto.getStatus());
        if(reservationUpdateRequestDto.getTourPeoples()!=null) {
            existReservation.getTourPeoples().clear();
            existReservation.getTourPeoples().addAll(reservationUpdateRequestDto.getTourPeoples().stream().map(
                    tourPersonCreateRequestDto -> TourPerson.builder()
                            .reservation(existReservation)
                            .name(tourPersonCreateRequestDto.getName())
                            .passportNumber(tourPersonCreateRequestDto.getPassportNumber())
                            .build()
            ).collect(Collectors.toSet()));
        }
        if(reservationUpdateRequestDto.getCancellationReason()!=null && reservationUpdateRequestDto.getStatus()==ReservationStatus.CANCELLED){
            existReservation.setCancellationReason(reservationUpdateRequestDto.getCancellationReason());
        }
        return mapToResponseDto(reservationRepository.save(existReservation));
    }

    @Override
    public void deleteReservation(String id) {
        reservationRepository.deleteById(id);
    }

    @Override
    public Page<ReservationResponseDto> searchByKeywordAndFiltersOfGuide(int page, int size, LocalDate startDate, LocalDate endDate, String keyword) {
        PageRequest pageRequest = PageRequest.of(page, size);
        Guide guide = guideRepo.findByApplicationUser(securityUtil.getCurrentUser()).orElseThrow(()->new EntryNotFoundException("guide is invalid"));
        Page<Reservation> reservations = reservationRepository.searchByKeywordAndFiltersOfGuide(keyword, startDate, endDate,guide, pageRequest);
        return reservations.map(this::mapToResponseDto);
    }

    @Override
    public Page<ReservationResponseDto> searchByKeywordAndFiltersOfTourist(int page, int size, LocalDate startDate, LocalDate endDate, String keyword) {
        PageRequest pageRequest = PageRequest.of(page, size);
        Tourist tourist = touristRepo.findByApplicationUser(securityUtil.getCurrentUser()).orElseThrow(()->new EntryNotFoundException("guide is invalid"));
        Page<Reservation> reservations = reservationRepository.searchByKeywordAndFiltersOfTourist(keyword, startDate, endDate,tourist, pageRequest);
        return reservations.map(this::mapToResponseDto);
    }

    public ReservationResponseDto mapToResponseDto(Reservation reservation) {
        // Map Reservation entity to ReservationResponseDto
        return ReservationResponseDto.builder()
                .id(reservation.getPropertyId())
                .touristResponseDto(touristService.getTouristByPropertyId(reservation.getTourist().getPropertyId()))
                .viewResponseDto(tourService.getTourById(reservation.getTour().getId()))
                .createdAt(reservation.getCreatedAt())
                .status(reservation.getStatus())
                .startDate(reservation.getStartDate())
                .endDate(reservation.getEndDate())
                .updatedAt(reservation.getUpdatedAt())
                .cancellationReason(reservation.getCancellationReason())
                .totalCost(reservation.getTotalCost())
                .tourPeoples(reservation.getTourPeoples().stream().map(
                        tourPerson -> TourPersonResponseDto.builder()
                                .name(tourPerson.getName())
                                .passportNumber(tourPerson.getPassportNumber())
                                .build()
                ).collect(Collectors.toList()))
                .build();
    }
    public Reservation mapToEntity(ReservationCreateRequestDto reservationCreateRequestDto) {
        Tour tour = tourRepo.findById(reservationCreateRequestDto.getTourId()).orElseThrow(() -> new RuntimeException("Tour not found"));
        Reservation reservation= Reservation.builder()
                .tour(tour)
                .status(ReservationStatus.PENDING)
                .tourist(touristRepo.findByApplicationUser(securityUtil.getCurrentUser()).orElseThrow(() -> new RuntimeException("Tourist not found")))
                .startDate(reservationCreateRequestDto.getStartDate())
                .totalCost(reservationCreateRequestDto.getTotalCost())
                .endDate(reservationCreateRequestDto.getStartDate().plusDays(tour.getDuration()))
                .build();
        reservation.setTourPeoples(reservationCreateRequestDto.getTourPeoples().stream().map(
                tourPersonCreateRequestDto -> TourPerson.builder()
                        .reservation(reservation)
                        .name(tourPersonCreateRequestDto.getName())
                        .passportNumber(tourPersonCreateRequestDto.getPassportNumber())
                        .type(tourPersonCreateRequestDto.getType())
                        .build()
        ).collect(Collectors.toList()));
        return reservation;
    }
}
