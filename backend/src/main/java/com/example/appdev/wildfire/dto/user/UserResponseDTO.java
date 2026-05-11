package com.example.appdev.wildfire.dto.user;
import com.example.appdev.wildfire.entity.enums.Role;

import lombok.Data;

@Data
public class UserResponseDTO {
    private Long id;
    private String name;
    private String email;
    private String phoneNumber;
    private Role role;
}
