package com.uor.group_14.touripearl_backend.repository;

import com.uor.group_14.touripearl_backend.entity.applicationUser.ApplicationUser;
import jakarta.transaction.Transactional;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.Instant;
import java.time.LocalDateTime;
import java.util.Optional;

public interface ApplicationUserRepository extends JpaRepository<ApplicationUser, String> {
    Optional<ApplicationUser> findByEmail(String email);
    @Query("SELECT au FROM application_user au " +
            "WHERE LOWER(au.userName) LIKE LOWER(CONCAT('%', :keyword, '%')) " +
            "   OR LOWER(au.email) LIKE LOWER(CONCAT('%', :keyword, '%')) " +
            "   OR LOWER(au.phone) LIKE LOWER(CONCAT('%', :keyword, '%'))")
    Page<ApplicationUser> searchByKeyword(String keyword, Pageable pageable);

    @Query("SELECT u FROM application_user u WHERE " +
           "(LOWER(u.userName) LIKE LOWER(CONCAT('%', :keyword, '%')) OR " +
           "LOWER(u.email) LIKE LOWER(CONCAT('%', :keyword, '%'))) AND " +
           "(:emailVerified IS NULL OR u.isEmailVerified = :emailVerified) AND " +
           "(:status IS NULL OR u.isEnabled = :status)")
    Page<ApplicationUser> searchByKeywordAndFilters(@Param("keyword") String keyword,
                                                    @Param("emailVerified") Boolean emailVerified,
                                                    @Param("status") Boolean status,
                                                    Pageable pageable);

    @Query("SELECT COUNT(u) FROM application_user u WHERE u.createdAt >= :startDate AND u.createdAt <= :endDate")
    long countUsersByDateRange(@Param("startDate") LocalDateTime startDate, @Param("endDate") LocalDateTime endDate);


    @Query("SELECT COUNT(u) FROM application_user u " +
            "WHERE (:b IS NULL OR u.isEmailVerified = :b )")
    Long countUsersByEmailVerified(Boolean b);

    @Modifying
    @Transactional
    @Query("UPDATE application_user u SET u.lastActive = :lastActive WHERE u.email = :email")
    void updateLastActive(@Param("email") String email, @Param("lastActive") LocalDateTime lastActive);

    ApplicationUser findByUserId(String userId);


}
