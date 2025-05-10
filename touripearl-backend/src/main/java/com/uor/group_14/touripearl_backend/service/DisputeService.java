package com.uor.group_14.touripearl_backend.service;

import com.uor.group_14.touripearl_backend.dto.request.dispute.RaiseDisputeRequestDto;
import com.uor.group_14.touripearl_backend.dto.request.dispute.UpdateDisputeDto;
import com.uor.group_14.touripearl_backend.dto.response.dispute.DisputeResponseDto;
import com.uor.group_14.touripearl_backend.entity.dispute.DisputeStatus;
import org.springframework.data.domain.Page;
import org.springframework.web.multipart.MultipartFile;

import java.time.LocalDateTime;
import java.util.List;

public interface DisputeService {
    DisputeResponseDto raiseDispute(List<MultipartFile> images, RaiseDisputeRequestDto dto);

    DisputeResponseDto getDisputeById(String disputeId);

    Page<DisputeResponseDto> getAllDisputes();

    DisputeResponseDto resolveDispute(String disputeId, UpdateDisputeDto decision);

    Page<DisputeResponseDto> searchByKeywordAndFilters(int page, int size, DisputeStatus status,String keyword);

    DisputeResponseDto inProgressDispute(String disputeId);
}
