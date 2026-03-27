package com.codecool.getalife.service;

import com.codecool.getalife.exception.categories.CategoryDuplicateException;
import com.codecool.getalife.exception.categories.CategoryInUseException;
import com.codecool.getalife.exception.categories.CategoryNotFoundException;
import com.codecool.getalife.model.Category;
import com.codecool.getalife.model.Hobby;
import com.codecool.getalife.model.dto.category.CategoryCreateRequest;
import com.codecool.getalife.model.dto.category.CategoryNameResponse;
import com.codecool.getalife.repository.CategoryRepository;
import com.codecool.getalife.repository.HobbyRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class CategoryService {

    private final CategoryRepository categoryRepository;
    private final HobbyRepository hobbyRepository;

    public CategoryNameResponse get(Long id) {
        Category category = categoryRepository.findById(id).orElseThrow(
                () -> new CategoryNotFoundException(id.toString())
        );

        return toResponse(category);
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
                saved.getId(),
                saved.getName()
        );
    }

    public Set<CategoryNameResponse> getAll() {
        return categoryRepository.findAll()
                .stream()
                .map(this::toResponse)
                .collect(Collectors.toSet());
    }

    private CategoryNameResponse toResponse(Category category) {
        return new CategoryNameResponse(category.getId(), category.getName());
    }

    public void delete(Long id) {
        Category category = categoryRepository.findById(id)
                .orElseThrow(() -> new CategoryNotFoundException(id.toString()));

        List<String> assignedHobbies = hobbyRepository.findByCategoriesId(id)
                .stream()
                .map(Hobby::getName)
                .toList();

        if (!assignedHobbies.isEmpty()) {
            throw new CategoryInUseException(category.getName(), assignedHobbies);
        }

        categoryRepository.delete(category);
    }
}
