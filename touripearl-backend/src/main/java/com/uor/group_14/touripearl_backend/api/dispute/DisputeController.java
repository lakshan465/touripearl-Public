package com.uor.group_14.touripearl_backend.api.dispute;

import com.uor.group_14.touripearl_backend.dto.request.dispute.RaiseDisputeRequestDto;
import com.uor.group_14.touripearl_backend.dto.request.dispute.UpdateDisputeDto;
import com.uor.group_14.touripearl_backend.dto.response.dispute.DisputeResponseDto;
import com.uor.group_14.touripearl_backend.entity.dispute.DisputeStatus;
import com.uor.group_14.touripearl_backend.service.DisputeService;
import com.uor.group_14.touripearl_backend.util.StandardResponseDto;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/api/v1/disputes")
@RequiredArgsConstructor
public class DisputeController {
    private final DisputeService disputeService;

    @PostMapping(path = "/raise",consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<StandardResponseDto> raiseDispute(
            @RequestPart(value = "Images", required = false) List<MultipartFile> Images,
            @RequestPart("body") RaiseDisputeRequestDto dto
    ) {
    return new ResponseEntity<>(
            new StandardResponseDto(201, "Dispute raised successfully", disputeService.raiseDispute(Images, dto)),
            HttpStatus.OK
    );
    }
    @GetMapping("/{disputeId}")
    public ResponseEntity<StandardResponseDto> getDisputeById(@PathVariable String disputeId) {
        return new ResponseEntity<>(
                new StandardResponseDto(200, "Dispute retrieved successfully", disputeService.getDisputeById(disputeId)),
                HttpStatus.OK
        );
    }
    @GetMapping("/getAllDisputes")
    public ResponseEntity<StandardResponseDto> getAllDisputes() {
        return new ResponseEntity<>(
                new StandardResponseDto(200, "Disputes retrieved successfully", disputeService.getAllDisputes()),
                HttpStatus.OK
        );
    }
    @PatchMapping("/{disputeId}/resolve")
    public ResponseEntity<StandardResponseDto> resolveDispute(@PathVariable String disputeId, @RequestBody UpdateDisputeDto decision) {
        return new ResponseEntity<>(
                new StandardResponseDto(200, "Dispute resolved successfully", disputeService.resolveDispute(disputeId, decision)),
                HttpStatus.OK
        );
    }
    @PatchMapping("/{disputeId}/inProgress")
    public ResponseEntity<StandardResponseDto> resolveDispute(@PathVariable String disputeId) {
        return new ResponseEntity<>(
                new StandardResponseDto(200, "Dispute resolved successfully", disputeService.inProgressDispute(disputeId)),
                HttpStatus.OK
        );
    }
    @GetMapping("/search-by-keyword")
    public ResponseEntity<StandardResponseDto> searchByKeyword(@RequestParam(defaultValue = "0") int page,
                                                               @RequestParam(defaultValue = "10") int size,
                                                               @RequestParam(required = false) DisputeStatus status,
                                                               @RequestParam(defaultValue = "") String keyword){
        Page<DisputeResponseDto> responseDtos =disputeService.searchByKeywordAndFilters(page,size,status,keyword);
        return new ResponseEntity<>(
                new StandardResponseDto(
                        200,"Keyword disputes",responseDtos
                ),HttpStatus.OK
        );
    }
}
