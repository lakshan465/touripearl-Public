package com.uor.group_14.touripearl_backend.repository.reservation;

import com.uor.group_14.touripearl_backend.entity.Tourist;
import com.uor.group_14.touripearl_backend.entity.guide.Guide;
import com.uor.group_14.touripearl_backend.entity.reservation.Reservation;
import com.uor.group_14.touripearl_backend.entity.reservation.ReservationStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.time.LocalDate;

public interface ReservationRepository extends JpaRepository<Reservation, String> {
    @Query("SELECT r FROM reservation r " +
            "WHERE (:keyword IS NULL OR " +
            "LOWER(r.tourist.firstName) LIKE LOWER(CONCAT('%', :keyword, '%')) OR " +
            "LOWER(r.tourist.lastName) LIKE LOWER(CONCAT('%', :keyword, '%')) OR " +
            "LOWER(r.tour.name) LIKE LOWER(CONCAT('%', :keyword, '%')) " +
            "AND (:startDate IS NULL OR r.startDate >= :startDate) " +
            "AND (:endDate IS NULL OR r.endDate <= :endDate)" +
            "AND r.tour.guide = :guide )")
    Page<Reservation> searchByKeywordAndFiltersOfGuide(String keyword, LocalDate startDate, LocalDate endDate, Guide guide, Pageable pageRequest);

    @Query("SELECT r FROM reservation r " +
            "WHERE (:keyword IS NULL OR " +
            "LOWER(r.tour.guide.firstname) LIKE LOWER(CONCAT('%', :keyword, '%')) OR " +
            "LOWER(r.tour.guide.lastname) LIKE LOWER(CONCAT('%', :keyword, '%')) OR " +
            "LOWER(r.tour.name) LIKE LOWER(CONCAT('%', :keyword, '%')) " +
            "AND (:startDate IS NULL OR r.startDate >= :startDate) " +
            "AND (:endDate IS NULL OR r.endDate <= :endDate)" +
            "AND r.tourist = :tourist )")
    Page<Reservation> searchByKeywordAndFiltersOfTourist(String keyword, LocalDate startDate, LocalDate endDate, Tourist tourist, Pageable pageRequest);

    Long countReservationsByStatusAndTour_Guide(ReservationStatus status, Guide tourGuide);

    Long countReservationsByTour_Guide(Guide tour_guide);
}
