package com.codecool.getalife.exception.hobby;

public class HobbyNotFoundException extends RuntimeException {
    public HobbyNotFoundException(String hobby) {
        super("This hobby does not exits: " + hobby);
    }
}
