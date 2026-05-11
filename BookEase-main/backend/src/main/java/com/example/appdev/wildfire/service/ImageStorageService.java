package com.example.appdev.wildfire.service;

import org.springframework.stereotype.Service;

import java.io.File;

@Service
public class ImageStorageService {

    private static final String UPLOAD_ROOT =
            System.getProperty("user.dir") + "/uploads/";

    public void deleteImageIfExists(String imageUrl) {
        if (imageUrl == null || imageUrl.isBlank()) return;

        // prevent deleting default images
        if (imageUrl.contains("default")) return;

        File file = new File(UPLOAD_ROOT + imageUrl.replace("/uploads/", ""));
        if (file.exists()) {
            file.delete();
        }
    }
}

