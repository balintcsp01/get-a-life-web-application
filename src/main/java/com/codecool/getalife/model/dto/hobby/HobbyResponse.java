package com.codecool.getalife.model.dto.hobby;

import com.codecool.getalife.model.dto.category.CategoryNameResponse;

import java.util.Set;

public record HobbyResponse(String name, String description, Set<CategoryNameResponse> categories, Integer min_price, Integer max_price) {}
