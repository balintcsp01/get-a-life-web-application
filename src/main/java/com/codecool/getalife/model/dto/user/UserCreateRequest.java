package com.codecool.getalife.model.dto.user;

import java.util.Set;

public record UserCreateRequest (
   String name,
   String email,
   String password,
   Set<Long> hobbyIds
) {}
