package com.codecool.getalife.controller;

import com.codecool.getalife.exception.GlobalExceptionHandler;
import com.codecool.getalife.exception.hobby.HobbyNotFoundException;
import com.codecool.getalife.exception.user.UserDuplicateException;
import com.codecool.getalife.exception.user.UserNotFoundException;
import com.codecool.getalife.model.dto.hobby.HobbyIdResponse;
import com.codecool.getalife.model.dto.user.UserCreateRequest;
import com.codecool.getalife.model.dto.user.UserResponse;
import com.codecool.getalife.service.UserService;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Nested;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;

import java.util.Set;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@ExtendWith(MockitoExtension.class)
class UserControllerTest {

    private MockMvc mockMvc;

    private final ObjectMapper objectMapper = new ObjectMapper();

    @Mock
    private UserService userService;

    @InjectMocks
    private UserController userController;

    @BeforeEach
    void setUp() {
        mockMvc = MockMvcBuilders
                .standaloneSetup(userController)
                .setControllerAdvice(new GlobalExceptionHandler())
                .build();
    }

    private UserResponse lunaResponse() {
        return new UserResponse(1L, "Luna", "luna@meow.com", Set.of(new HobbyIdResponse(10L)));
    }

    private UserResponse jeffResponse() {
        return new UserResponse(2L, "Jeff", "jeff@meow.com", Set.of());
    }

    @Nested
    @DisplayName("GET /api/users")
    class GetAll {

        @Test
        @DisplayName("200 with list of users")
        void getAll_returns200() throws Exception {
            when(userService.getAll()).thenReturn(Set.of(lunaResponse(), jeffResponse()));

            mockMvc.perform(get("/api/users"))
                    .andExpect(status().isOk())
                    .andExpect(jsonPath("$.length()").value(2));
        }

        @Test
        @DisplayName("200 with empty array when no users exist")
        void getAll_noUsers_returnsEmptyArray() throws Exception {
            when(userService.getAll()).thenReturn(Set.of());

            mockMvc.perform(get("/api/users"))
                    .andExpect(status().isOk())
                    .andExpect(jsonPath("$.length()").value(0));
        }
    }

    @Nested
    @DisplayName("GET /api/users/{id}")
    class GetById {

        @Test
        @DisplayName("200 with correct user fields")
        void get_existingUser_returns200WithBody() throws Exception {
            when(userService.get(1L)).thenReturn(lunaResponse());

            mockMvc.perform(get("/api/users/1"))
                    .andExpect(status().isOk())
                    .andExpect(jsonPath("$.id").value(1))
                    .andExpect(jsonPath("$.name").value("Luna"))
                    .andExpect(jsonPath("$.email").value("luna@meow.com"))
                    .andExpect(jsonPath("$.hobbyIds.length()").value(1));
        }

        @Test
        @DisplayName("200 with empty hobbyIds when user has no hobbies")
        void get_userWithNoHobbies_returnsEmptyHobbyIds() throws Exception {
            when(userService.get(2L)).thenReturn(jeffResponse());

            mockMvc.perform(get("/api/users/2"))
                    .andExpect(status().isOk())
                    .andExpect(jsonPath("$.hobbyIds").isEmpty());
        }

        @Test
        @DisplayName("404 when user does not exist")
        void get_unknownUser_returns404() throws Exception {
            when(userService.get(99L)).thenThrow(new UserNotFoundException("99"));

            mockMvc.perform(get("/api/users/99"))
                    .andExpect(status().isNotFound())
                    .andExpect(jsonPath("$.status").value(404))
                    .andExpect(jsonPath("$.message").value("User does not exist: 99"));
        }
    }

    @Nested
    @DisplayName("POST /api/users")
    class Create {

        @Test
        @DisplayName("201 with created user body")
        void create_validRequest_returns201() throws Exception {
            UserCreateRequest request = new UserCreateRequest("Luna", "luna@meow.com", "purr1234", Set.of(10L));
            when(userService.create(any(UserCreateRequest.class))).thenReturn(lunaResponse());

            mockMvc.perform(post("/api/users")
                            .contentType(MediaType.APPLICATION_JSON)
                            .content(objectMapper.writeValueAsString(request)))
                    .andExpect(status().isCreated())
                    .andExpect(jsonPath("$.id").value(1))
                    .andExpect(jsonPath("$.name").value("Luna"))
                    .andExpect(jsonPath("$.email").value("luna@meow.com"));
        }

        @Test
        @DisplayName("201 with empty hobbyIds when no hobbies provided")
        void create_noHobbies_returns201WithEmptyHobbyIds() throws Exception {
            UserCreateRequest request = new UserCreateRequest("Jeff", "jeff@meow.com", "purr1234", Set.of());
            when(userService.create(any(UserCreateRequest.class))).thenReturn(jeffResponse());

            mockMvc.perform(post("/api/users")
                            .contentType(MediaType.APPLICATION_JSON)
                            .content(objectMapper.writeValueAsString(request)))
                    .andExpect(status().isCreated())
                    .andExpect(jsonPath("$.hobbyIds").isEmpty());
        }

        @Test
        @DisplayName("404 when a referenced hobby does not exist")
        void create_unknownHobbyId_returns404() throws Exception {
            UserCreateRequest request = new UserCreateRequest("Luna", "luna@meow.com", "purr1234", Set.of(99L));
            when(userService.create(any(UserCreateRequest.class))).thenThrow(new HobbyNotFoundException("99"));

            mockMvc.perform(post("/api/users")
                            .contentType(MediaType.APPLICATION_JSON)
                            .content(objectMapper.writeValueAsString(request)))
                    .andExpect(status().isNotFound())
                    .andExpect(jsonPath("$.status").value(404));
        }

        @Test
        @DisplayName("409 when email or username already exists")
        void create_duplicateUser_returns409() throws Exception {
            UserCreateRequest request = new UserCreateRequest("Luna", "luna@meow.com", "purr1234", Set.of());
            when(userService.create(any(UserCreateRequest.class))).thenThrow(new UserDuplicateException());

            mockMvc.perform(post("/api/users")
                            .contentType(MediaType.APPLICATION_JSON)
                            .content(objectMapper.writeValueAsString(request)))
                    .andExpect(status().isConflict())
                    .andExpect(jsonPath("$.status").value(409));
        }
    }
}
