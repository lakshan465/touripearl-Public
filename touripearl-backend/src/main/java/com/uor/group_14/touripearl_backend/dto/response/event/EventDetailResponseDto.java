package com.uor.group_14.touripearl_backend.dto.response.event;

import com.uor.group_14.touripearl_backend.entity.events.entityEnum.CurrencyType;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import lombok.*;

import java.time.LocalDateTime;
import java.util.Set;

@Getter
@Setter
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class EventDetailResponseDto {
    private String id;
    private String title;
    private String description;
    private String shortDescription;
    private String location;
    private LocalDateTime startDateTime;
    private LocalDateTime endDateTime;
    private String venue;
    private String weatherSuitability;
    private LocalDateTime updateAt;
    private Set<String> highlights;
    private double foreignPrice;
    private double localPrice;
    @Enumerated(EnumType.STRING)
    private CurrencyType currencyType;
    private String dressCode;
    private String photography;
    private Integer minimumAge;
    private boolean wheelchairAccessible;
    private boolean familyFriendly;
    private boolean seniorFriendly;
    private Set<EventImageResponseDto> images;
    private String updatedBy;
}