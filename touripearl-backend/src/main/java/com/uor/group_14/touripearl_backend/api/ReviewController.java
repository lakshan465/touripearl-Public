package com.uor.group_14.touripearl_backend.api;

import com.uor.group_14.touripearl_backend.dto.request.ReviewRequestDto;
import com.uor.group_14.touripearl_backend.service.ReviewService;
import com.uor.group_14.touripearl_backend.util.StandardResponseDto;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/reviews")
public class ReviewController {
    @Autowired
    private ReviewService reviewService;

    @PostMapping("/add/{guideId}")
    public ResponseEntity<StandardResponseDto> addReview(@PathVariable String guideId, @RequestBody ReviewRequestDto dto) {
        reviewService.addReview(dto, guideId);
        return new ResponseEntity<>(
                new StandardResponseDto(200, "reviews added..", null),
                HttpStatus.OK
        );
    }
}
