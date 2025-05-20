package com.uor.group_14.touripearl_backend.repository.applicationUser;

import com.uor.group_14.touripearl_backend.entity.applicationUser.ApplicationUser;
import com.uor.group_14.touripearl_backend.entity.applicationUser.PasswordResetToken;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface PasswordResetTokenRepository extends JpaRepository<PasswordResetToken,String> {
    Optional<PasswordResetToken> findByValue(String value);

    Optional<PasswordResetToken> findByApplicationUser(ApplicationUser user);
}
