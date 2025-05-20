package com.uor.group_14.touripearl_backend.dto.request;

import lombok.*;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
//admin do approve or deny guide application
public class RequestApplicationUpdateDto {
    private String guideApplicationId;
    private String applicationStatus;
}
