package com.example.appdev.wildfire.controller;

import com.example.appdev.wildfire.dto.user.UserRequestDTO;
import com.example.appdev.wildfire.dto.user.UserResponseDTO;
import com.example.appdev.wildfire.entity.User;
import com.example.appdev.wildfire.service.BookingService;
import com.example.appdev.wildfire.service.ReviewService;
import com.example.appdev.wildfire.service.UserService;
import org.springframework.security.core.annotation.AuthenticationPrincipal;        
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;
    private final BookingService bookingService;
    private final ReviewService reviewService;
    private final ModelMapper mapper;

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public UserResponseDTO createUser(@RequestBody UserRequestDTO dto) {
        User user = mapper.map(dto, User.class);
        return mapper.map(userService.createUser(user), UserResponseDTO.class);
    }

    @GetMapping("/{id}")
    public UserResponseDTO getUserById(@PathVariable Long id) {
        return mapper.map(userService.getUserById(id), UserResponseDTO.class);
    }

    @GetMapping("/email/{email}")
    public UserResponseDTO getUserByEmail(@PathVariable String email) {
        return mapper.map(userService.getUserByEmail(email), UserResponseDTO.class);
    }

    @GetMapping
    public List<UserResponseDTO> getAllUsers() {
        return userService.getAllUsers()
                .stream()
                .map(u -> mapper.map(u, UserResponseDTO.class))
                .collect(Collectors.toList());
    }

    @PutMapping("/{id}")
    public UserResponseDTO updateUser(@PathVariable Long id, @RequestBody UserRequestDTO dto) {
        User updated = mapper.map(dto, User.class);
        return mapper.map(userService.updateUser(id, updated), UserResponseDTO.class);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deleteUser(@PathVariable Long id) {
        userService.deleteUser(id);
    }

    @GetMapping("/{id}/confirmed-bookings/count")
    public Map<String, Long> getConfirmedBookingCount(@PathVariable Long id) {
        long count = bookingService.countConfirmedBookingsByUser(id);
        return Map.of("count", count);
    }

    @GetMapping("/{id}/reviews/count")
    public Map<String, Long> getReviewCount(@PathVariable Long id) {
        return Map.of(
                "count",
                reviewService.countReviewsByUser(id));
    }

    @GetMapping("/me")
    public UserResponseDTO getCurrentUser(@AuthenticationPrincipal User user) {
        return mapper.map(user, UserResponseDTO.class);
    }

}
