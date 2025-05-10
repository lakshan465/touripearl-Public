package com.uor.group_14.touripearl_backend.entity.applicationUser;

import com.uor.group_14.touripearl_backend.entity.CustomTour;
import com.uor.group_14.touripearl_backend.entity.Tourist;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Set;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Entity(name = "application_user")
public class ApplicationUser {
    @Id
    @Column(name = "user_id", length = 100)
    private String userId;

    @Column(name = "user_name", length = 100, unique = true)
    private String userName;

    @Column(name = "email", length = 100, unique = true, nullable = false)
    private String email;

    @Column(name = "password", length = 750, nullable = false)
    private String password;

    @Column(name = "country", length = 20, nullable = false)
    private String country;

    @Column(name = "street", length = 100, nullable = false)
    private String street;

    @Column(name = "city", length = 20, nullable = false)
    private String city;

    @Column(name = "state", length = 20, nullable = false)
    private String state;

    @Column(name = "zipCode", length = 20, nullable = false)
    private String zipCode;

    @Column(name = "phone", length = 15, nullable = false)
    private String phone;

    @Column(name = "is_account_non_expired", columnDefinition = "TINYINT")
    private boolean isAccountNonExpired;

    @Column(name = "is_account_non_locked", columnDefinition = "TINYINT")
    private boolean isAccountNonLocked;

    @Column(name = "is_credentials_non_expired", columnDefinition = "TINYINT")
    private boolean isCredentialsNonExpired;

    @Column(name = "is_enabled", columnDefinition = "TINYINT")
    private boolean isEnabled;

    @Column(name = "is_email_verified", columnDefinition = "TINYINT")
    private boolean isEmailVerified;

    @Column(name = "created_at", length = 50, nullable = false)
    private LocalDateTime createdAt;

    @ManyToMany//one to many
    @JoinTable(name = "application_user_roles", joinColumns = @JoinColumn(name = "role_id"),
            inverseJoinColumns = @JoinColumn(name = "user_id"))
    private Set<UserRole> userRoles;

    @OneToOne(mappedBy = "applicationUser", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private ProfileImage profileImage;

    @OneToOne(mappedBy = "applicationUser", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private Tourist tourist;

    @OneToOne(mappedBy = "applicationUser", cascade = CascadeType.ALL, orphanRemoval = true)
    private PasswordResetToken passwordResetToken;

    private LocalDateTime lastActive;


}
