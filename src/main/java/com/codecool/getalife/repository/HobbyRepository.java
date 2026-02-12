package com.codecool.getalife.repository;

import com.codecool.getalife.model.Hobby;
import org.springframework.data.jpa.repository.JpaRepository;

public interface HobbyRepository extends JpaRepository<Hobby, Long> {
    boolean existsByNameIgnoreCase(String name);
}
