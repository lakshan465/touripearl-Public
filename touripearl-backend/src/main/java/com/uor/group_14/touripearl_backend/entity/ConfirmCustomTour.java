package com.uor.group_14.touripearl_backend.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.util.List;

@Entity
@Table(name = "confirm_custom_tour")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Getter
public class ConfirmCustomTour {

    @Id
    //@GeneratedValue(strategy = GenerationType.UUID)
    private Long tourIdc;

    private String startDatec;
    private String endDatec;
    private int travelersc;
    private String pickupLocationc;

    @ElementCollection
    private List<String> placesToVisitc;

    @ElementCollection
    private List<String> specialAttractionsc;

    @ElementCollection
    private List<String> activitiesc;

    private String transportc;
    private String accommodationTypec;
    private boolean accommodationc;
    private String accessibilityc;
    private boolean guideWithVehiclec;
    private String genderPreferencec;

    @ElementCollection
    private List<String> languagec;

    private String guideIdc;
    private String touristIdc;
    private boolean uponArrivalc;
    private boolean guideNeedToBookTicketc;
    private int basicCostc;
    private int accommodationServicec;
    private int bookingTicketServicec;
    private int vehicleServicec;
    private int guideServicec;
    private int hotelCostc;
    private int vehicleCostc;
    private int visitTicketCostc;
    private int marginc;
    private int costc;
    private double starMeanc;
    private String profilePictureUrlc;
}
