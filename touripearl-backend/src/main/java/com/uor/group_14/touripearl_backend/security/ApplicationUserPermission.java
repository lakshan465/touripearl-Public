package com.uor.group_14.touripearl_backend.security;

import lombok.Getter;

@Getter
public enum ApplicationUserPermission {
    //set permissions here
    ;

    private final String permission;

    ApplicationUserPermission(String permission) {
        this.permission = permission;
    }

}