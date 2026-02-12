package com.codecool.getalife.controller;


import com.codecool.getalife.model.dto.category.CategoryCreateRequest;
import com.codecool.getalife.model.dto.category.CategoryNameResponse;
import com.codecool.getalife.service.CategoryService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Set;

@RestController
@RequestMapping("/api/categories")
@RequiredArgsConstructor
public class CategoryController {
    private final CategoryService categoryService;

    @GetMapping
    public ResponseEntity<Set<CategoryNameResponse>> getAll() {
        return ResponseEntity.ok(categoryService.getAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<CategoryNameResponse> get(@PathVariable Long id) {

        CategoryNameResponse response = categoryService.get(id);
        return ResponseEntity.ok(response);
    }

    @PostMapping
    public ResponseEntity<CategoryNameResponse> create(@RequestBody CategoryCreateRequest req) {
        return ResponseEntity.status(HttpStatus.CREATED).body(categoryService.create(req));
    }
}
