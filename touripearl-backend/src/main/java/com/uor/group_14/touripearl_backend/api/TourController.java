package com.uor.group_14.touripearl_backend.api;

import com.uor.group_14.touripearl_backend.dto.request.TourCreateRequestDto;
import com.uor.group_14.touripearl_backend.dto.response.TourViewResponseDto;
import com.uor.group_14.touripearl_backend.entity.tour.Tour;
import com.uor.group_14.touripearl_backend.service.TourService;
import com.uor.group_14.touripearl_backend.util.StandardResponseDto;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/tours")
@RequiredArgsConstructor
public class TourController {

    private final TourService tourService;

    @PostMapping
    public ResponseEntity<StandardResponseDto> createTour(@Valid @RequestBody TourCreateRequestDto dto){
        Tour createdTour = tourService.createTour(dto);
        return new ResponseEntity<>(
                new StandardResponseDto(
                        201, "Tour Created",createdTour.getId()
                ),
                HttpStatus.OK
        );
    }

    @GetMapping
    public ResponseEntity<StandardResponseDto> getAllTours(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size
    ) {

        return new ResponseEntity<>(
                new StandardResponseDto(
                        200, "All tours fetched successfully", tourService.getAllTours(page, size)
                ),
                HttpStatus.OK
        );
    }

    @GetMapping("/{id}")
    public ResponseEntity<StandardResponseDto> getTourById(@PathVariable String id) {
        TourViewResponseDto tour = tourService.getTourById(id);
        return new ResponseEntity<>(
                new StandardResponseDto(
                        200, "Tour details fetched successfully", tour
                ),
                HttpStatus.OK
        );
    }

    @PutMapping("/{id}")
    public ResponseEntity<StandardResponseDto> updateTour(
            @PathVariable String id,
            @RequestBody @Valid TourCreateRequestDto dto
    ){
        Tour updatedTour = tourService.updateTour(id, dto);

        return new ResponseEntity<>(
                new StandardResponseDto(
                        200, "Tour updated successfully", updatedTour
                ),
                HttpStatus.OK
        );
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<StandardResponseDto> deleteTour(@PathVariable String id) {
        tourService.deleteTour(id);

        return new ResponseEntity<>(
                new StandardResponseDto(
                        200, "Tour deleted successfully", null
                ),
                HttpStatus.OK
        );
    }
    @GetMapping("/search-by-keyword")
    public ResponseEntity<StandardResponseDto> searchByKeyword(@RequestParam(defaultValue = "0") int page,
                                                               @RequestParam(defaultValue = "10") int size,
                                                               @RequestParam(defaultValue = "") String keyword,
                                                               @RequestParam(required = false) Boolean includeMeals,
                                                               @RequestParam(required = false) Boolean isAvailable
    ) {
        Page<TourViewResponseDto> tours = tourService.searchByKeywordAndFilters(page, size, keyword, includeMeals, isAvailable);
        return new ResponseEntity<>(
                new StandardResponseDto(
                        200, "Keyword users", tours
                ), HttpStatus.OK
        );
    }

}
