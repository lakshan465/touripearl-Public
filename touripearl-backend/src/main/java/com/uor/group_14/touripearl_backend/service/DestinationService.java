package com.uor.group_14.touripearl_backend.service;

import com.uor.group_14.touripearl_backend.dto.request.DestinationRequestDto;
import com.uor.group_14.touripearl_backend.dto.response.DestinationResponseDto;
import org.springframework.data.domain.Page;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.sql.SQLException;
import java.util.List;

public interface DestinationService {

    public void createDestination(MultipartFile mainImage, List<MultipartFile> subImages, DestinationRequestDto destinationRequestDto, List<MultipartFile> activityImages) throws SQLException, IOException;
    public DestinationResponseDto findByDestinationId(String destinationId);
    public void updateDestination(String destinationId, MultipartFile mainImage, List<MultipartFile> subImages,DestinationRequestDto destinationRequestDto, List<MultipartFile> activityImages) throws SQLException, IOException;
    public void deleteDestination(String destinationId);
    Page<DestinationResponseDto> getAllDestinations(int page, int size,String search, Boolean active);
    public List<DestinationResponseDto> getAllDestinationsWithoutPagination();
    public void deleteSubImage(String destinationId, String imageId);
    public void deleteMainImage(String destinationId, String imageId);
    public void deleteActivity(String destinationId, String activityName);
}
