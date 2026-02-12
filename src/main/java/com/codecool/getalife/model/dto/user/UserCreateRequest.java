package com.codecool.getalife.model.dto.user;

public record UserCreateRequest (
   String name,
   String email,
   String password
) {}
