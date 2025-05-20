package com.uor.group_14.touripearl_backend.dto.response;

import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;
import java.util.Set;

@Getter
@Setter
@Builder
public class ApplicationUserResponseDto {
    private String userId;
    private String userName;
    private String email;
    private String phone;
    private String country;
    private String street;
    private String city;
    private String state;
    private String zipCode;
    private boolean isAccountNonExpired;
    private boolean isAccountNonLocked;
    private boolean isCredentialsNonExpired;
    private boolean isEnabled;
    private boolean isEmailVerified;
    private LocalDateTime createdAt;
    private Set<String> userRoles;
    private ProfileImageResponseDto profileImage;
}
