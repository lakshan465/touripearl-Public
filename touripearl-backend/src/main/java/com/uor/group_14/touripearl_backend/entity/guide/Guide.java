package com.uor.group_14.touripearl_backend.entity.guide;

import com.uor.group_14.touripearl_backend.entity.Review;
import com.uor.group_14.touripearl_backend.entity.enumEntity.Interests;
import com.uor.group_14.touripearl_backend.entity.guideApplication.ApplicationLanguage;
import com.uor.group_14.touripearl_backend.entity.applicationUser.ApplicationUser;
import com.uor.group_14.touripearl_backend.entity.guideApplication.GuideApplication;
import com.uor.group_14.touripearl_backend.entity.enumEntity.Gender;
import com.uor.group_14.touripearl_backend.entity.enumEntity.WorkingAreas;
import com.uor.group_14.touripearl_backend.entity.enumEntity.WorkingDays;
import com.uor.group_14.touripearl_backend.entity.tour.Tour;
import jakarta.persistence.*;
import lombok.*;

import java.util.Date;
import java.util.List;
import java.util.Set;

@Setter
@Getter
@NoArgsConstructor
@AllArgsConstructor
@Entity(name = "guide")
@Builder
@Table(indexes = {
        @Index(name = "guide_property_id_index", columnList = "property_id"),
        @Index(name = "guide_firstname_index", columnList = "firstname"),
        @Index(name = "guide_lastname_index", columnList = "lastname"),
})
public class Guide {
    @Id
    @Column(name = "property_id")
    private String propertyId;

    @Column(name = "firstname", nullable = false, length = 50)
    private String firstname;

    @Column(name = "lastname", nullable = false, length = 50)
    private String lastname;

    @Enumerated(EnumType.STRING)
    private Gender gender;

    @Column(name = "birthday", nullable = false, length = 50)
    private Date birthday;

    @Column(name = "nationality", nullable = false, length = 50)
    private String nationality;

    @Column(name = "star_avg")
    private double starMean;


    @Column(name = "biography", nullable = false, length = 200)
    private String biography;

    @OneToMany(mappedBy = "guidelanguage", cascade = CascadeType.ALL, orphanRemoval = true)
    private Set<ApplicationLanguage> languages;

    @ElementCollection
    @Enumerated(EnumType.STRING)
    private List<Interests> interests;

    @ElementCollection
    @Enumerated(EnumType.STRING)
    private List<WorkingAreas> workingAreas;

    @ElementCollection
    @Enumerated(EnumType.STRING)
    private List<WorkingDays> workingDays;

    @Column(name = "has_license", nullable = false)
    private boolean hasLicense;

    @OneToOne(cascade = CascadeType.ALL)
    private GuideApplication application;

    @OneToOne(cascade = CascadeType.ALL)
    private ApplicationUser applicationUser;

    @OneToMany(mappedBy = "guide", cascade = CascadeType.ALL)
    private List<Review> reviews;

    @OneToMany(mappedBy = "guide", cascade = CascadeType.ALL)
    private List<Tour> tours;
}