package com.uor.group_14.touripearl_backend.api;


import com.uor.group_14.touripearl_backend.entity.SlideShowImg;
import com.uor.group_14.touripearl_backend.service.SlideShowImgService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.sql.SQLException;
import java.util.List;

@RestController
@RequestMapping("/api/v1/slideShow")
@RequiredArgsConstructor
public class SlideShowController {
    private final SlideShowImgService slideShowImgService;

    @PostMapping("/upload")
    public ResponseEntity<Object> saveFile(@RequestParam MultipartFile file
    ) throws SQLException, IOException {
        System.out.println(" @PostMapping(\"/upload\")");
        if (file.isEmpty()) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("File and name cannot be empty");
        }
        return ResponseEntity.ok(slideShowImgService.saveFile(file));


    }

    @GetMapping("/getAll")
    public ResponseEntity<List<SlideShowImg>> getAllFiles() {
        return ResponseEntity.ok(slideShowImgService.getAllFiles());
    }

    @DeleteMapping("/delete")
    public ResponseEntity<String> deleteFile(@RequestParam String fileS3Name) {
        slideShowImgService.deleteFile(fileS3Name);
        return ResponseEntity.ok("deleted");
    }
}

