package com.example.appdev.wildfire.util;

import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.stereotype.Component;

@Component
public class CookieUtil {

    // hardcoded logic: not production unless served on HTTPS domain
    private boolean isLocalhost(HttpServletRequest req) {
        String host = req.getServerName(); // e.g., localhost
        return host.equals("localhost") || host.equals("127.0.0.1");
    }

    public void addRefreshTokenCookie(String token, HttpServletResponse response) {
        Cookie cookie = new Cookie("refreshToken", token);

        cookie.setHttpOnly(true);
        cookie.setPath("/");
        cookie.setMaxAge(7 * 24 * 60 * 60); // 7 days

        // IMPORTANT:
        // Localhost = Secure MUST be false or cookie will be blocked
        cookie.setSecure(false);

        // Add using container-managed method
        response.addCookie(cookie);

        System.out.println("CookieUtil: Added refresh token cookie → " + token);
    }

    public void clearRefreshTokenCookie(HttpServletResponse response) {
        Cookie cookie = new Cookie("refreshToken", "");
        cookie.setHttpOnly(true);
        cookie.setPath("/");
        cookie.setSecure(false);
        cookie.setMaxAge(0);
        response.addCookie(cookie);

        System.out.println("CookieUtil: Cleared refresh token cookie");
    }

    public String getRefreshToken(HttpServletRequest request) {
        if (request.getCookies() == null) return null;

        for (Cookie c : request.getCookies()) {
            if ("refreshToken".equals(c.getName())) {
                return c.getValue();
            }
        }
        return null;
    }
}
