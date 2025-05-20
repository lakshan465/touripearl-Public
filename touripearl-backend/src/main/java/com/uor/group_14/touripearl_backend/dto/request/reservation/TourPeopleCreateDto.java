package com.uor.group_14.touripearl_backend.dto.request.reservation;

import com.uor.group_14.touripearl_backend.entity.reservation.PersonType;
import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Builder
public class TourPeopleCreateDto {
    private String name;
    private String passportNumber;
    private PersonType type;
}
