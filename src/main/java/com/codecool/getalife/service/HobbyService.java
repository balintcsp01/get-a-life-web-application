package com.codecool.getalife.service;

import com.codecool.getalife.exception.categories.CategoryNotFoundException;
import com.codecool.getalife.exception.hobby.HobbyDuplicateException;
import com.codecool.getalife.exception.hobby.HobbyMissingCategoryException;
import com.codecool.getalife.exception.hobby.HobbyNotFoundException;
import com.codecool.getalife.model.Category;
import com.codecool.getalife.model.Hobby;
import com.codecool.getalife.model.dto.category.CategoryNameResponse;
import com.codecool.getalife.model.dto.hobby.HobbyCreateRequest;
import com.codecool.getalife.model.dto.hobby.HobbyPatchRequest;
import com.codecool.getalife.model.dto.hobby.HobbyResponse;
import com.codecool.getalife.repository.CategoryRepository;
import com.codecool.getalife.repository.HobbyRepository;
import com.codecool.getalife.service.storage.FileStorageService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.util.Set;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class HobbyService {

    private final HobbyRepository hobbyRepository;
    private final CategoryRepository categoryRepository;
    private final FileStorageService fileStorageService;


    public Set<HobbyResponse> getAll() {
        return hobbyRepository.findAll()
                .stream()
                .map(this::toResponse)
                .collect(Collectors.toSet());
    }

    public HobbyResponse get(Long id) {
        var hobby = hobbyRepository.findById(id).orElseThrow(
                () -> new HobbyNotFoundException(id.toString())
        );

        return toResponse(hobby);
    }

    public HobbyResponse create(HobbyCreateRequest req, MultipartFile img) {
        if (hobbyRepository.existsByNameIgnoreCase(req.name())) {
            throw new HobbyDuplicateException(req.name());
        }

        if (req.categoryIds() == null || req.categoryIds().isEmpty()) {
            throw new HobbyMissingCategoryException();
        }

        String imagePath = fileStorageService.store(img, "hobbies");

        Set<Category> categories = req.categoryIds()
                .stream()
                .map(id -> categoryRepository.findById(id)
                        .orElseThrow(() -> new CategoryNotFoundException(id.toString())))
                .collect(Collectors.toSet());

        Hobby hobby = Hobby.builder()
                .name(req.name())
                .imagePath(imagePath)
                .description(req.description())
                .min_price(req.minPrice())
                .max_price(req.maxPrice())
                .categories(categories)
                .difficulty(req.difficulty())
                .build();

        Hobby savedHobby = hobbyRepository.save(hobby);
        return toResponse(savedHobby);
    }

    public HobbyResponse patch(Long id, HobbyPatchRequest req, MultipartFile image) {

        Hobby hobby = hobbyRepository.findById(id)
                .orElseThrow(() -> new HobbyNotFoundException(id.toString()));

        if (req.name() != null) {
            if (!hobby.getName().equalsIgnoreCase(req.name())
                    && hobbyRepository.existsByNameIgnoreCase(req.name())) {
                throw new HobbyDuplicateException(req.name());
            }
            hobby.setName(req.name());
        }

        if (req.description() != null) {
            hobby.setDescription(req.description());
        }

        if (req.minPrice() != null) {
            hobby.setMin_price(req.minPrice());
        }

        if (req.maxPrice() != null) {
            hobby.setMax_price(req.maxPrice());
        }

        if (req.categoryIds() != null) {
            Set<Category> categories = req.categoryIds().stream()
                    .map(catId -> categoryRepository.findById(catId)
                            .orElseThrow(() -> new CategoryNotFoundException(catId.toString())))
                    .collect(Collectors.toSet());

            hobby.setCategories(categories);
        }

        if (image != null && !image.isEmpty()) {
            if (hobby.getImagePath() != null) {
                fileStorageService.delete(hobby.getImagePath());
            }

            String newImagePath = fileStorageService.store(image, "hobbies");
            hobby.setImagePath(newImagePath);
        }

        Hobby updated = hobbyRepository.save(hobby);
        return toResponse(updated);
    }

    public void delete(Long id) {
        var hobby = hobbyRepository.findById(id).orElseThrow(
                () -> new HobbyNotFoundException(id.toString())
        );

        if (hobby.getImagePath() != null) {
            fileStorageService.delete(hobby.getImagePath());
        }

        hobbyRepository.delete(hobby);

    }

    private HobbyResponse toResponse(Hobby hobby) {

        return new HobbyResponse(
                hobby.getId(),
                hobby.getName(),
                "/images/" + hobby.getImagePath(),
                hobby.getDescription(),
                hobby.getCategories()
                        .stream()
                        .map(category -> new CategoryNameResponse(category.getId(), category.getName()))
                        .collect(Collectors.toSet()),
                hobby.getMin_price(),
                hobby.getMax_price(),
                hobby.getDifficulty()
        );
    }


}
