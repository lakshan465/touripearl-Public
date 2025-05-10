package com.uor.group_14.touripearl_backend.dto.response;

import com.uor.group_14.touripearl_backend.entity.Review;
import com.uor.group_14.touripearl_backend.entity.applicationUser.ApplicationUser;
import com.uor.group_14.touripearl_backend.entity.enumEntity.Gender;
import com.uor.group_14.touripearl_backend.entity.enumEntity.WorkingAreas;
import com.uor.group_14.touripearl_backend.entity.enumEntity.WorkingDays;
import com.uor.group_14.touripearl_backend.entity.guide.Guide;
import com.uor.group_14.touripearl_backend.entity.guideApplication.ApplicationLanguage;
import com.uor.group_14.touripearl_backend.entity.guideApplication.GuideApplication;
import jakarta.persistence.*;
import lombok.*;

import java.util.Date;
import java.util.List;
import java.util.Set;

@Getter
@Setter
@Data
@NoArgsConstructor
@AllArgsConstructor
public class CustomTourMarginWithGuide {
    private Long id;
    private Long tourId;
    private double margin;
    private double vehicleCost;
    private double hotelCost;
    private double visitTicketCost;
    private String firstname;
    private String lastname;
    private Gender gender;
    private double starMean;
    private String nationality;
    private Set<ApplicationLanguageResponseDto> languages;
    private List<WorkingAreas> workingAreas;
    private List<WorkingDays> workingDays;
    private boolean hasLicense;
    private List<Review> reviews;
    private String profilePictureUrl;
    private String guideId;

}


