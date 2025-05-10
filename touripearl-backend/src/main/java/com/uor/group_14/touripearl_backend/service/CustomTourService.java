package com.uor.group_14.touripearl_backend.service;

import com.uor.group_14.touripearl_backend.dto.request.tourist.CuztomTourDTO;
import com.uor.group_14.touripearl_backend.dto.request.tourist.SaveConfirmTourReqDto;
import com.uor.group_14.touripearl_backend.dto.response.CustomTourResponseDto;
import com.uor.group_14.touripearl_backend.entity.ConfirmCustomTour;
import com.uor.group_14.touripearl_backend.entity.CustomTour;
import com.uor.group_14.touripearl_backend.entity.CustomTourMargin;
import org.springframework.data.domain.Page;

import java.util.List;
import java.util.Optional;

public interface CustomTourService {
    public CustomTour createCustomTour(CuztomTourDTO dto );

    //List<Long> getTourIdsByGuideId(String guideId);
    public Page<CustomTourResponseDto> findNonOverlappingToursAndDetails(int page, int size,String guideId);
    public Optional<Double> getMargin(String guideId, Long tourId);
    public CustomTourMargin saveMargin(CustomTourMargin customTourMargin);
    public void saveTour(CustomTourMargin customTourMargin);

    public Page<CustomTourMargin> getMarginsByGuideId(String guideId,  int page, int size);

    public CustomTourResponseDto getTourById(Long tourId);
    public Page<CustomTourResponseDto> getTourByTouristId(String tourId,int page);
    public void deleteCustomTour(Long id);

    public ConfirmCustomTour saveCustomTour(SaveConfirmTourReqDto saveConfirmTourReqDto);
    public Page<ConfirmCustomTour> getToursByTouristIdc(int page, int size);

    Page<ConfirmCustomTour> getToursByGuideIdc(String guideUUID, int page, int size);
}
