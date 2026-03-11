package com.codecool.getalife.service;

import com.codecool.getalife.exception.hobby.HobbyNotFoundException;
import com.codecool.getalife.exception.user.UserNotFoundException;
import com.codecool.getalife.model.Hobby;
import com.codecool.getalife.model.User;
import com.codecool.getalife.model.dto.hobby.HobbyIdResponse;
import com.codecool.getalife.repository.HobbyRepository;
import com.codecool.getalife.repository.UserRepository;
import org.springframework.transaction.annotation.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.Set;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional
public class WishlistService {

    private final UserRepository userRepository;
    private final HobbyRepository hobbyRepository;

    public Set<HobbyIdResponse> getWishlist(String email) {
        return findUser(email).getHobbies()
                .stream()
                .map(hobby -> new HobbyIdResponse(hobby.getId()))
                .collect(Collectors.toSet());
    }

    public void addToWishlist(String email, Long hobbyId) {
        User user = findUser(email);
        Hobby hobby = findHobby(hobbyId);
        if (!user.getHobbies().contains(hobby)) {
            user.getHobbies().add(hobby);
            userRepository.save(user);
        }
    }

    public void removeFromWishlist(String email, Long hobbyId) {
        User user = findUser(email);
        Hobby hobby = findHobby(hobbyId);
        user.getHobbies().remove(hobby);
        userRepository.save(user);
    }

    private User findUser(String email) {
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new UserNotFoundException(email));
    }

    private Hobby findHobby(Long hobbyId) {
        return hobbyRepository.findById(hobbyId)
                .orElseThrow(() -> new HobbyNotFoundException(hobbyId.toString()));
    }
}
