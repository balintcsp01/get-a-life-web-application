package com.codecool.getalife.model.dto.user;

import com.codecool.getalife.model.dto.hobby.HobbyIdResponse;
import com.codecool.getalife.model.dto.hobby.HobbyResponse;

import java.util.Set;

public record UserResponse (
        Long id,
        String name,
        String email,
        Set<HobbyIdResponse> hobbyIds
) {}
