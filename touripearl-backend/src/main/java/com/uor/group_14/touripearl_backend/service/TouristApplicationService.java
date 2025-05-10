package com.uor.group_14.touripearl_backend.service;

import com.uor.group_14.touripearl_backend.dto.request.TouristChangeDataRequestDto;
import com.uor.group_14.touripearl_backend.dto.request.TouristRequestDto;
import com.uor.group_14.touripearl_backend.dto.response.TouristResponseDto;

public interface TouristApplicationService {
    void createTourist(TouristRequestDto dto);

    void update(String id, TouristChangeDataRequestDto dto);

    TouristResponseDto getTourist(String id);
    TouristResponseDto getTouristByPropertyId(String propertyId);
}
