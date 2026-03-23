package com.codecool.getalife.model.dto.suggestion;

import java.time.Instant;
import java.util.List;

public record SuggestionResponse(
        Long id,
        String name,
        String description,
        Integer minPrice,
        Integer maxPrice,
        String difficulty,
        List<String> categories,
        String submittedBy,
        Instant createdAt
) {}
