package com.codecool.getalife.model.dto.user;

import com.codecool.getalife.model.Hobby;

import java.util.Set;

public record UserCreateRequest (
   String name,
   String email,
   String password,
   Set<Long> hobbyIds
) {}
