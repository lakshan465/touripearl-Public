package com.uor.group_14.touripearl_backend.repository.dispute;

import com.uor.group_14.touripearl_backend.entity.dispute.Dispute;
import com.uor.group_14.touripearl_backend.entity.dispute.DisputeStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

public interface DisputeRepo extends JpaRepository<Dispute,String> {
    @Query("SELECT d FROM Dispute d " +
            "WHERE (:keyword IS NULL OR " +
            "LOWER(d.raisedBy.email) LIKE LOWER(CONCAT('%', :keyword, '%')) OR " +
            "LOWER(d.description) LIKE LOWER(CONCAT('%', :keyword, '%'))) " +
            "AND (:status IS NULL OR d.status = :status)")
    Page<Dispute> searchByKeywordAndFilters(Pageable pageRequest, DisputeStatus status, String keyword);
}

