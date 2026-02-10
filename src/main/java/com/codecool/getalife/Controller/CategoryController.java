package com.codecool.getalife.Controller;


import com.codecool.getalife.model.dto.Category.CategoryCreateRequest;
import com.codecool.getalife.model.dto.Category.CategoryNameResponse;
import com.codecool.getalife.service.CategoryService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/category")
@RequiredArgsConstructor
public class CategoryController {
    private final CategoryService categoryService;

    @GetMapping("/{id}")
    public ResponseEntity<CategoryNameResponse> get(
    @PathVariable Long id
    ) {

        CategoryNameResponse response = categoryService.get(id);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/all")
    public ResponseEntity<List<CategoryNameResponse>> getAll() {
        return ResponseEntity.ok(categoryService.getAll());
    }

    @PostMapping
    public ResponseEntity<CategoryNameResponse> create(
            @RequestBody CategoryCreateRequest req
    ) {
        var response = categoryService.create(req);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }
}
