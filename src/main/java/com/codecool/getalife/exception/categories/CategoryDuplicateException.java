package com.codecool.getalife.exception.categories;

public class CategoryDuplicateException extends RuntimeException {
    public CategoryDuplicateException(String categoryName) {
        super("Category already exists: " + categoryName);
    }
}
