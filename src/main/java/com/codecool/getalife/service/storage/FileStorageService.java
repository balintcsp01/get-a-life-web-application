package com.codecool.getalife.service.storage;

import org.springframework.web.multipart.MultipartFile;

public interface FileStorageService {
    String store(MultipartFile file, String subfolder);
    void delete(String filename);
}
