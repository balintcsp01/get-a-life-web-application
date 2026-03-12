package com.codecool.getalife.integrationtests;

import com.codecool.getalife.model.Hobby;
import com.codecool.getalife.repository.HobbyRepository;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.webmvc.test.autoconfigure.AutoConfigureMockMvc;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.transaction.annotation.Transactional;
import tools.jackson.databind.ObjectMapper;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("test")
@Transactional
public class HobbyIntegrationTest {
    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @Autowired
    private HobbyRepository hobbyRepository;

    private Hobby createValidHobby(String name) {
        Hobby hobby = new Hobby();
        hobby.setName(name);
        hobby.setDescription("Fun activity for testing");
        hobby.setDifficulty("EASY");
        hobby.setMin_price(10);
        hobby.setMax_price(50);
        return hobbyRepository.save(hobby);
    }

    @Test
    @WithMockUser
    void getAll_shouldReturnHobbies() throws Exception {

        Hobby hobby = createValidHobby("Football");

        hobbyRepository.save(hobby);

        mockMvc.perform(get("/api/hobbies"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].name").value("Football"));
    }

    @Test
    @WithMockUser
    void testCreateHobby() {
        Hobby hobby = createValidHobby("Basketball");

        assertNotNull(hobby.getId());
        assertEquals("Basketball", hobby.getName());
    }

    @Test
    @WithMockUser
    void testFindHobby() {
        Hobby hobby = createValidHobby("Tennis");

        Optional<Hobby> found = hobbyRepository.findById(hobby.getId());
        assertTrue(found.isPresent());
        assertEquals("Tennis", found.get().getName());
    }

    @Test
    @WithMockUser
    void testUpdateHobby() {
        Hobby hobby = createValidHobby("Running");
        hobby.setDescription("Outdoor running activity");
        hobby.setMax_price(70);
        hobbyRepository.save(hobby);

        Hobby updated = hobbyRepository.findById(hobby.getId()).get();
        assertEquals("Outdoor running activity", updated.getDescription());
        assertEquals(70, updated.getMax_price());
    }

    @Test
    @WithMockUser
    void testDeleteHobby() {
        Hobby hobby = createValidHobby("Swimming");
        Long id = hobby.getId();

        hobbyRepository.delete(hobby);
        assertFalse(hobbyRepository.findById(id).isPresent());
    }
}
