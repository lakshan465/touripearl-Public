package com.uor.group_14.touripearl_backend.jwt;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.uor.group_14.touripearl_backend.dto.request.ApplicationUserLoginRequestDto;
import com.uor.group_14.touripearl_backend.entity.applicationUser.ApplicationUser;
import com.uor.group_14.touripearl_backend.exception.EntryNotFoundException;
import com.uor.group_14.touripearl_backend.repository.ApplicationUserRepository;
import io.jsonwebtoken.Jwts;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import javax.crypto.SecretKey;
import java.io.IOException;
import java.time.LocalDate;
import java.util.Date;

import java.util.Optional;

public class JwtUsernameAndPasswordAuthenticationFilter extends UsernamePasswordAuthenticationFilter {
    private final AuthenticationManager authenticationManager;
    private final JwtConfig jwtConfig;
    private final SecretKey secretKey;
    private final ApplicationUserRepository applicationUserRepository;

    public JwtUsernameAndPasswordAuthenticationFilter(AuthenticationManager authenticationManager,
                                                      JwtConfig jwtConfig, SecretKey secretKey,
                                                      String processorUrl,
                                                      ApplicationUserRepository applicationUserRepository) {
        this.authenticationManager = authenticationManager;
        this.jwtConfig = jwtConfig;
        this.secretKey = secretKey;
        this.applicationUserRepository=applicationUserRepository;
        setFilterProcessesUrl(processorUrl);//set custom login url
    }

    //filter chain pass request and response to authenticate attempt
    @Override
    public Authentication attemptAuthentication(HttpServletRequest request, HttpServletResponse response)
            throws AuthenticationException {
        try {
            //extract username(email) and password from request
            ApplicationUserLoginRequestDto authenticationRequest
                    =new ObjectMapper().readValue(request.getInputStream()
                    , ApplicationUserLoginRequestDto.class);

            Authentication authentication = new UsernamePasswordAuthenticationToken(
                    authenticationRequest.getUsername(), authenticationRequest.getPassword()
            );
            //return Authentication with authentication manager
            return authenticationManager.authenticate(authentication);

        } catch (IOException e) {
            throw new IllegalStateException(e.getMessage(), e);
        }
    }
    //once the authentication is success this method is triggered
    @Override
    protected void successfulAuthentication(HttpServletRequest request,
                                            HttpServletResponse response,
                                            FilterChain chain,
                                            Authentication authResult) {
        //create jwt token and convert to string
        String token = createToken(authResult);

        response.addHeader("Authorization",jwtConfig.getTokenPrefix()+token);
        //extract user data from user repo
        Optional<ApplicationUser> user = applicationUserRepository.findByEmail(authResult.getName());
        if(user.isEmpty()){
            throw new EntryNotFoundException("user not found for cookies");
        }
        //add cookies to response
        response.addCookie(new CookieProvider()
                .createCookie("token",jwtConfig.getTokenPrefix()+token,true,"/",60*60*24*6));
        response.addCookie(new CookieProvider()
                .createCookie("UUID",user.get().getUserId(),true,"/",60*60*24*6));

        // set response as authenticated
        response.setStatus(HttpServletResponse.SC_OK);
    }


    //create jwt token and convert to string
    public String createToken(Authentication authResult){
        return Jwts.builder()
                .setSubject(authResult.getName())
                .claim("authorities",authResult.getAuthorities())
                .setIssuedAt(new Date())
                .setExpiration(
                        java.sql.Date.valueOf(LocalDate.now()
                                .plusDays(jwtConfig.getTokenExpirationAfterDays())))
                .signWith(secretKey)
                .compact();
    }

    @Override
    protected void unsuccessfulAuthentication(HttpServletRequest request, HttpServletResponse response, AuthenticationException failed) throws IOException, ServletException {
        // Set the response status and headers
        response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
        response.setContentType("application/json");
        response.setCharacterEncoding("UTF-8");

        // Customize the response message
        String errorMessage = "Authentication failed: " + failed.getMessage();
        String jsonResponse = String.format("{\"error\":\"%s\", \"timestamp\":\"%s\"}", errorMessage, new Date());

        // Write the JSON response to the output
        response.getWriter().write(jsonResponse);

    }
}
