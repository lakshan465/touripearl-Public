package com.uor.group_14.touripearl_backend.service.serviceImpl;

import com.uor.group_14.touripearl_backend.dto.request.tourist.CuztomTourDTO;
import com.uor.group_14.touripearl_backend.dto.request.tourist.SaveConfirmTourReqDto;
import com.uor.group_14.touripearl_backend.dto.response.CustomTourResponseDto;
import com.uor.group_14.touripearl_backend.entity.ConfirmCustomTour;
import com.uor.group_14.touripearl_backend.entity.CustomTour;
import com.uor.group_14.touripearl_backend.entity.CustomTourMargin;
import com.uor.group_14.touripearl_backend.entity.Tourist;
import com.uor.group_14.touripearl_backend.entity.applicationUser.ApplicationUser;
import com.uor.group_14.touripearl_backend.entity.guide.Guide;
import com.uor.group_14.touripearl_backend.exception.EntryNotFoundException;
import com.uor.group_14.touripearl_backend.repository.*;
import com.uor.group_14.touripearl_backend.service.CustomTourService;
import com.uor.group_14.touripearl_backend.service.serviceImpl.CustomTourPriceCalculation.*;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Pageable;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import com.uor.group_14.touripearl_backend.entity.guide.GuideTour;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;


@Service
@RequiredArgsConstructor
public class CustomTourServiceImpl implements CustomTourService {
    private final CustomTourRepo tourRepository;
    private final ApplicationUserRepository applicationUserRepository;
    private final GuideTourRepo guideTourRepo;
    private final CustomTourRepo customTourRepo;
    private final CusTourMarginRepo customTourMarginRepository;
    private final GuideRepo guideRepo;
    private final TouristRepo touristRepo;
    private final ConfirmCustomTourRepo confirmCustomTourRepo;


    double basicCost, accommaodationService, vehicleService, bookingTicketService, guideService;

    public double calculate(CuztomTourDTO dto) {//no need
        Tour tour = new BasicCustomTour(1000.0);
        basicCost = tour.getCost();
        System.out.println(basicCost);

        tour = new GuideWithHotel(tour, dto.isAccommodation());
        accommaodationService = tour.getCost() - basicCost;
        System.out.println(basicCost);

        tour = new GuideWithCar(tour, dto.isGuideWithVehicle());
        vehicleService = tour.getCost() - accommaodationService - basicCost;
        System.out.println(basicCost);

        tour = new GuideBookVisit(tour, dto.isGuideNeedToBookTicket());
        bookingTicketService = tour.getCost() - vehicleService - accommaodationService - basicCost;
        System.out.println(basicCost);

        tour = new TourTimePeriod(tour, dto.getStartDate(), dto.getEndDate());

        tour = new NumberOfPlaces(tour, dto.getPlacesToVisit().size());

        tour = new NumberOfActivity(tour, dto.getActivities().size());
        guideService = tour.getCost() - bookingTicketService - vehicleService - accommaodationService - basicCost;
        System.out.println(basicCost);

        return tour.getCost();
    }

    public CustomTour createCustomTour(CuztomTourDTO dto) {//no need
        Optional<Tourist> tourist = touristRepo.findByApplicationUser_Email(SecurityContextHolder.getContext().getAuthentication().getName());

        if (tourist.isEmpty()) {

            throw new EntryNotFoundException("Tourist not found");
        }
        // Convert the date to the correct format (yyyy-MM-dd)
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd");


        CustomTour tour = CustomTour.builder().title(dto.getTitle()).description(dto.getDescription()).
                startDate(formatDate(dto.getStartDate(), formatter)).endDate(formatDate(dto.getEndDate(), formatter)).
                travelers(dto.getTravelers()).pickupLocation(dto.getPickupLocation()).language(dto.getLanguage()).
                placesToVisit(dto.getPlacesToVisit()).activities(dto.getActivities()).specialAttractions(dto.
                        getSpecialAttractions()).cost(calculate(dto)).accommodationType(dto.getAccommodationType()).
                transport(dto.getTransport()).accommodationIncluded(dto.isAccommodation()).guideWithVehicle(dto.
                        isGuideWithVehicle()).experienceLevel(dto.getExperienceLevel()).genderPreference(dto.
                        getGenderPreference()).specializedGuide(dto.getSpecializedGuide()).
                upon_arrival(dto.isUpon_arrival()).accessibility(dto.getAccessibility()).
                customRequests(dto.getCustomRequests()).guideNeedToBookTicket(dto.isGuideNeedToBookTicket()).
                tourist(tourist.get()).basicCost(basicCost).accommaodationService(accommaodationService).
                vehicleService(vehicleService).bookingTicketService(bookingTicketService).guideService(guideService).build();
        return tourRepository.save(tour);
    }

