package com.uor.group_14.touripearl_backend.dto.request.tourist;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class SaveConfirmTourReqDto {
    private Long tourId;
    private String startDate;
    private String endDate;
    private int travelers;
    private String pickupLocation;
    private List<String> placesToVisit;
    private List<String> specialAttractions;
    private List<String> activities;
    private String transport;
    private String accommodationType;
    private boolean accommodation;
    private String accessibility;
    private boolean guideWithVehicle;
    private String genderPreference;
    private List<String> language;
    private String guideId;
    private String touristId;
    private boolean uponArrival;
    private boolean guideNeedToBookTicket;
    private int basicCost;
    private int accommodationService;
    private int bookingTicketService;
    private int vehicleService;
    private int guideService;
    private int hotelCost;
    private int vehicleCost;
    private int visitTicketCost;
    private int margin;
    private int cost;
    private double starMean;
    private String profilePictureUrl;
}

