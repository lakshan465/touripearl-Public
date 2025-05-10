package com.uor.group_14.touripearl_backend.dto.response;

import com.uor.group_14.touripearl_backend.entity.enumEntity.Interests;
import lombok.*;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class TouristResponseDto {
    private String email;
    private String firstName;
    private String lastName;
    private String phone;
    private String userName;
    private ProfileImageResponseDto profileImage;
    private String country;
    private String street;
    private String city;
    private String state;
    private String zipCode;
    private String bio;
    private LocalDateTime joinDate;
    private LocalDateTime lastActive;
    private List<Interests> interests;
    private Map<String, String> languages;
}
