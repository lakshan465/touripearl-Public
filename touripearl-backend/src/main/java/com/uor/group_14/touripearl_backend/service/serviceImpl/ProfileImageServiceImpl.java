package com.uor.group_14.touripearl_backend.service.serviceImpl;

import com.uor.group_14.touripearl_backend.entity.applicationUser.ApplicationUser;
import com.uor.group_14.touripearl_backend.entity.applicationUser.ProfileImage;
import com.uor.group_14.touripearl_backend.exception.EntryNotFoundException;
import com.uor.group_14.touripearl_backend.repository.ApplicationUserRepository;
import com.uor.group_14.touripearl_backend.repository.ProfileImageRepository;
import com.uor.group_14.touripearl_backend.service.ProfileImageService;
import com.uor.group_14.touripearl_backend.util.CommonFileSavedBinaryDataDto;
import com.uor.group_14.touripearl_backend.util.FileExtractor;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import software.amazon.awssdk.services.s3.model.S3Exception;

import java.io.InputStreamReader;
import java.sql.SQLException;
import java.util.Optional;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class ProfileImageServiceImpl implements ProfileImageService {
    @Value("${aws.bucket_name}")
    private String bucketName;
    private final FileServiceImpl fileService;
    private final ProfileImageRepository imageRepository;
    private final ApplicationUserRepository userRepository;
    private final FileExtractor fileExtractor;

    @Override
    public void saveFile(String id, MultipartFile file) throws SQLException {
        CommonFileSavedBinaryDataDto resource = fileService.createResource(file, "uploads/profile_images", "touripearl-data");

        try {
            Optional<ApplicationUser> selectedUser = userRepository.findById(id);

            if (selectedUser.isEmpty()) {
                throw new EntryNotFoundException(String.format("%s not found.", id));
            }

            Optional<ProfileImage> selectedImage = imageRepository.findByApplicationUser(selectedUser.get());

            if (selectedImage.isEmpty()) {
                ProfileImage profileImage = ProfileImage.builder()
                        .propertyId(UUID.randomUUID().toString())
                        .hash(fileExtractor.blobToByteArray(resource.getHash()))
                        .directory(resource.getDirectory().getBytes())
                        .resourceUrl(fileExtractor.blobToByteArray(resource.getResourceUrl()))
                        .fileName(fileExtractor.blobToByteArray(resource.getFileName()))
                        .applicationUser(selectedUser.get())
                        .build();
                imageRepository.save(profileImage);
            } else {
                deleteFile(selectedImage.get().getPropertyId());
            }

        } catch (Exception e) {
            fileService.deleteResource(bucketName, resource.getDirectory(), fileExtractor.extractActualFileName(
                    new InputStreamReader(resource.getFileName().getBinaryStream())));
            throw S3Exception.builder().message("Something Went Wrong....").build();
        }
    }

    @Override
    public void deleteFile(String imgId) {
        Optional<ProfileImage> selectedImage = imageRepository.findById(imgId);
        if (selectedImage.isEmpty()) {
            throw new EntryNotFoundException("Image not found");
        }
        imageRepository.deleteById(imgId);
    }

    @Override
    public void updateFile(String imageId, MultipartFile file) throws SQLException {
        Optional<ProfileImage> selectedImage = imageRepository.findById(imageId);
        if (selectedImage.isEmpty()) {
            throw new EntryNotFoundException("Profile Image Not Found.");
        }
        deleteFile(imageId);

        saveFile(selectedImage.get().getApplicationUser().getUserId(), file);
    }
}
