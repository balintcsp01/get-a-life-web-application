package com.codecool.getalife.model.dto.error;

import java.time.LocalDateTime;

public record ErrorResponse (
   int status,
   String message,
   LocalDateTime timestamp
) {}
