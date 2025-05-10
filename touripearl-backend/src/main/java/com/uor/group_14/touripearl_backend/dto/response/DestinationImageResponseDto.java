package com.uor.group_14.touripearl_backend.dto.response;

import com.uor.group_14.touripearl_backend.entity.enumEntity.DestinationImagePurpose;
import lombok.*;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class DestinationImageResponseDto {
    private String destinationImageId;
    private String destinationImageResourceUrl;
    private DestinationImagePurpose destinationImagePurpose;
}
