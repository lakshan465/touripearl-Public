package com.uor.group_14.touripearl_backend.repository;

import com.uor.group_14.touripearl_backend.entity.destinations.Destination;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.Optional;

public interface DestinationRepo extends JpaRepository<Destination, Integer> {
    boolean existsByDestinationNameIgnoreCase(String destinationName);
    @Query("SELECT d FROM destination d WHERE LOWER(d.destinationName) = LOWER(:destinationName)")
    Optional<Destination> findByDestinationName(@Param("destinationName") String destinationName);
    Optional<Destination> findByDestinationId(String destinationId);
    Page<Destination> findByDestinationNameContainingIgnoreCaseOrLocationContainingIgnoreCase(
            String name, String location, Pageable pageable);

    Page<Destination> findByDestinationNameContainingIgnoreCaseOrLocationContainingIgnoreCaseAndIsActive(
            String name, String location, boolean active, Pageable pageable);

    Page<Destination> findByIsActive(boolean active, Pageable pageable);
}
