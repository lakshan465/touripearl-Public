package com.uor.group_14.touripearl_backend.entity.guideApplication;

import com.uor.group_14.touripearl_backend.entity.enumEntity.*;
import com.uor.group_14.touripearl_backend.entity.guide.Guide;
import jakarta.persistence.*;
import lombok.*;

import java.util.Date;
import java.util.List;
import java.util.Set;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
@Entity(name="guide_application")
public class GuideApplication {
    @Id
    @Column(name="guide_application_id",nullable=false,length = 80)
    private String guideApplicationId;

    @Column(name="firstname",nullable=false,length = 50)
    private String firstname;

    @Column(name="lastname",nullable=false,length = 50)
    private String lastname;

    @Column(name="email",nullable=false, unique = true)//duplicate entry can happen ?
    private String email;

    @Enumerated(EnumType.STRING)
    private Gender gender;

    @Column(name="birthday",nullable=false,length = 50)
    private Date birthday;

    @Column(name="nationality",nullable=false,length = 50)
    private String nationality;

    @Column(name="country",nullable=false,length = 50)
    private String country;

    @Column(name = "street", length = 100, nullable = false)
    private String street;

    @Column(name = "city", length = 20, nullable = false)
    private String city;

    @Column(name = "state", length = 20, nullable = false)
    private String state;

    @Column(name="postalCode",nullable=false,length = 10)
    private String postalCode;

    @Column(name="phone",nullable=false,length = 20)// need to uniq ?
    private String phone;

    @Column(name="biography",nullable=false,length = 200)
    private String biography;

    @OneToMany(mappedBy = "guideApplication", cascade = CascadeType.ALL, orphanRemoval = true)
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

    @Column(name="extra_info",length = 400)
    private String extraInformation;

    @Column(name = "need_license", nullable = false)
    private boolean needLicense;

    @Column(name = "has_license", nullable = false)
    private boolean hasLicense;

    @OneToMany(mappedBy = "guideApplication", cascade = CascadeType.ALL, orphanRemoval = true)
    Set<ApplicationImage> applicationImages;

    @Column(name = "feedback_message", length = 400)
    private String feedbackMessage;

    @Column(name="status",nullable = false)
    @Enumerated(EnumType.STRING)
    private ApplicationStatus applicationStatus;

    @OneToOne(mappedBy = "application" ,cascade = CascadeType.ALL)
    private Guide guide;
}
