package com.uor.group_14.touripearl_backend.repository;

import com.uor.group_14.touripearl_backend.entity.Tourist;
import com.uor.group_14.touripearl_backend.entity.applicationUser.ApplicationUser;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface TouristRepo extends JpaRepository<Tourist,String> {
    Optional<Tourist> findByApplicationUser_Email(String email);
    Optional<Tourist> findByPropertyId(String propertyId);
    Optional<Tourist> findByApplicationUser(ApplicationUser user);

}
