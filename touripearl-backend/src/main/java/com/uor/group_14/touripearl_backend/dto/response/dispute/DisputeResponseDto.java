package com.uor.group_14.touripearl_backend.dto.response.dispute;

import com.uor.group_14.touripearl_backend.dto.response.ApplicationUserResponseDto;
import com.uor.group_14.touripearl_backend.dto.response.booking.BookingResponseDto;
import com.uor.group_14.touripearl_backend.entity.dispute.DisputeStatus;
import com.uor.group_14.touripearl_backend.entity.dispute.disputeReason;
import lombok.*;

import java.time.LocalDateTime;
import java.util.List;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class DisputeResponseDto {
    private String propertyId;
    private String description;
    private DisputeStatus status;
    private disputeReason reason;
    private String decision;
    private BookingResponseDto  booking;
    private List<String> disputeImageResourceUrls;
    private ApplicationUserResponseDto raisedBy;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
