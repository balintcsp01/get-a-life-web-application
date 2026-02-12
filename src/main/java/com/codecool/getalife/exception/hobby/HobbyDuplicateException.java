package com.codecool.getalife.exception.hobby;

public class HobbyDuplicateException extends RuntimeException {
    public HobbyDuplicateException(String hobbyName) {
        super("Category already exists: " + hobbyName);
    }
}
