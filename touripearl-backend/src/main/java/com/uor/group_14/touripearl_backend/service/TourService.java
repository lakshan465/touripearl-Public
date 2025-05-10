package com.uor.group_14.touripearl_backend.service;

import com.uor.group_14.touripearl_backend.dto.request.TourCreateRequestDto;
import com.uor.group_14.touripearl_backend.dto.response.TourViewResponseDto;
import com.uor.group_14.touripearl_backend.entity.tour.Tour;
import org.springframework.data.domain.Page;

import java.util.Map;

public interface TourService {
    Tour createTour(TourCreateRequestDto dto);
    Page<TourViewResponseDto> getAllTours(int page, int size);
    TourViewResponseDto getTourById(String id);
    Tour updateTour(String id, TourCreateRequestDto dto);
    void deleteTour(String id);
    Map<String,Long> getToursMetricsByGuideId();

    Page<TourViewResponseDto> searchByKeywordAndFilters(int page, int size, String keyword, Boolean emailVerified, Boolean status);
    public String getTouristIdByUserId(String userId);
}
