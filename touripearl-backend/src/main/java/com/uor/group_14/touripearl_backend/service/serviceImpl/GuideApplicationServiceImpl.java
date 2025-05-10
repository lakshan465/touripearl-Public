package com.uor.group_14.touripearl_backend.service.serviceImpl;

import com.uor.group_14.touripearl_backend.dto.request.GuideApplicationRequestDto;
import com.uor.group_14.touripearl_backend.dto.request.RequestApplicationUpdateDto;
import com.uor.group_14.touripearl_backend.dto.response.ApplicationImageResponseDto;
import com.uor.group_14.touripearl_backend.dto.response.ApplicationLanguageResponseDto;
import com.uor.group_14.touripearl_backend.dto.response.GuideApplicationResponseDto;
import com.uor.group_14.touripearl_backend.dto.response.guideApplication.ApplicationStatusResponseDto;
import com.uor.group_14.touripearl_backend.entity.applicationUser.ApplicationUser;
import com.uor.group_14.touripearl_backend.entity.guideApplication.ApplicationImage;
import com.uor.group_14.touripearl_backend.entity.guideApplication.ApplicationLanguage;
import com.uor.group_14.touripearl_backend.entity.guideApplication.GuideApplication;
import com.uor.group_14.touripearl_backend.entity.enumEntity.ApplicationStatus;
import com.uor.group_14.touripearl_backend.entity.enumEntity.ImagePurpose;
import com.uor.group_14.touripearl_backend.exception.DuplicateEntryException;
import com.uor.group_14.touripearl_backend.exception.EntryNotFoundException;
import com.uor.group_14.touripearl_backend.repository.ApplicationUserRepository;
import com.uor.group_14.touripearl_backend.repository.GuideApplicationRepo;
import com.uor.group_14.touripearl_backend.service.GuideApplicationService;
import com.uor.group_14.touripearl_backend.service.GuideEmailService;
import com.uor.group_14.touripearl_backend.util.CommonFileSavedBinaryDataDto;
import com.uor.group_14.touripearl_backend.util.FileExtractor;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.data.domain.Page;

import java.io.IOException;
import java.sql.SQLException;
import java.util.*;
import java.util.stream.Collectors;

import static java.util.UUID.randomUUID;

