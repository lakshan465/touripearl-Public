package com.uor.group_14.touripearl_backend.dto.request;
import com.uor.group_14.touripearl_backend.entity.enumEntity.*;
import com.uor.group_14.touripearl_backend.entity.guideApplication.ApplicationLanguage;
import jakarta.persistence.Column;
import lombok.*;

import java.util.Date;
import java.util.List;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class GuideApplicationRequestDto {
    private String firstname;
    private String lastname;
    private String email;
    private Gender gender;
    private Date birthday;
    private String nationality;
    private String country;
    private String street;
    private String city;
    private String state;
    private String postalCode;
    private String phone;
    private String biography;
    private List<ApplicationLanguage> applicationLanguages;
    private List<Interests> interests;
    private List<WorkingAreas> workingAreas;
    private List<WorkingDays> workingDays;
    private String extraInformation;
    private boolean hasLicense;
    private String feedbackMessage;
    private ApplicationStatus applicationStatus = ApplicationStatus.PENDING;
}

