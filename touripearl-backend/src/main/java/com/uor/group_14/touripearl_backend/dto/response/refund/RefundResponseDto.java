package com.uor.group_14.touripearl_backend.dto.response.refund;

import com.uor.group_14.touripearl_backend.entity.refund.RefundStatus;
import lombok.*;

import java.time.LocalDateTime;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class RefundResponseDto {
    private String propertyId;
    private RefundStatus status;
    private String reason;
    private String bookingId;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
