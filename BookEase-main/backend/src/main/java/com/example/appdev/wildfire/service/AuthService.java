package com.example.appdev.wildfire.service;

import com.example.appdev.wildfire.dto.auth.AuthRequestDTO;
import com.example.appdev.wildfire.dto.auth.RegisterRequestDTO;
import com.example.appdev.wildfire.entity.User;

public interface AuthService {
    User register(RegisterRequestDTO dto);
    User login(AuthRequestDTO dto);
    public User registerOwner(RegisterRequestDTO dto);
}
