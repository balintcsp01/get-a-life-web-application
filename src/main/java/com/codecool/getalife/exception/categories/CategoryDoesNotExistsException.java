package com.codecool.getalife.exception.categories;

public class CategoryDoesNotExistsException extends RuntimeException {
    public CategoryDoesNotExistsException(String category) {
        super("This category does not exits: " + category);
    }
}
