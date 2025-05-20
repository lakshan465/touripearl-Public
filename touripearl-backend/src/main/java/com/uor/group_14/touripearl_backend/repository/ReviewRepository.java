package com.uor.group_14.touripearl_backend.repository;

import com.uor.group_14.touripearl_backend.entity.Review;
import com.uor.group_14.touripearl_backend.entity.guide.Guide;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ReviewRepository extends JpaRepository<Review, String> {
    List<Review> findAllByGuide(Guide guide);
}
