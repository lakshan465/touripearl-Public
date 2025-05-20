package com.uor.group_14.touripearl_backend.entity.applicationUser;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.ManyToMany;
import lombok.*;
import java.util.Set;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Entity(name = "user_role")
public class UserRole {
    @Id
    @Column(name = "role_id")
    private String roleId;

    @Column(name = "role_name", unique = true)
    private String roleName;

    @ManyToMany(mappedBy = "userRoles")
    private Set<ApplicationUser> applicationUsers;
}
