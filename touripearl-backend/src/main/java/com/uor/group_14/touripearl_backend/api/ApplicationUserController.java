package com.uor.group_14.touripearl_backend.api;


import com.uor.group_14.touripearl_backend.dto.request.ApplicationUserUpdateRequestDto;
import com.uor.group_14.touripearl_backend.dto.request.PasswordChangeRequestDto;
import com.uor.group_14.touripearl_backend.dto.request.TouristRequestDto;
import com.uor.group_14.touripearl_backend.dto.request.applicationUser.PasswordResetRequestDto;
import com.uor.group_14.touripearl_backend.dto.request.applicationUser.ResetTokenRequestDto;
import com.uor.group_14.touripearl_backend.dto.response.ApplicationUserResponseDto;
import com.uor.group_14.touripearl_backend.entity.enumEntity.EmailTemplate;
import com.uor.group_14.touripearl_backend.service.ApplicationUserService;
import com.uor.group_14.touripearl_backend.service.MailService;
import com.uor.group_14.touripearl_backend.service.TouristApplicationService;
import com.uor.group_14.touripearl_backend.util.StandardResponseDto;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("api/v1/users")
@RequiredArgsConstructor
public class ApplicationUserController {
    private final ApplicationUserService applicationUserService;
    private final MailService mailService;

    @GetMapping("/{id}")
    public ResponseEntity<StandardResponseDto> getUserById(@PathVariable String id) {
        return new ResponseEntity<>(
                new StandardResponseDto(
                        201, "user details", applicationUserService.getSingleApplicationUser(id)
                ), HttpStatus.OK
        );
    }

    @PutMapping("/{id}")
    public ResponseEntity<StandardResponseDto> updateById(@PathVariable String id,
                                                          @RequestBody ApplicationUserUpdateRequestDto dto) {
        applicationUserService.updateUser(id, dto);
        return new ResponseEntity<>(
                new StandardResponseDto(
                        201, "user updated", null
                ), HttpStatus.OK
        );
    }

    @PutMapping("/password/{id}")
    public ResponseEntity<StandardResponseDto> changePassword(
            @RequestBody PasswordChangeRequestDto dto,
            @PathVariable String id
    ) {
        applicationUserService.changePassword(id, dto);
        return new ResponseEntity<>(
                new StandardResponseDto(201, "Password changed successfully", null),
                HttpStatus.OK
        );
    }

    @PostMapping("/password-reset-request")
    public ResponseEntity<StandardResponseDto> requestPasswordReset(@RequestBody ResetTokenRequestDto dto) {
        String token = applicationUserService.createEmailVerificationToken(dto.getEmail());
        mailService.sendPasswordResetEmail(dto.getEmail(), token);
        return new ResponseEntity<>(
                new StandardResponseDto(201, "Password reset token created", null),
                HttpStatus.OK
        );
    }

    @GetMapping("/verify-token/{token}")
    public ResponseEntity<StandardResponseDto> verifyPasswordResetToken(@PathVariable String token) {
        String propertyId = applicationUserService.validateToken(token);
        return new ResponseEntity<>(
                new StandardResponseDto(
                        201, "token verified", propertyId
                ), HttpStatus.OK
        );
    }

    @PostMapping("/reset-password")
    public ResponseEntity<StandardResponseDto> resetPassword(@RequestBody PasswordResetRequestDto resetRequestDto) {
        applicationUserService.resetPassword(resetRequestDto);
        return new ResponseEntity<>(
                new StandardResponseDto(201, "Password reset successfully", null),
                HttpStatus.OK
        );
    }

    @PostMapping("/email-verify-request")
    public ResponseEntity<StandardResponseDto> requestEmailVerifyToken(@RequestBody ResetTokenRequestDto dto) {
        String token = applicationUserService.createEmailVerificationToken(dto.getEmail());
        String body = EmailTemplate.EMAIL_VERIFY_EMAIL.getTemplate(token);
        mailService.sendEmailVerifyToken(dto.getEmail(), token, body);
        return new ResponseEntity<>(
                new StandardResponseDto(201, "Password reset token created", null),
                HttpStatus.OK
        );
    }

    @GetMapping("/verify-email/{token}")
    public ResponseEntity<StandardResponseDto> updateUserEmailVerifiedState(@PathVariable String token) {
        applicationUserService.updateUserEmailVerifiedState(token);
        return new ResponseEntity<>(
                new StandardResponseDto(
                        201, "token verified", null
                ), HttpStatus.OK
        );
    }

    @GetMapping("/search-by-keyword")
    public ResponseEntity<StandardResponseDto> searchByKeyword(@RequestParam(defaultValue = "0") int page,
                                                               @RequestParam(defaultValue = "10") int size,
                                                               @RequestParam(defaultValue = "") String keyword,
                                                               @RequestParam(required = false) Boolean emailVerified,
                                                               @RequestParam(required = false) Boolean status
    ) {
        Page<ApplicationUserResponseDto> users = applicationUserService.searchByKeywordAndFilters(page, size, keyword, emailVerified, status);
        return new ResponseEntity<>(
                new StandardResponseDto(
                        200, "Keyword users", users
                ), HttpStatus.OK
        );
    }

    @PostMapping("/account-delete/{email}")
    public ResponseEntity<StandardResponseDto> requestAccountDeletionToken(@PathVariable String email) {
        String token = applicationUserService.createEmailVerificationToken(email);
        String body = EmailTemplate.ACCOUNT_DELETE_VERIFY.getTemplate(token);
        mailService.sendEmailVerifyToken(email, token, body);
        return new ResponseEntity<>(
                new StandardResponseDto(201, "Account delete token created", null),
                HttpStatus.OK
        );
    }

    @DeleteMapping("/account-delete/{token}")
    public ResponseEntity<StandardResponseDto> deleteUserAccount(@PathVariable String token){
        applicationUserService.deleteApplicationUserAccount(token);
        return new ResponseEntity<>(
                new StandardResponseDto(200, "User Account Deleted.", null),
                HttpStatus.NO_CONTENT
        );
    }
}
