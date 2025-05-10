package com.uor.group_14.touripearl_backend.dto.request.reservation;

import com.uor.group_14.touripearl_backend.entity.reservation.TourPerson;
import jakarta.validation.constraints.Future;
import jakarta.validation.constraints.NotNull;
import lombok.*;

import java.time.LocalDate;
import java.util.List;

@Builder
@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
public class ReservationCreateRequestDto {
    private String tourId;
    @Future
    @NotNull
    private LocalDate startDate;

    @NotNull
    private Double totalCost;

    private List<TourPeopleCreateDto> tourPeoples;
}
