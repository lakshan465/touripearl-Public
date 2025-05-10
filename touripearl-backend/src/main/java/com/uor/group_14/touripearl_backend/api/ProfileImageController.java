package com.uor.group_14.touripearl_backend.api;

import com.uor.group_14.touripearl_backend.service.ProfileImageService;
import com.uor.group_14.touripearl_backend.util.StandardResponseDto;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.sql.SQLException;

@RestController
@RequestMapping("api/v1/profile-images")
@RequiredArgsConstructor
public class ProfileImageController {
    private final ProfileImageService imageService;

    @PostMapping("/{id}")
    public ResponseEntity<StandardResponseDto> saveFile(
            @PathVariable String id,
            @RequestParam("profileImage") MultipartFile file
    ) throws SQLException {
        imageService.saveFile(id, file);
        return new ResponseEntity<>(
                new StandardResponseDto(201, "Profile Image was created!..", null),
                HttpStatus.CREATED
        );
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<StandardResponseDto> deleteFile(@PathVariable String id) {
        imageService.deleteFile(id);
        return new ResponseEntity<>(
                new StandardResponseDto(204, "Image deleted", null),
                HttpStatus.NO_CONTENT
        );
    }

    @PutMapping("/{id}")
    public ResponseEntity<StandardResponseDto> updateFile(
            @PathVariable String id,
            @RequestParam("profileImage") MultipartFile file
    ) throws SQLException {
        imageService.updateFile(id, file);
        return new ResponseEntity<>(
                new StandardResponseDto(201, "Profile Image was updated!..", null),
                HttpStatus.CREATED
        );
    }
}
