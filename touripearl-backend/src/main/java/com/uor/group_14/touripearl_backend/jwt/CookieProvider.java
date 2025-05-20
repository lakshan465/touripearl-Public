package com.uor.group_14.touripearl_backend.jwt;

import com.uor.group_14.touripearl_backend.exception.EntryNotFoundException;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.stereotype.Service;

import java.util.Arrays;

@Service
public class CookieProvider {

    public Cookie createCookie(String name,
                               String value,
                               boolean secure,
                               String path,
                               int maxAge) {
        Cookie cookie = new Cookie(name, value);
        cookie.setSecure(secure);
        cookie.setPath(path);
        cookie.setMaxAge(maxAge);
        return cookie;
    }
    public String extractCookie(HttpServletRequest request,String name) {
        Cookie[] cookies = request.getCookies();
        if (cookies == null) {
            throw new EntryNotFoundException("cookie not found");
        }
        return Arrays.stream(cookies)
                .filter(cookie -> name.equals(cookie.getName()))
                .map(Cookie::getValue)
                .findFirst()
                .orElse(null);
    }
}