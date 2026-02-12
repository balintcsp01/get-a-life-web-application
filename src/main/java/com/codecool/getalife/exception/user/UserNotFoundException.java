package com.codecool.getalife.exception.user;

public class UserNotFoundException extends RuntimeException {
    public UserNotFoundException(String username) {
        super("User does not exists with this id : " + username);
    }
}