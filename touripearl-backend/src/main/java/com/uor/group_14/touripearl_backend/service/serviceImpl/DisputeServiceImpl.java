package com.uor.group_14.touripearl_backend.service.serviceImpl;

import com.uor.group_14.touripearl_backend.dto.request.dispute.RaiseDisputeRequestDto;
import com.uor.group_14.touripearl_backend.dto.request.dispute.UpdateDisputeDto;
import com.uor.group_14.touripearl_backend.dto.response.dispute.DisputeResponseDto;
import com.uor.group_14.touripearl_backend.entity.bookings.Booking;
import com.uor.group_14.touripearl_backend.entity.bookings.BookingStatus;
import com.uor.group_14.touripearl_backend.entity.dispute.Dispute;
import com.uor.group_14.touripearl_backend.entity.dispute.DisputeImage;
import com.uor.group_14.touripearl_backend.entity.dispute.DisputeStatus;
import com.uor.group_14.touripearl_backend.exception.EntryNotFoundException;
import com.uor.group_14.touripearl_backend.repository.booking.BookingRepository;
import com.uor.group_14.touripearl_backend.repository.dispute.DisputeRepo;
import com.uor.group_14.touripearl_backend.service.DisputeService;
import com.uor.group_14.touripearl_backend.util.CommonFileSavedBinaryDataDto;
import com.uor.group_14.touripearl_backend.util.FileExtractor;
import com.uor.group_14.touripearl_backend.util.SecurityUtil;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.sql.SQLException;
import java.util.List;

@Service
@RequiredArgsConstructor
public class DisputeServiceImpl implements DisputeService {
    private final ApplicationUserServiceImpl applicationUserService;
    private final BookingServiceImpl bookingService;
    private final FileExtractor fileExtractor;
    private final SecurityUtil securityUtil;
    private final FileServiceImpl fileServiceImpl;
    private final DisputeRepo disputeRepository;
    private final BookingRepository bookingRepository;
    @Override
    @Transactional
    public DisputeResponseDto raiseDispute(List<MultipartFile> images, RaiseDisputeRequestDto dto) {
        Booking booking = bookingRepository.findById(dto.getBookingId()).orElseThrow(() -> new EntryNotFoundException("No reservation found"));
        if(booking.getStatus() != BookingStatus.IN_DISPUTE) {
            return mapToDto(disputeRepository.save(mapToEntity(dto, images,booking)));
        }
        return null;
    }

    @Override
    public DisputeResponseDto getDisputeById(String disputeId) {
        return mapToDto(disputeRepository.findById(disputeId)
                .orElseThrow(() -> new RuntimeException("Dispute not found")));
    }

    @Override
    public Page<DisputeResponseDto> getAllDisputes() {
        return null;
    }

    @Override
    public DisputeResponseDto resolveDispute(String disputeId, UpdateDisputeDto dto) {
        Dispute dispute = disputeRepository.findById(disputeId).orElseThrow(() -> new EntryNotFoundException("Dispute not found"));
        dispute.setStatus(dto.getStatus());
        dispute.setDecision(dto.getDecision());
        disputeRepository.save(dispute);
        return mapToDto(dispute);
    }

    @Override
    public Page<DisputeResponseDto> searchByKeywordAndFilters(int page, int size, DisputeStatus status, String keyword) {
        Page<Dispute> disputes = disputeRepository.searchByKeywordAndFilters(PageRequest.of(page,size), status, keyword);
        return disputes.map(this::mapToDto);
    }

    @Override
    public DisputeResponseDto inProgressDispute(String disputeId) {
        Dispute dispute = disputeRepository.findById(disputeId).orElseThrow(() -> new EntryNotFoundException("Dispute not found"));
        dispute.setStatus(DisputeStatus.IN_PROGRESS);
        disputeRepository.save(dispute);
        return mapToDto(dispute);
    }

    public DisputeResponseDto mapToDto(Dispute dispute){
        return DisputeResponseDto.builder()
                .propertyId(dispute.getPropertyId())
                .raisedBy(applicationUserService.MapUsers(dispute.getRaisedBy()))
                .description(dispute.getDescription())
                .status(dispute.getStatus())
                .decision(dispute.getDecision())
                .reason(dispute.getReason())
                .booking(bookingService.mapToDto(dispute.getBooking()))
                .createdAt(dispute.getCreatedAt())
                .updatedAt(dispute.getUpdatedAt())
                .disputeImageResourceUrls(dispute.getDisputeImages().stream()
                        .map(disputeImage -> fileExtractor.byteArrayToString(disputeImage.getDisputeImageResourceUrl()))
                        .toList())
                .build();
    }

    public Dispute mapToEntity(RaiseDisputeRequestDto dto, List<MultipartFile> images,Booking booking){
        Dispute dispute= Dispute.builder()
                .raisedBy(securityUtil.getCurrentUser())
                .description(dto.getDescription())
                .status(DisputeStatus.PENDING)
                .reason(dto.getReason())
                .booking(bookingRepository.findById(dto.getBookingId())
                        .orElseThrow(() -> new RuntimeException("Booking not found")))
                .build();
        if(images!=null) {

            List<DisputeImage> disputeImages = images.stream()
                    .map(image ->
                    {
                        CommonFileSavedBinaryDataDto savedImage = fileServiceImpl.createResource(
                                image,
                                "uploads/dispute-images/",
                                "touripearl-data"
                        );
                        try {
                            return DisputeImage.builder()
                                    .disputeImageResourceUrl(fileExtractor.blobToByteArray(savedImage.getResourceUrl()))
                                    .disputeImageDirectory(savedImage.getDirectory().getBytes())
                                    .disputeImageHash(fileExtractor.blobToByteArray(savedImage.getHash()))
                                    .disputeImageFileName(fileExtractor.blobToByteArray(savedImage.getFileName()))
                                    .dispute(dispute)
                                    .build();
                        } catch (SQLException e) {
                            throw new RuntimeException(e);
                        } catch (IOException e) {
                            throw new RuntimeException(e);
                        }
                    })
                    .toList();
            dispute.setDisputeImages(disputeImages);
        }
        booking.setStatus(BookingStatus.IN_DISPUTE);
        bookingRepository.save(booking);
        return dispute;
    }
}
