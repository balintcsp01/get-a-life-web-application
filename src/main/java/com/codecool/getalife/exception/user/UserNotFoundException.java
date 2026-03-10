package com.codecool.getalife.exception.user;

public class UserNotFoundException extends RuntimeException {
    public UserNotFoundException(String username) {
        super("User does not exist: " + username);
    }

    public UserNotFoundException() {
        super("User not found");
    }
}