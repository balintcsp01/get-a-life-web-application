package com.codecool.getalife.model.dto.error;

import java.time.LocalDateTime;

public record ErrorResponse (
   int status,
   String error,
   String message,
   String path,
   LocalDateTime timestamp
) {}
