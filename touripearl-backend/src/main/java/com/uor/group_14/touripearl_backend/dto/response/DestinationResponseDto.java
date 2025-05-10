package com.uor.group_14.touripearl_backend.dto.response;

import lombok.*;

import java.util.Collection;
import java.util.List;
import java.util.Set;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class DestinationResponseDto {
    private String destinationId;
    private String destinationName;
    private String shortDescription;
    private String fullDescription;
    private String location;
    private Collection<ActivityResponseDto> activities;
    private Set<DestinationImageResponseDto> allDestinationImages;
    private String bestTimeToVisit;
    private boolean isActive;

}
