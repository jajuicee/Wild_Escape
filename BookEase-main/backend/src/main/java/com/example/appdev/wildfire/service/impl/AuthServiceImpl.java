package com.example.appdev.wildfire.service.impl;

import com.example.appdev.wildfire.dto.auth.AuthRequestDTO;
import com.example.appdev.wildfire.dto.auth.RegisterRequestDTO;
import com.example.appdev.wildfire.entity.User;
import com.example.appdev.wildfire.entity.enums.Role;
import com.example.appdev.wildfire.exception.InvalidCredentialsException;
import com.example.appdev.wildfire.repository.UserRepository;
import com.example.appdev.wildfire.service.AuthService;
import com.example.appdev.wildfire.service.RefreshTokenService;
import com.example.appdev.wildfire.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AuthServiceImpl implements AuthService {

    private final UserService userService;
    private final PasswordEncoder passwordEncoder;
    private final RefreshTokenService refreshTokenService;
    private final UserRepository  userRepository;

    @Override
    public User register(RegisterRequestDTO dto) {
        User user = new User();
        user.setName(dto.getName());
        user.setEmail(dto.getEmail());
        user.setPhoneNumber(dto.getPhoneNumber());
        user.setPassword(passwordEncoder.encode(dto.getPassword()));
        user.setRole(Role.ROLE_USER);
        return userService.createUser(user);
    }

    @Override
    public User login(AuthRequestDTO dto) {
        System.out.println("🔵 AuthService: login() called");

        User user = userService.getUserByEmail(dto.getEmail());
        System.out.println("🟢 AuthService: user found → " + user.getEmail());

        boolean match = passwordEncoder.matches(dto.getPassword(), user.getPassword());
        System.out.println("🟡 AuthService: password match = " + match);

        if (!match) {
            throw new InvalidCredentialsException("Invalid credentials");
        }

        System.out.println("🟣 AuthService: deleting old refresh tokens");
        refreshTokenService.deleteByUserId(user.getId());

        System.out.println("🟤 AuthService: login success → returning user");
        return user;
    }

    public User registerOwner(RegisterRequestDTO dto) {

        User user = new User();
        user.setName(dto.getName());
        user.setEmail(dto.getEmail());
        user.setPhoneNumber(dto.getPhoneNumber());
        user.setPassword(passwordEncoder.encode(dto.getPassword()));
        user.setRole(Role.ROLE_ADMIN); // OWNER / ADMIN ROLE

        return userRepository.save(user);
    }


}
