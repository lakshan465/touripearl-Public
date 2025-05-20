package com.uor.group_14.touripearl_backend.dto.response;

import com.uor.group_14.touripearl_backend.entity.enumEntity.*;
import lombok.*;

import java.util.Date;
import java.util.List;
import java.util.Set;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class GuideApplicationResponseDto {
    private String guideApplicationId;
    private String firstname;
    private String lastname;
    private String email;
    private Gender gender;
    private Date birthday;
    private String nationality;
    private String country;
    private String postalCode;
    private String phone;
    private String biography;
    private Set<ApplicationLanguageResponseDto> applicationLanguages;
    private List<Interests> interests;
    private List<WorkingAreas> workingAreas;
    private List<WorkingDays> workingDays;
    private String extraInformation;
    private boolean hasLicense;
    private Set<ApplicationImageResponseDto> applicationImages;
    private String feedbackMessage;
    private ApplicationStatus applicationStatus;
}
