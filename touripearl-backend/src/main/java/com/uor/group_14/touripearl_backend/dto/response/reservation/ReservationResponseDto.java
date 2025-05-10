package com.uor.group_14.touripearl_backend.dto.response.reservation;

import com.uor.group_14.touripearl_backend.dto.response.TourViewResponseDto;
import com.uor.group_14.touripearl_backend.dto.response.TouristResponseDto;
import com.uor.group_14.touripearl_backend.entity.reservation.ReservationStatus;
import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Builder
@Getter
@Setter
public class ReservationResponseDto {
    private String id;
    private TourViewResponseDto viewResponseDto;
    private LocalDate startDate;
    private LocalDate endDate;
    private ReservationStatus status;
    private List<TourPersonResponseDto> tourPeoples;
    private String cancellationReason;
    private Double totalCost;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private TouristResponseDto touristResponseDto;
}
