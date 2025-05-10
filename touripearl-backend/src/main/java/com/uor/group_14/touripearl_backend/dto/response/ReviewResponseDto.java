package com.uor.group_14.touripearl_backend.dto.response;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.Date;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
public class ReviewResponseDto {
    private String id;
    private int rating;
    private String comment;
    private Date createdAt;
    private TouristResponseDto touristResponseDto;
}