    // Helper method to format the date
    private String formatDate(String date, DateTimeFormatter formatter) {
        if (date != null && !date.isEmpty()) {
            // Handle the case where the date is in the "yyyy-MM-dd'T'HH:mm" format
            DateTimeFormatter inputFormatter = DateTimeFormatter.ofPattern("yyyy-MM-dd'T'HH:mm");
            LocalDateTime localDateTime = LocalDateTime.parse(date, inputFormatter);

            // Extract only the date part and format it as "yyyy-MM-dd"
            return localDateTime.toLocalDate().format(formatter);
        }
        return null; // If date is empty, return null
    }


    //    public List<Long> getTourIdsByGuideId(String guideId) {
//        List<GuideTour> guideTours = guideTourRepo.findByGuideId(guideId);
//        List<ConfirmCustomTour> confirmCustomTours = confirmCustomTourRepo.findByGuideIdc(guideId);
//                //guideTourRepo need to change as confirm custom tour repo
//        System.out.println("Raw results from DB for guide " + guideId + ": " + guideTours);
//        System.out.println("Raw results from DB for guide " + guideId + ": " + confirmCustomTours);
//
//        List<Long> tourIds = guideTours.stream().map(GuideTour::getTourId).collect(Collectors.toList());
//
//        //System.out.println("Tour IDs for guide " + guideId + ": " + tourIds);
//        return tourIds;
//    }
    public List<Long> getTourIdsByGuideId(String guideId) {
        // Fetch only from ConfirmCustomTour repo
        List<ConfirmCustomTour> confirmCustomTours = confirmCustomTourRepo.findByGuideIdc(guideId);

        System.out.println("Raw results from DB for guide " + guideId + ": " + confirmCustomTours);

        // Map to just the tour IDs
        List<Long> tourIds = confirmCustomTours.stream()
                .map(ConfirmCustomTour::getTourIdc)
                .collect(Collectors.toList());

        System.out.println("Tour IDs for guide " + guideId + ": " + tourIds);

        return tourIds;
    }


    // Method to get the tour dates for the guide (3)-
    public List<Map<String, String>> getTourDatesByGuideId(String guideId) {
//        List<Long> tourIds = getTourIdsByGuideId(guideId);
//        List<CustomTour> customTours = customTourRepo.findByIdIn(tourIds);
        List<ConfirmCustomTour> confirmCustomTours = confirmCustomTourRepo.findByGuideIdc(guideId);

        List<Map<String, String>> result = confirmCustomTours.stream().map(customTour -> {
            Map<String, String> tourDates = new HashMap<>();
            tourDates.put("tourId", customTour.getTourIdc().toString());
            tourDates.put("startDate", customTour.getStartDatec());
            tourDates.put("endDate", customTour.getEndDatec());
            //  Console log the result
            System.out.println("Tour Dates for Guide ID " + guideId + ": " + tourDates.get("tourIdc")+tourDates.get("startDate")+tourDates.get("endDate"));
            return tourDates;
        }).collect(Collectors.toList());
        return result;
    }


    // Method to get all tour dates
    public List<Map<String, String>> getAllTourDates() {
        List<CustomTour> allCustomTours = customTourRepo.findAll();

        return allCustomTours.stream().map(customTour -> {
            Map<String, String> tourDates = new HashMap<>();
            tourDates.put("tourId", customTour.getId().toString());
            tourDates.put("startDate", customTour.getStartDate());
            tourDates.put("endDate", customTour.getEndDate());
            return tourDates;
        }).collect(Collectors.toList());
    }

