package com.uor.group_14.touripearl_backend.dto.response.booking;

import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;

@Getter
@Setter
@Builder
public class BookingUnavailableRangeDto {
    private LocalDate startDate;
    private LocalDate endDate;
}
