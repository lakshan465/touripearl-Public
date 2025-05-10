package com.uor.group_14.touripearl_backend.util;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.sql.Blob;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class CommonFileSavedBinaryDataDto {
    private Blob hash;
    private String directory;
    private Blob fileName;
    private Blob resourceUrl;
}
