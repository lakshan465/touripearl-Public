package com.uor.group_14.touripearl_backend.service.serviceImpl;

import com.uor.group_14.touripearl_backend.entity.applicationUser.ApplicationUser;
import com.uor.group_14.touripearl_backend.entity.applicationUser.UserRole;
import com.uor.group_14.touripearl_backend.repository.ApplicationUserRepository;
import com.uor.group_14.touripearl_backend.repository.UserRoleRepository;
import com.uor.group_14.touripearl_backend.service.InitialDataService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.*;

@Service
@RequiredArgsConstructor
public class InitialDataServiceImpl implements InitialDataService {
    private final UserRoleRepository userRoleRepository;
    private final ApplicationUserRepository applicationUserRepository;
    private final PasswordEncoder passwordEncoder;
    @Override
    public void initializerUsers() {

        // Retrieve roles
        Set<UserRole> roleAdmin = userRoleRepository.findByRoleName("ROLE_ADMIN");
        Set<UserRole> roleGuide = userRoleRepository.findByRoleName("ROLE_GUIDE");
        Set<UserRole> roleTourist = userRoleRepository.findByRoleName("ROLE_TOURIST");

        if(roleAdmin.isEmpty()||roleTourist.isEmpty()||roleGuide.isEmpty()){
            return;
        }



        // Admin user creation
        Optional<ApplicationUser> existUserAdmin = applicationUserRepository.findByEmail("admin@touripearl.com");
        if (existUserAdmin.isEmpty()) {
            applicationUserRepository.save(
                    ApplicationUser.builder()
                            .userId(UUID.randomUUID().toString())
                            .email("admin@touripearl.com")
                            .userName("Admin")
                            .city("Matara")
                            .state("Matara")
                            .zipCode("81000")
                            .street("Wellamadama")
                            .country("SriLanka")
                            .phone("123456789")
                            .isAccountNonExpired(true)
                            .isCredentialsNonExpired(true)
                            .isAccountNonLocked(true)
                            .isEnabled(true)
                            .password(passwordEncoder.encode("12345678"))
                            .userRoles(roleAdmin)
                            .isEmailVerified(true)
                            .createdAt(LocalDateTime.now())
                            .build());
        }

 /*       // Insert 100 guides
        for (int i = 1; i <= 100; i++) {
            String email = String.format("guide%d@touripearl.com", i);
            if (applicationUserRepository.findByEmail(email).isEmpty()) {
                applicationUserRepository.save(
                        ApplicationUser.builder()
                                .userId(UUID.randomUUID().toString())
                                .email(email)
                                .userName("Guide" + i)
                                .address("Guide Address " + i)
                                .phone("123456789" + i)
                                .isAccountNonExpired(true)
                                .isCredentialsNonExpired(true)
                                .isAccountNonLocked(true)
                                .isEnabled(true)
                                .password(passwordEncoder.encode("12345678"))
                                .userRoles(new HashSet<>(roleGuide))
                                .createdAt(LocalDateTime.now())
                                .build());
            }
        }

        // Insert 100 tourists
        for (int i = 1; i <= 100; i++) {
            String email = String.format("tourist%d@touripearl.com", i);
            if (applicationUserRepository.findByEmail(email).isEmpty()) {
                applicationUserRepository.save(
                        ApplicationUser.builder()
                                .userId(UUID.randomUUID().toString())
                                .email(email)
                                .userName("Tourist" + i)
                                .address("Tourist Address " + i)
                                .phone("987654321" + i)
                                .isAccountNonExpired(true)
                                .isCredentialsNonExpired(true)
                                .isAccountNonLocked(true)
                                .isEnabled(true)
                                .password(passwordEncoder.encode("12345678"))
                                .userRoles(new HashSet<>(roleTourist))
                                .createdAt(LocalDateTime.now())
                                .build());
            }
        }*/
    }


    @Override
    public void initializerRoles() {
            List<UserRole> existingUserRoles = userRoleRepository.findAll();
            if(existingUserRoles.isEmpty()){
                userRoleRepository.saveAll(List.of(
                        UserRole.builder().roleId(UUID.randomUUID().toString()).roleName("ROLE_TOURIST").build(),
                        UserRole.builder().roleId(UUID.randomUUID().toString()).roleName("ROLE_GUIDE").build(),
                        UserRole.builder().roleId(UUID.randomUUID().toString()).roleName("ROLE_ADMIN").build()
                ));
            }
    }
}
