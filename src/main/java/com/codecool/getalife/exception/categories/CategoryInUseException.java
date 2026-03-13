package com.codecool.getalife.exception.categories;

import java.util.List;

public class CategoryInUseException extends RuntimeException {
    public CategoryInUseException(String categoryName, List<String> hobbyNames) {
        super("Category '" + categoryName + "' is used by " + hobbyNames.size() + " hobby/hobbies: " + String.join(", ", hobbyNames));
    }
}
