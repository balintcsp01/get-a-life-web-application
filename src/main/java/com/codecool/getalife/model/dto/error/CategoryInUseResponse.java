package com.codecool.getalife.model.dto.error;

import java.util.List;

public record CategoryInUseResponse(
        String message,
        List<String> hobbyNames
) {}
