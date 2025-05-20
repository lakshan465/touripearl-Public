package com.uor.group_14.touripearl_backend.service.serviceImpl.CustomTourPriceCalculation;

public class BasicCustomTour implements Tour {

    private double cost;
    public BasicCustomTour( double cost) {
        this.cost = cost;
    }
    @Override
    public double getCost() {
        return cost;
    }
}

