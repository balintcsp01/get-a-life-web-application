package com.codecool.getalife.model.dto.auth;

import java.util.List;

public record MeResponse(
        String email,
        String username,
        List<String> roles
) {}
