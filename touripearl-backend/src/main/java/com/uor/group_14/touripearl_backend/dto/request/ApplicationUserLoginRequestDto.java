package com.uor.group_14.touripearl_backend.dto.request;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ApplicationUserLoginRequestDto {
    private String username;
    private String password;

    public ApplicationUserLoginRequestDto() {

    }
}
