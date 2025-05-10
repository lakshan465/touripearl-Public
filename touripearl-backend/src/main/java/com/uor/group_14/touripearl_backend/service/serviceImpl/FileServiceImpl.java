package com.uor.group_14.touripearl_backend.service.serviceImpl;

import com.uor.group_14.touripearl_backend.service.FileService;
import com.uor.group_14.touripearl_backend.util.CommonFileSavedBinaryDataDto;
import com.uor.group_14.touripearl_backend.util.ImageUploadGenerator;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import software.amazon.awssdk.core.ResponseInputStream;
import software.amazon.awssdk.core.sync.RequestBody;
import software.amazon.awssdk.services.s3.S3Client;
import software.amazon.awssdk.services.s3.model.*;

import javax.sql.rowset.serial.SerialBlob;
import java.io.IOException;
import java.sql.SQLException;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class FileServiceImpl implements FileService {
    private final S3Client s3Client;
    private final ImageUploadGenerator imageUploadGenerator;

    @Override
    public CommonFileSavedBinaryDataDto createResource(MultipartFile file, String directory, String bucket) {
        try {
            String originalFilename = file.getOriginalFilename();
            String newFileName = imageUploadGenerator.generateTouriPearlResourceName(originalFilename, UUID.randomUUID().toString());

            PutObjectRequest putObjectRequest = PutObjectRequest.builder()
                    .bucket(bucket)
                    .key(directory + newFileName)
                    .acl(ObjectCannedACL.PUBLIC_READ)
                    .build();

            s3Client.putObject(putObjectRequest, RequestBody.fromInputStream(file.getInputStream(), file.getSize()));

            return new CommonFileSavedBinaryDataDto(
                    new SerialBlob(newFileName.getBytes()),
                    directory,
                    new SerialBlob(newFileName.getBytes()),
                    new SerialBlob(s3Client.utilities().getUrl(builder -> builder.bucket(bucket).key(directory + newFileName)).toString().getBytes())
            );
        } catch (SQLException | IOException e) {
            throw new RuntimeException(e);
        }
    }

    @Override
    public void deleteResource(String bucket, String directory, String fileName) {
        s3Client.deleteObject(DeleteObjectRequest.builder().bucket(bucket).key(directory + fileName).build());
    }

    @Override
    public byte[] downloadFile(String bucket, String fileName) {
        GetObjectRequest getObjectRequest = GetObjectRequest.builder().bucket(bucket).key(fileName).build();
        try (ResponseInputStream<GetObjectResponse> objectContent = s3Client.getObject(getObjectRequest)) {
            return objectContent.readAllBytes();
        } catch (IOException e) {
            throw new RuntimeException(e);
        }
    }
}
