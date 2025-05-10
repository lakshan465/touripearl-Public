package com.uor.group_14.touripearl_backend.repository;


import com.uor.group_14.touripearl_backend.entity.CustomTourMargin;
import com.uor.group_14.touripearl_backend.entity.guide.GuideTour;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Repository
public interface CusTourMarginRepo extends JpaRepository<CustomTourMargin, Long> {
    // Fetch margin based on guide_id and tour_id
    @Query("SELECT c.margin FROM CustomTourMargin c WHERE c.guideId = :guideId AND c.tourId = :tourId")
    Optional<Double> findMarginByGuideAndTour(@Param("guideId") String guideId, @Param("tourId") Long tourId);

    Page<CustomTourMargin> findByGuideId(String guideId, Pageable pageable);
    Page<CustomTourMargin> findByTourId(Long tourId, Pageable pageable);

    @Query("SELECT COUNT(c.guideId) FROM CustomTourMargin c WHERE c.tourId = :tourId")
    long countByTourId(Long tourId);

    @Transactional
    void deleteByTourId(Long tourId);
}


