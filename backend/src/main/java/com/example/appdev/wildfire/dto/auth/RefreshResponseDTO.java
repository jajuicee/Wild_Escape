package com.example.appdev.wildfire.dto.auth;

import lombok.Data;

@Data
public class RefreshResponseDTO {
    private String accessToken;
    private String refreshToken;
}
