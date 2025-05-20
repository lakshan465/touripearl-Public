package com.uor.group_14.touripearl_backend.service;

import com.uor.group_14.touripearl_backend.dto.request.ApplicationUserUpdateRequestDto;
import com.uor.group_14.touripearl_backend.dto.request.PasswordChangeRequestDto;
import com.uor.group_14.touripearl_backend.dto.request.applicationUser.PasswordResetRequestDto;
import com.uor.group_14.touripearl_backend.dto.response.ApplicationUserResponseDto;
import org.springframework.data.domain.Page;
import org.springframework.security.core.userdetails.UserDetailsService;

import java.util.Map;

public interface ApplicationUserService extends UserDetailsService {
    ApplicationUserResponseDto getSingleApplicationUser(String id);
    void updateUser(String id, ApplicationUserUpdateRequestDto dto);
    void changePassword(String id, PasswordChangeRequestDto dto);
    String createEmailVerificationToken(String email);
    String validateToken(String token);
    void resetPassword(PasswordResetRequestDto resetRequestDto);
    Page<ApplicationUserResponseDto> searchByKeywordAndFilters(int page, int size, String keyword,Boolean emailVerified,Boolean status);
    void updateUserEmailVerifiedState(String token);
    void deleteApplicationUserAccount(String token);
    Map<String, Long> getSignupCounts();
    Map<String,Long> getVerifiedCounts();
}