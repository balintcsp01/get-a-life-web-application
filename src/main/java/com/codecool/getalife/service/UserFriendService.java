package com.codecool.getalife.service;

import com.codecool.getalife.exception.user.UserCannotAddSelfAsFriendException;
import com.codecool.getalife.exception.user.UserFriendAlreadyExistsException;
import com.codecool.getalife.exception.user.UserFriendNotFoundException;
import com.codecool.getalife.exception.user.UserNotFoundException;
import com.codecool.getalife.model.UserFriends;
import com.codecool.getalife.model.dto.user.UserFriendResponse;
import com.codecool.getalife.repository.UserFriendsRepository;
import com.codecool.getalife.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@RequiredArgsConstructor
@Service
public class UserFriendService {

    private final UserFriendsRepository userFriendsRepository;
    private final UserRepository userRepository;

    public List<UserFriendResponse> getFriends(Long userId) {

        if (!userRepository.existsById(userId)) {
            throw new UserNotFoundException(userId.toString());
        }

        return userFriendsRepository.findFriendsIdsByUserId(userId)
                .stream()
                .map(UserFriendResponse::new)
                .collect(Collectors.toList());
    }

    public void addFriend(Long userId, Long friendId) {

        if (userId.equals(friendId)) {
            throw new UserCannotAddSelfAsFriendException(userId);
        }

        if (!userRepository.existsById(userId)) {
            throw new UserNotFoundException(userId.toString());
        }

        if (!userRepository.existsById(friendId)) {
            throw new UserNotFoundException(friendId.toString());
        }

        Long user1 = userId.compareTo(friendId) < 0 ? userId : friendId;
        Long user2 = userId.compareTo(friendId) < 0 ? friendId : userId;

        if (userFriendsRepository.findFriendship(user1, user2).isPresent()) {
            throw new UserFriendAlreadyExistsException(user1, user2);
        }

        UserFriends friendship = UserFriends.builder()
                .userId1(user1)
                .userId2(user2)
                .build();

        userFriendsRepository.save(friendship);
    }

    public void removeFriend(Long userId, Long friendId) {

        if (!userRepository.existsById(userId)) throw new UserNotFoundException(userId.toString());
        if (!userRepository.existsById(friendId)) throw new UserNotFoundException(friendId.toString());

        Long user1 = userId.compareTo(friendId) < 0 ? userId : friendId;
        Long user2 = userId.compareTo(friendId) < 0 ? friendId : userId;

        UserFriends friendship = userFriendsRepository.findFriendship(user1, user2)
                .orElseThrow(() -> new UserFriendNotFoundException(userId, friendId));

        userFriendsRepository.delete(friendship);
    }
}