@Service
@RequiredArgsConstructor
public class GuideApplicationServiceImpl implements GuideApplicationService {
    private final GuideApplicationRepo guideApplicationRepo;
    private final FileServiceImpl fileServiceImpl;
    private final GuideServiceImpl guideServiceImpl;
    private final FileExtractor fileExtractor;
    private final GuideEmailService guideEmailService;
    private final ApplicationUserRepository userRepository;
    @Override
    @Transactional
    public String submitApplication(MultipartFile NICImageFront,
                                    MultipartFile NICImageBack,
                                    MultipartFile licenseImageFront,
                                    MultipartFile licenseImageBack,
                                    MultipartFile profileImage,
                                    GuideApplicationRequestDto guideApplicationRequestDto)
            throws SQLException, IOException {
        Optional<GuideApplication> existGuideApplication = guideApplicationRepo.findByEmail(guideApplicationRequestDto.getEmail());
        Optional<ApplicationUser> user = userRepository.findByEmail(guideApplicationRequestDto.getEmail());
        if (user.isPresent()){
            throw new DuplicateEntryException("An Account is associate with this email");
        }
        if (existGuideApplication.isPresent()) {
            throw new DuplicateEntryException("An application was submitted with this email");
        }
        if (NICImageFront == null || NICImageBack == null) {
            throw new EntryNotFoundException("Please Provide An Id Image");
        }

        CommonFileSavedBinaryDataDto NICFrontFileSavedBinaryDataDto = fileServiceImpl.createResource(NICImageFront, "uploads/guideApplication/", "touripearl-data");
        CommonFileSavedBinaryDataDto NICBackFileSavedBinaryDataDto = fileServiceImpl.createResource(NICImageBack, "uploads/guideApplication/", "touripearl-data");
        CommonFileSavedBinaryDataDto LicenseFrontFileSavedBinaryDataDto = licenseImageFront != null ? fileServiceImpl.createResource(licenseImageFront, "uploads/guideApplication/", "touripearl-data") : null;
        CommonFileSavedBinaryDataDto LicenseBackFileSavedBinaryDataDto = licenseImageBack != null ? fileServiceImpl.createResource(licenseImageBack, "uploads/guideApplication/", "touripearl-data") : null;
        CommonFileSavedBinaryDataDto ProfileFileSavedBinaryDataDto = profileImage != null ? fileServiceImpl.createResource(profileImage, "uploads/guideApplication/", "touripearl-data") : null;

        GuideApplication guideApplication = GuideApplication.builder()
                .guideApplicationId(randomUUID().toString())
                .firstname(guideApplicationRequestDto.getFirstname())
                .lastname(guideApplicationRequestDto.getLastname())
                .email(guideApplicationRequestDto.getEmail())
                .gender(guideApplicationRequestDto.getGender())
                .birthday(guideApplicationRequestDto.getBirthday())
                .nationality(guideApplicationRequestDto.getNationality())
                .country(guideApplicationRequestDto.getCountry())
                .state(guideApplicationRequestDto.getState())
                .street(guideApplicationRequestDto.getStreet())
                .city(guideApplicationRequestDto.getCity())
                .postalCode(guideApplicationRequestDto.getPostalCode())
                .phone(guideApplicationRequestDto.getPhone())
                .biography(guideApplicationRequestDto.getBiography())
                .interests(guideApplicationRequestDto.getInterests())
                .workingAreas(guideApplicationRequestDto.getWorkingAreas())
                .workingDays(guideApplicationRequestDto.getWorkingDays())
                .extraInformation(guideApplicationRequestDto.getExtraInformation())
                .hasLicense(guideApplicationRequestDto.isHasLicense())
                .feedbackMessage(guideApplicationRequestDto.getFeedbackMessage())
                .applicationStatus(ApplicationStatus.PENDING)
                .build();
        Set<ApplicationLanguage> languages = guideApplicationRequestDto.getApplicationLanguages().stream()
                .map(language -> {
                            return ApplicationLanguage.builder()
                                    .languageId(randomUUID().toString())
                                    .languageLevel(language.getLanguageLevel())
                                    .languageName(language.getLanguageName())
                                    .guideApplication(guideApplication)
                                    .build();
                        }
                ).collect(Collectors.toSet());
        guideApplication.setLanguages(languages);

        Set<ApplicationImage> applicationImages = new HashSet<>();
        applicationImages.add(
                ApplicationImage.builder()
                        .imageId(UUID.randomUUID().toString())
                        .hash(fileExtractor.blobToByteArray(NICFrontFileSavedBinaryDataDto.getHash()))
                        .directory(NICFrontFileSavedBinaryDataDto.getDirectory().getBytes())
                        .resourceUrl(fileExtractor.blobToByteArray(NICFrontFileSavedBinaryDataDto.getResourceUrl()))
                        .purpose(ImagePurpose.NIC_IMAGE_FRONT)
                        .guideApplication(guideApplication)
                        .build()
        );

        applicationImages.add(
                ApplicationImage.builder()
                        .imageId(UUID.randomUUID().toString())
                        .hash(fileExtractor.blobToByteArray(NICBackFileSavedBinaryDataDto.getHash()))
                        .directory(NICBackFileSavedBinaryDataDto.getDirectory().getBytes())
                        .resourceUrl(fileExtractor.blobToByteArray(NICBackFileSavedBinaryDataDto.getResourceUrl()))
                        .purpose(ImagePurpose.NIC_IMAGE_BACK)
                        .guideApplication(guideApplication)
                        .build()
        );
        if (LicenseFrontFileSavedBinaryDataDto != null) {
            applicationImages.add(
                    ApplicationImage.builder()
                            .imageId(UUID.randomUUID().toString())
                            .hash(fileExtractor.blobToByteArray(LicenseFrontFileSavedBinaryDataDto.getHash()))
                            .directory(LicenseFrontFileSavedBinaryDataDto.getDirectory().getBytes())
                            .resourceUrl(fileExtractor.blobToByteArray(LicenseFrontFileSavedBinaryDataDto.getResourceUrl()))
                            .purpose(ImagePurpose.LICENSE_IMAGE_FRONT)
                            .guideApplication(guideApplication)
                            .build()
            );

        }

        if (LicenseBackFileSavedBinaryDataDto != null) {
            applicationImages.add(
                    ApplicationImage.builder()
                            .imageId(UUID.randomUUID().toString())
                            .hash(fileExtractor.blobToByteArray(LicenseBackFileSavedBinaryDataDto.getHash()))
                            .directory(LicenseBackFileSavedBinaryDataDto.getDirectory().getBytes())
                            .resourceUrl(fileExtractor.blobToByteArray(LicenseBackFileSavedBinaryDataDto.getResourceUrl()))
                            .purpose(ImagePurpose.LICENSE_IMAGE_BACK)
                            .guideApplication(guideApplication)
                            .build()
            );

        }

        if (ProfileFileSavedBinaryDataDto != null) {
            applicationImages.add(
                    ApplicationImage.builder()
                            .imageId(UUID.randomUUID().toString())
                            .hash(fileExtractor.blobToByteArray(ProfileFileSavedBinaryDataDto.getHash()))
                            .directory(ProfileFileSavedBinaryDataDto.getDirectory().getBytes())
                            .resourceUrl(fileExtractor.blobToByteArray(ProfileFileSavedBinaryDataDto.getResourceUrl()))
                            .purpose(ImagePurpose.PROFILE_IMAGE)
                            .guideApplication(guideApplication)
                            .build()
            );
        }
        guideApplication.setApplicationImages(applicationImages);
        try {
            guideApplicationRepo.save(guideApplication);
        } catch (DataIntegrityViolationException e) {
            throw new DataIntegrityViolationException(e.getMessage());
        }
        return guideApplication.getGuideApplicationId();
    }

