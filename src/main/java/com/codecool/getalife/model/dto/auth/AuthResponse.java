package com.codecool.getalife.model.dto.auth;


import java.util.List;

public record AuthResponse(
        String accessToken,
        String refreshToken,
        String email,
        String username,
        List<String> roles
) {}