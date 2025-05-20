package com.uor.group_14.touripearl_backend.api;

import com.uor.group_14.touripearl_backend.dto.request.guide.GuideFilteringDto;
import com.uor.group_14.touripearl_backend.dto.request.guide.ProfileUpdateRequestDto;
import com.uor.group_14.touripearl_backend.dto.request.tourist.CuztomTourDTO;
import com.uor.group_14.touripearl_backend.dto.response.CustomTourResponseDto;
import com.uor.group_14.touripearl_backend.dto.response.GuideDetailsResponseDto;
import com.uor.group_14.touripearl_backend.entity.ConfirmCustomTour;
import com.uor.group_14.touripearl_backend.entity.applicationUser.ApplicationUser;
import com.uor.group_14.touripearl_backend.entity.guide.Guide;
import com.uor.group_14.touripearl_backend.entity.CustomTour;
import com.uor.group_14.touripearl_backend.entity.CustomTourMargin;
import com.uor.group_14.touripearl_backend.exception.EntryNotFoundException;
import com.uor.group_14.touripearl_backend.jwt.CookieProvider;
import com.uor.group_14.touripearl_backend.repository.GuideRepo;
import com.uor.group_14.touripearl_backend.service.GuideService;
import com.uor.group_14.touripearl_backend.service.CustomTourService;
import com.uor.group_14.touripearl_backend.service.serviceImpl.CustomTourServiceImpl;
import com.uor.group_14.touripearl_backend.util.StandardResponseDto;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.repository.query.Param;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;

@Slf4j
@RestController
@RequestMapping("api/v1/guide")
@RequiredArgsConstructor
public class GuideController {
    private final GuideService guideService;
    private final CookieProvider provider;
    private final CustomTourService guideTourService;
    private final NotificationController notificationController;


    @GetMapping("/{id}")
    public ResponseEntity<StandardResponseDto> getGuideById(@PathVariable String id) {
        GuideDetailsResponseDto detailsResponseDto = guideService.getGuideById(id);
        return new ResponseEntity<>(new StandardResponseDto(200, "guide data",
                detailsResponseDto), HttpStatus.OK);
    }

    @GetMapping("/guides/{id}")
    public ResponseEntity<StandardResponseDto> getGuideProfile(@PathVariable String id) {
        GuideDetailsResponseDto detailsResponseDtoDTO = guideService.getGuideById(id);
        return new ResponseEntity<>(new StandardResponseDto(200, "guide profile", detailsResponseDtoDTO),
                HttpStatus.OK);
    }

    @PutMapping("/updateMyGuideData")
    public ResponseEntity<StandardResponseDto> updateMyGuideData(HttpServletRequest request,
                                                                 @RequestBody ProfileUpdateRequestDto dto) {
        String UUID = provider.extractCookie(request, "UUID");
        GuideDetailsResponseDto detailsResponseDto = guideService.updateMyGuideData(UUID, dto);
        return new ResponseEntity<>(new StandardResponseDto(200, "Profile Updated Successfully",
                detailsResponseDto), HttpStatus.OK);
    }

    @GetMapping("/tours")
    public Page<CustomTourResponseDto> getTourIds(@RequestParam(defaultValue = "0") int page,
                                                  @RequestParam String guideId) {

        return guideTourService.findNonOverlappingToursAndDetails(page, 7, guideId);
    }

    @GetMapping("/getOneTourMargin")//api/v1/guide/getOneTourMargin
    public Double getMargin(@RequestParam String guideId, @RequestParam Long tourId) {

        Optional<Double> margin = guideTourService.getMargin(guideId, tourId);
        return margin.orElse(null);
    }

    @PostMapping("/saveTourMargin")
    public ResponseEntity<CustomTourMargin> saveMargin(@RequestBody CustomTourMargin customTourMargin) {
        //webSocket
        Long longValue = Long.valueOf(customTourMargin.getTourId());

        String touristUUID = guideService.getUUIdByTourId(longValue);
        notificationController.sendTourAcceptedNotification(touristUUID,
                "Guide Add margin to to Your Custom Tour");

        guideTourService.saveTour(customTourMargin);
        CustomTourMargin savedMargin = guideTourService.saveMargin(customTourMargin);
        return ResponseEntity.ok(savedMargin);
    }

