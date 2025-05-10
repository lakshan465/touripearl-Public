package com.uor.group_14.touripearl_backend.repository.refund;

import com.uor.group_14.touripearl_backend.entity.refund.RefundRequest;
import com.uor.group_14.touripearl_backend.entity.refund.RefundStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

public interface RefundRepo extends JpaRepository<RefundRequest,String> {
    @Query(
            "SELECT r FROM RefundRequest r " +
            "WHERE (:keyword IS NULL OR " +
            "LOWER(r.booking.reservation.tourist.firstName) LIKE LOWER(CONCAT('%', :keyword, '%')) OR " +
            "LOWER(r.booking.reservation.tour.guide.firstname) LIKE LOWER(CONCAT('%', :keyword, '%'))) " +
            "AND (:status IS NULL OR r.status = :status)"
    )
    Page<RefundRequest> searchByKeywordAndFilters(Pageable of, RefundStatus status, String keyword);
}
