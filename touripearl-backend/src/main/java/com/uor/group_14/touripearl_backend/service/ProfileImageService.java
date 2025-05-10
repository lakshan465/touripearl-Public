package com.uor.group_14.touripearl_backend.service;

import org.springframework.web.multipart.MultipartFile;

import java.sql.SQLException;

public interface ProfileImageService {
    void saveFile(String id, MultipartFile file) throws SQLException;

    void deleteFile(String imageId);

    void updateFile(String imageId, MultipartFile file) throws SQLException;
}
