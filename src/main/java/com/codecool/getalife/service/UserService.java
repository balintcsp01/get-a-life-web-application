package com.codecool.getalife.service;

import com.codecool.getalife.exception.user.UserDuplicateException;
import com.codecool.getalife.exception.user.UserNotFoundException;
import com.codecool.getalife.model.User;
import com.codecool.getalife.model.dto.user.UserCreateRequest;
import com.codecool.getalife.model.dto.user.UserResponse;
import com.codecool.getalife.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@RequiredArgsConstructor
@Service
public class UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public UserResponse create(UserCreateRequest req) {

        if (userRepository.existsByEmailIgnoreCase(req.email())) {
            throw new UserDuplicateException("Email is already in use: " + req.email());
        }

        if (userRepository.existsByNameIgnoreCase(req.name())) {
            throw new UserDuplicateException("Username is already in use: " + req.name());
        }

        String hashedPassword = passwordEncoder.encode(req.password());

        User saved = userRepository.save(
                User.builder()
                        .name(req.name())
                        .email(req.email())
                        .password_hash(hashedPassword)
                        .build()
        );

        return toResponse(saved);
    }

    public UserResponse get(Long id) {
        User user = userRepository.findUserById(id)
                .orElseThrow(() -> new UserNotFoundException(id.toString())
        );

        return toResponse(user);
    }

    private UserResponse toResponse (User user) {
        return new UserResponse(
                user.getName(),
                user.getEmail()
        );
    }
}
