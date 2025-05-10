package com.uor.group_14.touripearl_backend.dto.request.guide;

import com.uor.group_14.touripearl_backend.entity.enumEntity.WorkingAreas;
import com.uor.group_14.touripearl_backend.entity.enumEntity.WorkingDays;
import com.uor.group_14.touripearl_backend.entity.guideApplication.ApplicationLanguage;
import lombok.*;

import java.util.List;
import java.util.Set;

@Getter
@Setter
@ToString
@AllArgsConstructor
@NoArgsConstructor
public class ProfileUpdateRequestDto {
    private String firstname;
    private String lastname;
    private String area;
    private String country;
    private String street;
    private String city;
    private String state;
    private String zipCode;
    private String phone;
    private String biography;
    private Set<ApplicationLanguage> guideLanguages;
    private List<WorkingAreas> workingAreas;
    private List<WorkingDays> workingDays;
}
