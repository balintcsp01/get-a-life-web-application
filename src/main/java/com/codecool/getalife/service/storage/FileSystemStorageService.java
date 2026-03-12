package com.codecool.getalife.service.storage;

import com.codecool.getalife.exception.storage.StorageException;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.io.InputStream;
import java.nio.file.*;
import java.util.Set;
import java.util.UUID;

@Service
public class FileSystemStorageService implements FileStorageService {

    private static final Set<String> ALLOWED_EXTENSIONS = Set.of("png", "jpg", "jpeg");
    private static final Path UPLOADS_ROOT = Paths.get("uploads").toAbsolutePath().normalize();

    @Override
    public String store(MultipartFile file, String subfolder) {
        validateFile(file);

        Path location = UPLOADS_ROOT.resolve(subfolder).normalize();
        ensureWithinStorage(location);

        try {
            Files.createDirectories(location);
        } catch (IOException e) {
            throw new StorageException("Could not create storage directory: " + subfolder, e);
        }

        String extension = resolveExtension(file.getOriginalFilename());
        String filename = UUID.randomUUID() + "." + extension;

        Path destination = location.resolve(filename).normalize();
        ensureWithinStorage(destination);

        try (InputStream inputStream = file.getInputStream()) {
            Files.copy(inputStream, destination, StandardCopyOption.REPLACE_EXISTING);
            return subfolder + "/" + filename;
        } catch (IOException e) {
            throw new StorageException("Failed to store file.", e);
        }
    }

    @Override
    public void delete(String relativePath) {
        if (relativePath == null || relativePath.isBlank()) {
            return;
        }

        Path file = UPLOADS_ROOT.resolve(relativePath).normalize();
        ensureWithinStorage(file);

        try {
            Files.deleteIfExists(file);
        } catch (IOException e) {
            throw new StorageException("Failed to delete file: " + relativePath, e);
        }
    }

    private void validateFile(MultipartFile file) {
        if (file == null || file.isEmpty()) {
            throw new StorageException("Cannot store empty file.");
        }

        String contentType = file.getContentType();
        if (contentType == null ||
                (!contentType.equals("image/png") &&
                        !contentType.equals("image/jpeg"))) {
            throw new StorageException("Only PNG and JPG images are allowed.");
        }
    }

    private String resolveExtension(String originalFilename) {
        if (originalFilename == null) {
            throw new StorageException("File must have a valid name.");
        }

        int dotIndex = originalFilename.lastIndexOf('.');
        if (dotIndex < 0 || dotIndex == originalFilename.length() - 1) {
            throw new StorageException("File must have an extension.");
        }

        String extension = originalFilename.substring(dotIndex + 1).toLowerCase();

        if (!ALLOWED_EXTENSIONS.contains(extension)) {
            throw new StorageException("Only PNG and JPG images are allowed.");
        }

        return extension;
    }

    private void ensureWithinStorage(Path path) {
        if (!path.startsWith(UPLOADS_ROOT)) {
            throw new StorageException("Invalid file path.");
        }
    }
}