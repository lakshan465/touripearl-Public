package com.uor.group_14.touripearl_backend.dto.request.dispute;

import com.uor.group_14.touripearl_backend.entity.dispute.DisputeStatus;
import com.uor.group_14.touripearl_backend.entity.dispute.disputeReason;
import lombok.*;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class RaiseDisputeRequestDto {
    private String bookingId;
    private String description;
    private DisputeStatus status;
    private disputeReason reason;
}
