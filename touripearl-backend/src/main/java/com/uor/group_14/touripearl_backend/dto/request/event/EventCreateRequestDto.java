package com.uor.group_14.touripearl_backend.dto.request.event;

import com.uor.group_14.touripearl_backend.entity.events.embeds.Accessibility;
import com.uor.group_14.touripearl_backend.entity.events.embeds.Restrictions;
import com.uor.group_14.touripearl_backend.entity.events.embeds.TicketPrice;
import com.uor.group_14.touripearl_backend.entity.events.entityEnum.CurrencyType;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.validation.constraints.Future;
import jakarta.validation.constraints.NotNull;
import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;
import java.util.Set;

@Getter
@Setter
@Builder
public class EventCreateRequestDto {
    @NotNull
    private String title;
    private String description;
    private String shortDescription;
    private String location;
    @Future
    @NotNull
    private LocalDateTime startDateTime;
    @Future
    @NotNull
    private LocalDateTime endDateTime;
    private String venue;
    private String weatherSuitability;
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
}
