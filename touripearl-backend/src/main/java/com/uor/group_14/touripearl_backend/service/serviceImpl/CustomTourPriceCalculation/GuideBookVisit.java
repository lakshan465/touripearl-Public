package com.uor.group_14.touripearl_backend.service.serviceImpl.CustomTourPriceCalculation;

public class GuideBookVisit extends TourDecorator {
    double cost;
    public GuideBookVisit(Tour decoratedTour,boolean visit) {//placesToVisit.size()
        super(decoratedTour);
        cost = visit ? 10000 : 0;
    }

    @Override
    public double getCost() {
        return decoratedTour.getCost() + cost; //  adds extra cost
    }
}