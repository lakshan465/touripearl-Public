package com.uor.group_14.touripearl_backend.dto.request.booking;

import lombok.*;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class BookingCancelRequestDto {
    private String bookingId;
    private String reason;
}
