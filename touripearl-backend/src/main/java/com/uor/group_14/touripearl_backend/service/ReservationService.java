package com.uor.group_14.touripearl_backend.service;

import com.uor.group_14.touripearl_backend.dto.request.reservation.ReservationCreateRequestDto;
import com.uor.group_14.touripearl_backend.dto.request.reservation.ReservationUpdateRequestDto;
import com.uor.group_14.touripearl_backend.dto.response.reservation.ReservationResponseDto;
import org.springframework.data.domain.Page;

import java.time.LocalDate;
import java.util.List;

public interface ReservationService {
    ReservationResponseDto createReservation(ReservationCreateRequestDto reservationCreateRequestDto);
    ReservationResponseDto getReservationById(String id);
    List<ReservationResponseDto> getAllReservations();
    ReservationResponseDto updateReservation(String id, ReservationUpdateRequestDto reservationCreateRequestDto);
    void deleteReservation(String id);
    Page<ReservationResponseDto> searchByKeywordAndFiltersOfGuide(int page, int size, LocalDate startDate, LocalDate endDate, String keyword);
    Page<ReservationResponseDto> searchByKeywordAndFiltersOfTourist(int page, int size, LocalDate startDate, LocalDate endDate, String keyword);
}
