package com.codecool.getalife.controller;

import com.codecool.getalife.model.dto.user.UserCreateRequest;
import com.codecool.getalife.model.dto.user.UserResponse;
import com.codecool.getalife.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;

    @GetMapping("/{id}")
    public ResponseEntity<UserResponse> get(
            @PathVariable Long id
    ) {
        UserResponse response = userService.get(id);
        return ResponseEntity.ok(response);
    }

    @PostMapping
    public ResponseEntity<UserResponse> create(
            @RequestBody UserCreateRequest req
    ) {
        var response = userService.create(req);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }
}
