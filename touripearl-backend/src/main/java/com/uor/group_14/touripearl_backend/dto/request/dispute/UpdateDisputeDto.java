package com.uor.group_14.touripearl_backend.dto.request.dispute;

import com.uor.group_14.touripearl_backend.entity.dispute.DisputeStatus;
import lombok.*;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class UpdateDisputeDto {
    private DisputeStatus status;
    private String decision;
}
