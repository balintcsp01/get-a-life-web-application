package com.codecool.getalife.controller;

import com.codecool.getalife.model.dto.hobby.HobbyCreateRequest;
import com.codecool.getalife.model.dto.hobby.HobbyResponse;
import com.codecool.getalife.service.HobbyService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Set;

@RestController
@RequestMapping("/api/hobbies")
@RequiredArgsConstructor
public class HobbyController {
    private final HobbyService hobbyService;

    @GetMapping
    public ResponseEntity<Set<HobbyResponse>> getAll() {
        return ResponseEntity.ok(hobbyService.getAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<HobbyResponse> get(@PathVariable Long id) {
        return ResponseEntity.ok(hobbyService.get(id));
    }

    @PostMapping
    public ResponseEntity<HobbyResponse> create(@RequestBody HobbyCreateRequest req) {
        return ResponseEntity.status(HttpStatus.CREATED).body(hobbyService.create(req));
    }
}
