package com.uor.group_14.touripearl_backend.dto.request;

import lombok.*;

@Builder
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
public class PasswordChangeRequestDto {
    private String oldPassword;
    private String newPassword;
    private String confirmPassword;
}
