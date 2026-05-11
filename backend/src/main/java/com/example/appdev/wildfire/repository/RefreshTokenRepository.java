package com.example.appdev.wildfire.repository;

import com.example.appdev.wildfire.entity.RefreshToken;
import com.example.appdev.wildfire.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface RefreshTokenRepository extends JpaRepository<RefreshToken, Long> {
    Optional<RefreshToken> findByToken(String token);
    void deleteByUserId(Long userId);
    void deleteByUser(User user);
    void deleteByToken(String token);

}
