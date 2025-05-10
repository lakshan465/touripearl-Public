package com.uor.group_14.touripearl_backend.api.reservation;

import com.uor.group_14.touripearl_backend.dto.request.reservation.ReservationCreateRequestDto;
import com.uor.group_14.touripearl_backend.dto.request.reservation.ReservationUpdateRequestDto;
import com.uor.group_14.touripearl_backend.dto.response.reservation.ReservationResponseDto;
import com.uor.group_14.touripearl_backend.service.ReservationService;
import com.uor.group_14.touripearl_backend.util.StandardResponseDto;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/reservations")
@RequiredArgsConstructor
public class ReservationController {
    private final ReservationService reservationService;

    @PostMapping
    public ResponseEntity<ReservationResponseDto> createReservation(@Validated @RequestBody ReservationCreateRequestDto reservationCreateRequestDto) {
        ReservationResponseDto reservationResponseDto = reservationService.createReservation(reservationCreateRequestDto);
        return ResponseEntity.ok(reservationResponseDto);
    }

    @GetMapping("/{id}")
    public ResponseEntity<ReservationResponseDto> getReservationById(@PathVariable String id) {
        ReservationResponseDto reservationResponseDto = reservationService.getReservationById(id);
        return ResponseEntity.ok(reservationResponseDto);
    }

    @GetMapping
    public ResponseEntity<List<ReservationResponseDto>> getAllReservations() {
        List<ReservationResponseDto> reservations = reservationService.getAllReservations();
        return ResponseEntity.ok(reservations);
    }

    @PutMapping("/{id}")
    public ResponseEntity<ReservationResponseDto> updateReservation(@PathVariable String id, @Validated @RequestBody ReservationUpdateRequestDto reservationUpdateRequestDto) {
        ReservationResponseDto reservationResponseDto = reservationService.updateReservation(id, reservationUpdateRequestDto);
        return ResponseEntity.ok(reservationResponseDto);
    }


    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteReservation(@PathVariable String id) {
        reservationService.deleteReservation(id);
        return ResponseEntity.noContent().build();
    }
    @GetMapping("/guide/search-by-keyword")
    public ResponseEntity<StandardResponseDto> searchByKeywordOfGuide(@RequestParam(defaultValue = "0") int page,
                                                                      @RequestParam(defaultValue = "10") int size,
                                                                      @RequestParam(required = false) LocalDate startDate,
                                                                      @RequestParam(required = false) LocalDate endDate,
                                                                      @RequestParam(defaultValue = "") String keyword){
        Page<ReservationResponseDto> reservations =reservationService.searchByKeywordAndFiltersOfGuide(page,size,startDate,endDate,keyword);
        return new ResponseEntity<>(
                new StandardResponseDto(
                        200,"Keyword reservations",reservations
                ), HttpStatus.OK
        );
    }
    @GetMapping("/tourist/search-by-keyword")
    public ResponseEntity<StandardResponseDto> searchByKeywordOfTourist(@RequestParam(defaultValue = "0") int page,
                                                                      @RequestParam(defaultValue = "10") int size,
                                                                      @RequestParam(required = false) LocalDate startDate,
                                                                      @RequestParam(required = false) LocalDate endDate,
                                                                      @RequestParam(defaultValue = "") String keyword){
        Page<ReservationResponseDto> reservations =reservationService.searchByKeywordAndFiltersOfTourist(page,size,startDate,endDate,keyword);
        return new ResponseEntity<>(
                new StandardResponseDto(

                        200,"Keyword reservations",reservations
                ), HttpStatus.OK
        );
    }
}
