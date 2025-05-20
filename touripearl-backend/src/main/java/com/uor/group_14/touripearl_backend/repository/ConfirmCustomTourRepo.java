package com.uor.group_14.touripearl_backend.repository;

import com.uor.group_14.touripearl_backend.entity.ConfirmCustomTour;
import com.uor.group_14.touripearl_backend.entity.CustomTour;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;


@Repository
public interface ConfirmCustomTourRepo extends JpaRepository<ConfirmCustomTour, Long> {
    Page<ConfirmCustomTour> findByTouristIdc(String touristIdc, Pageable pageable);
    Page<ConfirmCustomTour> findByGuideIdc(String guideIdc, Pageable pageable);
    List<ConfirmCustomTour> findByGuideIdc(String guideIdc);

    //List<CustomTour> findByIdIn(List<Long> );
}

