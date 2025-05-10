package com.uor.group_14.touripearl_backend.repository;

import com.uor.group_14.touripearl_backend.entity.SlideShowImg;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface SlideShowImgRepo extends JpaRepository<SlideShowImg, Long> {
    SlideShowImg findByName(String fileName);
    // Get all SlideShowImg entities
    List<SlideShowImg> findAll();

}