    // Method to check for overlapping tours (2)-
    public List<Long> findNonOverlappingTours(String guideId) {
        List<Map<String, String>> guideBookTour = getTourDatesByGuideId(guideId); //(3)-
        List<Map<String, String>> allTour = getAllTourDates();

        //System.out.println("Guide Booked Tours for Guide ID " + guideId + ": " + guideBookTour);
        //System.out.println("All Available Tours: " + allTour);

        List<Long> nonOverlappingTourIds = new ArrayList<>();

        for (Map<String, String> allTourMap : allTour) {
            Long allTourId = Long.parseLong(allTourMap.get("tourId"));
            LocalDate allTourStartDate = parseDate(allTourMap.get("startDate"));
            LocalDate allTourEndDate = parseDate(allTourMap.get("endDate"));

            boolean overlapFound = false;

            for (Map<String, String> guideTourMap : guideBookTour) {
                Long guideTourId = Long.parseLong(guideTourMap.get("tourId"));
                LocalDate guideTourStartDate = parseDate(guideTourMap.get("startDate"));
                LocalDate guideTourEndDate = parseDate(guideTourMap.get("endDate"));

                //System.out.println("Comparing Tour ID " + allTourId + " with Guide's Tour ID " + guideTourId);

                if (datesOverlap(allTourStartDate, allTourEndDate, guideTourStartDate, guideTourEndDate)) {

                    overlapFound = true;
                    break;
                }
            }

            if (!overlapFound) {

                nonOverlappingTourIds.add(allTourId);
            }
        }

        //System.out.println("Final Non-Overlapping Tours for Guide ID " + guideId + ": " + nonOverlappingTourIds);

        return nonOverlappingTourIds;
    }


    // Method to fetch non-overlapping tours with full details---start  (1)-
    public Page<CustomTourResponseDto> findNonOverlappingToursAndDetails(int page, int size, String guideId2) {//need
        Optional<ApplicationUser> users = applicationUserRepository.
                findByEmail(SecurityContextHolder.getContext().getAuthentication().getName());
        if (users.isEmpty()) {
            throw new EntryNotFoundException("User not found");
        }
        Optional<Guide> guide = guideRepo.findByApplicationUser(users.get());
        if (guide.isEmpty()) {
            throw new EntryNotFoundException("Guide not found");
        }
        System.out.println("from find nonover lapping " + users);

        String guideId = guide.get().getPropertyId();

        System.out.println(guideId + "from guide ");
        System.out.println(guideId2 + "from guide 2");

        List<Long> nonOverlappingTourIds = findNonOverlappingTours(guideId2); //(2)-
        List<CustomTour> nonOverlappingTours = customTourRepo.findByIdIn(nonOverlappingTourIds);
        List<CustomTourResponseDto> tourDTOs = nonOverlappingTours.stream().//need
                map(this::convertToDTO).collect(Collectors.toList());

//        for (CustomTourResponseDto tourDTO : tourDTOs) {//need
//            System.out.println("Tour Title: " + tourDTO.getTitle() +
//                    ", Start Date: " + tourDTO.getStartDate() +
//                    ", End Date: " + tourDTO.getEndDate());
//        }

        // Step 4: Apply manual pagination
        int start = page * size;
        int end = Math.min(start + size, tourDTOs.size());

        if (start >= tourDTOs.size()) {
            return new PageImpl<>(new ArrayList<>(), PageRequest.of(page, size), tourDTOs.size());
        }

        List<CustomTourResponseDto> paginatedList = tourDTOs.subList(start, end);

        return new PageImpl<>(paginatedList, PageRequest.of(page, size), tourDTOs.size());
    }

    //Helper Method to Convert CustomTour → CuztomTourDTO
    private CustomTourResponseDto convertToDTO(CustomTour tour) {//CuztomTourDTO
        CustomTourResponseDto dto = new CustomTourResponseDto();
        dto.setTitle(tour.getTitle());
        dto.setTourId(tour.getId());
        dto.setStartDate(tour.getStartDate());
        dto.setEndDate(tour.getEndDate());
        dto.setTravelers(tour.getTravelers());
        dto.setPickupLocation(tour.getPickupLocation());
        dto.setLanguage(tour.getLanguage());
        dto.setPlacesToVisit(tour.getPlacesToVisit());
        dto.setActivities(tour.getActivities());
        dto.setCost(tour.getCost());
        dto.setSpecialAttractions(tour.getSpecialAttractions());
        dto.setAccommodationType(tour.getAccommodationType());
        dto.setTransport(tour.getTransport());
        dto.setAccommodation(tour.isAccommodationIncluded());
        dto.setGuideWithVehicle(tour.isGuideWithVehicle());
        dto.setExperienceLevel(tour.getExperienceLevel());
        dto.setGenderPreference(tour.getGenderPreference());
        dto.setSpecializedGuide(tour.getSpecializedGuide());
        dto.setUpon_arrival(tour.isUpon_arrival());
        dto.setAccessibility(tour.getAccessibility());
        dto.setCustomRequests(tour.getCustomRequests());
        dto.setGuideNeedToBookTicket(tour.isGuideNeedToBookTicket());
        dto.setBasicCost(tour.getBasicCost());
        dto.setAccommaodationService(tour.getAccommaodationService());
        dto.setVehicleService(tour.getVehicleService());
        dto.setBookingTicketService(tour.getBookingTicketService());
        dto.setGuideService(tour.getGuideService());

        // Setting Tourist ID
        if (tour.getTourist() != null) {
            dto.setTouristId(tour.getTourist().getPropertyId());
        }
        // Setting Number of Guides
        long numberOfGuides = customTourMarginRepository.countByTourId(tour.getId());
        dto.setNumberOfGuides(numberOfGuides);

        return dto;
    }


