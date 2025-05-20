package com.uor.group_14.touripearl_backend.api.search;

import com.uor.group_14.touripearl_backend.dto.response.search.StandardSearchResponseDto;
import com.uor.group_14.touripearl_backend.service.serviceImpl.EventServiceImpl;
import com.uor.group_14.touripearl_backend.service.serviceImpl.GuideServiceImpl;
import com.uor.group_14.touripearl_backend.util.StandardResponseDto;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.*;

@RestController
@RequestMapping("api/v1/search")
@RequiredArgsConstructor
public class SearchController {
    private final EventServiceImpl eventService;
    private final GuideServiceImpl guideService;
    @GetMapping()
    public ResponseEntity<StandardResponseDto> search(@RequestParam(defaultValue = "0") int page,
                                                      @RequestParam(defaultValue = "4") int size,
                                                      @RequestParam(required = false) String keyword
                                                      ){
        Map<String, List<Object>> results = new HashMap<>();
        Page<StandardSearchResponseDto> eventSearchResponseDto = eventService.globalSearch(page, size, keyword);
        Page<StandardSearchResponseDto> guideSearchResponseDto = guideService.globalSearch(page, size, keyword);
        results.put("events", Collections.singletonList(eventSearchResponseDto));
        results.put("guides", Collections.singletonList(guideSearchResponseDto));
        return new ResponseEntity<>(
                new StandardResponseDto(
                        200,"Result",results
                ), HttpStatus.OK
        );
    }
}
