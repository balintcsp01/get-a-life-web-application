package com.codecool.getalife.controller;

import com.codecool.getalife.model.dto.hobby.HobbyIdResponse;
import com.codecool.getalife.service.WishlistService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.Set;

@RestController
@RequestMapping("/api/users/me/wishlist")
@RequiredArgsConstructor
public class WishlistController {

    private final WishlistService wishlistService;

    @GetMapping
    public ResponseEntity<Set<HobbyIdResponse>> getWishlist(
            @AuthenticationPrincipal String email
    ) {
        return ResponseEntity.ok(wishlistService.getWishlist(email));
    }

    @PostMapping("/{hobbyId}")
    public ResponseEntity<Void> addToWishlist(
            @AuthenticationPrincipal String email,
            @PathVariable Long hobbyId
    ) {
        wishlistService.addToWishlist(email, hobbyId);
        return ResponseEntity.status(201).build();
    }

    @DeleteMapping("/{hobbyId}")
    public ResponseEntity<Void> removeFromWishlist(
            @AuthenticationPrincipal String email,
            @PathVariable Long hobbyId
    ) {
        wishlistService.removeFromWishlist(email, hobbyId);
        return ResponseEntity.noContent().build();
    }
}
