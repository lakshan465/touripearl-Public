package com.uor.group_14.touripearl_backend.service.serviceImpl;

import com.uor.group_14.touripearl_backend.entity.SlideShowImg;
import com.uor.group_14.touripearl_backend.repository.SlideShowImgRepo;
import com.uor.group_14.touripearl_backend.service.SlideShowImgService;
import com.uor.group_14.touripearl_backend.util.CommonFileSavedBinaryDataDto;
import com.uor.group_14.touripearl_backend.util.FileExtractor;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.nio.charset.StandardCharsets;

import java.io.IOException;
import java.sql.SQLException;
import java.util.List;

@Service
@RequiredArgsConstructor
public class SlideShowImgServiceImpl implements SlideShowImgService {




    private final SlideShowImgRepo slideShowImgRepo;
    private final FileServiceImpl fileServiceImpl;
    private final FileExtractor fileExtractor;

    @Override
    public SlideShowImg saveFile(MultipartFile file) throws SQLException, IOException {

        // Handle image
        CommonFileSavedBinaryDataDto savedMainImageData = fileServiceImpl.createResource(
                file,
                "uploads/bannerImg/",
                "touripearl-data"
        );
        SlideShowImg slideShowImg = SlideShowImg.builder()
                .dir(new String(savedMainImageData.getDirectory().getBytes(), StandardCharsets.UTF_8))
                .url(new String(fileExtractor.blobToByteArray(savedMainImageData.getResourceUrl()), StandardCharsets.UTF_8))
                .hash(new String(fileExtractor.blobToByteArray(savedMainImageData.getHash()), StandardCharsets.UTF_8))
                .name(new String(fileExtractor.blobToByteArray(savedMainImageData.getFileName()), StandardCharsets.UTF_8))
                .build();

        return (slideShowImgRepo.save(slideShowImg));
    }

    @Override
    public List<SlideShowImg> getAllFiles() {
        return slideShowImgRepo.findAll();
    }


    @Override
    public void deleteFile(String fileName) {
        fileServiceImpl.deleteResource("touripearl-data", "uploads/bannerImg/", fileName);
        SlideShowImg slideShowImg = slideShowImgRepo.findByName(fileName);
        slideShowImgRepo.delete(slideShowImg);

    }

}
