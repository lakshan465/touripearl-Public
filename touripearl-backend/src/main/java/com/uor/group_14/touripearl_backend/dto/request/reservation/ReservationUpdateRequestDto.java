package com.uor.group_14.touripearl_backend.dto.request.reservation;

import com.uor.group_14.touripearl_backend.entity.reservation.ReservationStatus;
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
public class ReservationUpdateRequestDto {
    @Future
    private LocalDate startDate;

    private List<TourPeopleCreateDto> tourPeoples;

    private ReservationStatus status;

    private String cancellationReason;

}
