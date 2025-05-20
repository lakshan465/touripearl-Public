package com.uor.group_14.touripearl_backend.service;

import com.uor.group_14.touripearl_backend.dto.request.event.EventCreateRequestDto;
import com.uor.group_14.touripearl_backend.dto.response.event.EventDetailResponseDto;
import com.uor.group_14.touripearl_backend.dto.response.search.StandardSearchResponseDto;
import org.springframework.data.domain.Page;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.net.ContentHandler;
import java.sql.SQLException;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

public interface EventService {
    EventDetailResponseDto createEvent(MultipartFile coverImage, MultipartFile mainImage, List<MultipartFile> subImages, EventCreateRequestDto requestDto) throws SQLException, IOException;
    Page<EventDetailResponseDto> searchByKeywordAndFilters(int page, int size, LocalDateTime startDate,LocalDateTime endDate, String keyword);
    Page<EventDetailResponseDto> findUpcomingEvents(int page, int size);
    EventDetailResponseDto getEventById(String id);
    EventDetailResponseDto updateEvent(String id, EventCreateRequestDto eventDetails);
    Page<StandardSearchResponseDto> globalSearch(int page, int size, String keyword);
    void deleteEvent(String id);
    Map<String,Long> getEventCounts();
}
