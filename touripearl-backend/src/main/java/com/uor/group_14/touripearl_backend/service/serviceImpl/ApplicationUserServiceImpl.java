package com.uor.group_14.touripearl_backend.service.serviceImpl;

import com.uor.group_14.touripearl_backend.auth.ApplicationUserDetails;
import com.uor.group_14.touripearl_backend.dto.request.ApplicationUserUpdateRequestDto;
import com.uor.group_14.touripearl_backend.dto.request.PasswordChangeRequestDto;
import com.uor.group_14.touripearl_backend.dto.request.applicationUser.PasswordResetRequestDto;
import com.uor.group_14.touripearl_backend.dto.response.ApplicationUserResponseDto;
import com.uor.group_14.touripearl_backend.dto.response.ProfileImageResponseDto;
import com.uor.group_14.touripearl_backend.entity.applicationUser.ApplicationUser;
import com.uor.group_14.touripearl_backend.entity.applicationUser.PasswordResetToken;
import com.uor.group_14.touripearl_backend.entity.applicationUser.ProfileImage;
import com.uor.group_14.touripearl_backend.entity.applicationUser.UserRole;
import com.uor.group_14.touripearl_backend.entity.enumEntity.EmailTemplate;
import com.uor.group_14.touripearl_backend.exception.EntryNotFoundException;
import com.uor.group_14.touripearl_backend.exception.IllegalStateException;
import com.uor.group_14.touripearl_backend.exception.InvalidPasswordException;
import com.uor.group_14.touripearl_backend.repository.ApplicationUserRepository;
import com.uor.group_14.touripearl_backend.repository.ProfileImageRepository;
import com.uor.group_14.touripearl_backend.repository.applicationUser.PasswordResetTokenRepository;
import com.uor.group_14.touripearl_backend.service.ApplicationUserService;
import com.uor.group_14.touripearl_backend.service.MailService;
import com.uor.group_14.touripearl_backend.util.FileExtractor;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ApplicationUserServiceImpl implements ApplicationUserService {
    private final ApplicationUserRepository applicationUserRepository;
    private final FileExtractor fileExtractor;
    private final PasswordEncoder passwordEncoder;
    private final ProfileImageRepository profileImageRepository;
    private final PasswordResetTokenRepository passwordResetTokenRepository;
    private final MailService mailService;

    @Transactional
    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        Optional<ApplicationUser> existUser = applicationUserRepository.findByEmail(username);
        if (existUser.isEmpty()) {
            throw new EntryNotFoundException(String.format("user %s not found", username));
        }
        if (!existUser.get().isEmailVerified()) {
            throw new IllegalStateException("email verification failed");
        }
        Set<SimpleGrantedAuthority> grantedAuthorities = new HashSet<>();
        for (UserRole role : existUser.get().getUserRoles()) {
            grantedAuthorities.add(new SimpleGrantedAuthority(role.getRoleName())); // Prefix roles with "ROLE_"
        }

        return ApplicationUserDetails.builder()
                .authorities(grantedAuthorities)
                .username(existUser.get().getEmail())
                .password(existUser.get().getPassword())
                .isEnabled(existUser.get().isEnabled())
                .isAccountNonLocked(existUser.get().isAccountNonLocked())
                .isCredentialsNonExpired(existUser.get().isCredentialsNonExpired())
                .isAccountNonExpired(existUser.get().isAccountNonExpired())
                .build();

    }


    @Override
    public ApplicationUserResponseDto getSingleApplicationUser(String id) {
        Optional<ApplicationUser> applicationUser = applicationUserRepository.findById(id);
        if (applicationUser.isEmpty()) {
            throw new EntryNotFoundException(String.format("user %s not found", id));
        }

        Optional<ProfileImage> selectedImage = profileImageRepository.findByApplicationUser(applicationUser.get());

        if (selectedImage.isEmpty()) {
            return MapUsers(applicationUser.get());
        } else {

            ProfileImageResponseDto imageResponseDto = ProfileImageResponseDto.builder()
                    .hash(fileExtractor.byteArrayToString(selectedImage.get().getHash()))
                    .resourceUrl(fileExtractor.byteArrayToString(selectedImage.get().getResourceUrl()))
                    .directory(fileExtractor.byteArrayToString(selectedImage.get().getDirectory()))
                    .fileName(fileExtractor.byteArrayToString(selectedImage.get().getFileName()))
                    .propertyId(selectedImage.get().getPropertyId())
                    .build();

            return ApplicationUserResponseDto.builder()
                    .userId(applicationUser.get().getUserId())
                    .userName(applicationUser.get().getUserName())
                    .email(applicationUser.get().getEmail())
                    .phone(applicationUser.get().getPhone())
                    .isAccountNonExpired(applicationUser.get().isAccountNonExpired())
                    .isCredentialsNonExpired(applicationUser.get().isCredentialsNonExpired())
                    .isAccountNonLocked(applicationUser.get().isAccountNonLocked())
                    .city(applicationUser.get().getCity())
                    .country(applicationUser.get().getCountry())
                    .state(applicationUser.get().getState())
                    .street(applicationUser.get().getStreet())
                    .zipCode(applicationUser.get().getZipCode())
                    .profileImage(imageResponseDto)
                    .userRoles(applicationUser.get().getUserRoles().stream()
                            .map(UserRole::getRoleName)
                            .collect(Collectors.toSet())
                    )
                    .isEnabled(applicationUser.get().isEnabled())
                    .createdAt(applicationUser.get().getCreatedAt())
                    .build();
        }

    }

    @Override
    public void updateUser(String id, ApplicationUserUpdateRequestDto dto) {
        Optional<ApplicationUser> user = applicationUserRepository.findById(id);
        if (user.isEmpty()) {
            throw new EntryNotFoundException(String.format("user %s not found", id));
        }
        user.get().setAccountNonExpired(dto.isAccountNonExpired);
        user.get().setAccountNonLocked(dto.isAccountNonLocked);
        user.get().setCredentialsNonExpired(dto.isCredentialsNonExpired);
        user.get().setEnabled(dto.isEnabled);

        applicationUserRepository.save(user.get());
    }

    @Override
    public void changePassword(String id, PasswordChangeRequestDto dto) {
        Optional<ApplicationUser> selectedUser = applicationUserRepository.findById(id);

        if (selectedUser.isEmpty()) {
            throw new EntryNotFoundException("User not found.");
        }

        ApplicationUser user = selectedUser.get();

        if (!passwordEncoder.matches(dto.getOldPassword(), user.getPassword())) {
            throw new InvalidPasswordException("Old password does not match.");
        }

        user.setPassword(passwordEncoder.encode(dto.getNewPassword()));

        applicationUserRepository.save(user);
    }

    @Override
    public String createEmailVerificationToken(String email) {
        Optional<ApplicationUser> user = applicationUserRepository.findByEmail(email);
        if (user.isEmpty()) {
            throw new EntryNotFoundException("A user not found with this email");
        }
        Optional<PasswordResetToken> existToken = passwordResetTokenRepository.findByApplicationUser(user.get());
        if (existToken.isPresent()) {
            user.get().setPasswordResetToken(null);
            passwordResetTokenRepository.delete(existToken.get());
        }

        PasswordResetToken resetToken = PasswordResetToken.builder()
                .propertyId(UUID.randomUUID().toString())
                .applicationUser(user.get())
                .value(new Random().ints(6, 0, 36)
                        .mapToObj(i -> i < 10 ? String.valueOf(i) : String.valueOf((char) ('A' + i - 10)))
                        .collect(Collectors.joining()))
                .expiryDate(LocalDateTime.now().plusMinutes(5))
                .build();
        passwordResetTokenRepository.save(resetToken);

        return resetToken.getValue();
    }

    @Override
    public String validateToken(String token) {
        Optional<PasswordResetToken> resetToken = passwordResetTokenRepository.findByValue(token);
        if (resetToken.isEmpty()) {
            throw new EntryNotFoundException("Your reset token not found!");
        }
        if (resetToken.get().getExpiryDate().isBefore(LocalDateTime.now())) {
            throw new EntryNotFoundException("Your reset token has been expired");
        }
        return resetToken.get().getPropertyId();
    }

    @Override
    public void resetPassword(PasswordResetRequestDto resetRequestDto) {
        Optional<PasswordResetToken> resetToken = passwordResetTokenRepository.findByValue(resetRequestDto.getToken());
        validateToken(resetRequestDto.getToken());
        if (resetToken.isEmpty()) {
            throw new EntryNotFoundException("Reset token not found");
        }
        Optional<ApplicationUser> user = applicationUserRepository.findById(resetToken.get().getApplicationUser().getUserId());
        if (user.isEmpty()) {
            throw new EntryNotFoundException("A user not found with this email");
        }
        if (!user.get().isEnabled()) {
            throw new EntryNotFoundException("Your account has been disabled please contact us");
        }
        user.get().setPassword(passwordEncoder.encode(resetRequestDto.getPassword()));
        applicationUserRepository.save(user.get());

    }

    private ApplicationUser emailVerification(String token) {
        String propertyId = validateToken(token);
        Optional<PasswordResetToken> resetToken = passwordResetTokenRepository.findById(propertyId);
        if (resetToken.isEmpty()) {
            throw new EntryNotFoundException("Your token not found");
        }
        Optional<ApplicationUser> user = applicationUserRepository.findById(resetToken.get().getApplicationUser().getUserId());
        if (user.isEmpty()) {
            throw new EntryNotFoundException("A user not found with this email");
        }
        return user.get();
    }

    @Override
    public Page<ApplicationUserResponseDto> searchByKeywordAndFilters(int page, int size, String keyword, Boolean emailVerified, Boolean status) {
        PageRequest pageRequest = PageRequest.of(page, size);
        Page<ApplicationUser> applicationUsers = applicationUserRepository.searchByKeywordAndFilters(keyword, emailVerified, status, pageRequest);
        return applicationUsers.map(
                this::MapUsers
        );
    }

    @Override
    public void updateUserEmailVerifiedState(String token) {
        ApplicationUser user = emailVerification(token);

        user.setEmailVerified(true);
        try {
            applicationUserRepository.save(user);
        } catch (Exception e) {
            throw new DataIntegrityViolationException("Can not update user.");
        }
    }

    @Override
    public void deleteApplicationUserAccount(String token) {
        ApplicationUser user = emailVerification(token);
        String email = user.getEmail();
        try {
            applicationUserRepository.delete(user);
            String body = EmailTemplate.ACCOUNT_DELETE_CONFIRM.getTemplate();
            mailService.SendMail(email, "TouriPearl Account Deletion.", body);
        } catch (Exception e) {
            throw new DataIntegrityViolationException("Can not delete account.");
        }

    }

    @Override
    public Map<String, Long> getSignupCounts() {
        Map<String, Long> signupCounts = new HashMap<>();
        signupCounts.put("daily", applicationUserRepository.countUsersByDateRange(
                LocalDate.now().atStartOfDay(),
                LocalDateTime.now()
        ));
        signupCounts.put("weekly", applicationUserRepository.countUsersByDateRange(
                LocalDate.now().minusDays(7).atStartOfDay(),
                LocalDateTime.now()
        ));
        signupCounts.put("monthly", applicationUserRepository.countUsersByDateRange(
                LocalDate.now().minusDays(30).atStartOfDay(),
                LocalDateTime.now()
        ));
        return signupCounts;
    }

    @Override
    public Map<String, Long> getVerifiedCounts() {
        return Map.of(
                "VERIFIED", applicationUserRepository.countUsersByEmailVerified(true),
                "NON_VERIFIED", applicationUserRepository.countUsersByEmailVerified(false),
                "ALL", applicationUserRepository.countUsersByEmailVerified(null)
        );
    }

    public ApplicationUserResponseDto MapUsers(ApplicationUser user) {
        return ApplicationUserResponseDto.builder()
                .userId(user.getUserId())
                .userName(user.getUserName())
                .email(user.getEmail())
                .phone(user.getPhone())
                .isAccountNonExpired(user.isAccountNonExpired())
                .isCredentialsNonExpired(user.isCredentialsNonExpired())
                .isAccountNonLocked(user.isAccountNonLocked())
                .zipCode(user.getZipCode())
                .street(user.getStreet())
                .state(user.getState())
                .city(user.getCity())
                .country(user.getCountry())
                .userRoles(user.getUserRoles().stream()
                        .map(UserRole::getRoleName)
                        .collect(Collectors.toSet())
                )
                .isEnabled(user.isEnabled())
                .isEmailVerified(user.isEmailVerified())
                .createdAt(user.getCreatedAt())
                .build();
    }
}
