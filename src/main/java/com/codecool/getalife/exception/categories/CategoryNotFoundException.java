package com.codecool.getalife.exception.categories;

public class CategoryNotFoundException extends RuntimeException {
    public CategoryNotFoundException(String category) {
        super("This category does not exits: " + category);
    }
}
