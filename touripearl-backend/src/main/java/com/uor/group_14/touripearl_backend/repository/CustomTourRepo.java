package com.uor.group_14.touripearl_backend.repository;
import com.uor.group_14.touripearl_backend.entity.CustomTour;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CustomTourRepo extends JpaRepository<CustomTour, Long> {
    List<CustomTour> findByIdIn(List<Long> tourIds);  // Fetch tours by their IDs
    Page<CustomTour> findByTouristPropertyId(String touristId, Pageable pageable);
}
