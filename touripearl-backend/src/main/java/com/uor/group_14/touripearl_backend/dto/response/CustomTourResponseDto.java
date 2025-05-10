package com.uor.group_14.touripearl_backend.dto.response;

import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
public class CustomTourResponseDto {
    private String title;
    private Long tourId;
    private String startDate;
    private String endDate;
    private int travelers;
    private String pickupLocation;
    private List<String> language;
    private List<String> placesToVisit;
    private List<String> activities;
    private List<String>  specialAttractions;
    private double cost;
    private String accommodationType;
    private String transport;
    private boolean accommodation;  //do guide need to allocate hotels for tour ?
    private boolean guideWithVehicle;
    private String experienceLevel;
    private String genderPreference;
    private String specializedGuide;
    private boolean upon_arrival;
    private String accessibility;
    private String customRequests;
    private String touristId;
    private boolean guideNeedToBookTicket;

    private double basicCost;
    private double accommaodationService;
    private double vehicleService;
    private double bookingTicketService;
    private double guideService;
    private long numberOfGuides;
}
