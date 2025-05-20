package com.uor.group_14.touripearl_backend.dto.request.tourist;
import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
public class CuztomTourDTO {
    private String title;
    private String description;
    private String startDate;
    private String endDate;
    private int travelers;
    private String pickupLocation;
    private List<String> language;
    private List<String> placesToVisit;
    private List<String> activities;
    private List<String>  specialAttractions;
    //private double cost;
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
    private boolean guideNeedToBookTicket;
}
