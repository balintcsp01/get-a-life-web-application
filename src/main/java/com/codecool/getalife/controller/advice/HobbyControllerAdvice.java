package com.codecool.getalife.controller.advice;

import com.codecool.getalife.controller.HobbyController;
import com.codecool.getalife.exception.hobby.HobbyNotFoundException;
import com.codecool.getalife.model.dto.error.ErrorResponse;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;

import java.time.LocalDateTime;

@ControllerAdvice(assignableTypes = HobbyController.class)
public class HobbyControllerAdvice {

    @ExceptionHandler(HobbyNotFoundException.class)
    public ResponseEntity<ErrorResponse> handleNotFound(HobbyNotFoundException ex) {

        ErrorResponse error = new ErrorResponse(
                HttpStatus.NOT_FOUND.value(),
                ex.getMessage(),
                LocalDateTime.now()

        );

        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(error);
    }
}
