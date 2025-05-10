package com.uor.group_14.touripearl_backend.api;

import com.uor.group_14.touripearl_backend.dto.request.GuideApplicationRequestDto;
import com.uor.group_14.touripearl_backend.dto.request.RequestApplicationUpdateDto;
import com.uor.group_14.touripearl_backend.dto.response.GuideApplicationPaginatedResponse;
import com.uor.group_14.touripearl_backend.dto.response.GuideApplicationResponseDto;
import com.uor.group_14.touripearl_backend.entity.enumEntity.ApplicationStatus;
import com.uor.group_14.touripearl_backend.entity.guideApplication.GuideApplication;
import com.uor.group_14.touripearl_backend.service.GuideApplicationService;
import com.uor.group_14.touripearl_backend.util.StandardResponseDto;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.sql.SQLException;

@RestController
@RequestMapping("/api/v1/guideApplications")
@RequiredArgsConstructor
public class GuideApplicationController {
    private final GuideApplicationService guideApplicationService;

    @PostMapping
    public ResponseEntity<StandardResponseDto> submitApplication(@RequestPart(value = "NICImageFront", required = false) MultipartFile NICImageFront ,
                                                                 @RequestPart(value = "NICImageBack", required = false) MultipartFile NICImageBack ,
                                                                 @RequestPart(value = "licenseImageFront", required = false) MultipartFile licenseImageFront,
                                                                 @RequestPart(value = "licenseImageBack", required = false) MultipartFile licenseImageBack,
                                                                 @RequestPart(value = "profileImage",required = false) MultipartFile profileImage,
                                                                 @RequestPart("body") GuideApplicationRequestDto guideApplicationRequestDto)
            throws SQLException, IOException {
        String applicationID = guideApplicationService.submitApplication(NICImageFront,NICImageBack,licenseImageFront,licenseImageBack,profileImage,guideApplicationRequestDto);
        return new ResponseEntity<>(
                new StandardResponseDto(201,"Application was submitted...",applicationID),
                HttpStatus.CREATED
        );
    }

    @GetMapping("/{id}")
    public ResponseEntity<StandardResponseDto> getById(@PathVariable String id){
        return new ResponseEntity<>(
                new StandardResponseDto(200,"Application data...",guideApplicationService.findById(id)),
                HttpStatus.OK
        );
    }

    @GetMapping("/applicationStatus/{id}")
    public ResponseEntity<StandardResponseDto> getApplicationStatus(@PathVariable String id){
        return new ResponseEntity<>(
                new StandardResponseDto(200,"ApplicationStatus",guideApplicationService.getStatus(id)),HttpStatus.OK
        );
    }

    @PostMapping("/createGuide")
    public ResponseEntity<StandardResponseDto> create(@RequestBody RequestApplicationUpdateDto dto){
        // First, update the application status
        guideApplicationService.updateApplicationStatus(dto);

        int code;
        String msg;
        ApplicationStatus status = ApplicationStatus.valueOf(dto.getApplicationStatus().toUpperCase());
        if (status == ApplicationStatus.APPROVED) {
            // If approved, create the guide
            guideApplicationService.create(dto);
            msg = "Guide created and application status approved!";
            code = 201;  // 201 Created
        } else {
            // If rejected, handle the rejection
            msg = "Application was rejected.";
            code = 200;  // 400 Bad Request
        }

        // Return the response with the appropriate status code and message
        return new ResponseEntity<>(new StandardResponseDto(code, msg, null),
                status == ApplicationStatus.APPROVED ? HttpStatus.CREATED : HttpStatus.OK);
    }

    @GetMapping("/getAllApplication")
    public ResponseEntity<Page<GuideApplicationResponseDto>> getGuideApplication(
            @RequestParam(defaultValue = "0") int page, // Default to page 0
            @RequestParam(defaultValue = "7") int limit // Default to 7 items per page
    ){

        Pageable pageable = PageRequest.of(page, limit);
        System.out.println(page+limit);
        Page<GuideApplicationResponseDto> guideApplicationPage = guideApplicationService.findAll(pageable);

        return ResponseEntity.ok(guideApplicationPage);
    }


    @GetMapping("/filteredApplications")
    public ResponseEntity<Page<GuideApplicationResponseDto>> getPendingApplications(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam (defaultValue = "PENDING") String status)//PENDING
    {
       // Pageable pageable = PageRequest.of(page, 7);
        Page<GuideApplicationResponseDto> guideApplicationPage = guideApplicationService.getPendingApplications(page,status);
        return ResponseEntity.ok(guideApplicationPage);
    }


    @DeleteMapping(value = "/deleteGuideApplication")
    public ResponseEntity<StandardResponseDto> deleteGuideApplication(@RequestBody RequestApplicationUpdateDto dto) {
        guideApplicationService.deleteGuideApplication(dto);
        return new ResponseEntity<>(new StandardResponseDto(200, "GuideApplication deleted successfully!", null), HttpStatus.OK);
    }




}