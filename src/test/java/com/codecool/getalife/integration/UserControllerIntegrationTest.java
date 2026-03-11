package com.codecool.getalife.integration;

import com.codecool.getalife.model.Hobby;
import com.codecool.getalife.model.dto.user.UserCreateRequest;
import com.codecool.getalife.repository.HobbyRepository;
import com.codecool.getalife.repository.UserRepository;
import com.codecool.getalife.service.CustomUserDetailsService;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import java.util.HashSet;
import java.util.Set;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest(properties = "spring.config.name=application-test")
@AutoConfigureMockMvc(addFilters = false)
class UserControllerIntegrationTest {

    @Autowired
    MockMvc mockMvc;

    @Autowired
    HobbyRepository hobbyRepository;

    @Autowired
    UserRepository userRepository;

    @Autowired
    ObjectMapper objectMapper;

    @BeforeEach
    void cleanDatabase() {
        userRepository.deleteAll();
        hobbyRepository.deleteAll();
    }

    @Test
    void shouldCreateUser() throws Exception {
        Hobby hobby = new Hobby();
        hobby.setName("Gaming");
        hobby.setDescription("Fun hobby");
        hobby.setMin_price(10);
        hobby.setMax_price(100);
        hobby.setDifficulty("Beginner");
        hobby.setCategories(new HashSet<>());
        hobby = hobbyRepository.save(hobby);

        String requestJson = """
                {
                  "name": "John",
                  "email": "john@test.com",
                  "password": "1234",
                  "hobbyIds": [%d]
                }
                """.formatted(hobby.getId());

        mockMvc.perform(org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post("/api/users")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(requestJson))
                .andExpect(org.springframework.test.web.servlet.result.MockMvcResultMatchers.status().isCreated())
                .andExpect(org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath("$.name").value("John"))
                .andExpect(org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath("$.email").value("john@test.com"))
                .andExpect(org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath("$.hobbyIds[0].id").value(hobby.getId()));
    }

    @Test
    void shouldGetUserById() throws Exception {
        Hobby hobby = new Hobby();
        hobby.setName("Gaming");
        hobby.setDescription("Fun hobby");
        hobby.setMin_price(10);
        hobby.setMax_price(100);
        hobby.setDifficulty("Beginner");
        hobby.setCategories(new HashSet<>());
        hobby = hobbyRepository.save(hobby);

        UserCreateRequest userRequest = new UserCreateRequest(
                "Alice",
                "alice@test.com",
                "1234",
                Set.of(hobby.getId())
        );

        String userJson = objectMapper.writeValueAsString(userRequest);

        Long userId = objectMapper.readTree(
                mockMvc.perform(post("/api/users")
                                .contentType(MediaType.APPLICATION_JSON)
                                .content(userJson))
                        .andExpect(status().isCreated())
                        .andReturn()
                        .getResponse()
                        .getContentAsString()
        ).get("id").asLong();

        mockMvc.perform(get("/api/users/" + userId))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.name").value("Alice"))
                .andExpect(jsonPath("$.hobbyIds[0].id").value(hobby.getId()));
    }
    @Test
    void shouldGetAllUsers() throws Exception {
        Hobby hobby = new Hobby();
        hobby.setName("Reading");
        hobby.setDescription("Fun hobby");
        hobby.setMin_price(5);
        hobby.setMax_price(50);
        hobby.setDifficulty("Beginner");
        hobby.setCategories(new HashSet<>());
        hobby = hobbyRepository.save(hobby);

        for (String name : new String[]{"Bob", "Charlie"}) {
            UserCreateRequest userRequest = new UserCreateRequest(
                    name,
                    name.toLowerCase() + "@test.com",
                    "1234",
                    Set.of(hobby.getId())
            );

            String userJson = objectMapper.writeValueAsString(userRequest);

            mockMvc.perform(post("/api/users")
                            .contentType(MediaType.APPLICATION_JSON)
                            .content(userJson))
                    .andExpect(status().isCreated());
        }

        mockMvc.perform(get("/api/users"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.length()").value(2))
                .andExpect(jsonPath("$[0].hobbyIds[0].id").value(hobby.getId()))
                .andExpect(jsonPath("$[1].hobbyIds[0].id").value(hobby.getId()));
    }



}