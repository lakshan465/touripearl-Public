package com.uor.group_14.touripearl_backend.dto.request.guide;

import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
@Builder
public class GuideFilteringDto {
    private String searchQuery;
    private String sort;
    private List<String> languages;
    private List<String> interests;
    private int size;
    private int page;
}
