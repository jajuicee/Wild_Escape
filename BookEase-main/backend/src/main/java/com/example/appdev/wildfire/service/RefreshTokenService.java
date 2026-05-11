package com.example.appdev.wildfire.service;

import com.example.appdev.wildfire.entity.RefreshToken;
import com.example.appdev.wildfire.entity.User;

public interface RefreshTokenService {

    RefreshToken createRefreshToken(Long userId);

    RefreshToken verifyExpiration(RefreshToken token);

    RefreshToken rotateRefreshToken(User user);

    void deleteByUserId(Long userId);

    void deleteByToken(String token);

    RefreshToken getByToken(String token);
}
