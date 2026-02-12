package com.codecool.getalife.service;

import com.codecool.getalife.exception.hobby.HobbyNotFoundException;
import com.codecool.getalife.exception.user.UserDuplicateException;
import com.codecool.getalife.exception.user.UserNotFoundException;
import com.codecool.getalife.model.Hobby;
import com.codecool.getalife.model.User;
import com.codecool.getalife.model.dto.category.CategoryNameResponse;
import com.codecool.getalife.model.dto.hobby.HobbyIdResponse;
import com.codecool.getalife.model.dto.hobby.HobbyResponse;
import com.codecool.getalife.model.dto.user.UserCreateRequest;
import com.codecool.getalife.model.dto.user.UserResponse;
import com.codecool.getalife.repository.HobbyRepository;
import com.codecool.getalife.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.HashSet;
import java.util.Set;
import java.util.stream.Collectors;

@RequiredArgsConstructor
@Service
public class UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final HobbyRepository hobbyRepository;

    public UserResponse create(UserCreateRequest req) {

        try {
            String hashedPassword = passwordEncoder.encode(req.password());

            Set<Hobby> hobbies = req.hobbyIds()
                    .stream()
                    .map(id -> hobbyRepository.findById(id)
                            .orElseThrow(() -> new HobbyNotFoundException(id.toString())))
                    .collect(Collectors.toSet());

            User saved = userRepository.save(
                    User.builder()
                            .name(req.name())
                            .email(req.email())
                            .password_hash(hashedPassword)
                            .hobbies(hobbies)
                            .build()
            );

            return toResponse(saved);
        } catch (DataIntegrityViolationException ex) {
            throw new UserDuplicateException();
        }
    }

    public UserResponse get(Long id) {
        User user = userRepository.findUserById(id)
                .orElseThrow(() -> new UserNotFoundException(id.toString())
        );

        return toResponse(user);
    }

    public Set<UserResponse> getAll() {
        return userRepository.findAll()
                .stream()
                .map(this::toResponse)
                .collect(Collectors.toSet());
    }

    private UserResponse toResponse (User user) {
        return new UserResponse(
                user.getId(),
                user.getName(),
                user.getEmail(),
                user.getHobbies()
                        .stream()
                        .map(hobby -> new HobbyIdResponse(hobby.getId()))
                        .collect(Collectors.toSet())
        );
    }
}
