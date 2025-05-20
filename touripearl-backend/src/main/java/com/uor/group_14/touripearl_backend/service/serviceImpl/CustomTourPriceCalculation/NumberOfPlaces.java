package com.uor.group_14.touripearl_backend.service.serviceImpl.CustomTourPriceCalculation;



public class NumberOfPlaces extends TourDecorator {
    int size;
    public NumberOfPlaces(Tour decoratedTour,int size) {//placesToVisit.size()
        super(decoratedTour);
        this.size = (size*1000);
    }

    @Override
    public double getCost() {
        return decoratedTour.getCost() + size; //  adds extra cost
    }
}
