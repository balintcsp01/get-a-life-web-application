package com.codecool.getalife.service;

import com.codecool.getalife.exception.categories.CategoryNotFoundException;
import com.codecool.getalife.exception.hobby.HobbyNotFoundException;
import com.codecool.getalife.model.Category;
import com.codecool.getalife.model.Hobby;
import com.codecool.getalife.model.dto.category.CategoryNameResponse;
import com.codecool.getalife.model.dto.hobby.HobbyCreateRequest;
import com.codecool.getalife.model.dto.hobby.HobbyResponse;
import com.codecool.getalife.repository.CategoryRepository;
import com.codecool.getalife.repository.HobbyRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.Set;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class HobbyService {

    private final HobbyRepository hobbyRepository;
    private final CategoryRepository categoryRepository;


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

    public HobbyResponse create(HobbyCreateRequest request) {
        Set<Category> categories = request.categoryIds()
                .stream()
                .map(id -> categoryRepository.findById(id)
                        .orElseThrow(() -> new CategoryNotFoundException(id.toString())))
                .collect(Collectors.toSet());

        Hobby hobby = Hobby.builder()
                .name(request.name())
                .description(request.description())
                .min_price(request.minPrice())
                .max_price(request.maxPrice())
                .categories(categories)
                .build();

        Hobby savedHobby = hobbyRepository.save(hobby);
        return toResponse(savedHobby);
    }

    private HobbyResponse toResponse(Hobby hobby) {

        return new HobbyResponse(
                hobby.getName(),
                hobby.getDescription(),
                hobby.getCategories()
                        .stream()
                        .map(category -> new CategoryNameResponse(category.getId(), category.getName()))
                        .collect(Collectors.toSet()),
                hobby.getMin_price(),
                hobby.getMax_price()
        );
    }
}
