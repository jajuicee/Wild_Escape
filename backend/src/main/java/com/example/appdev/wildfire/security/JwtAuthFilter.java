package com.example.appdev.wildfire.security;

import com.example.appdev.wildfire.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import jakarta.servlet.FilterChain;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

@Component
@RequiredArgsConstructor
public class JwtAuthFilter extends OncePerRequestFilter {

    private final JwtUtil jwtUtil;
    private final UserService userService;

    @Override
    protected boolean shouldNotFilter(HttpServletRequest request) {
        String uri = request.getRequestURI();

        System.out.println("\n===========================");
        System.out.println(" SHOULD_NOT_FILTER CHECK ");
        System.out.println(" URI → " + uri);
        System.out.println("===========================\n");

        return uri.startsWith("/api/auth/");
    }

    @Override
    protected void doFilterInternal(
            HttpServletRequest request,
            HttpServletResponse response,
            FilterChain filterChain) throws java.io.IOException, jakarta.servlet.ServletException {

        String authHeader = request.getHeader("Authorization");

        System.out.println("Authorization header: " + request.getHeader("Authorization"));
        System.out.println("JWT filter triggered for: " + request.getRequestURI());

        // Allow requests without token
        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            filterChain.doFilter(request, response);
            return;
        }

        String token = authHeader.substring(7);

        try {
            String email = jwtUtil.extractEmail(token);

            if (email != null && SecurityContextHolder.getContext().getAuthentication() == null) {
                var user = userService.getUserByEmail(email);

                if (jwtUtil.isTokenValid(token)) {

                    UsernamePasswordAuthenticationToken auth = new UsernamePasswordAuthenticationToken(
                            user,
                            null,
                            user.getAuthorities() // ✅ FIXED
                    );

                    auth.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));

                    System.out.println("AUTH USER → " + user.getEmail());
                    System.out.println("AUTHORITIES → " + user.getAuthorities());

                    SecurityContextHolder.getContext().setAuthentication(auth);
                }
            }

        } catch (Exception e) {
            // 🔥 IMPORTANT: do NOT block the request.
            // Just continue without authentication.
            System.out.println("JWT ERROR → " + e.getMessage());
        }

        filterChain.doFilter(request, response);
    }

}
