package com.uor.group_14.touripearl_backend.repository;

import com.uor.group_14.touripearl_backend.entity.guide.Guide;
import com.uor.group_14.touripearl_backend.entity.tour.Tour;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface TourRepo extends JpaRepository<Tour, String> {
    @Query("SELECT u FROM Tour u WHERE " +
            "(LOWER(u.name) LIKE LOWER(CONCAT('%', :keyword, '%')) OR " +
            "LOWER(u.meetingPoint) LIKE LOWER(CONCAT('%', :keyword, '%'))) AND " +
            "(:isAvailable IS NULL OR u.isAvailable = :isAvailable) AND " +
            "(:includeMeals IS NULL OR u.includesMeals = :includeMeals) AND " +
            "(:guide IS NULL OR u.guide = :guide)")
    Page<Tour> searchByKeywordAndFilters(String keyword, Boolean includeMeals, Boolean isAvailable, Pageable pageable, Guide guide);

    List<Tour> findByGuide_PropertyId(String guideId);

}
