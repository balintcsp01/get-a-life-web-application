package com.codecool.getalife.service.storage;

import com.codecool.getalife.exception.storage.StorageException;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.io.InputStream;
import java.nio.file.*;
import java.util.UUID;

@Service
public class FileSystemStorageService implements FileStorageService {

    private static final String DEFAULT_EXTENSION = "png";
    private final Path rootLocation;

    public FileSystemStorageService() {
        this.rootLocation = Paths.get("uploads", "hobbies").toAbsolutePath().normalize();
        init();
    }

    private void init() {
        try {
            Files.createDirectories(rootLocation);
        } catch (IOException e) {
            throw new StorageException("Could not initialize storage directory.", e);
        }
    }

    @Override
    public String store(MultipartFile file) {
        validateFile(file);

        String extension = resolveExtension(file.getOriginalFilename());
        String filename = UUID.randomUUID() + "." + extension;

        Path destination = rootLocation.resolve(filename).normalize();
        ensureWithinStorage(destination);

        try (InputStream inputStream = file.getInputStream()) {
            Files.copy(inputStream, destination, StandardCopyOption.REPLACE_EXISTING);
            return filename;
        } catch (IOException e) {
            throw new StorageException("Failed to store file.", e);
        }
    }

    @Override
    public void delete(String filename) {
        if (filename == null || filename.isBlank()) {
            return;
        }

        Path file = rootLocation.resolve(filename).normalize();
        ensureWithinStorage(file);

        try {
            Files.deleteIfExists(file);
        } catch (IOException e) {
            throw new StorageException("Failed to delete file: " + filename, e);
        }
    }

    private void validateFile(MultipartFile file) {
        if (file == null || file.isEmpty()) {
            throw new StorageException("Cannot store empty file.");
        }
    }

    private String resolveExtension(String originalFilename) {
        if (originalFilename == null) {
            return DEFAULT_EXTENSION;
        }

        int dotIndex = originalFilename.lastIndexOf('.');
        if (dotIndex < 0 || dotIndex == originalFilename.length() - 1) {
            return DEFAULT_EXTENSION;
        }

        return originalFilename.substring(dotIndex + 1).toLowerCase();
    }

    private void ensureWithinStorage(Path path) {
        if (!path.startsWith(rootLocation)) {
            throw new StorageException("Invalid file path.");
        }
    }
}