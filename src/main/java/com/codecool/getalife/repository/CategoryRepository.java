package com.codecool.getalife.repository;

import com.codecool.getalife.model.Category;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface CategoryRepository extends JpaRepository<Category, Long> {

    boolean existsCategoryByNameIgnoreCase(String name);
    Optional<Category> findByNameIgnoreCase(String name);
}
