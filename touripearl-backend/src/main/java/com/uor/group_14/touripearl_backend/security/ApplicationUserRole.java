package com.uor.group_14.touripearl_backend.security;

import lombok.Getter;
import org.springframework.security.core.authority.SimpleGrantedAuthority;

import java.util.HashSet;
import java.util.Set;
import java.util.stream.Collectors;

@Getter
public enum ApplicationUserRole {
    TOURIST(new HashSet<>()),
    ADMIN(new HashSet<>()),
    GUIDE(new HashSet<>());

    private final Set<ApplicationUserPermission> applicationUserPermissions;

    ApplicationUserRole(Set<ApplicationUserPermission> applicationUserPermissions) {
        this.applicationUserPermissions = applicationUserPermissions;
    }

    public Set<SimpleGrantedAuthority> grantedAuthorities() {
        Set<SimpleGrantedAuthority> permissions = getApplicationUserPermissions().stream().map(permission ->
                new SimpleGrantedAuthority(permission.getPermission())).collect(Collectors.toSet());
        permissions.add(new SimpleGrantedAuthority("ROLE_" + this.name()));
        return permissions;

    }
}
