package com.codecool.getalife.controller;

import com.codecool.getalife.model.dto.hobby.HobbyCreateRequest;
import com.codecool.getalife.model.dto.hobby.HobbyPatchRequest;
import com.codecool.getalife.model.dto.hobby.HobbyResponse;
import com.codecool.getalife.service.HobbyService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.Set;

@RestController
@RequestMapping("/api/hobbies")
@RequiredArgsConstructor
public class HobbyController {
    private final HobbyService hobbyService;

    @GetMapping
    public ResponseEntity<Set<HobbyResponse>> getAll() {
        return ResponseEntity.ok(hobbyService.getAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<HobbyResponse> get(@PathVariable Long id) {
        return ResponseEntity.ok(hobbyService.get(id));
    }

    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<HobbyResponse> create(
            @RequestPart("hobby") HobbyCreateRequest req,
            @RequestPart("image") MultipartFile img) {
        return ResponseEntity.status(HttpStatus.CREATED).body(hobbyService.create(req, img));
    }

    @PatchMapping(value = "/{id}", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<HobbyResponse> patch(
            @PathVariable Long id,
            @RequestPart("hobby") HobbyPatchRequest req,
            @RequestPart(value = "image", required = false) MultipartFile image) {

        return ResponseEntity.ok(hobbyService.patch(id, req, image));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        hobbyService.delete(id);
        return ResponseEntity.noContent().build();
    }
}
