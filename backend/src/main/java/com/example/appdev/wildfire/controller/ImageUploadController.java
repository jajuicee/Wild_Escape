package com.example.appdev.wildfire.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.nio.file.*;
import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/api/uploads")
@RequiredArgsConstructor
public class ImageUploadController {

    private static final String ROOM_UPLOAD_DIR =
            System.getProperty("user.dir") + "/uploads/rooms/";


    @PostMapping("/room-image")
    public Map<String, String> uploadRoomImage(
            @RequestParam("file") MultipartFile file
    ) {
        try {
            // ✅ Ensure folder exists
            File dir = new File(ROOM_UPLOAD_DIR);
            if (!dir.exists()) {
                dir.mkdirs();
            }

            // ✅ Unique filename
            String filename = UUID.randomUUID() + "_" + file.getOriginalFilename();
            Path filePath = Paths.get(ROOM_UPLOAD_DIR + filename);

            // ✅ WRITE FILE
            Files.write(filePath, file.getBytes());

            // ✅ Public URL (relative)
            String imageUrl = "/uploads/rooms/" + filename;

            return Map.of("url", imageUrl);

        } catch (IOException e) {
            throw new RuntimeException("Failed to upload image", e);
        }
    }
}

