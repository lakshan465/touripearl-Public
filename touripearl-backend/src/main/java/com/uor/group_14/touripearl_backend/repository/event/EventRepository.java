package com.uor.group_14.touripearl_backend.repository.event;

import com.uor.group_14.touripearl_backend.entity.events.Event;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;

@Repository
public interface EventRepository extends JpaRepository<Event, String> {
    boolean existsEventByTitleIgnoreCase(String title);

    @Query("SELECT e FROM event e " +
            "WHERE (:keyword IS NULL OR " +
            "LOWER(e.title) LIKE LOWER(CONCAT('%', :keyword, '%')) OR " +
            "LOWER(e.description) LIKE LOWER(CONCAT('%', :keyword, '%')) OR " +
            "LOWER(e.shortDescription) LIKE LOWER(CONCAT('%', :keyword, '%')) OR " +
            "LOWER(e.location) LIKE LOWER(CONCAT('%', :keyword, '%'))) " +
            "AND (:startDate IS NULL OR e.startDateTime >= :startDate) " +
            "AND (:endDate IS NULL OR e.endDateTime <= :endDate)")
    Page<Event> searchByKeywordAndFilters(@Param("keyword") String keyword,
                                          @Param("startDate") LocalDateTime startDate,
                                          @Param("endDate") LocalDateTime endDate,
                                          Pageable pageRequest);
    @Query("SELECT e FROM event e " +
            "WHERE e.startDateTime >= :today " +
            "ORDER BY e.startDateTime ASC")
    Page<Event> findUpcomingEvents(@Param("today") LocalDateTime today, Pageable pageRequest);

    @Query("SELECT e FROM event e " +
            "WHERE :keyword IS NOT NULL AND (" +
            "LOWER(e.title) LIKE LOWER(CONCAT('%', :keyword, '%')) OR " +
            "LOWER(e.description) LIKE LOWER(CONCAT('%', :keyword, '%')) OR " +
            "LOWER(e.shortDescription) LIKE LOWER(CONCAT('%', :keyword, '%')) OR " +
            "LOWER(e.location) LIKE LOWER(CONCAT('%', :keyword, '%'))) ")
    Page<Event> globalSearch(@Param("keyword") String keyword, Pageable pageRequest);

    // Total events count
    @Query("SELECT COUNT(e) FROM event e")
    long countTotalEvents();

    // Upcoming events count
    @Query("SELECT COUNT(e) FROM event e WHERE e.startDateTime > CURRENT_TIMESTAMP")
    long countUpcomingEvents();

    // Past events count
    @Query("SELECT COUNT(e) FROM event e WHERE e.startDateTime < CURRENT_TIMESTAMP")
    long countPastEvents();

}