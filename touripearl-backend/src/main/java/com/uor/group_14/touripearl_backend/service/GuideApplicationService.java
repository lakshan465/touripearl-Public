package com.uor.group_14.touripearl_backend.service;

import com.uor.group_14.touripearl_backend.dto.request.GuideApplicationRequestDto;
import com.uor.group_14.touripearl_backend.dto.request.RequestApplicationUpdateDto;
import com.uor.group_14.touripearl_backend.dto.response.GuideApplicationResponseDto;
import com.uor.group_14.touripearl_backend.dto.response.guideApplication.ApplicationStatusResponseDto;
import org.springframework.data.domain.Pageable;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.data.domain.Page;

import java.io.IOException;
import java.sql.SQLException;
import java.util.Map;

public interface GuideApplicationService {
    String submitApplication(MultipartFile NICImageFront, MultipartFile NICImageBack, MultipartFile licenseImageFront,MultipartFile licenseImageBack, MultipartFile profileImage, GuideApplicationRequestDto guideApplicationRequestDto) throws SQLException, IOException;
    GuideApplicationResponseDto findById(String id);
    void create(RequestApplicationUpdateDto dto);
    public Page<GuideApplicationResponseDto> findAll(Pageable pageable);
    void updateApplicationStatus(RequestApplicationUpdateDto dto);
    Page<GuideApplicationResponseDto> getPendingApplications(int page, String status);
    void deleteGuideApplication(RequestApplicationUpdateDto dto);
    ApplicationStatusResponseDto getStatus(String id);
    Map<String, Long> getApplicationCounts();
}
