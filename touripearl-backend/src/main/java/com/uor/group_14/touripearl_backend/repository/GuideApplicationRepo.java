package com.uor.group_14.touripearl_backend.repository;

import com.uor.group_14.touripearl_backend.entity.enumEntity.ApplicationStatus;
import com.uor.group_14.touripearl_backend.entity.guideApplication.GuideApplication;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.Optional;

public interface GuideApplicationRepo extends JpaRepository<GuideApplication, String> {
    Optional<GuideApplication> findByGuideApplicationId(String guideApplicationId);

    // Derived query method to find all applications with status "PENDING"
    Page<GuideApplication> findAllByApplicationStatus(ApplicationStatus applicationStatus, Pageable pageable);

    Optional<GuideApplication> findByEmail(String email);

    @Query("SELECT COUNT(a) FROM guide_application a WHERE " +
            "(:applicationStatus IS NULL OR a.applicationStatus = :applicationStatus)")
    long countByApplicationStatus(ApplicationStatus applicationStatus);
}
