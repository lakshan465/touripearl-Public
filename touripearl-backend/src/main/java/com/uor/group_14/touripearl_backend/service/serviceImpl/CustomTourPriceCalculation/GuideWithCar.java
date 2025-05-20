package com.uor.group_14.touripearl_backend.service.serviceImpl.CustomTourPriceCalculation;

public class GuideWithCar extends TourDecorator {
    double cost;
    public GuideWithCar(Tour decoratedTour,boolean car) {//placesToVisit.size()
        super(decoratedTour);
        cost = car ? 10000 : 0;
    }

    @Override
    public double getCost() {
        return decoratedTour.getCost() + cost; //  adds extra cost
    }
}

