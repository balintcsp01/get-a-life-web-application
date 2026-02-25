package com.codecool.getalife.model.dto.auth;

public record RegisterRequest(
        String username,
        String email,
        String password
) {}