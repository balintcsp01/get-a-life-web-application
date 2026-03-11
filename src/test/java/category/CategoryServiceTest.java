package category;

import com.codecool.getalife.exception.categories.CategoryDuplicateException;
import com.codecool.getalife.model.Category;
import com.codecool.getalife.model.dto.category.CategoryCreateRequest;
import com.codecool.getalife.model.dto.category.CategoryNameResponse;
import com.codecool.getalife.repository.CategoryRepository;
import com.codecool.getalife.service.CategoryService;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.List;
import java.util.Optional;
import java.util.Set;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
public class CategoryServiceTest {

    @Mock
    private CategoryRepository categoryRepository;

    @InjectMocks
    private CategoryService categoryService;

    @Test
    void shouldCreateCategory() {

        CategoryCreateRequest req = new CategoryCreateRequest("Food");

        Category saved = Category.builder()
                .name("Food")
                .build();

        when(categoryRepository.existsCategoryByNameIgnoreCase("Food"))
                .thenReturn(false);

        when(categoryRepository.save(any(Category.class)))
                .thenReturn(saved);

        CategoryNameResponse result = categoryService.create(req);

        assertEquals("Food", result.name());

    }

    @Test
    void shouldThrowExceptionWhenCategoryAlreadyExists() {

        CategoryCreateRequest req = new CategoryCreateRequest("Food");

        when(categoryRepository.existsCategoryByNameIgnoreCase("Food"))
                .thenReturn(true);

        assertThrows(
                CategoryDuplicateException.class,
                () -> categoryService.create(req)
        );
    }

    @Test
    void shouldReturnAllCategories() {
        Category cat1 = Category.builder().name("Food").build();
        Category cat2 = Category.builder().name("Sport").build();

        when(categoryRepository.findAll())
                .thenReturn(List.of(cat1, cat2));

        Set<CategoryNameResponse> result = categoryService.getAll();

        assertEquals(2, result.size());
    }

    @Test
    void shouldDeleteCategory() {

        Category category = Category.builder()
                .name("Food")
                .build();

        when(categoryRepository.findById(1L))
                .thenReturn(Optional.of(category));

        categoryService.delete(1L);

        verify(categoryRepository).delete(category);
    }
}
