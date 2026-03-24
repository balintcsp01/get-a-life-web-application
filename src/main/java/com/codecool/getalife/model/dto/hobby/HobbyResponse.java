package com.codecool.getalife.model.dto.hobby;

import com.codecool.getalife.model.dto.category.CategoryNameResponse;

import java.util.Set;

public record HobbyResponse(
        Long id,
        String name,
        String imageUrl,
        String description,
        Set<CategoryNameResponse> categories,
        Integer minPrice,
        Integer maxPrice,
        String difficulty
) {}
