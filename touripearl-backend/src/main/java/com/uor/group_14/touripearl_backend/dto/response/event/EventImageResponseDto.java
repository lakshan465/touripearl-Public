package com.uor.group_14.touripearl_backend.dto.response.event;

import com.uor.group_14.touripearl_backend.entity.events.entityEnum.EventImageType;
import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Builder
public class EventImageResponseDto {
    private String eventImageResourceUrl;
    private EventImageType eventImageType;
}
