package com.codecool.getalife.service;

import com.codecool.getalife.exception.categories.CategoryDuplicateException;
import com.codecool.getalife.exception.categories.CategoryNotFoundException;
import com.codecool.getalife.model.Category;
import com.codecool.getalife.model.dto.category.CategoryCreateRequest;
import com.codecool.getalife.model.dto.category.CategoryNameResponse;
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
                () -> new CategoryNotFoundException(name));
    }

    public CategoryNameResponse get(Long id) {
        return categoryRepository.findCategoryById(id).orElseThrow(
                () -> new CategoryNotFoundException(id.toString())
        );
    }

    public CategoryNameResponse create(CategoryCreateRequest req) {

        if (categoryRepository.existsCategoryByNameIgnoreCase(req.name())) {
            throw new CategoryDuplicateException(req.name());
        }

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
