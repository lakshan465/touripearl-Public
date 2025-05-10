package com.uor.group_14.touripearl_backend.dto.response;
import lombok.*;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class ActivityResponseDto {
    private String activityName;
    private String activityImageUrl;
}
