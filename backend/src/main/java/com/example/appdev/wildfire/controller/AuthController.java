package com.example.appdev.wildfire.controller;

import com.example.appdev.wildfire.dto.auth.*;
import com.example.appdev.wildfire.entity.RefreshToken;
import com.example.appdev.wildfire.entity.User;
import com.example.appdev.wildfire.security.JwtUtil;
import com.example.appdev.wildfire.service.AuthService;
import com.example.appdev.wildfire.service.RefreshTokenService;
import com.example.appdev.wildfire.util.CookieUtil;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;
    private final JwtUtil jwtUtil;
    private final ModelMapper mapper;
    private final RefreshTokenService refreshTokenService;
    private final CookieUtil cookieUtil;

    @PostMapping("/register")
    public AuthResponseDTO register(@RequestBody RegisterRequestDTO dto, HttpServletResponse res) {

        // Create the user
        User user = authService.register(dto);

        // Generate access token
        String accessToken = jwtUtil.generateToken(user.getEmail());

        // Generate refresh token
        RefreshToken refreshToken = refreshTokenService.createRefreshToken(user.getId());

        // Add the refresh token as HttpOnly cookie
        cookieUtil.addRefreshTokenCookie(refreshToken.getToken(), res);

        // Build response
        AuthResponseDTO response = new AuthResponseDTO();
        response.setToken(accessToken);
        response.setUserId(user.getId());
        response.setEmail(user.getEmail());
        response.setName(user.getName());

        return response;
    }


    @PostMapping("/login")
    public AuthResponseDTO login(@RequestBody AuthRequestDTO dto, HttpServletResponse res) {
        System.out.println("🔵 LOGIN: request received");
        User user = authService.login(dto);

        System.out.println("🟢 LOGIN: user authenticated → " + user.getEmail());

        String access = jwtUtil.generateToken(user.getEmail());

        System.out.println("🟡 LOGIN: generating refresh token...");
        var refresh = refreshTokenService.createRefreshToken(user.getId());

        System.out.println("🟣 LOGIN: setting cookie → " + refresh.getToken());
        cookieUtil.addRefreshTokenCookie(refresh.getToken(), res);

        AuthResponseDTO response = new AuthResponseDTO();
        response.setToken(access);
        response.setUserId(user.getId());
        response.setEmail(user.getEmail());
        response.setName(user.getName());
        response.setRole(user.getRole().toString());    

        System.out.println("🟤 LOGIN: returning response");

        return response;
    }


    @PostMapping("/refresh")
    public RefreshResponseDTO refresh(HttpServletRequest req, HttpServletResponse res) {

        String refreshToken = cookieUtil.getRefreshToken(req);

        var token = refreshTokenService.getByToken(refreshToken);
        refreshTokenService.verifyExpiration(token);

        var newRefresh = refreshTokenService.rotateRefreshToken(token.getUser());
        String newAccess = jwtUtil.generateToken(token.getUser().getEmail());

        cookieUtil.addRefreshTokenCookie(newRefresh.getToken(), res);

        RefreshResponseDTO response = new RefreshResponseDTO();
        response.setAccessToken(newAccess);
        response.setRefreshToken(newRefresh.getToken()); // optional (frontend usually doesn't need it)

        return response;
    }

    @PostMapping("/logout")
    public MessageResponseDTO logout(HttpServletRequest req, HttpServletResponse res) {

        // 1. Get the refresh token from the cookie
        String refreshToken = cookieUtil.getRefreshToken(req);

        if (refreshToken != null) {
            // 2. Remove refresh token from DB
            refreshTokenService.deleteByToken(refreshToken);
        }

        // 3. Clear (invalidate) the refresh token cookie
        cookieUtil.clearRefreshTokenCookie(res);

        // 4. Return response message
        return new MessageResponseDTO("Logout successful.");
    }




}
