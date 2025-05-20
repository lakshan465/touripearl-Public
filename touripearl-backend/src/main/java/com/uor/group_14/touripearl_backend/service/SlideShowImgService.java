package com.uor.group_14.touripearl_backend.service;

import com.uor.group_14.touripearl_backend.entity.SlideShowImg;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.sql.SQLException;
import java.util.List;

public interface SlideShowImgService {
    SlideShowImg saveFile(MultipartFile file) throws SQLException, IOException;
    List<SlideShowImg> getAllFiles();
    public void deleteFile(String fileName);

}
