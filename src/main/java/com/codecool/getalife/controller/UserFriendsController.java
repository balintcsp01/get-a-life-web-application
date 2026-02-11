package com.codecool.getalife.controller;

import com.codecool.getalife.model.dto.user.UserFriendResponse;
import com.codecool.getalife.service.UserFriendService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/friends")
@RequiredArgsConstructor
public class UserFriendsController {

    private final UserFriendService userFriendService;

    @GetMapping("/{userId}")
    public ResponseEntity<List<UserFriendResponse>> getFriends(
            @PathVariable Long userId
    ) {
        return ResponseEntity.ok(userFriendService.getFriends(userId));
    }

    @PostMapping("/{userId}/{friendId}")
    public ResponseEntity<Void> addFriend(
            @PathVariable Long userId,
            @PathVariable Long friendId
    ) {
        userFriendService.addFriend(userId, friendId);
        return ResponseEntity.status(201).build();
    }

    @DeleteMapping("/{userId}/{friendId}")
    public ResponseEntity<Void> removeFriend(
            @PathVariable Long userId,
            @PathVariable Long friendId
    ) {
        userFriendService.removeFriend(userId, friendId);
        return ResponseEntity.noContent().build();
    }
}
