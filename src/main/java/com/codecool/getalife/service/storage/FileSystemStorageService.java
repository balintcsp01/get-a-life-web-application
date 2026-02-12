package com.codecool.getalife.service.storage;

import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.UUID;

@Service
public class FileSystemStorageService implements FileStorageService {

    private final Path rootLocation = Paths.get("uploads/hobbies");

    public FileSystemStorageService() throws IOException {
        Files.createDirectories(rootLocation);
    }

    @Override
    public String store(MultipartFile file) {
        try {
            if (file.isEmpty()) {
                throw new RuntimeException("Failed to store empty file.");
            }

            String ext = getExtension(file.getOriginalFilename());
            if (ext == null) {
                ext = "png";
            }

            String filename = UUID.randomUUID() + "." + ext;
            Path destinationFile = rootLocation.resolve(filename);

            Files.copy(file.getInputStream(), destinationFile);

            return filename;
        } catch (IOException e) {
            throw new RuntimeException("Failed to store file.", e);
        }
    }

    private String getExtension(String filename) {
        if (filename == null) return null;
        int dotIndex = filename.lastIndexOf('.');
        if (dotIndex < 0) return null;
        return filename.substring(dotIndex + 1);
    }
}
