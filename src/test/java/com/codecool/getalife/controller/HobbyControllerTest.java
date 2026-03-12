package com.codecool.getalife.controller;

import com.codecool.getalife.configuration.SecurityConfig;
import com.codecool.getalife.controller.HobbyController;
import com.codecool.getalife.model.dto.category.CategoryNameResponse;
import com.codecool.getalife.model.dto.hobby.HobbyCreateRequest;
import com.codecool.getalife.model.dto.hobby.HobbyPatchRequest;
import com.codecool.getalife.model.dto.hobby.HobbyResponse;
import com.codecool.getalife.security.JwtAuthenticationFilter;
import com.codecool.getalife.security.JwtUtil;
import com.codecool.getalife.service.CustomUserDetailsService;
import com.codecool.getalife.service.HobbyService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.webmvc.test.autoconfigure.AutoConfigureMockMvc;
import org.springframework.boot.webmvc.test.autoconfigure.WebMvcTest;
import org.springframework.context.annotation.Import;
import org.springframework.http.MediaType;
import org.springframework.mock.web.MockMultipartFile;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.request.MockMvcRequestBuilders;
import tools.jackson.databind.ObjectMapper;


import java.nio.charset.StandardCharsets;
import java.util.Set;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.delete;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@WebMvcTest(HobbyController.class)
@AutoConfigureMockMvc(addFilters = false)
class HobbyControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockitoBean
    private HobbyService hobbyService;

    @MockitoBean
    private JwtUtil jwtUtil;

    @MockitoBean
    private JwtAuthenticationFilter jwtAuthenticationFilter;

    @MockitoBean
    private CustomUserDetailsService customUserDetailsService;


    @Autowired
    private ObjectMapper objectMapper;

    private HobbyResponse response;

    @BeforeEach
    void setup() {
        CategoryNameResponse category =
                new CategoryNameResponse(1L, "Sport");

        response = new HobbyResponse(
                1L,
                "Football",
                "/images/img.png",
                "desc",
                Set.of(category),
                10,
                100,
                "EASY"
        );
    }

    @Test
    void getAll_shouldReturnList() throws Exception {

        when(hobbyService.getAll()).thenReturn(Set.of(response));

        mockMvc.perform(get("/api/hobbies"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].name").value("Football"));
    }

    @Test
    void get_shouldReturnHobby() throws Exception {

        when(hobbyService.get(1L)).thenReturn(response);

        mockMvc.perform(get("/api/hobbies/1"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.name").value("Football"));
    }

    @Test
    void create_shouldReturnCreated() throws Exception {

        MockMultipartFile hobbyJson = new MockMultipartFile(
                "hobby",
                "hobby.json",
                MediaType.APPLICATION_JSON_VALUE,
                objectMapper.writeValueAsBytes(
                        new HobbyCreateRequest(
                                "Football",
                                "desc",
                                Set.of(1L),
                                10,
                                100,
                                "EASY"
                        )
                )
        );

        MockMultipartFile image =
                new MockMultipartFile(
                        "image",
                        "img.png",
                        MediaType.IMAGE_PNG_VALUE,
                        "fake image content".getBytes(StandardCharsets.UTF_8)
                );

        when(hobbyService.create(any(), any())).thenReturn(response);

        mockMvc.perform(MockMvcRequestBuilders.multipart("/api/hobbies/1")
                        .file(hobbyJson)
                        .file(image)
                        .with(request -> { request.setMethod("PATCH"); return request; })
                        .contentType(MediaType.MULTIPART_FORM_DATA)
                )
                .andExpect(status().isOk());
    }

    @Test
    void patch_shouldReturnUpdated() throws Exception {

        MockMultipartFile hobbyJson =
                new MockMultipartFile(
                        "hobby",
                        "",
                        "application/json",
                        objectMapper.writeValueAsBytes(
                                new HobbyPatchRequest(
                                        "NewName",
                                        "desc",
                                        Set.of(1L),
                                        10,
                                        100,
                                        "EASY"
                                )
                        )
                );

        MockMultipartFile image =
                new MockMultipartFile(
                        "image",
                        "img.png",
                        MediaType.IMAGE_PNG_VALUE,
                        "image".getBytes()
                );

        when(hobbyService.patch(eq(1L), any(), any())).thenReturn(response);

        mockMvc.perform(MockMvcRequestBuilders.multipart("/api/hobbies/1")
                        .file(hobbyJson)
                        .file(image)
                        .with(request -> {
                            request.setMethod("PATCH");
                            return request;
                        })
                        .contentType(MediaType.MULTIPART_FORM_DATA))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.name").value("Football"));
    }

    @Test
    void delete_shouldReturnNoContent() throws Exception {

        doNothing().when(hobbyService).delete(1L);

        mockMvc.perform(delete("/api/hobbies/1"))
                .andExpect(status().isNoContent());

        verify(hobbyService).delete(1L);
    }
}