    @Override
    public GuideApplicationResponseDto findById(String id) {
        Optional<GuideApplication> selectedGuideApplication = guideApplicationRepo.findById(id);
        if (selectedGuideApplication.isEmpty()) {
            throw new EntryNotFoundException("This Application is not found");
        }
        Set<ApplicationLanguageResponseDto> applicationLanguageResponseDtos = selectedGuideApplication.get().getLanguages()
                .stream().map(languagedto -> {
                    return ApplicationLanguageResponseDto.builder()
                            .languageName(languagedto.getLanguageName())

                            .languageLevel(languagedto.getLanguageLevel())
                            .build();
                }).collect(Collectors.toSet());
        Set<ApplicationImageResponseDto> applicationImageResponseDtos = selectedGuideApplication.get().getApplicationImages()
                .stream().map(
                        applicationImage -> {
                            return ApplicationImageResponseDto.builder()
                                    .resourceUrl(fileExtractor.byteArrayToString(applicationImage.getResourceUrl()))
                                    .purpose(applicationImage.getPurpose())
                                    .build();
                        }
                ).collect(Collectors.toSet());
        return GuideApplicationResponseDto.builder()
                .guideApplicationId(selectedGuideApplication.get().getGuideApplicationId())
                .firstname(selectedGuideApplication.get().getFirstname())
                .lastname(selectedGuideApplication.get().getLastname())
                .email(selectedGuideApplication.get().getEmail())
                .gender(selectedGuideApplication.get().getGender())
                .birthday(selectedGuideApplication.get().getBirthday())
                .nationality(selectedGuideApplication.get().getNationality())
                .country(selectedGuideApplication.get().getCountry())
                .postalCode(selectedGuideApplication.get().getPostalCode())
                .phone(selectedGuideApplication.get().getPhone())
                .biography(selectedGuideApplication.get().getBiography())
                .applicationLanguages(applicationLanguageResponseDtos)
                .interests(selectedGuideApplication.get().getInterests())
                .workingAreas(selectedGuideApplication.get().getWorkingAreas())
                .workingDays(selectedGuideApplication.get().getWorkingDays())
                .extraInformation(selectedGuideApplication.get().getExtraInformation())
                .hasLicense(selectedGuideApplication.get().isHasLicense())
                .applicationImages(applicationImageResponseDtos)
                .feedbackMessage(selectedGuideApplication.get().getFeedbackMessage())
                .applicationStatus(selectedGuideApplication.get().getApplicationStatus())
                .build();
    }