    @GetMapping("/myData")
    public ResponseEntity<StandardResponseDto> getMyGuideData(HttpServletRequest request) {
        GuideDetailsResponseDto detailsResponseDto = guideService.getGuideByUser();
        return new ResponseEntity<>(new StandardResponseDto(200, "guide data",
                detailsResponseDto), HttpStatus.OK);
    }

    @GetMapping("/list")
    public ResponseEntity<StandardResponseDto> getAllGuides(@RequestParam String searchTxt,
                                                            @RequestParam int size, @RequestParam int page) {
        return new ResponseEntity<>(new StandardResponseDto(200, "All guides..",
                guideService.findAllGuides(searchTxt, page, size)), HttpStatus.OK);
    }

    @GetMapping("/list/new")
    public ResponseEntity<StandardResponseDto> getAllNewGuides(@RequestParam String searchTxt,
                                                               @RequestParam int size, @RequestParam int page) {
        return new ResponseEntity<>(new StandardResponseDto(200, "All guides..",
                guideService.findAllNewGuides(searchTxt, page, size)), HttpStatus.OK);
    }

    //this method use for web socket testing , can remove later
    @PostMapping("/accept/{tourId}/{touristId}")//api/v1/guide/accept/{tourId}/{touristId}
    public Long acceptTour(@PathVariable Long tourId, @PathVariable String touristId) {
        System.out.println("inside acceptTour ,guide controller, web socker testing from post man");


        //webSocket
//        saveMargin guide controller
        String touristUUID = guideService.getUUIdByTourId(1L);
        System.out.println(touristUUID);
        notificationController.sendTourAcceptedNotification(touristUUID,
                "Guide Add margin to to Your Custom Tour");

        //customTour tourist controller
        //notificationController.sendTourAcceptedNotification("toAllGuide", "Tourist Create a New Custom Tour");

        //tourist confirm tour then certain guide receive notification
        //notificationController.sendTourAcceptedNotification("12c733b9-fa13-40cb-8908-c321094f3e3f",
        // "Tourist Confirm Your Margin");
        return tourId;
    }

    @GetMapping("/guideSelectedTour/{guideId}")//api/v1/guide/guideSelectedTour/{guideId}
    public ResponseEntity<Page<CustomTourMargin>> getMarginsByGuideId(@PathVariable String guideId,
                                                                      @RequestParam int size, @RequestParam int page) {
        Page<CustomTourMargin> margins = guideTourService.getMarginsByGuideId(guideId, page, size);
        return ResponseEntity.ok(margins);//base on guide id send all tours that guide add margin
    }

    @GetMapping("/selectedTour/{tourId}")//api/v1/guide/selectedTour/{tourId}
    public ResponseEntity<CustomTourResponseDto> getTourById(@PathVariable Long tourId) {
        System.out.println(tourId);
        CustomTourResponseDto customTour = guideTourService.getTourById(tourId);
        if (customTour == null) {
            return ResponseEntity.notFound().build(); // Return 404 if the tour is not found
        }
        return ResponseEntity.ok(customTour);
    }

    @GetMapping("/getGuidesByFiltering")
    public ResponseEntity<StandardResponseDto> getGuidesByFiltering(@RequestParam(defaultValue = "") String searchQuery,
                                                                    @RequestParam(required = false) String sort,
                                                                    @RequestParam(required = false) List<String> languages,
                                                                    @RequestParam(required = false) List<String> interests,
                                                                    @RequestParam(defaultValue = "10") int size,
                                                                    @RequestParam(defaultValue = "0") int page) {
        GuideFilteringDto dto = GuideFilteringDto.builder()
                .searchQuery(searchQuery)
                .sort(sort)
                .languages(languages)
                .interests(interests)
                .size(size)
                .page(page)
                .build();
        return new ResponseEntity<>(new StandardResponseDto(200, "All guides..",
                guideService.getGuidesByFiltering(dto)), HttpStatus.OK);
    }


    @GetMapping("/guideIdc")//api/v1/guide/guideIdc  guide get confirm tours
    public Page<ConfirmCustomTour> getTours(
            @RequestParam String guideUUID,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "5") int size) {
        return guideTourService.getToursByGuideIdc(guideUUID, page, size);
    }

}