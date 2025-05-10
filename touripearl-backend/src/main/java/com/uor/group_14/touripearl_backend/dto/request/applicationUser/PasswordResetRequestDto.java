package com.uor.group_14.touripearl_backend.dto.request.applicationUser;

import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Builder
public class PasswordResetRequestDto {
    private String token;
    private String password;
}
