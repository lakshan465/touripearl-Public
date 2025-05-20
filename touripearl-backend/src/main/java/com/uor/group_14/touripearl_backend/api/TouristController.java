package com.uor.group_14.touripearl_backend.api;

import com.uor.group_14.touripearl_backend.dto.request.TouristChangeDataRequestDto;
import com.uor.group_14.touripearl_backend.dto.request.tourist.CuztomTourDTO;
import com.uor.group_14.touripearl_backend.dto.request.tourist.SaveConfirmTourReqDto;
import com.uor.group_14.touripearl_backend.dto.response.CustomTourMarginWithGuide;
import com.uor.group_14.touripearl_backend.dto.response.CustomTourResponseDto;
import com.uor.group_14.touripearl_backend.entity.ConfirmCustomTour;
import com.uor.group_14.touripearl_backend.entity.CustomTour;
import com.uor.group_14.touripearl_backend.service.CustomTourService;
import com.uor.group_14.touripearl_backend.dto.request.TouristRequestDto;
import com.uor.group_14.touripearl_backend.service.GuideService;
import com.uor.group_14.touripearl_backend.service.TourService;
import com.uor.group_14.touripearl_backend.service.TouristApplicationService;
import com.uor.group_14.touripearl_backend.util.StandardResponseDto;
import lombok.AllArgsConstructor;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("api/v1/tourists")
@RequiredArgsConstructor

public class TouristController {

    private final TourService touristService;
    private final TouristApplicationService touristApplicationService;
    private final NotificationController notificationController;
    private final GuideService guideService;
    private final CustomTourService customTourService;


    @PostMapping("/save")
    public ResponseEntity<StandardResponseDto> saveTourist(@RequestBody TouristRequestDto dto) {
        touristApplicationService.createTourist(dto);

        return new ResponseEntity<>(
                new StandardResponseDto(201, "User Tourist Saved!..", null),
                HttpStatus.CREATED
        );
    }

    @PutMapping("/{id}")
    public ResponseEntity<StandardResponseDto> updateTourist(
            @PathVariable String id,
            @RequestBody TouristChangeDataRequestDto dto
    ) {
        touristApplicationService.update(id, dto);
        return new ResponseEntity<>(
                new StandardResponseDto(201, "Tourist Updated", null),
                HttpStatus.CREATED
        );
    }

    @GetMapping("/{id}")
    public ResponseEntity<StandardResponseDto> getTourist(@PathVariable String id) {
        return new ResponseEntity<>(
                new StandardResponseDto(200, "Selected user.", touristApplicationService.getTourist(id)),
                HttpStatus.OK
        );
    }

    @PostMapping("/cuzTour")//api/v1/tourists/cuzTour/{id} //customize tour created by tourist comes to here
    public ResponseEntity<StandardResponseDto> customTour(@RequestBody CuztomTourDTO dto) {

        customTourService.createCustomTour(dto);

        //webSocket
        notificationController.sendTourAcceptedNotification("toAllGuide", "Tourist Create a New Custom Tour");

        return new ResponseEntity<>(
                new StandardResponseDto(201, "Custom Tour added", null),
                HttpStatus.CREATED
        );
    }

    @GetMapping("/getCustomTour/{uuid}")
    public Page<CustomTourResponseDto> getTouristId(@PathVariable String uuid, @RequestParam(defaultValue = "0") int page) {

        String touristId = touristService.getTouristIdByUserId(uuid);

        return customTourService.getTourByTouristId(touristId, page);
    }

    @GetMapping("/getCustomTourGuideList")
    public Page<CustomTourMarginWithGuide> getMarginsWithGuides(@RequestParam Long tourId, @RequestParam(defaultValue = "0") int page) {
        //System.out.println(tourId);
        return guideService.getMarginAndGuidesByTourId(tourId, page, 5);
    }

    @PostMapping("/customTourConfirm/{id}")
    public ResponseEntity<String> deleteCustomTour(@PathVariable Long id, @RequestBody Map<String, SaveConfirmTourReqDto> dto) {
        try {
            SaveConfirmTourReqDto dto2 = dto.get("selectedData");
            System.out.println("from deleteCustomTour " + dto2.getGuideId());
            notificationController.sendTourAcceptedNotification(dto2.getGuideId(), "Tourist Confirm Your Margin");

            customTourService.saveCustomTour(dto2);
            customTourService.deleteCustomTour(id);


            return ResponseEntity.ok("Custom Tour deleted successfully");
        } catch (RuntimeException e) {
            System.err.println("Error: " + e.getMessage());
            return ResponseEntity.status(500).body("Server Error: " + e.getMessage());

        }
    }

    @GetMapping("/touristIdc")//api/v1/tourists/touristIdc  tourist get confirm tours
    public Page<ConfirmCustomTour> getTours(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "5") int size) {

        System.out.println("touristIdc");

        return customTourService.getToursByTouristIdc(page, size);
    }
}
