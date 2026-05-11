package com.example.appdev.wildfire.controller;


import com.example.appdev.wildfire.dto.auth.RegisterRequestDTO;
import com.example.appdev.wildfire.entity.User;
import com.example.appdev.wildfire.service.AuthService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/admin")
@RequiredArgsConstructor
public class AdminController {
    private final AuthService authService;

    // ADMIN CREATES HOTEL OWNER (ROLE_ADMIN)
    @PostMapping("/create-owner")
    @PreAuthorize("hasRole('ADMIN')")
    public User createHotelOwner(@RequestBody RegisterRequestDTO dto) {
        return authService.registerOwner(dto);
    }
}
