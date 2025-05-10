package com.uor.group_14.touripearl_backend.repository;

import com.uor.group_14.touripearl_backend.entity.applicationUser.UserRole;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Set;

public interface UserRoleRepository extends JpaRepository<UserRole, String> {
    Set<UserRole> findByRoleName(String roleName);
}
