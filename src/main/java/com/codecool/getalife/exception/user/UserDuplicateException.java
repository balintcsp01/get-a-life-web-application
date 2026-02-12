package com.codecool.getalife.exception.user;

public class UserDuplicateException extends RuntimeException {
    public UserDuplicateException() {
        super("Email or username already in use");
    }
}
