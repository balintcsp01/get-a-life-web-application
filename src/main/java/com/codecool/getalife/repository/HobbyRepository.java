package com.codecool.getalife.repository;

import com.codecool.getalife.model.Hobby;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface HobbyRepository extends JpaRepository<Hobby, Long> {
    boolean existsByNameIgnoreCase(String name);
    List<Hobby> findByCategoriesId(Long categoryId);
}
