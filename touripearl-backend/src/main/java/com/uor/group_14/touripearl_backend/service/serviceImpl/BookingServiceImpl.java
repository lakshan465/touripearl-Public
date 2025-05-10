package com.uor.group_14.touripearl_backend.service.serviceImpl;

import com.uor.group_14.touripearl_backend.dto.request.booking.BookingCancelRequestDto;
import com.uor.group_14.touripearl_backend.dto.response.booking.BookingResponseDto;
import com.uor.group_14.touripearl_backend.dto.response.booking.BookingUnavailableRangeDto;
import com.uor.group_14.touripearl_backend.entity.ConfirmCustomTour;
import com.uor.group_14.touripearl_backend.entity.CustomTour;
import com.uor.group_14.touripearl_backend.entity.bookings.Booking;
import com.uor.group_14.touripearl_backend.entity.bookings.BookingStatus;
import com.uor.group_14.touripearl_backend.entity.guide.Guide;
import com.uor.group_14.touripearl_backend.entity.payment.PaymentEntity;
import com.uor.group_14.touripearl_backend.entity.reservation.Reservation;
import com.uor.group_14.touripearl_backend.repository.GuideRepo;
import com.uor.group_14.touripearl_backend.repository.booking.BookingRepository;
import com.uor.group_14.touripearl_backend.service.BookingService;
import com.uor.group_14.touripearl_backend.service.RefundService;
import com.uor.group_14.touripearl_backend.util.SecurityUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class BookingServiceImpl implements BookingService {
    private final BookingRepository bookingRepository;
    private final ReservationServiceImpl reservationService;
    private final SecurityUtil securityUtil;
    private final GuideRepo guideRepo;
    private final RefundService refundService;
    @Override
    public void addBooking(Reservation reservation, ConfirmCustomTour confirmCustomTour, PaymentEntity paymentEntity, LocalDate startDate, LocalDate endDate) {
        bookingRepository.save(Booking.builder()
                        .confirmCustomTour(confirmCustomTour)
                        .reservation(reservation)
                        .paymentEntity(paymentEntity)
                        .startDate(startDate)
                        .status(BookingStatus.CONFIRMED)
                        .endDate(endDate)
                .build());
    }

    @Override
    public void updateBooking(BookingStatus status) {

    }

    @Override
    public void deleteBooking(String bookingId) {

    }

    @Override
    public BookingResponseDto getBooking(String bookingId) {
        return mapToDto(
                bookingRepository.findById(bookingId).orElseThrow(() -> new RuntimeException("Booking not found"))
        );
    }

    @Override
    public List<BookingUnavailableRangeDto> getUnavailableRangeByGuide(String guideId) {
        List<Booking> bookings = bookingRepository.getBookingByReservation_Tour_Guide_PropertyId(guideId);
        return bookings.stream().map(this::mapToUnavailableRangeDto).toList();
    }

    @Override
    public Page<BookingResponseDto> getAllBookingsByTourist(int page, int size) {
        return bookingRepository.findAllByReservation_Tourist_ApplicationUser_UserId((securityUtil.getCurrentUser().getUserId()), PageRequest.of(page, size))
                .map(this::mapToDto);
    }

    @Override
    public Map<String, Long> getBookingsMetricsByGuideAndStatus() {
        Guide guide = guideRepo.findByApplicationUser(securityUtil.getCurrentUser()).orElseThrow(() -> new RuntimeException("Guide not found"));
        return Map.of(
                "CONFIRMED",bookingRepository.countBookingsByStatusAndReservation_Tour_Guide(BookingStatus.CONFIRMED, guide),
                "CANCELLED",bookingRepository.countBookingsByStatusAndReservation_Tour_Guide(BookingStatus.CANCELLED, guide),
                "COMPLETED", bookingRepository.countBookingsByStatusAndReservation_Tour_Guide(BookingStatus.COMPLETED, guide),
                "IN_DISPUTE",bookingRepository.countBookingsByStatusAndReservation_Tour_Guide(BookingStatus.IN_DISPUTE, guide)
        );
    }

    @Override
    public Page<BookingResponseDto> searchByKeywordAndFilters(int page, int size, BookingStatus status, String keyword) {
        Page<Booking> bookings = bookingRepository.searchByKeywordAndFilters(PageRequest.of(page,size), status, keyword);
        return bookings.map(this::mapToDto);
    }

    @Override
    public Page<BookingResponseDto> searchByKeywordAndFiltersWithGuide(int page, int size, BookingStatus status, String keyword) {
        Guide guide = guideRepo.findByApplicationUser(securityUtil.getCurrentUser()).orElseThrow(() -> new RuntimeException("Guide not found"));
        Page<Booking> bookings = bookingRepository.searchByKeywordAndFiltersWithGuide(PageRequest.of(page,size), status, keyword,guide);
        return bookings.map(this::mapToDto);
    }

    @Override
    public List<BookingUnavailableRangeDto> getUnavailableRangeForGuide() {
        Guide guide = guideRepo.findByApplicationUser(securityUtil.getCurrentUser()).orElseThrow(() -> new RuntimeException("Guide not found"));
        List<Booking> bookings = bookingRepository.getBookingByReservation_Tour_Guide_PropertyId(guide.getPropertyId());
        return bookings.stream().map(this::mapToUnavailableRangeDto).toList();
    }

    @Override
    public BookingResponseDto cancelBooking(BookingCancelRequestDto dto) {
        Booking booking =bookingRepository.findById(dto.getBookingId()).orElseThrow(() -> new RuntimeException("Booking not found"));
        booking.setStatus(BookingStatus.CANCELLED);
        refundService.requestRefund(dto);
        return mapToDto(booking);
    }

    public BookingUnavailableRangeDto mapToUnavailableRangeDto(Booking booking){
        return BookingUnavailableRangeDto.builder()
                .endDate(booking.getEndDate())
                .startDate(booking.getStartDate())
                .build();
    }
    public BookingResponseDto mapToDto(Booking booking){
        return BookingResponseDto.builder()
                .propertyId(booking.getPropertyId())
                //.customTourResponseDto(tourService.getTourById(booking.getCustomTour().getId()))
                .reservationResponseDto(reservationService.mapToResponseDto(booking.getReservation()))
                .startDate(booking.getStartDate())
                .endDate(booking.getEndDate())
                .status(booking.getStatus())
                .build();
    }
}
