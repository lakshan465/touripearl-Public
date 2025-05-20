package com.uor.group_14.touripearl_backend.api.dashboardMatrices;

import com.uor.group_14.touripearl_backend.dto.response.GuideDetailsResponseDto;
import com.uor.group_14.touripearl_backend.service.BookingService;
import com.uor.group_14.touripearl_backend.service.GuideService;
import com.uor.group_14.touripearl_backend.service.TourService;
import com.uor.group_14.touripearl_backend.util.StandardResponseDto;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;


@RestController
@RequestMapping("/api/v1/dashboard/guide")
@RequiredArgsConstructor
public class GuideDashboardController {

    private final GuideService guideService;
    private final TourService tourService;
    private final BookingService bookingService;

    @GetMapping("/guide/{guideId}")
    public ResponseEntity<StandardResponseDto> getGuideDetails(@PathVariable String guideId) {
        GuideDetailsResponseDto guideDTO = guideService.getGuideById(guideId);
        return new ResponseEntity<>(
                new StandardResponseDto(200, "Guide Details", guideDTO),
                HttpStatus.OK
        );
    }

    @GetMapping("/tours-metrics")
    public ResponseEntity<StandardResponseDto> getGuideTours() {

        return new ResponseEntity<>(
                new StandardResponseDto(200, "Guide Tours", tourService.getToursMetricsByGuideId()),
                HttpStatus.OK
        );
    }
    @GetMapping("/bookings-metrics")
    public ResponseEntity<StandardResponseDto> getGuideBookings() {
        return new ResponseEntity<>(
                new StandardResponseDto(200, "Guide Bookings", bookingService.getBookingsMetricsByGuideAndStatus()),
                HttpStatus.OK
        );
    }
}
