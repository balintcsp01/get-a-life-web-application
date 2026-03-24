package com.codecool.getalife.controller;

import com.codecool.getalife.model.dto.suggestion.SuggestionCreateRequest;
import com.codecool.getalife.model.dto.suggestion.SuggestionResponse;
import com.codecool.getalife.service.SuggestionService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/suggestions")
@RequiredArgsConstructor
public class SuggestionController {

    private final SuggestionService suggestionService;

    @GetMapping
    public ResponseEntity<List<SuggestionResponse>> getAll() {
        return ResponseEntity.ok(suggestionService.getAll());
    }

    @PostMapping
    public ResponseEntity<SuggestionResponse> create(
            @RequestBody SuggestionCreateRequest req,
            @AuthenticationPrincipal String email) {
        return ResponseEntity.status(HttpStatus.CREATED).body(suggestionService.create(req, email));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        suggestionService.delete(id);
        return ResponseEntity.noContent().build();
    }
}
