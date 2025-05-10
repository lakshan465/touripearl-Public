package com.uor.group_14.touripearl_backend.dto.request;

import lombok.*;
import org.springframework.web.multipart.MultipartFile;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder

public class ActivityRequestDto {
    private String activityName;
    private MultipartFile activityImage;
}
