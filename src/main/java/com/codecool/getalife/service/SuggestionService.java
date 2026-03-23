package com.codecool.getalife.service;

import com.codecool.getalife.model.Suggestion;
import com.codecool.getalife.model.User;
import com.codecool.getalife.model.dto.suggestion.SuggestionCreateRequest;
import com.codecool.getalife.model.dto.suggestion.SuggestionResponse;
import com.codecool.getalife.repository.SuggestionRepository;
import com.codecool.getalife.repository.UserRepository;
import com.codecool.getalife.exception.user.UserNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class SuggestionService {

    private final SuggestionRepository suggestionRepository;
    private final UserRepository userRepository;

    public List<SuggestionResponse> getAll() {
        return suggestionRepository.findAll()
                .stream()
                .map(this::toResponse)
                .toList();
    }

    public SuggestionResponse create(SuggestionCreateRequest req, String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new UserNotFoundException(email));

        Suggestion suggestion = Suggestion.builder()
                .name(req.name())
                .description(req.description())
                .minPrice(req.minPrice())
                .maxPrice(req.maxPrice())
                .difficulty(req.difficulty())
                .categories(req.categories() != null ? req.categories() : List.of())
                .submittedBy(user)
                .build();

        return toResponse(suggestionRepository.save(suggestion));
    }

    public void delete(Long id) {
        suggestionRepository.deleteById(id);
    }

    private SuggestionResponse toResponse(Suggestion s) {
        return new SuggestionResponse(
                s.getId(),
                s.getName(),
                s.getDescription(),
                s.getMinPrice(),
                s.getMaxPrice(),
                s.getDifficulty(),
                s.getCategories(),
                s.getSubmittedBy() != null ? s.getSubmittedBy().getName() : null,
                s.getCreatedAt()
        );
    }
}
