package com.uor.group_14.touripearl_backend.dto.request;

import com.uor.group_14.touripearl_backend.entity.enumEntity.Interests;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import software.amazon.awssdk.services.s3.endpoints.internal.Value;

import java.util.List;
import java.util.Map;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class TouristRequestDto {
    private String email;
    private String password;
    private String confirmPassword;
    private String firstName;
    private String lastName;
    private String country;
    private String street;
    private String city;
    private String state;
    private String zipCode;
    private String phone;
    private String userName;
    private String bio;
    private Map<String, Interests> interests;
    private Map<String, String> languages;
}
