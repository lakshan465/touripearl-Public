package com.uor.group_14.touripearl_backend.service.serviceImpl;

import com.uor.group_14.touripearl_backend.dto.request.guide.GuideFilteringDto;
import com.uor.group_14.touripearl_backend.dto.request.guide.ProfileUpdateRequestDto;
import com.uor.group_14.touripearl_backend.dto.response.*;
import com.uor.group_14.touripearl_backend.entity.CustomTour;
import com.uor.group_14.touripearl_backend.entity.CustomTourMargin;
import com.uor.group_14.touripearl_backend.entity.Review;
import com.uor.group_14.touripearl_backend.dto.response.search.StandardSearchResponseDto;
import com.uor.group_14.touripearl_backend.entity.Tourist;
import com.uor.group_14.touripearl_backend.entity.applicationUser.ApplicationUser;
import com.uor.group_14.touripearl_backend.entity.applicationUser.ProfileImage;
import com.uor.group_14.touripearl_backend.entity.applicationUser.UserRole;
import com.uor.group_14.touripearl_backend.entity.enumEntity.ImagePurpose;
import com.uor.group_14.touripearl_backend.entity.guide.Guide;
import com.uor.group_14.touripearl_backend.entity.guideApplication.ApplicationImage;
import com.uor.group_14.touripearl_backend.entity.guideApplication.ApplicationLanguage;
import com.uor.group_14.touripearl_backend.entity.guideApplication.GuideApplication;
import com.uor.group_14.touripearl_backend.exception.EntryNotFoundException;
import com.uor.group_14.touripearl_backend.repository.*;
import com.uor.group_14.touripearl_backend.service.GuideService;
import com.uor.group_14.touripearl_backend.service.TourService;
import com.uor.group_14.touripearl_backend.service.TouristApplicationService;
import com.uor.group_14.touripearl_backend.util.FileExtractor;
import com.uor.group_14.touripearl_backend.util.SecurityUtil;
import jakarta.persistence.criteria.Predicate;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.*;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class GuideServiceImpl implements GuideService {
    private final GuideRepo guideRepo;
    private final PasswordEncoder passwordEncoder;
    private final UserRoleRepository userRoleRepository;
    private final ApplicationImageRepo applicationImageRepo;
    private final ApplicationUserRepository userRepository;
    private final FileExtractor fileExtractor;
    private final TouristApplicationService touristApplicationService;
    private final MailServiceImpl mailService;
    private final TourServiceImpl tourService;
    private final CusTourMarginRepo customTourMarginRepository;
    private final GuideRepo guideRepository;
    private final ProfileImageRepository profileImageRepository;
    private final CustomTourRepo customTourRepo;
    private final TouristRepo touristRepository;
    private final SecurityUtil securityUtil;

    @Override
    @Transactional
    public String create(GuideApplication guideApplication) {
        String password = passwordGenerate();
        // Create an application user from the guide application details
        ApplicationUser applicationUser = createApplicationUser(guideApplication, password);
        // Assign roles to the created application user
        applicationUser.setUserRoles(assignRolesToUser());
        // Set the user's profile image
        applicationUser.setProfileImage(createUserImage(guideApplication, applicationUser));

        // Create and populate the Guide object
        Guide guide = createGuide(guideApplication, applicationUser);
        // Map the application languages to the Guide
        Set<ApplicationLanguage> languages = mapLanguagesToGuide(guideApplication, guide);
        guide.setLanguages(languages);

        // Save and return the created Guide
        guideRepo.save(guide);
        //mailService.SendMail(applicationUser.getEmail(), "Application Approved", "Your application has been approved. You can now login to the system and view your profile. Thank you for your patience and support.");
        return password;
    }

    private String passwordGenerate() {
        int length = 8;
        String characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
        Random random = new Random();
        StringBuilder password = new StringBuilder(length);
        for (int i = 0; i < length; i++) {
            password.append(characters.charAt(random.nextInt(characters.length())));
        }
        return password.toString();
    }

    @Override
    public GuideDetailsResponseDto getGuideById(String id) {
        // Fetch the Guide associated with the user
        Guide guide = fetchGuideById(id);
        // Fetch the user by ID
        ApplicationUser user = guide.getApplicationUser();
        // Extract profile image URL from the user's profile
        ProfileImageResponseDto profileImageUrl = extractProfileImage(user);
        // Map the Guide's languages to the response object
        Set<ApplicationLanguageResponseDto> languages = mapLanguagesToResponse(guide);

        // Build and return the Guide details response object
        return buildGuideDetailsResponse(guide);
    }

    @Override
    public GuidePaginateResponseDto findAllGuides(String searchText, int page, int size) {
        return GuidePaginateResponseDto.builder()
                .count(guideRepo.searchCount(searchText))
                .guideDetailsList(
                        guideRepo.searchAll(searchText, PageRequest.of(page, size,
                                        Sort.by(Sort.Direction.DESC, "star_avg")))
                                .stream()
                                .map(this::buildGuideDetailsResponse)
                                .toList()
                )
                .build();
    }

    @Override
    public Map<String, Long> getGuidesByActive() {
        return Map.of(
                "nowTime", guideRepo.countByLastActive(LocalDateTime.now().minusMinutes(1)),
                "fiveMin", guideRepo.countByLastActive(LocalDateTime.now().minusMinutes(5)),
                "hour", guideRepo.countByLastActive(LocalDateTime.now().minusHours(1))
        );
    }

    @Override
    public GuideDetailsResponseDto getGuideByUser() {
        Optional<ApplicationUser> users = userRepository.findByEmail(SecurityContextHolder.getContext().getAuthentication().getName());
        if (users.isEmpty()) {
            throw new EntryNotFoundException("User not found");
        }
        Optional<Guide> guide = guideRepo.findByApplicationUser(users.get());
        if (guide.isEmpty()) {
            throw new EntryNotFoundException("Guide not found");
        }
        ApplicationUser user = guide.get().getApplicationUser();
        // Build and return the Guide details response object
        return buildGuideDetailsResponse(guide.get());
    }

    @Override
    public GuidePaginateResponseDto findAllNewGuides(String searchTxt, int page, int size) {
        return GuidePaginateResponseDto.builder()
                .count(guideRepo.searchCount(searchTxt))
                .guideDetailsList(
                        guideRepo.searchNewAll(searchTxt, PageRequest.of(page, size))
                                .stream()
                                .map(this::buildGuideDetailsResponse)
                                .toList()
                )
                .build();
    }


    @Override
    public GuideDetailsResponseDto updateMyGuideData(String uuid, ProfileUpdateRequestDto dto) {
        ApplicationUser user = fetchUserById(uuid);
        Guide guide = guideRepo.findByApplicationUser(user).orElseThrow(() -> new EntryNotFoundException("guide not found"));

        user.setCountry(dto.getCountry());
        user.setCity(dto.getCity());
        user.setState(dto.getState());
        user.setStreet(dto.getStreet());
        user.setZipCode(dto.getZipCode());
        user.setPhone(dto.getPhone());
        guide.setBiography(dto.getBiography());
        guide.setWorkingDays(dto.getWorkingDays());
        guide.setWorkingAreas(dto.getWorkingAreas());
        guide.setFirstname(dto.getFirstname());
        guide.setLastname(dto.getLastname());
        guide.setApplicationUser(user);
        Set<ApplicationLanguage> languages = dto.getGuideLanguages().stream()
                .map(
                        language -> ApplicationLanguage.builder()
                                .languageId(UUID.randomUUID().toString())
                                .languageName(language.getLanguageName())
                                .languageLevel(language.getLanguageLevel())
                                .guidelanguage(guide)
                                .build()
                ).collect(Collectors.toSet());
        guide.getLanguages().clear(); // Clear the existing languages to handle orphan removal
        guide.getLanguages().addAll(languages); // Add the new languages
        guideRepo.save(guide);

        return getGuideById(uuid);
    }

    @Override
    public Page<StandardSearchResponseDto> globalSearch(int page, int size, String keyword) {
        Pageable pageRequest = PageRequest.of(page, size);
        Page<Guide> guides = guideRepo.globalSearch(keyword, pageRequest);
        return guides.map(
                guide -> {
                    String imageUrl;
                    ProfileImageResponseDto imageResponse = extractProfileImage(guide.getApplicationUser());
                    if (imageResponse != null) {
                        imageUrl = imageResponse.getResourceUrl();
                    } else {
                        imageUrl = null;
                    }
                    return StandardSearchResponseDto.builder()
                            .propertyId(guide.getPropertyId())
                            .propertyName(guide.getFirstname() + " " + guide.getLastname())
                            .propertyImageUrl(imageUrl)
                            .build();
                }
        );
    }

    // Creates an ApplicationUser object from guide application details
    private ApplicationUser createApplicationUser(GuideApplication guideApplication, String password) {
        return ApplicationUser.builder()
                .userId(UUID.randomUUID().toString())
                .userName("guide_"+guideApplication.getFirstname())
                .phone(guideApplication.getPhone())
                .country(guideApplication.getCountry())
                .street(guideApplication.getStreet())
                .state(guideApplication.getState())
                .city(guideApplication.getCity())
                .zipCode(guideApplication.getPostalCode())
                .email(guideApplication.getEmail())
                .isAccountNonExpired(true)
                .isAccountNonLocked(true)
                .isCredentialsNonExpired(true)
                .isEnabled(true)
                .password(passwordEncoder.encode(password))
                .createdAt(LocalDateTime.now())
                .build();
    }

    // Assigns the "ROLE_GUIDE" role to the user
    private Set<UserRole> assignRolesToUser() {
        Set<UserRole> role = userRoleRepository.findByRoleName("ROLE_GUIDE");
        if (role.isEmpty()) {
            throw new EntryNotFoundException("Role not found");
        }
        return role;
    }

    // Creates a UserImage for the profile image
    private ProfileImage createUserImage(GuideApplication guideApplication, ApplicationUser applicationUser) {
        Optional<ApplicationImage> profileImage = applicationImageRepo.findByGuideApplicationAndPurpose(guideApplication, ImagePurpose.PROFILE_IMAGE);
        return profileImage.map(applicationImage -> ProfileImage.builder()
                .propertyId(UUID.randomUUID().toString())
                .hash(applicationImage.getHash())
                .resourceUrl(applicationImage.getResourceUrl())
                .directory(applicationImage.getDirectory())
                .fileName(applicationImage.getFileName())
                .applicationUser(applicationUser)
                .build()).orElse(null);

    }

    // Creates a Guide object from guide application details and the application user
    private Guide createGuide(GuideApplication guideApplication, ApplicationUser applicationUser) {
        return Guide.builder()
                .firstname(guideApplication.getFirstname())
                .gender(guideApplication.getGender())
                .hasLicense(guideApplication.isHasLicense())
                .nationality(guideApplication.getNationality())
                .lastname(guideApplication.getLastname())
                .languages(guideApplication.getLanguages())
                .biography(guideApplication.getBiography())
                .birthday(guideApplication.getBirthday())
                .applicationUser(applicationUser)
                .application(guideApplication)
                .interests(new ArrayList<>(guideApplication.getInterests()))
                .propertyId(UUID.randomUUID().toString())
                .workingAreas(new ArrayList<>(guideApplication.getWorkingAreas()))
                .workingDays(new ArrayList<>(guideApplication.getWorkingDays()))
                .build();
    }

    // Maps ApplicationLanguage objects to the Guide and associates them
    private Set<ApplicationLanguage> mapLanguagesToGuide(GuideApplication guideApplication, Guide guide) {
        return guideApplication.getLanguages().stream()
                .map(language -> ApplicationLanguage.builder()
                        .languageId(UUID.randomUUID().toString())
                        .languageName(language.getLanguageName())
                        .languageLevel(language.getLanguageLevel())
                        .guidelanguage(guide)
                        .build()
                ) // Link the language to the guide
                .collect(Collectors.toSet());
    }

    // Fetches an ApplicationUser by ID or throws an EntryNotFoundException
    private ApplicationUser fetchUserById(String id) {
        return userRepository.findById(id).orElseThrow(() -> new EntryNotFoundException("User not found"));
    }

    // Fetches a Guide
    private Guide fetchGuideById(String id) {
        return guideRepo.findById(id).orElseThrow(() -> new EntryNotFoundException("Guide not found"));
    }

    // Maps Guide languages to response DTOs
    private Set<ApplicationLanguageResponseDto> mapLanguagesToResponse(Guide guide) {
        return guide.getLanguages().stream()
                .map(language -> ApplicationLanguageResponseDto.builder()
                        .languageName(language.getLanguageName())
                        .languageLevel(language.getLanguageLevel())
                        .build())
                .collect(Collectors.toSet());
    }

    // Builds a GuideDetailsResponseDto from the user, guide, image, and languages
    private GuideDetailsResponseDto buildGuideDetailsResponse(Guide guide) {
        return GuideDetailsResponseDto.builder()
                .id(guide.getPropertyId())
                .guideLanguages(mapLanguagesToResponse(guide))
                .firstname(guide.getFirstname())
                .gender(guide.getGender())
                .hasLicense(guide.isHasLicense())
                .phone(guide.getApplicationUser().getPhone())
                .country(guide.getApplicationUser().getCountry())
                .state(guide.getApplicationUser().getState())
                .street(guide.getApplicationUser().getStreet())
                .city(guide.getApplicationUser().getCity())
                .zipCode(guide.getApplicationUser().getZipCode())
                .email(guide.getApplicationUser().getEmail())
                .biography(guide.getBiography())
                .lastname(guide.getLastname())
                .nationality(guide.getNationality())
                .profileImageUrl(extractProfileImage(guide.getApplicationUser()))
                .workingAreas(guide.getWorkingAreas())
                .workingDays(guide.getWorkingDays())
                .reviewList(setReviews(guide))
                .starMean(guide.getStarMean())
                .interests(guide.getInterests())
                .LastSeen(guide.getApplicationUser().getLastActive())
                .tours(guide.getTours().stream().map(
                        tourService::mapToTourViewResponseDto
                ).collect(Collectors.toList()))
                .build();
    }

    // Extracts and converts the profile image URL to a String
    private ProfileImageResponseDto extractProfileImage(ApplicationUser user) {
        ProfileImage profileImage = user.getProfileImage();
        if (profileImage == null) {
            return null;
        }
        return ProfileImageResponseDto.builder()
                .directory(fileExtractor.byteArrayToString(profileImage.getDirectory()))
                .propertyId(profileImage.getPropertyId())
                .fileName(fileExtractor.byteArrayToString(profileImage.getFileName()))
                .resourceUrl(fileExtractor.byteArrayToString(profileImage.getResourceUrl()))
                .build();
    }

    private List<ReviewResponseDto> setReviews(Guide g) {
        List<ReviewResponseDto> reviews = new ArrayList<>();
        for (Review r : g.getReviews()) {
            reviews.add(
                    new ReviewResponseDto(
                            r.getId(),
                            r.getRating(),
                            r.getComment(),
                            r.getCreatedAt(),
                            touristApplicationService.getTourist(r.getTourist().getApplicationUser().getUserId())
                    )
            );
        }
        return reviews;
    }

    public Page<CustomTourMarginWithGuide> getMarginAndGuidesByTourId(Long tourId, int page, int size) {
        PageRequest pageRequest = PageRequest.of(page, size);
        Page<CustomTourMargin> customTourMargins = customTourMarginRepository.findByTourId(tourId, pageRequest);

        return customTourMargins.map(margin -> {
            System.out.println(margin.getGuideId());
            Optional<Guide> guideOptional = guideRepository.findByApplicationUserId(margin.getGuideId());
            Guide guide = guideOptional.orElse(null);

            Set<ApplicationLanguageResponseDto> applicationLanguageResponseDtos = guide.getLanguages()
                    .stream().map(languagedto ->
                            ApplicationLanguageResponseDto.builder()
                                    .languageName(languagedto.getLanguageName())
                                    .languageLevel(languagedto.getLanguageLevel())
                                    .build()
                    ).collect(Collectors.toSet());

            assert guide != null;
            return new CustomTourMarginWithGuide(
                    margin.getId(),
                    margin.getTourId(),
                    margin.getMargin(),
                    margin.getVehicleCost(),
                    margin.getHotelCost(),
                    margin.getVisitTicketCost(),
                    guide.getFirstname(),
                    guide.getLastname(),
                    guide.getGender(),
                    guide.getStarMean(),
                    guide.getNationality(),
                    applicationLanguageResponseDtos,
                    guide.getWorkingAreas(),
                    guide.getWorkingDays(),
                    guide.isHasLicense(),
                    guide.getReviews(),
                    getProfileImageUrl(margin.getGuideId(),guide.getFirstname()),
                    margin.getGuideId()

            );
        });
    }

    public String getProfileImageUrl(String userId,String firstname) {
        Optional<ProfileImage> profileImage = profileImageRepository.findByApplicationUser_userId(userId);
        if (profileImage.isPresent() && profileImage.get().getResourceUrl() != null) {
            byte[] urlBytes = profileImage.get().getResourceUrl();
            return new String(urlBytes);  //  Convert byte[] to String
        }
        return "https://ui-avatars.com/api/?name="+firstname+"&size=256";
    }

    public String getTouristIdByTourId(Long tourId) {
        CustomTour customTour = customTourRepo.findById(tourId)
                .orElseThrow(() -> new RuntimeException("Custom Tour not found"));

        return customTour.getTourist().getPropertyId(); // This will return the Tourist ID
    }

    @Override
    public Page<GuideDetailsResponseDto> getGuidesByFiltering(GuideFilteringDto dto) {
        Specification<Guide> spec = (root, query, criteriaBuilder) -> {
            List<Predicate> predicates = new ArrayList<>();
            if (dto.getSearchQuery() != null && !dto.getSearchQuery().isEmpty()) {
                String searchPattern = "%" + dto.getSearchQuery().toLowerCase() + "%";
                Predicate namePredicate = criteriaBuilder.like(criteriaBuilder.lower(root.get("firstname")), searchPattern);
                Predicate locationPredicate = criteriaBuilder.like(criteriaBuilder.lower(root.get("applicationUser").get("city")), searchPattern);
                predicates.add(criteriaBuilder.or(namePredicate, locationPredicate));
            }
            if (dto.getLanguages() != null && !dto.getLanguages().isEmpty()) {
                predicates.add(root.join("languages").get("languageName").in(dto.getLanguages()));
            }
            if (dto.getInterests() != null && !dto.getInterests().isEmpty()){
                predicates.add(root.join("interests").in(dto.getInterests()));
            }
            return criteriaBuilder.and(predicates.toArray(new Predicate[0]));
        };

            if(dto.getSort() !=null) {
                switch (dto.getSort()) {
                    case "rating":
                        return guideRepo.findAll(spec, PageRequest.of(dto.getPage(), dto.getSize(), Sort.by(Sort.Direction.DESC, "starMean"))).map(this::buildGuideDetailsResponse);

                    case "recommended":
                        try {
                            ApplicationUser currentUser = securityUtil.getCurrentUser();
                            if (currentUser != null && touristRepository.findByApplicationUser(currentUser).isPresent()) {
                                Tourist tourist = touristRepository.findByApplicationUser(currentUser).get();

                                // Get all guides that match the specification
                                Page<Guide> matchingGuides = guideRepo.findAll(spec, PageRequest.of(dto.getPage(), dto.getSize(), Sort.by(Sort.Direction.DESC, "starMean")));

                                // Sort guides by interest similarity
                                List<Guide> sortedGuides = matchingGuides.stream()
                                        .sorted((guide1, guide2) -> {
                                            // Count matching interests for guide1
                                            long matchingInterestsCount1 = guide1.getInterests().stream()
                                                    .filter(interest -> tourist.getInterests().contains(interest))
                                                    .count();

                                            // Count matching interests for guide2
                                            long matchingInterestsCount2 = guide2.getInterests().stream()
                                                    .filter(interest -> tourist.getInterests().contains(interest))
                                                    .count();

                                            // First sort by matching interests count (descending)
                                            int interestComparison = Long.compare(matchingInterestsCount2, matchingInterestsCount1);
                                            if (interestComparison != 0) {
                                                return interestComparison;
                                            }

                                            // If same number of matching interests, sort by rating (descending)
                                            return Double.compare(guide2.getStarMean(), guide1.getStarMean());
                                        })
                                        .collect(Collectors.toList());

                                // Create a pageable result from the sorted list
                                int start = (int) dto.getPage() * dto.getSize();
                                int end = Math.min((start + dto.getSize()), sortedGuides.size());

                                // Handle out of bounds
                                if (start >= sortedGuides.size()) {
                                    List<Guide> emptyGuideList = new ArrayList<>();
                                    return new PageImpl<>(
                                            emptyGuideList,
                                            PageRequest.of(dto.getPage(), dto.getSize()),
                                            sortedGuides.size()
                                    ).map(this::buildGuideDetailsResponse);
                                }

                                List<Guide> pageContent = sortedGuides.subList(start, end);
                                return new PageImpl<>(
                                        pageContent,
                                        PageRequest.of(dto.getPage(), dto.getSize()),
                                        sortedGuides.size()
                                ).map(this::buildGuideDetailsResponse);
                            }
                        } catch (EntryNotFoundException e) {
                            // Fall through to default sorting if user not found or not a tourist
                        }
                    default:
                        return guideRepo.findAll(spec, PageRequest.of(dto.getPage(), dto.getSize(), Sort.by(Sort.Direction.DESC, "starMean"))).map(this::buildGuideDetailsResponse);

                }
            }else {
                return guideRepo.findAll(spec, PageRequest.of(dto.getPage(), dto.getSize(), Sort.by(Sort.Direction.DESC, "starMean"))).map(this::buildGuideDetailsResponse);
            }
    }

    public String getUUIdByTourId(Long tourId) {
        Tourist tourist = touristRepository.findByPropertyId(getTouristIdByTourId(tourId))
                .orElseThrow(() -> new RuntimeException("Tourist not found"));

        return tourist.getApplicationUser().getUserId(); // Get User UUID
    }




}