package com.uor.group_14.touripearl_backend.dto.request;


import lombok.*;

import java.util.List;
import java.util.Set;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
@ToString
public class DestinationRequestDto {
    private String destinationName;
    private String shortDescription;
    private String fullDescription;
    private String location;
    private List<ActivityRequestDto> activities;
    private String bestTimeToVisit;
    private boolean isActive=true;
}