    @Override
    public void create(RequestApplicationUpdateDto dto) {
        Optional<GuideApplication> guideApplication = guideApplicationRepo.findById(dto.getGuideApplicationId());
        if (guideApplication.isEmpty()) {
            throw new EntryNotFoundException("GuideApplication not found");
        }
        String password =guideServiceImpl.create(guideApplication.get());//.get() use to unwrap the Optional
        // its Optional<GuideApplication>  not just GuideApplication if so then its okay to use
        //guideServiceImpl.create(guideApplication); this way
        guideEmailService.sendMail(guideApplication.get(),password);
    }

    public void deleteGuideApplication(RequestApplicationUpdateDto dto) {
        // Find the GuideApplication by its ID
        String guideApplicationId = dto.getGuideApplicationId();

        // Check if the guide application exists
        GuideApplication guideApplication = guideApplicationRepo.findById(guideApplicationId)
                .orElseThrow(() -> new IllegalArgumentException("GuideApplication with ID " + guideApplicationId + " not found"));

        // Delete the guide application
        guideApplicationRepo.delete(guideApplication);
    }

    @Override
    public ApplicationStatusResponseDto getStatus(String id) {
        Optional<GuideApplication> guideApplication = guideApplicationRepo.findById(id);
        if (guideApplication.isEmpty()) {
            throw new EntryNotFoundException("Guide application not found with ID: " + id);
        }

        return ApplicationStatusResponseDto.builder()
                .lastName(guideApplication.get().getLastname())
                .firstName(guideApplication.get().getFirstname())
                .status(guideApplication.get().getApplicationStatus())
                .email(guideApplication.get().getEmail())
                .build();
    }

    @Override
    public Map<String, Long> getApplicationCounts() {
        return Map.of(
                ApplicationStatus.PENDING.toString(), guideApplicationRepo.countByApplicationStatus(ApplicationStatus.PENDING),
                ApplicationStatus.APPROVED.toString(), guideApplicationRepo.countByApplicationStatus(ApplicationStatus.APPROVED),
                ApplicationStatus.REJECTED.toString(), guideApplicationRepo.countByApplicationStatus(ApplicationStatus.REJECTED),
                "ALL", guideApplicationRepo.countByApplicationStatus(null)
        );
    }


    public void updateApplicationStatus(RequestApplicationUpdateDto dto) {
        // Fetch the GuideApplication by its ID
        GuideApplication guideApplication = guideApplicationRepo.findByGuideApplicationId(dto.getGuideApplicationId())
                .orElseThrow(() -> new EntryNotFoundException("Guide application not found with ID: " + dto.getGuideApplicationId()));

        // Update the application status
        ApplicationStatus status;
        try {
            status = ApplicationStatus.valueOf(dto.getApplicationStatus().toUpperCase());
        } catch (IllegalArgumentException e) {
            throw new IllegalArgumentException("Invalid application status: " + dto.getApplicationStatus());
        }
        guideApplication.setApplicationStatus(status);

        // Save the updated entity
        guideApplicationRepo.save(guideApplication);
    }

