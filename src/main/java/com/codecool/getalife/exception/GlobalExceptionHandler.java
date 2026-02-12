package com.codecool.getalife.exception;

import com.codecool.getalife.exception.categories.CategoryDuplicateException;
import com.codecool.getalife.exception.categories.CategoryNotFoundException;
import com.codecool.getalife.exception.hobby.HobbyDuplicateException;
import com.codecool.getalife.exception.hobby.HobbyMissingCategoryException;
import com.codecool.getalife.exception.hobby.HobbyNotFoundException;
import com.codecool.getalife.exception.user.*;
import com.codecool.getalife.model.dto.error.ErrorResponse;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.time.LocalDateTime;

@RestControllerAdvice
@RequiredArgsConstructor
public class GlobalExceptionHandler {

    private ResponseEntity<ErrorResponse> buildError(
            HttpStatus status,
            String message,
            HttpServletRequest request
    ) {
        ErrorResponse error = new ErrorResponse(
                status.value(),
                status.getReasonPhrase(),
                message,
                request.getRequestURI(),
                LocalDateTime.now()
        );

        return ResponseEntity.status(status).body(error);
    }

    @ExceptionHandler({
            UserNotFoundException.class,
            HobbyNotFoundException.class,
            CategoryNotFoundException.class,
            UserFriendNotFoundException.class,
    })
    public ResponseEntity<ErrorResponse> handleUserNotFound(
            RuntimeException ex,
            HttpServletRequest request
    ) {
        return buildError(HttpStatus.NOT_FOUND, ex.getMessage(), request);
    }

    @ExceptionHandler({
            UserCannotAddSelfAsFriendException.class,
            UserFriendAlreadyExistsException.class,
            HobbyMissingCategoryException.class
    })
    public ResponseEntity<ErrorResponse> handleBadRequest(
            RuntimeException ex,
            HttpServletRequest request
    ) {
        return buildError(HttpStatus.BAD_REQUEST, ex.getMessage(), request);
    }

    @ExceptionHandler({
            UserDuplicateException.class,
            CategoryDuplicateException.class,
            HobbyDuplicateException.class
    })
    public ResponseEntity<ErrorResponse> handleConflict(
            RuntimeException ex,
            HttpServletRequest request
    ) {
        return buildError(HttpStatus.CONFLICT, ex.getMessage(), request);
    }

    @ExceptionHandler(DataIntegrityViolationException.class)
    public ResponseEntity<ErrorResponse> handleDatabaseError(
            DataIntegrityViolationException ex,
            HttpServletRequest request
    ) {
        return buildError(
                HttpStatus.CONFLICT,
                "Database constraint violation",
                request
        );
    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity<ErrorResponse> handleAll(
            Exception ex,
            HttpServletRequest request
    ) {
        return buildError(
                HttpStatus.INTERNAL_SERVER_ERROR,
                "Unexpected error occured",
                request
        );
    }

}
