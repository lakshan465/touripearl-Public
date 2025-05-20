package com.uor.group_14.touripearl_backend.service;

import com.uor.group_14.touripearl_backend.dto.request.ReviewRequestDto;
import com.uor.group_14.touripearl_backend.entity.Review;

import java.util.List;

public interface ReviewService {
    void addReview(ReviewRequestDto dto, String guideId);

    List<Review> getReviewsByProductId(String productId);
}
