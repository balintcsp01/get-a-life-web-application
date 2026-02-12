package com.codecool.getalife.exception.user;

public class UserFriendAlreadyExistsException extends RuntimeException {
    public UserFriendAlreadyExistsException(Long userId1, Long userId2) {
        super("User: " + userId1 + " and User: " + userId2 + " already friends.");
    }
}
