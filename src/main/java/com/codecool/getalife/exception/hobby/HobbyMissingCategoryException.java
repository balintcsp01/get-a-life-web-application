package com.codecool.getalife.exception.hobby;

public class HobbyMissingCategoryException extends RuntimeException {
    public HobbyMissingCategoryException() {
        super("A hobby must have at least one category");
    }
}