    // Helper method to parse date from String to LocalDate
    private LocalDate parseDate(String dateString) {
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd");
        return LocalDate.parse(dateString, formatter);
    }

    // Helper method to check if two date ranges overlap
    private boolean datesOverlap(LocalDate start1, LocalDate end1, LocalDate start2, LocalDate end2) {
        return (start1.isBefore(end2) || start1.isEqual(end2)) && (end1.isAfter(start2) || end1.isEqual(start2));
    }

    public Optional<Double> getMargin(String guideId, Long tourId) {
        // Check authentication context
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication != null) {
            System.out.println("Authenticated user: " + authentication.getName());
        } else {
            System.out.println("No authenticated user found.");
        }


        Optional<Double> margin = customTourMarginRepository.findMarginByGuideAndTour(guideId, tourId);

        // If no margin is found, return Optional with a default value (0.0)
        return margin.or(() -> Optional.of(0.0));
    }

    public CustomTourMargin saveMargin(CustomTourMargin customTourMargin) {

        return customTourMarginRepository.save(customTourMargin);
    }

    public void saveTour(CustomTourMargin customTourMargin) {
        GuideTour dto = new GuideTour();
        dto.setGuideId(customTourMargin.getGuideId());
        dto.setTourId(customTourMargin.getTourId());
        guideTourRepo.save(dto);

    }

    public Page<CustomTourMargin> getMarginsByGuideId(String guideId, int page, int size) {
        PageRequest pageRequest = PageRequest.of(page, size);
        return customTourMarginRepository.findByGuideId(guideId, pageRequest);
    }

    public CustomTourResponseDto getTourById(Long tourId) {
        Optional<CustomTour> tour1 = tourRepository.findById(tourId);

        if (tour1.isPresent()) {
            CustomTour tour = tour1.get(); // Extract the CustomTour object

            CustomTourResponseDto dto = new CustomTourResponseDto();
            dto.setTitle(tour.getTitle());
            dto.setTourId(tour.getId());
            dto.setStartDate(tour.getStartDate());
            dto.setEndDate(tour.getEndDate());
            dto.setTravelers(tour.getTravelers());
            dto.setPickupLocation(tour.getPickupLocation());
            dto.setLanguage(tour.getLanguage());
            dto.setPlacesToVisit(tour.getPlacesToVisit());
            dto.setActivities(tour.getActivities());
            dto.setCost(tour.getCost());
            dto.setSpecialAttractions(tour.getSpecialAttractions());
            dto.setAccommodationType(tour.getAccommodationType());
            dto.setTransport(tour.getTransport());
            dto.setAccommodation(tour.isAccommodationIncluded());
            dto.setGuideWithVehicle(tour.isGuideWithVehicle());
            dto.setExperienceLevel(tour.getExperienceLevel());
            dto.setGenderPreference(tour.getGenderPreference());
            dto.setSpecializedGuide(tour.getSpecializedGuide());
            dto.setUpon_arrival(tour.isUpon_arrival());
            dto.setAccessibility(tour.getAccessibility());
            dto.setCustomRequests(tour.getCustomRequests());
            dto.setGuideNeedToBookTicket(tour.isGuideNeedToBookTicket());
            dto.setBasicCost(tour.getBasicCost());
            dto.setAccommaodationService(tour.getAccommaodationService());
            dto.setVehicleService(tour.getVehicleService());
            dto.setBookingTicketService(tour.getBookingTicketService());
            dto.setGuideService(tour.getGuideService());

            return dto;
        } else {
            // Handle the case where the tour was not found, e.g., throw an exception or return null
            return null; // Or throw a custom exception
        }
    }

    public Page<CustomTourResponseDto> getTourByTouristId(String touristId, int page) {
        Pageable pageable = PageRequest.of(page, 6);
        Page<CustomTour> allTour = customTourRepo.findByTouristPropertyId(touristId, pageable);
        // Map CustomTour entities to CustomTourResponseDto objects

        return allTour.map(this::convertToDTO);
    }

    public void deleteCustomTour(Long id) {//and custom tour margin and guide tour
        System.out.println(id + "from deleteCustomTour");
        if (tourRepository.existsById(id)) {

            System.out.println("tour deleted successfully,testing");
//            -- temporary comments
//            tourRepository.deleteById(id);
//            customTourMarginRepository.deleteByTourId(id);

//            guideTourRepo.deleteByTourId(id);

        } else {
            throw new RuntimeException("Custom Tour not found with id: " + id);
        }
    }

    // Method to save a confirmation custom tour based on DTO
    public ConfirmCustomTour saveCustomTour(SaveConfirmTourReqDto saveConfirmTourReqDto) {
        ConfirmCustomTour confirmCustomTour = new ConfirmCustomTour(
                saveConfirmTourReqDto.getTourId(),
                saveConfirmTourReqDto.getStartDate(),
                saveConfirmTourReqDto.getEndDate(),
                saveConfirmTourReqDto.getTravelers(),
                saveConfirmTourReqDto.getPickupLocation(),
                saveConfirmTourReqDto.getPlacesToVisit(),
                saveConfirmTourReqDto.getSpecialAttractions(),
                saveConfirmTourReqDto.getActivities(),
                saveConfirmTourReqDto.getTransport(),
                saveConfirmTourReqDto.getAccommodationType(),
                saveConfirmTourReqDto.isAccommodation(),
                saveConfirmTourReqDto.getAccessibility(),
                saveConfirmTourReqDto.isGuideWithVehicle(),
                saveConfirmTourReqDto.getGenderPreference(),
                saveConfirmTourReqDto.getLanguage(),
                saveConfirmTourReqDto.getGuideId(),
                saveConfirmTourReqDto.getTouristId(),
                saveConfirmTourReqDto.isUponArrival(),
                saveConfirmTourReqDto.isGuideNeedToBookTicket(),
                saveConfirmTourReqDto.getBasicCost(),
                saveConfirmTourReqDto.getAccommodationService(),
                saveConfirmTourReqDto.getBookingTicketService(),
                saveConfirmTourReqDto.getVehicleService(),
                saveConfirmTourReqDto.getGuideService(),
                saveConfirmTourReqDto.getHotelCost(),
                saveConfirmTourReqDto.getVehicleCost(),
                saveConfirmTourReqDto.getVisitTicketCost(),
                saveConfirmTourReqDto.getMargin(),
                saveConfirmTourReqDto.getCost(),
                saveConfirmTourReqDto.getStarMean(),
                saveConfirmTourReqDto.getProfilePictureUrl()
        );

        return confirmCustomTourRepo.save(confirmCustomTour);
    }

    public Page<ConfirmCustomTour> getToursByTouristIdc(int page, int size) {
        Pageable pageable = PageRequest.of(page, size);
        Optional<ApplicationUser> users = applicationUserRepository.
                findByEmail(SecurityContextHolder.getContext().getAuthentication().getName());
        if (users.isEmpty()) {
            throw new EntryNotFoundException("User not found");
        }
        Optional<Tourist> tourist = touristRepo.findByApplicationUser(users.get());
        if (tourist.isEmpty()) {
            throw new EntryNotFoundException("Tourist not found");
        }
        String touristIdc = tourist.get().getPropertyId();
        return confirmCustomTourRepo.findByTouristIdc(touristIdc, pageable);
    }

    public Page<ConfirmCustomTour> getToursByGuideIdc(String guideUUID, int page, int size) {

        Pageable pageable = PageRequest.of(page, size);
        Optional<ApplicationUser> users = applicationUserRepository.findById(guideUUID);
        if (users.isEmpty()) {
            System.out.println("User not found");
            throw new EntryNotFoundException("User not found");
        }
        Optional<Guide> guide = guideRepo.findByApplicationUser(users.get());
        if (guide.isEmpty()) {
            System.out.println("Guide not found");
            throw new EntryNotFoundException("Guide not found");
        }

        return confirmCustomTourRepo.findByGuideIdc(guideUUID, pageable);
    }


}
