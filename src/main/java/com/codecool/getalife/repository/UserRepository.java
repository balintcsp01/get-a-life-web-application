package com.codecool.getalife.repository;

import com.codecool.getalife.model.User;
import com.codecool.getalife.model.dto.user.UserResponse;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Long> {

    boolean existsByEmailIgnoreCase(String email);

    boolean existsByNameIgnoreCase(String name);

    Optional<User> findUserById(Long id);
}
