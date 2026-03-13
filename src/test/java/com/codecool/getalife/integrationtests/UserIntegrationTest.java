package com.codecool.getalife.integrationtests;

import com.codecool.getalife.model.Hobby;
import com.codecool.getalife.model.dto.user.UserCreateRequest;
import com.codecool.getalife.model.dto.user.UserResponse;
import com.codecool.getalife.repository.HobbyRepository;
import com.codecool.getalife.repository.UserRepository;
import com.codecool.getalife.service.UserService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import java.util.HashSet;
import java.util.Set;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest(properties = "spring.config.name=application-test")
class UserIntegrationTest {

    @Autowired
    private HobbyRepository hobbyRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private UserService userService;

    @BeforeEach
    void cleanDatabase() {
        userRepository.deleteAll();
        hobbyRepository.deleteAll();
    }

    private Hobby createHobby(String name) {
        Hobby hobby = new Hobby();
        hobby.setName(name);
        hobby.setDescription("Fun activity for testing");
        hobby.setDifficulty("EASY");
        hobby.setMinPrice(10);
        hobby.setMaxPrice(50);
        hobby.setCategories(new HashSet<>());
        return hobbyRepository.save(hobby);
    }

    @Test
    void shouldCreateUser() {
        Hobby hobby = createHobby("Gaming");

        UserCreateRequest request = new UserCreateRequest(
                "John",
                "john@test.com",
                "1234",
                Set.of(hobby.getId())
        );

        UserResponse createdUser = userService.create(request);

        assertNotNull(createdUser.id());
        assertEquals("John", createdUser.name());
        assertEquals(1, createdUser.hobbyIds().size());
        assertTrue(createdUser.hobbyIds().stream()
                .anyMatch(h -> h.id().equals(hobby.getId())));
    }

    @Test
    void shouldGetAllUsers() {
        Hobby hobby = createHobby("Reading");

        UserCreateRequest user1 = new UserCreateRequest(
                "Bob",
                "bob@test.com",
                "1234",
                Set.of(hobby.getId())
        );
        UserCreateRequest user2 = new UserCreateRequest(
                "Charlie",
                "charlie@test.com",
                "1234",
                Set.of(hobby.getId())
        );

        userService.create(user1);
        userService.create(user2);

        Set<UserResponse> allUsers = userService.getAll();

        assertEquals(2, allUsers.size());
    }
}