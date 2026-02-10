package com.codecool.getalife.repository;

import com.codecool.getalife.model.Category;
import com.codecool.getalife.model.dto.Category.CategoryNameResponse;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface CategoryRepository extends JpaRepository<Category, Long> {

    Optional<Category> findCategoryByName(String name);
    Optional<CategoryNameResponse> findCategoryById(Long id);
}
