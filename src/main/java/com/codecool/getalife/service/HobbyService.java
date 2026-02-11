package com.codecool.getalife.service;

import com.codecool.getalife.exception.hobby.HobbyNotFoundException;
import com.codecool.getalife.model.Hobby;
import com.codecool.getalife.model.dto.category.CategoryNameResponse;
import com.codecool.getalife.model.dto.hobby.HobbyResponse;
import com.codecool.getalife.repository.HobbyRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class HobbyService {

    private final HobbyRepository hobbyRepository;



    public HobbyResponse get(Long id) {
        var hobby = hobbyRepository.findById(id).orElseThrow(
                () -> new HobbyNotFoundException(id.toString())
        );

        return toResponse(hobby);

    }

    private HobbyResponse toResponse(Hobby hobby) {

        return new HobbyResponse(
                hobby.getName(),
                hobby.getDescription(),
                hobby.getCategories()
                        .stream()
                        .map(category -> new CategoryNameResponse(category.getName()))
                        .collect(Collectors.toSet()),
                hobby.getMin_price(),
                hobby.getMax_price()
        );
    }
}
