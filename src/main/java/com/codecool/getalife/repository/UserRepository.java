package com.codecool.getalife.repository;

import com.codecool.getalife.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Long> {

    Optional<User> findByEmail(String email);

    boolean existsByName(String name);
    boolean existsByEmail(String email);

}
