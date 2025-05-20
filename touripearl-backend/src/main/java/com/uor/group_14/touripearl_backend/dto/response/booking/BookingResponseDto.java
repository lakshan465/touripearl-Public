package com.uor.group_14.touripearl_backend.dto.response.booking;

import com.uor.group_14.touripearl_backend.dto.response.CustomTourResponseDto;
import com.uor.group_14.touripearl_backend.dto.response.reservation.ReservationResponseDto;
import com.uor.group_14.touripearl_backend.entity.bookings.BookingStatus;
import lombok.*;

import java.time.LocalDate;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class BookingResponseDto {
    private String propertyId;
    private ReservationResponseDto reservationResponseDto;
    private CustomTourResponseDto customTourResponseDto;
    private LocalDate startDate;
    private LocalDate endDate;
    private BookingStatus status;
}
