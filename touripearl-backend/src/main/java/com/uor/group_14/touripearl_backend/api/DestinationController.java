package com.uor.group_14.touripearl_backend.api;

import com.uor.group_14.touripearl_backend.dto.request.ActivityRequestDto;
import com.uor.group_14.touripearl_backend.dto.request.DestinationRequestDto;
import com.uor.group_14.touripearl_backend.dto.response.DestinationResponseDto;
import com.uor.group_14.touripearl_backend.exception.DuplicateEntryException;
import com.uor.group_14.touripearl_backend.service.DestinationService;
import com.uor.group_14.touripearl_backend.util.StandardResponseDto;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.List;
import java.util.Set;

@RestController
@RequestMapping("/api/v1/destinations")
@RequiredArgsConstructor
public class DestinationController {

    private final DestinationService destinationService;

    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<StandardResponseDto> createDestination(
            @RequestPart("mainImage") MultipartFile mainImage,
            @RequestPart(value = "subImages", required = false) List<MultipartFile> subImages,
            @RequestPart("body") DestinationRequestDto destinationRequestDto,
            @RequestPart(value = "activityImages", required = false) List<MultipartFile> activityImages)
            throws SQLException, IOException {
        destinationService.createDestination(mainImage, subImages, destinationRequestDto,activityImages);

        return ResponseEntity.status(HttpStatus.CREATED)
                .body(new StandardResponseDto(201, "Destination was created successfully", null));
    }

    @GetMapping("/{destinationId}")
    public ResponseEntity<StandardResponseDto> getByDestinationId(@PathVariable String destinationId) {
        return ResponseEntity.ok()
                .body(new StandardResponseDto(200, "Destination retrieved successfully",
                        destinationService.findByDestinationId(destinationId)));
    }

    @PutMapping(value = "/{destinationId}", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<StandardResponseDto> updateDestination(
            @PathVariable String destinationId,
            @RequestPart(value = "mainImage", required = false) MultipartFile mainImage,
            @RequestPart(value = "subImages", required = false) List<MultipartFile> subImages,
            @RequestPart("body") DestinationRequestDto destinationRequestDto,
            @RequestPart(value = "activityImages", required = false) List<MultipartFile> activityImages)
            throws SQLException, IOException {

        destinationService.updateDestination(
                destinationId,
                mainImage,
                subImages,
                destinationRequestDto,
                activityImages
        );

        return ResponseEntity.ok()
                .body(new StandardResponseDto(200, "Destination was updated successfully", null));
    }


    @DeleteMapping("/{destinationId}")
    public ResponseEntity<StandardResponseDto> deleteDestination(@PathVariable String destinationId) {
        destinationService.deleteDestination(destinationId);
        return ResponseEntity.ok()
                .body(new StandardResponseDto(200, "Destination was deleted successfully", null));
    }

    @GetMapping
    public ResponseEntity<StandardResponseDto> getAllDestinations(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(required = false) String search,
            @RequestParam(required = false) Boolean active) {
        Page<?> destinations = destinationService.getAllDestinations(page, size, search, active);
        return ResponseEntity.ok()
                .body(new StandardResponseDto(200, "All destinations retrieved successfully", destinations));
    }

    @GetMapping("/all")
    public  ResponseEntity<StandardResponseDto> getAllDestinationsWithoutPagination(){
        List<DestinationResponseDto> destinations = destinationService.getAllDestinationsWithoutPagination();
        return ResponseEntity.ok()
                .body(new StandardResponseDto(200, "All destinations retrieved successfully", destinations));
    }

    @DeleteMapping("/{destinationId}/subimages/{imageId}")
    public ResponseEntity<StandardResponseDto> deleteSubImage(
            @PathVariable String destinationId,
            @PathVariable String imageId){
        destinationService.deleteSubImage(destinationId, imageId);
        return ResponseEntity.ok()
                .body(new StandardResponseDto(200, "Sub image was deleted successfully", null));
    }

    @DeleteMapping("/{destinationId}/mainimage/{imageId}")
    public ResponseEntity<StandardResponseDto> deleteMainImage(
            @PathVariable String destinationId,
            @PathVariable String imageId){
        destinationService.deleteMainImage(destinationId, imageId);
        return ResponseEntity.ok()
                .body(new StandardResponseDto(200, "Main image was deleted successfully", null));
    }

    @DeleteMapping("/{destinationId}/activities/{activityName}")
    public ResponseEntity<StandardResponseDto> deleteActivity(
            @PathVariable String destinationId,
            @PathVariable String activityName) {
        destinationService.deleteActivity(destinationId, activityName);
        return ResponseEntity.ok()
                .body(new StandardResponseDto(200, "Activity was deleted successfully", null));
    }
}