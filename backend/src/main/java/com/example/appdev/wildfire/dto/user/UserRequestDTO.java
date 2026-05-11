package com.example.appdev.wildfire.dto.user;

import lombok.Data;

@Data
public class UserRequestDTO {
    private String name;
    private String email;
    private String phoneNumber;
    private String password;
}
