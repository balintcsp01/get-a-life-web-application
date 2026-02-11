package com.codecool.getalife.controller.advice;

import com.codecool.getalife.controller.UserFriendsController;
import com.codecool.getalife.exception.user.UserCannotAddSelfAsFriendException;
import com.codecool.getalife.exception.user.UserFriendAlreadyExistsException;
import com.codecool.getalife.exception.user.UserFriendNotFoundException;
import com.codecool.getalife.exception.user.UserNotFoundException;
import com.codecool.getalife.model.dto.error.ErrorResponse;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.ResponseBody;

import java.time.LocalDateTime;

@ControllerAdvice(assignableTypes = UserFriendsController.class)
public class UserFriendsControllerAdvice {

    @ExceptionHandler(UserFriendAlreadyExistsException.class)
    public ResponseEntity<ErrorResponse> handleAlreadyFriends(UserFriendAlreadyExistsException ex) {

        ErrorResponse error = new ErrorResponse(
                HttpStatus.CONFLICT.value(),
                ex.getMessage(),
                LocalDateTime.now()
        );

        return ResponseEntity.status(HttpStatus.CONFLICT).body(error);

    }

    @ExceptionHandler(UserFriendNotFoundException.class)
    public ResponseEntity<ErrorResponse> handleNotFound(UserFriendNotFoundException ex) {

        ErrorResponse error = new ErrorResponse(
                HttpStatus.NOT_FOUND.value(),
                ex.getMessage(),
                LocalDateTime.now()
        );

        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(error);
    }

    @ExceptionHandler(UserCannotAddSelfAsFriendException.class)
    public ResponseEntity<ErrorResponse> handleCannotAddSelf(UserCannotAddSelfAsFriendException ex) {

        ErrorResponse error = new ErrorResponse(
                HttpStatus.CONFLICT.value(),
                ex.getMessage(),
                LocalDateTime.now()
        );

        return ResponseEntity.status(HttpStatus.CONFLICT).body(error);

    }

    @ExceptionHandler(UserNotFoundException.class)
    public ResponseEntity<ErrorResponse> handleNotFound(UserNotFoundException ex) {

        ErrorResponse error = new ErrorResponse(
                HttpStatus.NOT_FOUND.value(),
                ex.getMessage(),
                LocalDateTime.now()
        );

        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(error);
    }
}
