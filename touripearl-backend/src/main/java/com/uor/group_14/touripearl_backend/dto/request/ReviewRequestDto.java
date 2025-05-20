package com.uor.group_14.touripearl_backend.dto.request;

import lombok.*;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@Builder
public class ReviewRequestDto {
    private String touristUserId;
    private int rating;
    private String comment;
    private String bookingId;
}

