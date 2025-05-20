package com.uor.group_14.touripearl_backend.api;

import com.uor.group_14.touripearl_backend.dto.response.ApplicationUserResponseDto;
import com.uor.group_14.touripearl_backend.jwt.CookieProvider;
import com.uor.group_14.touripearl_backend.service.ApplicationUserService;
import com.uor.group_14.touripearl_backend.util.StandardResponseDto;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Arrays;

@RestController
@RequestMapping("/auth/auth-me")
@RequiredArgsConstructor
public class RouteController {
    private final ApplicationUserService applicationUserService;
    @GetMapping("admin")
    @PreAuthorize("hasRole('ROLE_ADMIN')")
    public ResponseEntity<StandardResponseDto> authAdmin() {
        return new ResponseEntity<>(
                new StandardResponseDto(200,"authorized",null)
                , HttpStatus.OK
        );
    }
    @GetMapping("guide")
    @PreAuthorize("hasRole('ROLE_GUIDE')")
    public ResponseEntity<StandardResponseDto> authGuide() {
        return new ResponseEntity<>(
                new StandardResponseDto(200,"authorized",null),
                HttpStatus.OK
        );
    }
    @GetMapping("tourist")
    @PreAuthorize("hasRole('ROLE_TOURIST')")
    public ResponseEntity<StandardResponseDto> authTourist() {
        return new ResponseEntity<>(
                new StandardResponseDto(200,"authorized",null),
                HttpStatus.OK
        );
    }
    @GetMapping("/userdata")
    @PreAuthorize("hasAnyRole('ROLE_ADMIN','ROLE_GUIDE','ROLE_TOURIST')")
    public ResponseEntity<StandardResponseDto> userdata(HttpServletRequest request) {
        Cookie[] cookies = request.getCookies();
        if (cookies == null) {
             return new ResponseEntity<>(
                     new StandardResponseDto(403,"log again",null),HttpStatus.FORBIDDEN
             );
        }
        String UserId = Arrays.stream(cookies)
                .filter(cookie -> "UUID".equals(cookie.getName()))
                .map(Cookie::getValue)
                .findFirst()
                .orElse(null);

        if (UserId == null) {
            return new ResponseEntity<>(
                    new StandardResponseDto(403,"log again",null),HttpStatus.FORBIDDEN
            );
        }
        ApplicationUserResponseDto dto = applicationUserService.getSingleApplicationUser(UserId);
        return new ResponseEntity<>(
                new StandardResponseDto(
                        201,"User Details",dto
                ),HttpStatus.OK
        );
    }

}
