package com.uor.group_14.touripearl_backend.repository;

import com.uor.group_14.touripearl_backend.dto.response.GuideDetailsResponseDto;
import com.uor.group_14.touripearl_backend.entity.applicationUser.ApplicationUser;
import com.uor.group_14.touripearl_backend.entity.guide.Guide;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Range;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

public interface GuideRepo extends JpaRepository<Guide, String> {
     Optional<Guide> findByApplicationUser(ApplicationUser applicationUser);

    @Query("SELECT g FROM guide g "+
            "WHERE :keyword IS NOT NULL AND (" +
            "LOWER(g.firstname) LIKE LOWER(CONCAT('%',:keyword,'%')) OR " +
            "LOWER(g.lastname) LIKE LOWER(CONCAT('%',:keyword,'%')))"
    )
    Page<Guide> globalSearch(@Param("keyword")String keyword, Pageable pageable);

    @Query(value = "SELECT * FROM guide", nativeQuery = true)
    Page<Guide> searchAll(String searchText, Pageable pageable);

    @Query(value = "SELECT COUNT(*) FROM guide", nativeQuery = true)
    long searchCount(String searchText);

    @Query("SELECT COUNT(g) FROM guide g " +
            "WHERE g.applicationUser.lastActive >= :date")
    long countByLastActive(@Param("date") LocalDateTime date);

    @Query("SELECT g FROM guide g ORDER BY g.applicationUser.createdAt DESC")
    List<Guide> searchNewAll(String searchTxt, PageRequest of);

    @Query("SELECT g FROM guide g WHERE g.applicationUser.userId = :userId")
    Optional<Guide> findByApplicationUserId(@Param("userId") String userId);


    Page<Guide> findAll(Specification<Guide> spec, Pageable starMean);
}