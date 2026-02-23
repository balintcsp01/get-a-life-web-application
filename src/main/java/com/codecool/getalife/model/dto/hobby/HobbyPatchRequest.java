package com.codecool.getalife.model.dto.hobby;

import java.util.Set;

public record HobbyPatchRequest(
        String name,
        String description,
        Set<Long> categoryIds,
        Integer minPrice,
        Integer maxPrice
) {}
