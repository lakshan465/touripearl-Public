package com.uor.group_14.touripearl_backend.service.serviceImpl.CustomTourPriceCalculation;

public class GuideWithHotel extends TourDecorator {
    double cost;
    public GuideWithHotel(Tour decoratedTour,boolean hotel) {//placesToVisit.size()
        super(decoratedTour);
        cost = hotel ? 10000 : 0;
    }

    @Override
    public double getCost() {
        return decoratedTour.getCost() + cost; //  adds extra cost
    }
}