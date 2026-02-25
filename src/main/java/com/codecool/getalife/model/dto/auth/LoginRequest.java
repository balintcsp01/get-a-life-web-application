package com.codecool.getalife.model.dto.auth;

public record LoginRequest(
        String email,
        String password
) {}