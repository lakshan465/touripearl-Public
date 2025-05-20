package com.uor.group_14.touripearl_backend.dto.request;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class TouristChangeDataRequestDto {
    private String email;
    private String firstName;
    private String lastName;
    private String country;
    private String street;
    private String city;
    private String state;
    private String zipCode;
    private String phone;
    private String userName;
}
