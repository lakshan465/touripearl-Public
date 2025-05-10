package com.uor.group_14.touripearl_backend.security;

import com.uor.group_14.touripearl_backend.service.serviceImpl.ApplicationUserServiceImpl;
import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.authentication.logout.LogoutHandler;


@Configuration
@RequiredArgsConstructor
public class AuthenticationConfig {
    private final PasswordEncoder passwordEncoder;
    private final ApplicationUserServiceImpl applicationUserDetailsService;
    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration authenticationConfiguration) throws Exception {
        return authenticationConfiguration.getAuthenticationManager();
    }

    @Bean
    public DaoAuthenticationProvider daoAuthenticationProvider() {
        DaoAuthenticationProvider provider = new DaoAuthenticationProvider();
        provider.setPasswordEncoder(passwordEncoder);
        provider.setUserDetailsService(applicationUserDetailsService);
        return provider;
    }
    @Bean
    public LogoutHandler logoutHandler() {
        return (request, response, authentication) -> {
        };
    }
}
