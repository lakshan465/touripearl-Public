package com.uor.group_14.touripearl_backend.service.serviceImpl;

import com.uor.group_14.touripearl_backend.dto.request.ActivityRequestDto;
import com.uor.group_14.touripearl_backend.dto.request.DestinationRequestDto;
import com.uor.group_14.touripearl_backend.dto.response.ActivityResponseDto;
import com.uor.group_14.touripearl_backend.dto.response.DestinationImageResponseDto;
import com.uor.group_14.touripearl_backend.dto.response.DestinationResponseDto;
import com.uor.group_14.touripearl_backend.entity.destinations.Activity;
import com.uor.group_14.touripearl_backend.entity.destinations.ActivityImage;
import com.uor.group_14.touripearl_backend.entity.destinations.Destination;
import com.uor.group_14.touripearl_backend.entity.destinations.DestinationImage;
import com.uor.group_14.touripearl_backend.entity.enumEntity.DestinationImagePurpose;
import com.uor.group_14.touripearl_backend.exception.DuplicateEntryException;
import com.uor.group_14.touripearl_backend.exception.EntryNotFoundException;
import com.uor.group_14.touripearl_backend.repository.DestinationRepo;
import com.uor.group_14.touripearl_backend.service.DestinationService;
import com.uor.group_14.touripearl_backend.util.CommonFileSavedBinaryDataDto;
import com.uor.group_14.touripearl_backend.util.FileExtractor;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.sql.SQLException;
import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class DestinationServiceImpl implements DestinationService {
    private final DestinationRepo destinationRepo;
    private final FileServiceImpl fileServiceImpl;
    private final FileExtractor fileExtractor;

    @Override
    @Transactional
    public void createDestination(MultipartFile mainImage,
                                  List<MultipartFile> subImages,
                                  DestinationRequestDto destinationRequestDto,
                                  List<MultipartFile> activityImages)
            throws SQLException, IOException {
        if (destinationRepo.existsByDestinationNameIgnoreCase(destinationRequestDto.getDestinationName())) {
            throw new DuplicateEntryException(
                    "Destination already exists"
            );}
        // Create and save the destination first
        Destination destination= Destination.builder()
                .destinationId(UUID.randomUUID().toString())
                .destinationName(destinationRequestDto.getDestinationName())
                .shortDescription(destinationRequestDto.getShortDescription())
                .fullDescription(destinationRequestDto.getFullDescription())
                .location(destinationRequestDto.getLocation())
                .bestTimeToVisit(destinationRequestDto.getBestTimeToVisit())
                .isActive(true)
                .build();

        Set<DestinationImage> allDestinationImages=new HashSet<>();
        // Handle main image
        CommonFileSavedBinaryDataDto savedMainImageData = fileServiceImpl.createResource(
                mainImage,
                "uploads/destination-images",
                "touripearl-data"
        );
        DestinationImage destinationMainImage = DestinationImage.builder()
                .destinationImageDirectory(savedMainImageData.getDirectory().getBytes())
                .destinationImageResourceUrl(fileExtractor.blobToByteArray(savedMainImageData.getResourceUrl()))
                .destinationImageHash(fileExtractor.blobToByteArray(savedMainImageData.getHash()))
                .destinationImagePurpose(DestinationImagePurpose.MAIN_IMAGE)
                .destinationImageFileName(mainImage.getOriginalFilename().getBytes())
                .destination(destination)
                .build();
        allDestinationImages.add(destinationMainImage);

        // Handle sub images
        for (MultipartFile requestSubImage : subImages) {
            CommonFileSavedBinaryDataDto savedSubImageData = fileServiceImpl.createResource(
                    requestSubImage,
                    "uploads/destination-images",
                    "touripearl-data"
            );

            DestinationImage destinationSubImage = DestinationImage.builder()
                    .destinationImageDirectory(savedSubImageData.getDirectory().getBytes())
                    .destinationImageResourceUrl(fileExtractor.blobToByteArray(savedSubImageData.getResourceUrl()))
                    .destinationImageHash(fileExtractor.blobToByteArray(savedSubImageData.getHash()))
                    .destinationImagePurpose(DestinationImagePurpose.SUB_IMAGE)
                    .destinationImageFileName(requestSubImage.getOriginalFilename().getBytes())
                    .destination(destination)
                    .build();

            allDestinationImages.add(destinationSubImage);
        }

        // Handle Activities (Move logic here!)
        Set<Activity> destinationActivities = new HashSet<>();
        if (destinationRequestDto.getActivities() != null) {
            for (int i = 0; i < destinationRequestDto.getActivities().size(); i++) {
                ActivityRequestDto activityDto = destinationRequestDto.getActivities().get(i);
                MultipartFile activityImage = (activityImages != null && i < activityImages.size()) ? activityImages.get(i) : null;

                ActivityImage activityImgEntity = null;
                if (activityImage != null) {
                    CommonFileSavedBinaryDataDto savedActivityImageData = fileServiceImpl.createResource(
                            activityImage, "uploads/activity-images", "touripearl-data");

                    activityImgEntity = ActivityImage.builder()
                            .activityImageDirectory(savedActivityImageData.getDirectory().getBytes())
                            .activityImageResourceUrl(fileExtractor.blobToByteArray(savedActivityImageData.getResourceUrl()))
                            .activityImageHash(fileExtractor.blobToByteArray(savedActivityImageData.getHash()))
                            .activityImageFileName(activityImage.getOriginalFilename().getBytes())
                            .build();
                }

                Activity activity = Activity.builder()
                        .activityName(activityDto.getActivityName())
                        .activityImage(activityImgEntity)
                        .destination(destination)
                        .build();

                destinationActivities.add(activity);
            }
        }


        destination.setActivities(destinationActivities);

        // Set all images to destination and save
        destination.setAllDestinationImages(allDestinationImages);
        destinationRepo.save(destination);
    }


    @Override
    public DestinationResponseDto findByDestinationId(String destinationId) {
        Destination destination = destinationRepo.findByDestinationId(destinationId)
                .orElseThrow(() -> new EntryNotFoundException("Destination not found with name: " + destinationId));

        Set<ActivityResponseDto> activityResponseDtos=destination.getActivities()
                .stream().map(activity -> {
                    if(activity.getActivityImage() == null){
                        return ActivityResponseDto.builder()
                                .activityName(activity.getActivityName())
                                //.activityImageUrl(fileExtractor.byteArrayToString(activity.getActivityImage().getActivityImageResourceUrl()))
                                .build();
                    }else {
                        return ActivityResponseDto.builder()
                                .activityName(activity.getActivityName())
                                .activityImageUrl(fileExtractor.byteArrayToString(activity.getActivityImage().getActivityImageResourceUrl()))
                                .build();
                    }
                }).collect(Collectors.toSet());

        // Convert DestinationImage entities to DTOs
        Set<DestinationImageResponseDto> destinationImageResponseDtos = destination.getAllDestinationImages()
                .stream().map(image ->{
                            return DestinationImageResponseDto.builder()
                                    .destinationImageId(image.getDestinationImageId())
                                    .destinationImageResourceUrl(fileExtractor.byteArrayToString(image.getDestinationImageResourceUrl()))
                                    .destinationImagePurpose(image.getDestinationImagePurpose())
                                    .build();
                        }
                ).collect(Collectors.toSet());

        return DestinationResponseDto.builder()
                .destinationId(destination.getDestinationId())
                .destinationName(destination.getDestinationName())
                .shortDescription(destination.getShortDescription())
                .fullDescription(destination.getFullDescription())
                .location(destination.getLocation())
                .allDestinationImages(destinationImageResponseDtos)
                .bestTimeToVisit(destination.getBestTimeToVisit())
                .isActive(destination.isActive())
                .activities(activityResponseDtos)
                .build();
    }
    @Transactional
    @Override
    public void updateDestination(String destinationId, MultipartFile mainImage, List<MultipartFile> subImages, DestinationRequestDto destinationRequestDto, List<MultipartFile> activityImages) throws SQLException, IOException {
        Destination destination=destinationRepo.findByDestinationId(destinationId)
                .orElseThrow(() -> new EntryNotFoundException("Destination not found"));

        // Update destination details
        destination.setDestinationName(destinationRequestDto.getDestinationName());
        destination.setShortDescription(destinationRequestDto.getShortDescription());
        destination.setFullDescription(destinationRequestDto.getFullDescription());
        destination.setLocation(destinationRequestDto.getLocation());
        destination.setBestTimeToVisit(destinationRequestDto.getBestTimeToVisit());
        destination.setActive(destinationRequestDto.isActive());


        if (mainImage != null || (subImages != null && !subImages.isEmpty())) {

            if(mainImage!=null){

                // Find and delete existing main image
                Optional<DestinationImage> existingMainImage = destination.getAllDestinationImages()
                        .stream()
                        .filter(img -> img.getDestinationImagePurpose() == DestinationImagePurpose.MAIN_IMAGE)
                        .findFirst();

                if (existingMainImage.isPresent()) {
                    // Delete the file from storage
                    fileServiceImpl.deleteResource(
                            "touripearl-data",
                            "uploads/destination-images",
                            fileExtractor.byteArrayToString(existingMainImage.get().getDestinationImageResourceUrl())
                    );
                    // Remove from collection
                    destination.getAllDestinationImages().remove(existingMainImage.get());
                }

                CommonFileSavedBinaryDataDto savedMainImageData = fileServiceImpl.createResource(
                        mainImage,
                        "uploads/destination-images",
                        "touripearl-data"
                );
                DestinationImage destinationMainImage = DestinationImage.builder()
                        .destinationImageDirectory(savedMainImageData.getDirectory().getBytes())
                        .destinationImageResourceUrl(fileExtractor.blobToByteArray(savedMainImageData.getResourceUrl()))
                        .destinationImageHash(fileExtractor.blobToByteArray(savedMainImageData.getHash()))
                        .destinationImagePurpose(DestinationImagePurpose.MAIN_IMAGE)
                        .destinationImageFileName(mainImage.getOriginalFilename().getBytes())
                        .destination(destination)
                        .build();
                destination.getAllDestinationImages().add(destinationMainImage);
            }

            if(subImages!= null && !subImages.isEmpty()){
                for (MultipartFile requestSubImage : subImages) {
                    CommonFileSavedBinaryDataDto savedSubImageData = fileServiceImpl.createResource(
                            requestSubImage,
                            "uploads/destination-images",
                            "touripearl-data"
                    );

                    DestinationImage destinationSubImage = DestinationImage.builder()
                            .destinationImageDirectory(savedSubImageData.getDirectory().getBytes())
                            .destinationImageResourceUrl(fileExtractor.blobToByteArray(savedSubImageData.getResourceUrl()))
                            .destinationImageHash(fileExtractor.blobToByteArray(savedSubImageData.getHash()))
                            .destinationImagePurpose(DestinationImagePurpose.SUB_IMAGE)
                            .destinationImageFileName(requestSubImage.getOriginalFilename().getBytes())
                            .destination(destination)
                            .build();

                    destination.getAllDestinationImages().add(destinationSubImage);
                }
            }

        }




        // Add new activities with images
        if (destinationRequestDto.getActivities() != null) {
            Set<Activity> destinationActivities = new HashSet<>();

            for (int i = 0; i < destinationRequestDto.getActivities().size(); i++) {
                ActivityRequestDto activityDto = destinationRequestDto.getActivities().get(i);
                MultipartFile activityImage = (activityImages != null && i < activityImages.size()) ? activityImages.get(i) : null;

                ActivityImage savedActivityImage = null;
                if (activityImage != null) {
                    CommonFileSavedBinaryDataDto savedActivityImageData = fileServiceImpl.createResource(
                            activityImage, "uploads/activity-images", "touripearl-data");

                    savedActivityImage = ActivityImage.builder()
                            .activityImageDirectory(savedActivityImageData.getDirectory().getBytes())
                            .activityImageResourceUrl(fileExtractor.blobToByteArray(savedActivityImageData.getResourceUrl()))
                            .activityImageHash(fileExtractor.blobToByteArray(savedActivityImageData.getHash()))
                            .activityImageFileName(activityImage.getOriginalFilename().getBytes())
                            .build();
                }

                Activity activity = Activity.builder()
                        .activityName(activityDto.getActivityName())
                        .activityImage(savedActivityImage)
                        .destination(destination)
                        .build();

                destinationActivities.add(activity);
            }

            //destination.setActivities(destinationActivities);
            destination.getActivities().addAll(destinationActivities);

        }
        destinationRepo.save(destination);
    }

    @Override
    public void deleteDestination(String destinationId) {
        Destination destination=destinationRepo.findByDestinationId(destinationId)
                .orElseThrow(()-> new EntryNotFoundException("Destination not found"));

        destination.setActive(false);
        destinationRepo.delete(destination);
        for (DestinationImage image : destination.getAllDestinationImages()) {
            fileServiceImpl.deleteResource(
                    "touripearl-data",
                    "uploads/images",
                    fileExtractor.byteArrayToString(image.getDestinationImageResourceUrl())

            );
        }
        // Delete activity images
        destination.getActivities().forEach(activity -> {
            if (activity.getActivityImage() != null) {
                fileServiceImpl.deleteResource(
                        "touripearl-data",
                        "uploads/activity-images",
                        fileExtractor.byteArrayToString(activity.getActivityImage().getActivityImageResourceUrl())
                );
            }
        });
    }

    @Override
    public Page<DestinationResponseDto> getAllDestinations(int page, int size, String search, Boolean active) {
        PageRequest pageRequest =PageRequest.of(page, size);
        Page<Destination> destinations;

        if (search != null && !search.trim().isEmpty()) {
            // If search term is provided, search by name or location
            if (active != null) {
                // Search with active filter
                destinations = destinationRepo.findByDestinationNameContainingIgnoreCaseOrLocationContainingIgnoreCaseAndIsActive(
                        search, search, active, pageRequest);
            } else {
                // Search without active filter
                destinations = destinationRepo.findByDestinationNameContainingIgnoreCaseOrLocationContainingIgnoreCase(
                        search, search, pageRequest);
            }
        } else if (active != null) {
            // Only filter by active status
            destinations = destinationRepo.findByIsActive(active, pageRequest);
        } else {
            // No filters
            destinations = destinationRepo.findAll(pageRequest);
        }

        return destinations.map(
                destination ->{
                    Set<DestinationImageResponseDto> imageResponseDtos = destination.getAllDestinationImages().stream()
                            .map(image -> DestinationImageResponseDto.builder()
                                    .destinationImageResourceUrl(fileExtractor.byteArrayToString(image.getDestinationImageResourceUrl()))
                                    .destinationImagePurpose(image.getDestinationImagePurpose())
                                    .build())
                            .collect(Collectors.toSet());

                    // Map activities
                    List<ActivityResponseDto> activityResponseDtos = destination.getActivities().stream()
                            .map(activity -> ActivityResponseDto.builder()
                                    .activityName(activity.getActivityName())
                                    .activityImageUrl(activity.getActivityImage() != null
                                            ? fileExtractor.byteArrayToString(activity.getActivityImage().getActivityImageResourceUrl())
                                            : null)
                                    .build())
                            .collect(Collectors.toList());

                    return DestinationResponseDto.builder()
                            .destinationId(destination.getDestinationId())
                            .destinationName(destination.getDestinationName())
                            .shortDescription(destination.getShortDescription())
                            .fullDescription(destination.getFullDescription())
                            .location(destination.getLocation())
                            .allDestinationImages(imageResponseDtos)
                            .bestTimeToVisit(destination.getBestTimeToVisit())
                            .isActive(destination.isActive())
                            .activities(activityResponseDtos)
                            .build();
                });

    }

    @Override
    public List<DestinationResponseDto> getAllDestinationsWithoutPagination() {
        List<Destination> destinations = destinationRepo.findAll();
        return destinations.stream()
                .map(destination -> {
                    return DestinationResponseDto.builder()
                            .destinationId(destination.getDestinationId())
                            .destinationName(destination.getDestinationName())
                            .shortDescription(destination.getShortDescription())
                            .fullDescription(destination.getFullDescription())
                            .location(destination.getLocation())
                            .bestTimeToVisit(destination.getBestTimeToVisit())
                            .isActive(destination.isActive())
                            .build();
                }).collect(Collectors.toList());
    }


    @Transactional
    @Override
    public void deleteSubImage(String destinationId, String imageId) {
        Destination destination = destinationRepo.findByDestinationId(destinationId)
                .orElseThrow(() -> new EntryNotFoundException("Destination not found"));

        Optional<DestinationImage> subImageOpt = destination.getAllDestinationImages().stream()
                .filter(img -> img.getDestinationImageId().equals(imageId) &&
                        img.getDestinationImagePurpose().equals(DestinationImagePurpose.SUB_IMAGE))
                .findFirst();

        if (subImageOpt.isPresent()) {
            DestinationImage subImage = subImageOpt.get();

            // Delete the file from storage
            fileServiceImpl.deleteResource(
                    "touripearl-data",
                    "uploads/destination-images",
                    fileExtractor.byteArrayToString(subImage.getDestinationImageResourceUrl())
            );

            // Remove from collection
            destination.getAllDestinationImages().remove(subImage);
            destinationRepo.save(destination);
        } else {
            throw new EntryNotFoundException("Sub image not found");
        }
    }

    @Transactional
    @Override
    public void deleteMainImage(String destinationId, String imageId) {
        Destination destination = destinationRepo.findByDestinationId(destinationId)
                .orElseThrow(() -> new EntryNotFoundException("Destination not found"));

        Optional<DestinationImage> mainImageOpt = destination.getAllDestinationImages().stream()
                .filter(img -> img.getDestinationImageId().equals(imageId) &&
                        img.getDestinationImagePurpose().equals(DestinationImagePurpose.MAIN_IMAGE))
                .findFirst();

        if (mainImageOpt.isPresent()) {
            DestinationImage mainImage = mainImageOpt.get();

            // Delete the file from storage
            fileServiceImpl.deleteResource(
                    "touripearl-data",
                    "uploads/destination-images",
                    fileExtractor.byteArrayToString(mainImage.getDestinationImageResourceUrl())
            );

            // Remove from collection
            destination.getAllDestinationImages().remove(mainImage);
            destinationRepo.save(destination);
        } else {
            throw new EntryNotFoundException("Main image not found");
        }
    }

    @Override
    public void deleteActivity(String destinationId, String activityName) {
        // Fetch the destination
        Destination destination = destinationRepo.findByDestinationId(destinationId)
                .orElseThrow(() -> new EntryNotFoundException("Destination not found"));

        // Remove the activity and its associated image
        boolean removed = destination.getActivities().removeIf(activity ->
                activity.getActivityName().equals(activityName)
        );

        // If no activity was removed, throw an exception
        if (!removed) {
            throw new EntryNotFoundException("Activity not found in the destination");
        }



        // Save the updated destination
        destinationRepo.save(destination);
    }
}
