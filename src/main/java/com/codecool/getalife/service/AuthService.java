package com.codecool.getalife.service;

import com.codecool.getalife.model.User;
import com.codecool.getalife.model.dto.auth.AuthResponse;
import com.codecool.getalife.model.dto.auth.LoginRequest;
import com.codecool.getalife.model.dto.auth.RegisterRequest;
import com.codecool.getalife.repository.UserRepository;
import com.codecool.getalife.security.JwtUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Set;

@Service
@RequiredArgsConstructor
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
                .enabled(true)
                .build();

        userRepository.save(user);

        return login(new LoginRequest(request.email(), request.password()));
    }

    public AuthResponse login(LoginRequest request) {
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

        return new AuthResponse(
                accessToken,
                refreshToken,
                user.getEmail(),
                user.getName(),
                user.getRoles().stream()
                        .map(role -> "ROLE_" + role)
                        .toList()
        );
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

        return new AuthResponse(
                newAccessToken,
                newRefreshToken,
                user.getEmail(),
                user.getName(),
                user.getRoles().stream().map(role -> "ROLE_" + role).toList()
        );
    }
}