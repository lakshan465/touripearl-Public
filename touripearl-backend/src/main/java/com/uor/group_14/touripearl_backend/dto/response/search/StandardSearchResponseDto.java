package com.uor.group_14.touripearl_backend.dto.response.search;

import lombok.*;

@Getter
@Setter
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class StandardSearchResponseDto {
    private String propertyId;
    private String propertyName;
    private String propertyImageUrl;
}
