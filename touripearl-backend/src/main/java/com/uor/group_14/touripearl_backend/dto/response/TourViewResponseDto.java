package com.uor.group_14.touripearl_backend.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.util.Set;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class TourViewResponseDto {

    private String id;

    private String name;

    private String description;

    private LocalDate date;

    private int duration;

    private Double price;

    private int availableSlots;

    private String difficultyLevel;

    private boolean includesTransport;

    private boolean includesMeals;

    private String meetingPoint;

    private String departureTime;

    private Set<TimelineResponseDto> timeline;

    private Set<DestinationResponseDto> destinations;

    private boolean isAvailable;

    private String guideId;
}
