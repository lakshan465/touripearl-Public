package com.uor.group_14.touripearl_backend.repository;

import com.uor.group_14.touripearl_backend.entity.applicationUser.ApplicationUser;
import com.uor.group_14.touripearl_backend.entity.applicationUser.ProfileImage;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface ProfileImageRepository extends JpaRepository<ProfileImage,String> {

    Optional<ProfileImage> findByApplicationUser(ApplicationUser user);
    Optional<ProfileImage> findByApplicationUser_userId(String userId);
}
