package com.uor.group_14.touripearl_backend.dto.response.guideApplication;

import com.uor.group_14.touripearl_backend.entity.enumEntity.ApplicationStatus;
import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Builder
public class ApplicationStatusResponseDto {
    private String firstName;
    private String lastName;
    private String email;
    private ApplicationStatus status;
}
