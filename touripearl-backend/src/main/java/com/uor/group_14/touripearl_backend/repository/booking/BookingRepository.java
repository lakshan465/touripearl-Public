package com.uor.group_14.touripearl_backend.repository.booking;

import com.uor.group_14.touripearl_backend.entity.bookings.Booking;
import com.uor.group_14.touripearl_backend.entity.bookings.BookingStatus;
import com.uor.group_14.touripearl_backend.entity.guide.Guide;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Range;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;
import java.util.Optional;

public interface BookingRepository extends JpaRepository<Booking,String> {
    List<Booking> getBookingByReservation_Tour_Guide_PropertyId(String reservationTourGuidePropertyId);

    Page<Booking> findAllByReservation_Tourist_ApplicationUser_UserId(String userId , Pageable pageable);

    long countBookingsByStatusAndReservation_Tour_Guide(BookingStatus status, Guide reservationTourGuide);
    @Query("SELECT b FROM booking b " +
            "WHERE (:keyword IS NULL OR " +
            "LOWER(b.reservation.tour.guide.firstname) LIKE LOWER(CONCAT('%', :keyword, '%')) OR " +
            "LOWER(b.reservation.tourist.firstName) LIKE LOWER(CONCAT('%', :keyword, '%'))) " +
            "AND (:status IS NULL OR b.status = :status)")
    Page<Booking> searchByKeywordAndFilters(Pageable pageRequest, BookingStatus status, String keyword);

    @Query("SELECT b FROM booking b " +
            "WHERE (:keyword IS NULL OR " +
            "LOWER(b.reservation.tour.guide.firstname) LIKE LOWER(CONCAT('%', :keyword, '%')) OR " +
            "LOWER(b.reservation.tourist.firstName) LIKE LOWER(CONCAT('%', :keyword, '%'))) " +
            "AND (:status IS NULL OR b.status = :status) " +
            "AND b.reservation.tour.guide = :guide")
    Page<Booking> searchByKeywordAndFiltersWithGuide(Pageable of, BookingStatus status, String keyword, Guide guide);
}
