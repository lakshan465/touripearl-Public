package com.uor.group_14.touripearl_backend.service.serviceImpl.CustomTourPriceCalculation;

public abstract class TourDecorator implements Tour {
    protected Tour decoratedTour;
    public TourDecorator(Tour decoratedTour) {
        this.decoratedTour = decoratedTour;
    }
    @Override
    public double getCost() {
        return decoratedTour.getCost();
    }
}

