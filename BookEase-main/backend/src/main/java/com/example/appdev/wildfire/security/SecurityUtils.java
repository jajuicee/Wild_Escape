package com.example.appdev.wildfire.security;

import com.example.appdev.wildfire.entity.User;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;

public class SecurityUtils {

    public static Long getCurrentUserId() {

        Authentication auth = SecurityContextHolder.getContext().getAuthentication();

        if (auth == null || !auth.isAuthenticated()) {
            throw new RuntimeException("Unauthenticated");
        }

        Object principal = auth.getPrincipal();

        // 🔥 THIS is the fix
        if (principal instanceof User user) {
            return user.getId();
        }

        throw new RuntimeException("Unauthenticated");
    }
}
