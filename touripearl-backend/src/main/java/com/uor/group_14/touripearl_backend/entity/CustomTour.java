package com.uor.group_14.touripearl_backend.entity;


import com.uor.group_14.touripearl_backend.entity.applicationUser.ApplicationUser;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.Cascade;

import java.util.List;

@Setter
@Getter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Entity
@Data
@Table(name = "custom_tour")
public class CustomTour {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "tourist_id", referencedColumnName = "property_id")
    private Tourist tourist;

    private String title;
    private String description;
    private String startDate;
    private String endDate;
    private int travelers;
    private String pickupLocation;

    @ElementCollection(fetch = FetchType.EAGER)
    @CollectionTable(name = "custom_tour_languages", joinColumns = @JoinColumn(name = "tour_id"))
    @Cascade(org.hibernate.annotations.CascadeType.ALL)
    private List<String> language;

    @ElementCollection(fetch = FetchType.EAGER)
    @CollectionTable(name = "custom_tour_placesToVisit", joinColumns = @JoinColumn(name = "tour_id"))
    @Cascade(org.hibernate.annotations.CascadeType.ALL)
    private List<String> placesToVisit;

    @ElementCollection(fetch = FetchType.EAGER)
    @CollectionTable(name = "custom_tour_activities", joinColumns = @JoinColumn(name = "tour_id"))
    @Cascade(org.hibernate.annotations.CascadeType.ALL)
    private List<String> activities;

    @ElementCollection(fetch = FetchType.EAGER)
    @CollectionTable(name = "custom_tour_specialAttractions", joinColumns = @JoinColumn(name = "tour_id"))
    @Cascade(org.hibernate.annotations.CascadeType.ALL)
    private List<String> specialAttractions;


    private double cost;
    private String accommodationType;
    private String transport;
    private boolean accommodationIncluded;
    private boolean guideWithVehicle;
    private String experienceLevel;
    private String genderPreference;
    private String specializedGuide;
    private boolean upon_arrival;
    private String accessibility;
    private String customRequests;
    private boolean guideNeedToBookTicket;//visiting pleases not for hotel

    private double basicCost;
    private double accommaodationService;
    private double vehicleService;
    private double bookingTicketService;
    private double guideService;


}
