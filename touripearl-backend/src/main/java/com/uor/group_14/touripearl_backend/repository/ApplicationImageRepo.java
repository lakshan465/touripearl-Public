package com.uor.group_14.touripearl_backend.repository;


import com.uor.group_14.touripearl_backend.entity.enumEntity.ImagePurpose;
import com.uor.group_14.touripearl_backend.entity.guideApplication.ApplicationImage;
import com.uor.group_14.touripearl_backend.entity.guideApplication.GuideApplication;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.web.multipart.MultipartFile;

import java.util.Optional;

public interface ApplicationImageRepo extends JpaRepository<ApplicationImage, MultipartFile> {
    Optional<ApplicationImage> findByGuideApplicationAndPurpose(GuideApplication guideApplication, ImagePurpose purpose);
}