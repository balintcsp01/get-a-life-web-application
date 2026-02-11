package com.codecool.getalife.controller.advice;

import com.codecool.getalife.controller.CategoryController;
import com.codecool.getalife.exception.categories.CategoryDuplicateException;
import com.codecool.getalife.exception.categories.CategoryNotFoundException;
import com.codecool.getalife.model.dto.error.ErrorResponse;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;

import java.time.LocalDateTime;

@ControllerAdvice(assignableTypes = CategoryController.class)
public class CategoryControllerAdvice {

    @ExceptionHandler(CategoryNotFoundException.class)
    public ResponseEntity<ErrorResponse> handleNotFound(CategoryNotFoundException ex) {

        ErrorResponse error = new ErrorResponse(
                HttpStatus.NOT_FOUND.value(),
                ex.getMessage(),
                LocalDateTime.now()
        );

        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(error);
    }

    @ExceptionHandler(CategoryDuplicateException.class)
    public ResponseEntity<ErrorResponse> handleDuplicate(CategoryDuplicateException ex) {

        ErrorResponse error = new ErrorResponse(
                HttpStatus.CONFLICT.value(),
                ex.getMessage(),
                LocalDateTime.now()
        );

        return ResponseEntity.status(HttpStatus.CONFLICT).body(error);
    }
}
