package com.uor.group_14.touripearl_backend.dto.response;

import com.uor.group_14.touripearl_backend.entity.enumEntity.Gender;
import com.uor.group_14.touripearl_backend.entity.enumEntity.Interests;
import com.uor.group_14.touripearl_backend.entity.enumEntity.WorkingAreas;
import com.uor.group_14.touripearl_backend.entity.enumEntity.WorkingDays;
import jakarta.persistence.Column;
import lombok.Builder;
import lombok.Getter;
import lombok.Setter;


import java.time.LocalDateTime;
import java.util.List;
import java.util.Set;

@Getter
@Setter
@Builder
public class GuideDetailsResponseDto {
    private String id;
    private String firstname;
    private String lastname;
    private String email;
    private Gender gender;
    private String nationality;
    private String country;
    private String street;
    private String city;
    private String state;
    private String zipCode;
    private String phone;
    private String biography;
    private List<Interests> interests;
    private Set<ApplicationLanguageResponseDto> guideLanguages;
    private List<WorkingAreas> workingAreas;
    private List<WorkingDays> workingDays;
    private ProfileImageResponseDto profileImageUrl;
    private boolean hasLicense;
    private double starMean;
    private List<ReviewResponseDto> reviewList;
    private LocalDateTime LastSeen;
    private List<TourViewResponseDto> tours;
}