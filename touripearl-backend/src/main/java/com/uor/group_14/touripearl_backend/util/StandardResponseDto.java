package com.uor.group_14.touripearl_backend.util;

import lombok.*;

@Setter
@Getter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class StandardResponseDto {
    private int code;
    private String message;
    private Object object;
}
