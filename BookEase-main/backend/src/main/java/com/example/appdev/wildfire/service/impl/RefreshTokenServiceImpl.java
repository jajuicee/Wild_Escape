package com.example.appdev.wildfire.service.impl;

import com.example.appdev.wildfire.entity.RefreshToken;
import com.example.appdev.wildfire.entity.User;
import com.example.appdev.wildfire.repository.RefreshTokenRepository;
import com.example.appdev.wildfire.service.RefreshTokenService;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Transactional
public class RefreshTokenServiceImpl implements RefreshTokenService {

    private final RefreshTokenRepository refreshTokenRepository;

    private final long refreshExpirationMs = 1000L * 60 * 60 * 24 * 7; // 7 days

    @Override
    public RefreshToken createRefreshToken(Long userId) {
        RefreshToken token = new RefreshToken();

        token.setUser(new com.example.appdev.wildfire.entity.User());
        token.getUser().setId(userId);

        token.setToken(UUID.randomUUID().toString());

        token.setExpiryDate(Instant.now().plusMillis(refreshExpirationMs));

        return refreshTokenRepository.save(token);
    }

    @Override
    public RefreshToken verifyExpiration(RefreshToken token) {
        if (token.getExpiryDate().isBefore(Instant.now())) {
            refreshTokenRepository.delete(token);
            throw new RuntimeException("Refresh token expired.");
        }
        return token;
    }

    @Override
    @Transactional
    public RefreshToken rotateRefreshToken(User user) {
        // delete old refresh token
        refreshTokenRepository.deleteByUser(user);

        // create a new one
        RefreshToken newToken = new RefreshToken();
        newToken.setUser(user);
        newToken.setExpiryDate(Instant.now().plusSeconds(60 * 60 * 24 * 7)); // 7 days
        newToken.setToken(UUID.randomUUID().toString());

        return refreshTokenRepository.save(newToken);
    }


    @Override
    @Transactional
    public void deleteByUserId(Long userId) {
        refreshTokenRepository.deleteByUserId(userId);
    }

    @Override
    public RefreshToken getByToken(String token) {
        return refreshTokenRepository.findByToken(token)
                .orElseThrow(() -> new RuntimeException("Invalid refresh token"));
    }

    @Override
    @Transactional
    public void deleteByToken(String token) {
        refreshTokenRepository.findByToken(token)
                .ifPresent(refreshTokenRepository::delete);
    }

}
