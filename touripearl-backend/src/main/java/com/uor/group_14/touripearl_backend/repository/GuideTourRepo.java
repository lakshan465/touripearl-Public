package com.uor.group_14.touripearl_backend.repository;

import com.uor.group_14.touripearl_backend.entity.guide.GuideTour;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import com.uor.group_14.touripearl_backend.entity.guide.GuideTour;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

@Repository
public interface GuideTourRepo extends JpaRepository<GuideTour, Long> {
    // Custom query method to find all tour IDs for a given guide ID
    //@Query("SELECT g FROM GuideTour g WHERE g.guideId = :guideId")
    List<GuideTour> findByGuideId(String guideId);

    @Transactional
    void deleteByTourId(Long tourId);

}
