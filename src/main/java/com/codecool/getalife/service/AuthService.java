package com.codecool.getalife.service;

import com.codecool.getalife.exception.auth.InvalidCredentialsException;
import com.codecool.getalife.exception.auth.InvalidTokenException;
import com.codecool.getalife.exception.user.UserDuplicateException;
import com.codecool.getalife.exception.user.UserNotFoundException;
import com.codecool.getalife.model.User;
import com.codecool.getalife.model.dto.auth.AuthResponse;
import com.codecool.getalife.model.dto.auth.LoginRequest;
import com.codecool.getalife.model.dto.auth.MeResponse;
import com.codecool.getalife.model.dto.auth.RegisterRequest;
import com.codecool.getalife.repository.UserRepository;
import com.codecool.getalife.security.JwtUtil;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.HashSet;
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
            throw new UserDuplicateException("Username already exists");
        }
        if (userRepository.existsByEmail(request.email())) {
            throw new UserDuplicateException("Email already exists");
        }

        User user = userRepository.save(User.builder()
                .name(request.username())
                .email(request.email())
                .password_hash(passwordEncoder.encode(request.password()))
                .roles(Set.of("USER"))
                .hobbies(new HashSet<>())
                .build());

        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.email(), request.password())
        );

        return toAuthResponse(user, authentication);
    }

    public AuthResponse login(LoginRequest request) {
        try {
            Authentication authentication = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(request.email(), request.password())
            );

            User user = userRepository.findByEmail(request.email())
                    .orElseThrow(UserNotFoundException::new);

            return toAuthResponse(user, authentication);
        } catch (BadCredentialsException e) {
            throw new InvalidCredentialsException();
        }
    }

    public AuthResponse refreshToken(String refreshToken) {
        if (!jwtUtil.validateToken(refreshToken, true)) {
            throw new InvalidTokenException();
        }

        String email = jwtUtil.getEmailFromToken(refreshToken, true);
        User user = userRepository.findByEmail(email)
                .orElseThrow(UserNotFoundException::new);

        Authentication authentication = new UsernamePasswordAuthenticationToken(
                user.getEmail(), null, user.getAuthorities()
        );

        return toAuthResponse(user, authentication);
    }

    public MeResponse me(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(UserNotFoundException::new);
        return new MeResponse(user.getEmail(), user.getName(), buildRoles(user));
    }

    private AuthResponse toAuthResponse(User user, Authentication authentication) {
        return new AuthResponse(
                jwtUtil.generateAccessToken(authentication),
                jwtUtil.generateRefreshToken(authentication),
                user.getEmail(),
                user.getName(),
                buildRoles(user)
        );
    }

    private List<String> buildRoles(User user) {
        return user.getRoles().stream()
                .map(role -> "ROLE_" + role)
                .toList();
    }
}
