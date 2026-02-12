package com.codecool.getalife.exception.user;

public class UserCannotAddSelfAsFriendException extends RuntimeException {
    public UserCannotAddSelfAsFriendException(Long userId) {
        super("User " + userId + " cannot add themselves as a friend");
    }
}
