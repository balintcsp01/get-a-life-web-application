package com.codecool.getalife.service;

import com.codecool.getalife.exception.categories.CategoryDoesNotExistsException;
import com.codecool.getalife.model.Category;
import com.codecool.getalife.model.dto.Category.CategoryCreateRequest;
import com.codecool.getalife.model.dto.Category.CategoryNameResponse;
import com.codecool.getalife.repository.CategoryRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class CategoryService {

    private final CategoryRepository categoryRepository;

    public Category get(String name) {
        return categoryRepository.findCategoryByName(name).orElseThrow(
                () -> new CategoryDoesNotExistsException(name));
    }

    public CategoryNameResponse get(Long id) {
        return categoryRepository.findCategoryById(id).orElseThrow(
                () -> new CategoryDoesNotExistsException(id.toString())
        );
    }

    public CategoryNameResponse create(CategoryCreateRequest req) {
        Category saved = categoryRepository.save(
                Category.builder()
                        .name(req.name())
                        .build()
        );

        return new CategoryNameResponse(
                saved.getName()
        );
    }

    public List<CategoryNameResponse> getAll() {
        return categoryRepository.findAll()
                .stream()
                .map(category -> new CategoryNameResponse(
                        category.getName()
                ))
                .toList();
    }
}
