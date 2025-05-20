package com.uor.group_14.touripearl_backend.service.serviceImpl;

import com.uor.group_14.touripearl_backend.dto.request.TouristChangeDataRequestDto;
import com.uor.group_14.touripearl_backend.dto.request.TouristRequestDto;
import com.uor.group_14.touripearl_backend.dto.response.ProfileImageResponseDto;
import com.uor.group_14.touripearl_backend.dto.response.TouristResponseDto;
import com.uor.group_14.touripearl_backend.entity.applicationUser.ApplicationUser;
import com.uor.group_14.touripearl_backend.entity.Tourist;
import com.uor.group_14.touripearl_backend.entity.applicationUser.ProfileImage;
import com.uor.group_14.touripearl_backend.entity.applicationUser.UserRole;
import com.uor.group_14.touripearl_backend.exception.DuplicateEntryException;
import com.uor.group_14.touripearl_backend.exception.EntryNotFoundException;
import com.uor.group_14.touripearl_backend.repository.ApplicationUserRepository;
import com.uor.group_14.touripearl_backend.repository.ProfileImageRepository;
import com.uor.group_14.touripearl_backend.repository.TouristRepo;
import com.uor.group_14.touripearl_backend.repository.UserRoleRepository;
import com.uor.group_14.touripearl_backend.service.TouristApplicationService;
import com.uor.group_14.touripearl_backend.util.FileExtractor;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.Date;
import java.util.Optional;
import java.util.Set;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class TouristApplicationServiceImpl implements TouristApplicationService {
    private final TouristRepo touristRepo;
    private final ApplicationUserRepository userRepository;
    private final UserRoleRepository userRoleRepository;
    private final PasswordEncoder passwordEncoder;
    private final ProfileImageRepository profileImageRepository;
    private final FileExtractor fileExtractor;

    @Override
    @Transactional
    public void createTourist(TouristRequestDto dto) {
        Optional<ApplicationUser> selectedTourist = userRepository.findByEmail(dto.getEmail());

        if (selectedTourist.isPresent()) {
            throw new DuplicateEntryException("You have already account");
        }

        Set<UserRole> selectedRole = userRoleRepository.findByRoleName("ROLE_TOURIST");

        if (selectedRole.isEmpty()) {
            throw new EntryNotFoundException("ROLE_TOURIST not found!...");
        }

        ApplicationUser applicationUser =
                ApplicationUser.builder()
                        .userId(UUID.randomUUID().toString())
                        .email(dto.getEmail())
                        .password(passwordEncoder.encode(dto.getPassword()))
                        .userName(dto.getUserName())
                        .phone(dto.getPhone())
                        .userRoles(selectedRole)
                        .zipCode(dto.getZipCode())
                        .city(dto.getCity())
                        .state(dto.getState())
                        .street(dto.getStreet())
                        .country(dto.getCountry())
                        .isAccountNonExpired(true)
                        .isAccountNonLocked(true)
                        .isCredentialsNonExpired(true)
                        .isEnabled(true)
                        .createdAt(LocalDateTime.now())
                        .build();
        userRepository.save(applicationUser);

        Tourist tourist =
                Tourist.builder()
                        .propertyId(UUID.randomUUID().toString())
                        .applicationUser(applicationUser)
                        .firstName(dto.getFirstName())
                        .lastName(dto.getLastName())
                        .bio(dto.getBio())
                        .joinDate(new Date())
                        .languages(dto.getLanguages())
                        .interests(dto.getInterests().values().stream().toList())
                        .build();

        touristRepo.save(tourist);
    }

    @Override
    public void update(String id, TouristChangeDataRequestDto dto) {
        ApplicationUser selectedUser = findUser(id);

        Tourist selectedTourist = findTourist(selectedUser);

        selectedUser.setEmail(dto.getEmail());
        selectedUser.setUserName(dto.getUserName());
        selectedUser.setCountry(dto.getCountry());
        selectedUser.setStreet(dto.getStreet());
        selectedUser.setCity(dto.getCity());
        selectedUser.setState(dto.getState());
        selectedUser.setZipCode(dto.getZipCode());
        selectedUser.setPhone(dto.getPhone());

        userRepository.save(selectedUser);

        selectedTourist.setFirstName(dto.getFirstName());
        selectedTourist.setLastName(dto.getLastName());

        touristRepo.save(selectedTourist);
    }

    public TouristResponseDto getTourist(String id) {
        ApplicationUser selectedUser = findUser(id);

        Tourist selectedTourist = findTourist(selectedUser);

        return convert(selectedUser, selectedTourist);
    }

    public TouristResponseDto getTouristByPropertyId(String propertyId){
        Tourist tourist =touristRepo.findById(propertyId).orElseThrow(()->new EntryNotFoundException("Tourist not found"));
        ApplicationUser selectedUser = tourist.getApplicationUser();
        return convert(selectedUser,tourist);
    }

    private TouristResponseDto convert(ApplicationUser user, Tourist tourist) {
        if (user == null || tourist == null) {
            return null;
        }

        Optional<ProfileImage> selectedImage = profileImageRepository.findByApplicationUser(user);

        if (selectedImage.isEmpty()) {
            return TouristResponseDto.builder()
                    .firstName(tourist.getFirstName())
                    .lastName(tourist.getLastName())
                    .userName(user.getUserName())
                    .email(user.getEmail())
                    .phone(user.getPhone())
                    .zipCode(user.getZipCode())
                    .state(user.getState())
                    .street(user.getStreet())
                    .country(user.getCountry())
                    .city(user.getCity())
                    .lastActive(user.getLastActive())
                    .joinDate(user.getCreatedAt())
                    .bio(tourist.getBio())
                    .languages(tourist.getLanguages())
                    .interests(tourist.getInterests())
                    .profileImage(null)
                    .build();
        } else {

            ProfileImageResponseDto imageResponseDto = ProfileImageResponseDto.builder()
                    .hash(fileExtractor.byteArrayToString(selectedImage.get().getHash()))
                    .resourceUrl(fileExtractor.byteArrayToString(selectedImage.get().getResourceUrl()))
                    .directory(fileExtractor.byteArrayToString(selectedImage.get().getDirectory()))
                    .fileName(fileExtractor.byteArrayToString(selectedImage.get().getFileName()))
                    .propertyId(selectedImage.get().getPropertyId())
                    .build();

            return TouristResponseDto.builder()
                    .firstName(tourist.getFirstName())
                    .lastName(tourist.getLastName())
                    .userName(user.getUserName())
                    .email(user.getEmail())
                    .phone(user.getPhone())
                    .zipCode(user.getZipCode())
                    .state(user.getState())
                    .street(user.getStreet())
                    .country(user.getCountry())
                    .city(user.getCity())
                    .lastActive(user.getLastActive())
                    .joinDate(user.getCreatedAt())
                    .profileImage(imageResponseDto)
                    .bio(tourist.getBio())
                    .languages(tourist.getLanguages())
                    .interests(tourist.getInterests())
                    .build();
        }
    }

    private ApplicationUser findUser(String id) {
        Optional<ApplicationUser> selectedUser = userRepository.findById(id);

        if (selectedUser.isEmpty()) {
            throw new EntryNotFoundException(String.format("user id %s not found", id));
        }

        return selectedUser.get();
    }

    private Tourist findTourist(ApplicationUser user) {
        Optional<Tourist> selectedTourist = touristRepo.findByApplicationUser_Email(user.getEmail());

        if (selectedTourist.isEmpty()) {
            throw new EntryNotFoundException(String.format("email %s not found", user.getEmail()));
        }

        return selectedTourist.get();
    }
}
