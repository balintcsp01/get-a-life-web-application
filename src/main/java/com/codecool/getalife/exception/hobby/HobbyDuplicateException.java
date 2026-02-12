package com.codecool.getalife.exception.hobby;

public class HobbyDuplicateException extends RuntimeException {
    public HobbyDuplicateException(String hobbyName) {
        super("Hobby already exists: " + hobbyName);
    }
}
