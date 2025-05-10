package com.uor.group_14.touripearl_backend.api.booking;

import com.paypal.base.rest.PayPalRESTException;
import com.uor.group_14.touripearl_backend.dto.request.booking.BookingCancelRequestDto;
import com.uor.group_14.touripearl_backend.dto.response.booking.BookingResponseDto;
import com.uor.group_14.touripearl_backend.dto.response.booking.BookingUnavailableRangeDto;
import com.uor.group_14.touripearl_backend.dto.response.refund.RefundResponseDto;
import com.uor.group_14.touripearl_backend.entity.bookings.BookingStatus;
import com.uor.group_14.touripearl_backend.entity.refund.RefundStatus;
import com.uor.group_14.touripearl_backend.service.BookingService;
import com.uor.group_14.touripearl_backend.service.RefundService;
import com.uor.group_14.touripearl_backend.util.StandardResponseDto;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/booking")
@RequiredArgsConstructor
public class BookingController {
    private final BookingService bookingService;
    private final RefundService refundService;
    @GetMapping("/unavailability/{guideId}")
    public ResponseEntity<StandardResponseDto> getUnavailableRangeByGuide(@PathVariable String guideId){
        List<BookingUnavailableRangeDto> rangeDto = bookingService.getUnavailableRangeByGuide(guideId);
        return new ResponseEntity<>(
                new StandardResponseDto(200,"unavailableRanges",rangeDto), HttpStatus.OK
        );
    }
    @GetMapping("/guide/unavailability")
    public ResponseEntity<StandardResponseDto> getUnavailableForGuide(){
        List<BookingUnavailableRangeDto> rangeDto = bookingService.getUnavailableRangeForGuide();
        return new ResponseEntity<>(
                new StandardResponseDto(200,"unavailableRanges",rangeDto), HttpStatus.OK
        );
    }
    @GetMapping("/allBookings/tourist")
    public ResponseEntity<StandardResponseDto> getAllBookingsByTourist(@RequestParam int page,
                                                                        @RequestParam int size){
        Page<BookingResponseDto> rangeDto = bookingService.getAllBookingsByTourist(page, size);
        return new ResponseEntity<>(
                new StandardResponseDto(200, " ",rangeDto), HttpStatus.OK
        );
    }
    @GetMapping("/{bookingId}")
    public ResponseEntity<StandardResponseDto> getBooking(@PathVariable String bookingId){
        BookingResponseDto booking = bookingService.getBooking(bookingId);
        return new ResponseEntity<>(
                new StandardResponseDto(200, " ",booking), HttpStatus.OK
        );
    }
    @GetMapping("/search-by-keyword")
    public ResponseEntity<StandardResponseDto> searchByKeyword(@RequestParam(defaultValue = "0") int page,
                                                               @RequestParam(defaultValue = "10") int size,
                                                               @RequestParam(required = false) BookingStatus status,
                                                               @RequestParam(defaultValue = "") String keyword){
        Page<BookingResponseDto> responses =bookingService.searchByKeywordAndFilters(page,size,status,keyword);
        return new ResponseEntity<>(
                new StandardResponseDto(
                        200,"Keyword disputes",responses
                ),HttpStatus.OK
        );
    }
    @GetMapping("/guide/search-by-keyword")
    public ResponseEntity<StandardResponseDto> searchByKeywordWithGuide(@RequestParam(defaultValue = "0") int page,
                                                               @RequestParam(defaultValue = "10") int size,
                                                               @RequestParam(required = false) BookingStatus status,
                                                               @RequestParam(defaultValue = "") String keyword){
        Page<BookingResponseDto> responses =bookingService.searchByKeywordAndFiltersWithGuide(page,size,status,keyword);
        return new ResponseEntity<>(
                new StandardResponseDto(
                        200,"Keyword disputes",responses
                ),HttpStatus.OK
        );
    }
    @PostMapping("/cancel")
    public ResponseEntity<StandardResponseDto> cancelBooking(@RequestBody BookingCancelRequestDto dto){
        BookingResponseDto booking = bookingService.cancelBooking(dto);
        return new ResponseEntity<>(
                new StandardResponseDto(200, " ",booking), HttpStatus.OK
        );
    }
    @GetMapping("/refundRequests/search-by-keyword")
    public ResponseEntity<StandardResponseDto> searchByKeywordRefunds(@RequestParam(defaultValue = "0") int page,
                                                                        @RequestParam(defaultValue = "10") int size,
                                                                        @RequestParam(required = false) RefundStatus status,
                                                                        @RequestParam(defaultValue = "") String keyword){
        Page<RefundResponseDto> responses =refundService.searchByKeywordAndFilters(page,size,status,keyword);
        return new ResponseEntity<>(
                new StandardResponseDto(
                        200,"Keyword disputes",responses
                ),HttpStatus.OK
        );
    }
    @GetMapping("/refundRequest/{refundId}")
    public ResponseEntity<StandardResponseDto> getRefundRequest(@PathVariable String refundId){
        RefundResponseDto refund = refundService.getRefundRequest(refundId);
        return new ResponseEntity<>(
                new StandardResponseDto(200, " ",refund), HttpStatus.OK
        );
    }
    @PatchMapping("/refundRequest/{refundId}/response")
    public ResponseEntity<StandardResponseDto> updateRefundStatus(@PathVariable String refundId,
                                                              @RequestBody RefundStatus status) throws PayPalRESTException {
        refundService.updateRefundStatus(refundId,status);
        return new ResponseEntity<>(
                new StandardResponseDto(200, " ",null), HttpStatus.OK
        );
    }
}
