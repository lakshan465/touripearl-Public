package com.uor.group_14.touripearl_backend.service;

import com.uor.group_14.touripearl_backend.dto.request.guide.GuideFilteringDto;
import com.uor.group_14.touripearl_backend.dto.request.guide.ProfileUpdateRequestDto;
import com.uor.group_14.touripearl_backend.dto.response.CustomTourMarginWithGuide;
import com.uor.group_14.touripearl_backend.dto.response.GuideDetailsResponseDto;
import com.uor.group_14.touripearl_backend.dto.response.search.StandardSearchResponseDto;
import com.uor.group_14.touripearl_backend.dto.response.GuidePaginateResponseDto;
import com.uor.group_14.touripearl_backend.entity.guide.Guide;
import com.uor.group_14.touripearl_backend.entity.guideApplication.GuideApplication;
import jakarta.mail.MessagingException;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.Map;

public interface GuideService {
    public String create(GuideApplication guideApplication) throws MessagingException;
    public GuideDetailsResponseDto getGuideById(String id);
    public GuideDetailsResponseDto updateMyGuideData(String uuid, ProfileUpdateRequestDto dto);
    Page<StandardSearchResponseDto> globalSearch(int page, int size, String keyword);
    GuidePaginateResponseDto findAllGuides(String searchText, int page, int size);
    Map<String,Long> getGuidesByActive();
    GuideDetailsResponseDto getGuideByUser();
    GuidePaginateResponseDto findAllNewGuides(String searchTxt, int page, int size);

    public Page<CustomTourMarginWithGuide> getMarginAndGuidesByTourId(Long tourId, int pg,int size);
    public String getUUIdByTourId(Long tourId);
    public String getTouristIdByTourId(Long tourId);
    Page<GuideDetailsResponseDto> getGuidesByFiltering(GuideFilteringDto dto);
}