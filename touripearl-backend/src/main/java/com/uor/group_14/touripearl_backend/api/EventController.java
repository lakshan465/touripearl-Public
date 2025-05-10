package com.uor.group_14.touripearl_backend.api;

import com.uor.group_14.touripearl_backend.dto.request.event.EventCreateRequestDto;
import com.uor.group_14.touripearl_backend.dto.response.event.EventDetailResponseDto;

import com.uor.group_14.touripearl_backend.service.EventService;
import com.uor.group_14.touripearl_backend.util.StandardResponseDto;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.sql.SQLException;
import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/api/v1/events")
@RequiredArgsConstructor
public class EventController {
    private final EventService eventService;
    @GetMapping("/search-by-keyword")
    public ResponseEntity<StandardResponseDto> searchByKeyword(@RequestParam(defaultValue = "0") int page,
                                                               @RequestParam(defaultValue = "10") int size,
                                                               @RequestParam(required = false) LocalDateTime startDate,
                                                               @RequestParam(required = false) LocalDateTime endDate,
                                                               @RequestParam(defaultValue = "") String keyword){
        Page<EventDetailResponseDto> events =eventService.searchByKeywordAndFilters(page,size,startDate,endDate,keyword);
        return new ResponseEntity<>(
                new StandardResponseDto(
                        200,"Keyword events",events
                ),HttpStatus.OK
        );
    }
    @GetMapping("/upcoming-events")
    public ResponseEntity<StandardResponseDto> upcomingEvents(@RequestParam(defaultValue = "0") int page,
                                                              @RequestParam(defaultValue = "10") int size
                                                              ){
        Page<EventDetailResponseDto> events =eventService.findUpcomingEvents(page,size);
        return new ResponseEntity<>(
                new StandardResponseDto(
                        200,"upcoming events",events
                ),HttpStatus.OK
        );
    }

    @GetMapping("/{id}")
    public ResponseEntity<StandardResponseDto> getEventById(@PathVariable String id) {
        EventDetailResponseDto event = eventService.getEventById(id);
        return new ResponseEntity<>(
                new StandardResponseDto(
                        200,"event detail",event
                ),HttpStatus.OK
        );
    }

    @PostMapping
    public ResponseEntity<StandardResponseDto> createEvent(@RequestPart("coverImage") MultipartFile coverImage,
                             @RequestPart("mainImage") MultipartFile mainImage,
                             @RequestPart("subImages") List<MultipartFile> subImages,
                             @RequestPart("body") EventCreateRequestDto requestDto
                             ) throws SQLException, IOException {
         EventDetailResponseDto detailResponseDto=eventService.createEvent(coverImage,mainImage,subImages,requestDto);
         return new ResponseEntity<>(
                 new StandardResponseDto(
                         201,"create",detailResponseDto
                 ),HttpStatus.CREATED
         );
    }

    @PutMapping("/update/{id}")
    public ResponseEntity<StandardResponseDto> updateEvent(@PathVariable String id, @RequestBody EventCreateRequestDto eventDetails) {

        EventDetailResponseDto detailResponseDto = eventService.updateEvent(id, eventDetails);
            return new ResponseEntity<>(
                    new StandardResponseDto(
                            200,"updated event",detailResponseDto
                    ),HttpStatus.OK
            );

    }

    @DeleteMapping("/{id}")
    public ResponseEntity<StandardResponseDto> deleteEvent(@PathVariable String id) {
            eventService.deleteEvent(id);
            return new ResponseEntity<>(
                    new StandardResponseDto(
                            200,"deleted",null
                    ),HttpStatus.OK
            );

    }
}