package com.uor.group_14.touripearl_backend.service.serviceImpl.CustomTourPriceCalculation;


import org.springframework.web.bind.annotation.*;
import java.time.Duration;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;

public class TourTimePeriod extends TourDecorator {
    String start,end;
    public TourTimePeriod(Tour decoratedTour,String start, String end) {
        super(decoratedTour);
        this.start = start;
        this.end = end;

    }

    @Override
    public double getCost() {
        // Parse the start and end dates
        DateTimeFormatter formatter = DateTimeFormatter.ISO_LOCAL_DATE_TIME;
        LocalDateTime startDate = LocalDateTime.parse(start, formatter);
        LocalDateTime endDate = LocalDateTime.parse(end, formatter);

        // Calculate the gap (duration) between the two dates
        Duration duration = Duration.between(startDate, endDate);

        // Return the gap in seconds, or you can convert it to hours, minutes, etc.
        long gapInDays = (duration.getSeconds())/846;

        return decoratedTour.getCost() + gapInDays; //  adds extra cost
    }
}

