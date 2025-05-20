package com.uor.group_14.touripearl_backend.dto.response;

import lombok.*;

import java.util.List;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class GuidePaginateResponseDto {
    private long count;
    private List<GuideDetailsResponseDto> guideDetailsList;
}
