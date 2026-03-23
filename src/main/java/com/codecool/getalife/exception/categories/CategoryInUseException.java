package com.codecool.getalife.exception.categories;

import lombok.Getter;

import java.util.List;

@Getter
public class CategoryInUseException extends RuntimeException {
    private final List<String> hobbyNames;

    public CategoryInUseException(String categoryName, List<String> hobbyNames) {
        super("Category '" + categoryName + "' is in use.");
        this.hobbyNames = hobbyNames;
    }

}
