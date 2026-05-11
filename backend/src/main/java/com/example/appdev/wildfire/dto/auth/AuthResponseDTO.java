package com.example.appdev.wildfire.dto.auth;

import lombok.Data;

@Data
public class AuthResponseDTO {
    private String token;
    private String refreshToken;
    private Long userId;
    private String email;
    private String name;
    private String role;
}
