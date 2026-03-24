package com.codecool.getalife.model.dto.suggestion;

import java.util.List;

public record SuggestionCreateRequest(
        String name,
        String description,
        Integer minPrice,
        Integer maxPrice,
        String difficulty,
        List<String> categories
) {}
