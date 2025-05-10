package com.uor.group_14.touripearl_backend.api.dashboardMatrices;

import com.uor.group_14.touripearl_backend.service.ApplicationUserService;
import com.uor.group_14.touripearl_backend.service.EventService;
import com.uor.group_14.touripearl_backend.service.GuideApplicationService;
import com.uor.group_14.touripearl_backend.service.GuideService;
import com.uor.group_14.touripearl_backend.util.StandardResponseDto;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;


@RestController
@RequestMapping("api/v1/dashboard/admin")
@RequiredArgsConstructor
public class AdminDashboardController {
    private final ApplicationUserService applicationUserService;
    private final GuideApplicationService guideApplicationService;
    private final EventService eventService;
    private final GuideService guideService;
    @GetMapping("/user/signups")
    public ResponseEntity<StandardResponseDto> getSignupCounts(){
        return new ResponseEntity<>(
                new StandardResponseDto(
                        200,"SignupCounts",applicationUserService.getSignupCounts()
                ), HttpStatus.OK
        );
    }
    @GetMapping("/user/verified")
    public ResponseEntity<StandardResponseDto> getVerifiedCounts(){
        return new ResponseEntity<>(
                new StandardResponseDto(
                        200,"VerifiedCounts",applicationUserService.getVerifiedCounts()
                ),HttpStatus.OK
        );
    }
    @GetMapping("/guide/applications")
    public ResponseEntity<StandardResponseDto> getApplicationCounts(){
        return new ResponseEntity<>(
                new StandardResponseDto(
                        200,"ApplicationCounts",guideApplicationService.getApplicationCounts()
                ),HttpStatus.OK
        );
    }
    @GetMapping("/events/counts")
    public ResponseEntity<StandardResponseDto> getEventCounts(){
        return new ResponseEntity<>(
                new StandardResponseDto(
                        200,"EventCounts",eventService.getEventCounts()
                ),HttpStatus.OK
        );
    }
    @GetMapping("/guides/active")
    public ResponseEntity<StandardResponseDto> getActiveGuideCounts(){
        return new ResponseEntity<>(
                new StandardResponseDto(
                        200,"ActiveGuideCounts",guideService.getGuidesByActive()
                ),HttpStatus.OK
        );
    }
}