    //getAllApplications
    public Page<GuideApplicationResponseDto> findAll(Pageable pageable) {
        Page<GuideApplication> guideApplications = guideApplicationRepo.findAll(pageable); // Fetch paginated data
        return guideApplications.map(guideApplication -> {
            // Map applicationLanguages
            Set<ApplicationLanguageResponseDto> applicationLanguageResponseDtos = guideApplication.getLanguages()
                    .stream().map(languagedto ->
                            ApplicationLanguageResponseDto.builder()
                                    .languageName(languagedto.getLanguageName())
                                    .languageLevel(languagedto.getLanguageLevel())
                                    .build()
                    ).collect(Collectors.toSet());

            // Map applicationImages
            Set<ApplicationImageResponseDto> applicationImageResponseDtos = guideApplication.getApplicationImages()
                    .stream().map(applicationImage ->
                            ApplicationImageResponseDto.builder()
                                    .resourceUrl(fileExtractor.byteArrayToString(applicationImage.getResourceUrl()))
                                    .purpose(applicationImage.getPurpose())
                                    .build()
                    ).collect(Collectors.toSet());

            // Build GuideApplicationResponseDto
            return GuideApplicationResponseDto.builder()
                    .guideApplicationId(guideApplication.getGuideApplicationId())
                    .firstname(guideApplication.getFirstname())
                    .lastname(guideApplication.getLastname())
                    .email(guideApplication.getEmail())
                    .gender(guideApplication.getGender())
                    .birthday(guideApplication.getBirthday())
                    .nationality(guideApplication.getNationality())
                    .country(guideApplication.getCountry())
                    .postalCode(guideApplication.getPostalCode())
                    .phone(guideApplication.getPhone())
                    .biography(guideApplication.getBiography())
                    .applicationLanguages(applicationLanguageResponseDtos)
                    .interests(guideApplication.getInterests())
                    .workingAreas(guideApplication.getWorkingAreas())
                    .workingDays(guideApplication.getWorkingDays())
                    .extraInformation(guideApplication.getExtraInformation())
                    .hasLicense(guideApplication.isHasLicense())
                    .applicationImages(applicationImageResponseDtos)
                    .feedbackMessage(guideApplication.getFeedbackMessage())
                    .applicationStatus(guideApplication.getApplicationStatus())
                    .build();
        });
    }

    //getFiltered application by default its send pending
    public Page<GuideApplicationResponseDto> getPendingApplications(int page, String status) {
        Pageable pageable = PageRequest.of(page, 7);  // 7 items per page
        ApplicationStatus applicationStatus;
        if ("PENDING".equals(status)) {
            applicationStatus = ApplicationStatus.PENDING;

        } else if ("APPROVED".equals(status)) {
            applicationStatus = ApplicationStatus.APPROVED;

        } else {
            applicationStatus = ApplicationStatus.REJECTED;

        }

        Page<GuideApplication> guideApplications = guideApplicationRepo.findAllByApplicationStatus(applicationStatus, pageable);
        return guideApplications.map(guideApplication -> {
            // Map applicationLanguages
            Set<ApplicationLanguageResponseDto> applicationLanguageResponseDtos = guideApplication.getLanguages()
                    .stream().map(languagedto ->
                            ApplicationLanguageResponseDto.builder()
                                    .languageName(languagedto.getLanguageName())
                                    .languageLevel(languagedto.getLanguageLevel())
                                    .build()
                    ).collect(Collectors.toSet());

            // Map applicationImages
            Set<ApplicationImageResponseDto> applicationImageResponseDtos = guideApplication.getApplicationImages()
                    .stream().map(applicationImage ->
                            ApplicationImageResponseDto.builder()
                                    .resourceUrl(fileExtractor.byteArrayToString(applicationImage.getResourceUrl()))
                                    .purpose(applicationImage.getPurpose())
                                    .build()
                    ).collect(Collectors.toSet());

            // Build GuideApplicationResponseDto
            return GuideApplicationResponseDto.builder()
                    .guideApplicationId(guideApplication.getGuideApplicationId())
                    .firstname(guideApplication.getFirstname())
                    .lastname(guideApplication.getLastname())
                    .email(guideApplication.getEmail())
                    .gender(guideApplication.getGender())
                    .birthday(guideApplication.getBirthday())
                    .nationality(guideApplication.getNationality())
                    .country(guideApplication.getCountry())
                    .postalCode(guideApplication.getPostalCode())
                    .phone(guideApplication.getPhone())
                    .biography(guideApplication.getBiography())
                    .applicationLanguages(applicationLanguageResponseDtos)
                    .interests(guideApplication.getInterests())
                    .workingAreas(guideApplication.getWorkingAreas())
                    .workingDays(guideApplication.getWorkingDays())
                    .extraInformation(guideApplication.getExtraInformation())
                    .hasLicense(guideApplication.isHasLicense())
                    .applicationImages(applicationImageResponseDtos)
                    .feedbackMessage(guideApplication.getFeedbackMessage())
                    .applicationStatus(guideApplication.getApplicationStatus())
                    .build();
        });


    }

}





