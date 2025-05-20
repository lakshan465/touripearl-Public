package com.uor.group_14.touripearl_backend.dto.response.reservation;

import com.uor.group_14.touripearl_backend.entity.reservation.PersonType;
import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Builder
public class TourPersonResponseDto {
    private String name;
    private String passportNumber;
    private PersonType type;
}
