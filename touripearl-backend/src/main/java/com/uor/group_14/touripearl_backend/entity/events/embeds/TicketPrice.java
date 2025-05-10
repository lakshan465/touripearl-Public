package com.uor.group_14.touripearl_backend.entity.events.embeds;

import com.uor.group_14.touripearl_backend.entity.events.entityEnum.CurrencyType;
import jakarta.persistence.Embeddable;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@Builder
@Embeddable
@NoArgsConstructor
@AllArgsConstructor
public class TicketPrice {
    private double foreignPrice;
    private double localPrice;
    @Enumerated(EnumType.STRING)
    private CurrencyType currencyType;
}
