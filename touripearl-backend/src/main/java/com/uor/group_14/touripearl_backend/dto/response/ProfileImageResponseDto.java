package com.uor.group_14.touripearl_backend.dto.response;

import lombok.*;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class ProfileImageResponseDto {
    private String propertyId;
    private String directory;
    private String resourceUrl;
    private String hash;
    private String fileName;
}
