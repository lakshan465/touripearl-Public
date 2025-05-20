package com.uor.group_14.touripearl_backend.entity.events.embeds;

import jakarta.persistence.Embeddable;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@Builder
@Embeddable
@NoArgsConstructor
@AllArgsConstructor
public class Accessibility {
    private boolean wheelchairAccessible;
    private boolean familyFriendly;
    private boolean seniorFriendly;
}
