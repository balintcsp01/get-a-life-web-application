package com.codecool.getalife.repository;

import com.codecool.getalife.model.Category;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CategoryRepository extends JpaRepository<Category, Long> {

    boolean existsCategoryByNameIgnoreCase(String name);
}
