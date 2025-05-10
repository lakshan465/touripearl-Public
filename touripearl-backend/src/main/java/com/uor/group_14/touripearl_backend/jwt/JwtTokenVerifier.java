package com.uor.group_14.touripearl_backend.jwt;

import com.uor.group_14.touripearl_backend.repository.ApplicationUserRepository;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jws;
import io.jsonwebtoken.JwtException;
import io.jsonwebtoken.Jwts;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.http.HttpHeaders;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.filter.OncePerRequestFilter;

import javax.crypto.SecretKey;
import java.io.IOException;
import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.stream.Collectors;

public class JwtTokenVerifier extends OncePerRequestFilter {
    private final JwtConfig jwtConfig;
    private final SecretKey secretKey;
    private final ApplicationUserRepository userRepository;

    public JwtTokenVerifier(JwtConfig jwtConfig, SecretKey secretKey,ApplicationUserRepository userRepository) {
        this.jwtConfig = jwtConfig;
        this.secretKey = secretKey;
        this.userRepository = userRepository;
    }

    @Override
    protected void doFilterInternal(HttpServletRequest request,
                                    HttpServletResponse response,
                                    FilterChain filterChain)
            throws ServletException, IOException
    {
            String authorizationHeader=null;
            Cookie[] cookies = request.getCookies();
            if(cookies !=null) {
                authorizationHeader=  Arrays.stream(cookies)
                    .filter(cookie -> "token".equals(cookie.getName()))
                    .map(Cookie::getValue)
                    .findFirst()
                    .orElse(null);
            }else{
                authorizationHeader = request.getHeader(HttpHeaders.AUTHORIZATION);
            }
            //logger.info(authorizationHeader);

        //get jwtToken from request header

        //check whether jwt is null or jwt is not starts with prefix
        if (authorizationHeader == null || authorizationHeader.isEmpty() || !authorizationHeader.
                startsWith(jwtConfig.getTokenPrefix())) {
            filterChain.doFilter(request, response);
            return;
        }
        //remove prefix
        String token = authorizationHeader.replace(jwtConfig.getTokenPrefix(), "");

        try {
            //verify jwt with signature key
            Jws<Claims> claimsJws = Jwts.parserBuilder()
                    .setSigningKey(secretKey).build()
                    .parseClaimsJws(token);

            //extract username from jwt
            Claims body = claimsJws.getBody();
            String username = body.getSubject();

            //extract authorities from token
            var authorities = (List<Map<String, String>>) body.get("authorities");
            Set<SimpleGrantedAuthority> simpleGrantedAuthorities = authorities.stream()
                    .map(m -> new SimpleGrantedAuthority(m.get("authority")))
                    .collect(Collectors.toSet());
            //authenticate user with username and authorities
            Authentication authentication = new UsernamePasswordAuthenticationToken(
                    username,
                    null,
                    simpleGrantedAuthorities
            );
            SecurityContextHolder.getContext().setAuthentication(authentication);
            updateLastActive(username);
        } catch (JwtException e) {
            throw new IllegalStateException(String.format("Token %s Cannot be Trusted!", token));
        }

        filterChain.doFilter(request, response);

    }
    protected void updateLastActive(String email){
        userRepository.updateLastActive(email, LocalDateTime.now());
    }
}
