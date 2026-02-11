package com.codecool.getalife.exception.user;

public class UserFriendNotFoundException extends RuntimeException {
    public UserFriendNotFoundException(Long userId1, Long userId2) {
        super("User: " + userId1 + " and User: " + userId2 + " are not friends.");
    }
}
