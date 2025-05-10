package com.uor.group_14.touripearl_backend.security;

import com.uor.group_14.touripearl_backend.jwt.CookieProvider;
import com.uor.group_14.touripearl_backend.jwt.JwtConfig;
import com.uor.group_14.touripearl_backend.jwt.JwtTokenVerifier;
import com.uor.group_14.touripearl_backend.jwt.JwtUsernameAndPasswordAuthenticationFilter;
import com.uor.group_14.touripearl_backend.repository.ApplicationUserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.web.config.EnableSpringDataWebSupport;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configuration.WebSecurityConfiguration;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.security.web.authentication.logout.LogoutHandler;
import org.springframework.web.cors.CorsConfiguration;

import javax.crypto.SecretKey;
import java.util.List;

import static org.springframework.data.web.config.EnableSpringDataWebSupport.PageSerializationMode.VIA_DTO;

@Configuration
@EnableWebSecurity
@EnableMethodSecurity
@EnableSpringDataWebSupport(pageSerializationMode = VIA_DTO)
@RequiredArgsConstructor
public class ApplicationSecurityConfig extends WebSecurityConfiguration {
    private final ApplicationUserRepository applicationUserRepository;
    private final SecretKey secretKey;
    private final JwtConfig jwtConfig;
    private final LogoutHandler logoutHandler;

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http , AuthenticationManager authenticationManager) throws Exception{CorsConfiguration corsConfiguration = new CorsConfiguration();
        corsConfiguration.setAllowedHeaders(List.of("Authorization",
                "Cache-Control",
                "Content-Type",
                "X-XSRF_TOKEN"));
        corsConfiguration.setAllowedOrigins(List.of("http://localhost:5173"));
        corsConfiguration.setAllowedMethods(List.of("GET","POST","PUT","DELETE","OPTIONS","PATCH"));
        corsConfiguration.setAllowCredentials(true);
        corsConfiguration.setExposedHeaders(List.of("Authorization","X_XSRF_TOKEN"));
        corsConfiguration.setMaxAge(3600L);

        //.csrfTokenRepository(CookieCsrfTokenRepository.withHttpOnlyFalse())
        //.ignoringRequestMatchers("/auth/login", "/auth/register")
        http
                .csrf(AbstractHttpConfigurer::disable)
                .cors(cors -> cors.configurationSource(request -> corsConfiguration))
                .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                .addFilter(new JwtUsernameAndPasswordAuthenticationFilter(authenticationManager, jwtConfig, secretKey,"/auth/login",applicationUserRepository))
                .addFilterAfter(new JwtTokenVerifier(jwtConfig, secretKey,applicationUserRepository), UsernamePasswordAuthenticationFilter.class)
                .authorizeHttpRequests(
                        authorize->authorize
                                .requestMatchers("/ws/**").permitAll() // Allow WebSocket requests without JWT Token
                               // .requestMatchers("api/v1/visitors/**").permitAll()
                                .requestMatchers("/auth/auth-me/**")//add ws to get real time notification
                                .authenticated()
                                .anyRequest().permitAll()
                ).logout(logout->
                        logout
                                .logoutUrl("/auth/logout")
                                .addLogoutHandler(logoutHandler)
                                .logoutSuccessHandler((request, response, authentication)-> {
                                    SecurityContextHolder.clearContext();response.addCookie(new CookieProvider()
                                        .createCookie("token",null,true,"/",0));
                                    response.addCookie(new CookieProvider()
                                            .createCookie("UUID",null,true,"/",0));
                                })
                );
        return http.build();
    }

}
