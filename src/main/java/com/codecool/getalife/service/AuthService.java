package com.codecool.getalife.service;

import com.codecool.getalife.model.User;
import com.codecool.getalife.model.dto.auth.AuthResponse;
import com.codecool.getalife.model.dto.auth.LoginRequest;
import com.codecool.getalife.model.dto.auth.RegisterRequest;
import com.codecool.getalife.repository.UserRepository;
import com.codecool.getalife.security.JwtUtil;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Set;

@Service
@RequiredArgsConstructor
@Transactional
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;
    private final AuthenticationManager authenticationManager;

    public AuthResponse register(RegisterRequest request) {
        if (userRepository.existsByName(request.username())) {
            throw new RuntimeException("Username already exists");
        }
        if (userRepository.existsByEmail(request.email())) {
            throw new RuntimeException("Email already exists");
        }

        User user = User.builder()
                .name(request.username())
                .email(request.email())
                .password_hash(passwordEncoder.encode(request.password()))
                .roles(Set.of("USER"))
                .build();

        userRepository.save(user);
        userRepository.flush();

        return login(new LoginRequest(request.email(), request.password()));
    }

    public AuthResponse login(LoginRequest request) {
        try {
            Authentication authentication = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(
                            request.email(),
                            request.password()
                    )
            );

            User user = userRepository.findByEmail(request.email())
                    .orElseThrow(() -> new RuntimeException("User not found"));

            String accessToken = jwtUtil.generateAccessToken(authentication);
            String refreshToken = jwtUtil.generateRefreshToken(authentication);

            // Handle null or empty roles - default to USER role
            List<String> roles = new ArrayList<>();
            if (user.getRoles() != null && !user.getRoles().isEmpty()) {
                roles = user.getRoles().stream()
                        .map(role -> "ROLE_" + role)
                        .toList();
            } else {
                roles = List.of("ROLE_USER");
            }

            return new AuthResponse(
                    accessToken,
                    refreshToken,
                    user.getEmail(),
                    user.getName(),
                    roles
            );
        } catch (Exception e) {
            throw new RuntimeException("Login failed: " + e.getMessage());
        }
    }

    public AuthResponse refreshToken(String refreshToken) {
        if (refreshToken == null || !jwtUtil.validateToken(refreshToken, true)) {
            throw new RuntimeException("Invalid or expired refresh token");
        }

        String email = jwtUtil.getEmailFromToken(refreshToken, true);
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        UsernamePasswordAuthenticationToken authentication = new UsernamePasswordAuthenticationToken(
                user.getEmail(), null, user.getAuthorities());

        String newAccessToken = jwtUtil.generateAccessToken(authentication);
        String newRefreshToken = jwtUtil.generateRefreshToken(authentication);

        // Handle null or empty roles - default to USER role
        List<String> roles = new ArrayList<>();
        if (user.getRoles() != null && !user.getRoles().isEmpty()) {
            roles = user.getRoles().stream()
                    .map(role -> "ROLE_" + role)
                    .toList();
        } else {
            roles = List.of("ROLE_USER");
        }

        return new AuthResponse(
                newAccessToken,
                newRefreshToken,
                user.getEmail(),
                user.getName(),
                roles
        );
    }
}