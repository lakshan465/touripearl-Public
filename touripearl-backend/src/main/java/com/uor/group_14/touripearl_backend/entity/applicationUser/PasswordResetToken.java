package com.uor.group_14.touripearl_backend.entity.applicationUser;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.OneToOne;
import lombok.*;

import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Entity
public class PasswordResetToken {
    @Id
    private String propertyId;
    @Column(nullable = false)
    private String value;
    @Column(nullable = false)
    private LocalDateTime expiryDate;
    @OneToOne
    private ApplicationUser applicationUser;
}
