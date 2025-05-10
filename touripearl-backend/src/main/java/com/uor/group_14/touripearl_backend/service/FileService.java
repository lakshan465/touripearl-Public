package com.uor.group_14.touripearl_backend.service;

import com.uor.group_14.touripearl_backend.util.CommonFileSavedBinaryDataDto;
import org.springframework.web.multipart.MultipartFile;

public interface FileService {
    CommonFileSavedBinaryDataDto createResource(MultipartFile file, String directory, String bucket);

    void deleteResource(String fileName, String directory, String bucket);

    byte[] downloadFile(String bucket, String fileName);
}
