package com.uor.group_14.touripearl_backend.dto.response;

import lombok.*;

@Setter
@Getter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class TimelineResponseDto {
    private int sequenceOrder;
    private String location;
    private String activity;
    private String time;
}
