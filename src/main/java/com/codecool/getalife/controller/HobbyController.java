package com.codecool.getalife.controller;

import com.codecool.getalife.model.dto.hobby.HobbyResponse;
import com.codecool.getalife.service.HobbyService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/hobby")
@RequiredArgsConstructor
public class HobbyController {
    private final HobbyService hobbyService;

    @GetMapping("/{id}")
    public ResponseEntity<HobbyResponse> get(@PathVariable Long id) {

        var response = hobbyService.get(id);
        return ResponseEntity.ok(response);
    }
}
