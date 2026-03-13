package com.codecool.getalife.service;
import com.codecool.getalife.exception.hobby.*;
import com.codecool.getalife.exception.categories.*;
import com.codecool.getalife.model.Category;
import com.codecool.getalife.model.Hobby;
import com.codecool.getalife.model.dto.hobby.*;
import com.codecool.getalife.repository.CategoryRepository;
import com.codecool.getalife.repository.HobbyRepository;
import com.codecool.getalife.service.storage.FileStorageService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.Optional;
import java.util.Set;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class HobbyServiceTest {

    @Mock
    private HobbyRepository hobbyRepository;

    @Mock
    private CategoryRepository categoryRepository;

    @Mock
    private FileStorageService fileStorageService;

    @InjectMocks
    private HobbyService hobbyService;

    private Hobby hobby;
    private Category category;

    @BeforeEach
    void setUp() {
        category = Category.builder()
                .name("Sport")
                .build();

        hobby = Hobby.builder()
                .name("Football")
                .description("desc")
                .imagePath("img.png")
                .minPrice(10)
                .maxPrice(100)
                .difficulty("EASY")
                .categories(Set.of(category))
                .build();
    }

    @Test
    void getAll_shouldReturnAllHobbies() {
        when(hobbyRepository.findAll()).thenReturn(List.of(hobby));

        Set<HobbyResponse> result = hobbyService.getAll();

        assertEquals(1, result.size());
        assertEquals("Football", result.iterator().next().name());
    }

    @Test
    void get_shouldReturnHobby() {
        when(hobbyRepository.findById(1L)).thenReturn(Optional.of(hobby));

        HobbyResponse result = hobbyService.get(1L);

        assertEquals("Football", result.name());
    }

    @Test
    void get_shouldThrowWhenNotFound() {
        when(hobbyRepository.findById(1L)).thenReturn(Optional.empty());

        assertThrows(HobbyNotFoundException.class, () -> hobbyService.get(1L));
    }

    @Test
    void create_shouldCreateHobby() {

        MultipartFile file = mock(MultipartFile.class);

        HobbyCreateRequest req = new HobbyCreateRequest(
                "Football",
                "desc",
                Set.of(1L),
                10,
                100,
                "EASY"
        );

        when(hobbyRepository.existsByNameIgnoreCase("Football")).thenReturn(false);
        when(fileStorageService.store(file, "hobbies")).thenReturn("img.png");
        when(categoryRepository.findById(1L)).thenReturn(Optional.of(category));
        when(hobbyRepository.save(any())).thenReturn(hobby);

        HobbyResponse response = hobbyService.create(req, file);

        assertEquals("Football", response.name());
        verify(fileStorageService).store(file, "hobbies");
    }

    @Test
    void create_shouldThrowDuplicate() {

        MultipartFile file = mock(MultipartFile.class);

        HobbyCreateRequest req = new HobbyCreateRequest(
                "Football",
                "desc",
                Set.of(1L),
                10,
                100,
                "EASY"
        );

        when(hobbyRepository.existsByNameIgnoreCase("Football")).thenReturn(true);

        assertThrows(HobbyDuplicateException.class,
                () -> hobbyService.create(req, file));
    }

    @Test
    void create_shouldThrowMissingCategory() {

        MultipartFile file = mock(MultipartFile.class);

        HobbyCreateRequest req = new HobbyCreateRequest(
                "Football",
                "desc",
                Set.of(),
                10,
                100,
                "EASY"
        );

        when(hobbyRepository.existsByNameIgnoreCase("Football")).thenReturn(false);

        assertThrows(HobbyMissingCategoryException.class,
                () -> hobbyService.create(req, file));
    }

    @Test
    void create_shouldThrowCategoryNotFound() {

        MultipartFile file = mock(MultipartFile.class);

        HobbyCreateRequest req = new HobbyCreateRequest(
                "Football",
                "desc",
                Set.of(1L),
                10,
                100,
                "EASY"
        );

        when(hobbyRepository.existsByNameIgnoreCase("Football")).thenReturn(false);
        when(fileStorageService.store(file, "hobbies")).thenReturn("img.png");
        when(categoryRepository.findById(1L)).thenReturn(Optional.empty());

        assertThrows(CategoryNotFoundException.class,
                () -> hobbyService.create(req, file));
    }

    @Test
    void patch_shouldUpdateFields() {

        MultipartFile file = mock(MultipartFile.class);
        when(file.isEmpty()).thenReturn(false);

        HobbyPatchRequest req = new HobbyPatchRequest(
                "NewName",
                "newDesc",
                Set.of(1L),
                20,
                200,
                "EASY"
        );

        when(hobbyRepository.findById(1L)).thenReturn(Optional.of(hobby));
        when(hobbyRepository.existsByNameIgnoreCase("NewName")).thenReturn(false);
        when(categoryRepository.findById(1L)).thenReturn(Optional.of(category));
        when(fileStorageService.store(file, "hobbies")).thenReturn("new.png");
        when(hobbyRepository.save(any())).thenReturn(hobby);

        HobbyResponse result = hobbyService.patch(1L, req, file);

        assertEquals("NewName", result.name());
        verify(fileStorageService).delete("img.png");
        verify(fileStorageService).store(file, "hobbies");
    }

    @Test
    void patch_shouldThrowDuplicateName() {

        HobbyPatchRequest req = new HobbyPatchRequest(
                "OtherName",
                null,
                null,
                null,
                null,
                "EASY"
        );

        when(hobbyRepository.findById(1L)).thenReturn(Optional.of(hobby));
        when(hobbyRepository.existsByNameIgnoreCase("OtherName")).thenReturn(true);

        assertThrows(HobbyDuplicateException.class,
                () -> hobbyService.patch(1L, req, null));
    }

    @Test
    void patch_shouldThrowCategoryNotFound() {

        HobbyPatchRequest req = new HobbyPatchRequest(
                null,
                null,
                Set.of(2L),
                null,
                null,
                "EASY"
        );

        when(hobbyRepository.findById(1L)).thenReturn(Optional.of(hobby));
        when(categoryRepository.findById(2L)).thenReturn(Optional.empty());

        assertThrows(CategoryNotFoundException.class,
                () -> hobbyService.patch(1L, req, null));
    }

    @Test
    void delete_shouldDeleteHobby() {

        when(hobbyRepository.findById(1L)).thenReturn(Optional.of(hobby));

        hobbyService.delete(1L);

        verify(fileStorageService).delete("img.png");
        verify(hobbyRepository).delete(hobby);
    }

    @Test
    void delete_shouldThrowNotFound() {

        when(hobbyRepository.findById(1L)).thenReturn(Optional.empty());

        assertThrows(HobbyNotFoundException.class,
                () -> hobbyService.delete(1L));
    }
}
