package com.uor.group_14.touripearl_backend.service;

import com.uor.group_14.touripearl_backend.dto.request.booking.BookingCancelRequestDto;
import com.uor.group_14.touripearl_backend.dto.response.booking.BookingResponseDto;
import com.uor.group_14.touripearl_backend.dto.response.booking.BookingUnavailableRangeDto;
import com.uor.group_14.touripearl_backend.entity.ConfirmCustomTour;
import com.uor.group_14.touripearl_backend.entity.CustomTour;
import com.uor.group_14.touripearl_backend.entity.bookings.Booking;
import com.uor.group_14.touripearl_backend.entity.bookings.BookingStatus;
import com.uor.group_14.touripearl_backend.entity.payment.PaymentEntity;
import com.uor.group_14.touripearl_backend.entity.reservation.Reservation;
import org.springframework.data.domain.Page;

import java.time.LocalDate;
import java.util.List;
import java.util.Map;

public interface BookingService {
    public void addBooking(Reservation reservation, ConfirmCustomTour confirmCustomTour, PaymentEntity paymentEntity, LocalDate startDate, LocalDate endDate);
    public void updateBooking(BookingStatus status);
    public void deleteBooking(String bookingId);
    public BookingResponseDto getBooking(String bookingId);
    List<BookingUnavailableRangeDto> getUnavailableRangeByGuide(String guideId);
    Page<BookingResponseDto> getAllBookingsByTourist(int page, int size);
    Map<String,Long> getBookingsMetricsByGuideAndStatus();

    Page<BookingResponseDto> searchByKeywordAndFilters(int page, int size, BookingStatus status, String keyword);

    Page<BookingResponseDto> searchByKeywordAndFiltersWithGuide(int page, int size, BookingStatus status, String keyword);

    List<BookingUnavailableRangeDto> getUnavailableRangeForGuide();

    BookingResponseDto cancelBooking(BookingCancelRequestDto dto);
}
