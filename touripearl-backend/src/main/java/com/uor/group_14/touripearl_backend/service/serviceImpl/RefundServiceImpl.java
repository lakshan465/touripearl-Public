package com.uor.group_14.touripearl_backend.service.serviceImpl;

import com.paypal.base.rest.PayPalRESTException;
import com.uor.group_14.touripearl_backend.dto.request.booking.BookingCancelRequestDto;
import com.uor.group_14.touripearl_backend.dto.response.refund.RefundResponseDto;
import com.uor.group_14.touripearl_backend.entity.refund.RefundRequest;
import com.uor.group_14.touripearl_backend.entity.refund.RefundStatus;
import com.uor.group_14.touripearl_backend.repository.booking.BookingRepository;
import com.uor.group_14.touripearl_backend.repository.refund.RefundRepo;
import com.uor.group_14.touripearl_backend.service.BookingService;
import com.uor.group_14.touripearl_backend.service.EmailService;
import com.uor.group_14.touripearl_backend.service.PaypalService;
import com.uor.group_14.touripearl_backend.service.RefundService;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;

import java.time.Duration;
import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
public class RefundServiceImpl implements RefundService {
    private final RefundRepo refundRepo;
    private final BookingRepository bookingRepository;
    private final PaypalService service;
    private final EmailService emailService;
    @Override
    public void requestRefund(BookingCancelRequestDto dto) {
        RefundRequest refundRequest = RefundRequest.builder()
                .status(RefundStatus.PENDING)
                .reason(dto.getReason())
                .booking(bookingRepository.findById(dto.getBookingId()).orElseThrow(() -> new RuntimeException("Booking not found")))
                .build();
        refundRepo.save(refundRequest);
    }

    @Override
    @Transactional
    public void updateRefundStatus(String refundId, RefundStatus status) throws PayPalRESTException {
        RefundRequest refundRequest = refundRepo.findById(refundId).orElseThrow(() -> new RuntimeException("Refund request not found"));
        refundRequest.setStatus(status);
        refundRepo.save(refundRequest);
        if (status == RefundStatus.APPROVED) {
            LocalDateTime now = LocalDateTime.now();
            LocalDateTime startDate = refundRequest.getBooking().getPaymentEntity().getCreatedDate();
            long daysPassed = Duration.between(startDate, now).toDays();

            double originalAmount = Double.parseDouble(refundRequest.getBooking().getPaymentEntity().getAmount());
            double refundAmount = 0;

            if (daysPassed <= 1) {
                refundAmount = originalAmount;
            } else if (daysPassed <= 3) {
                refundAmount = originalAmount * 0.8;
            } else if (daysPassed <= 7) {
                refundAmount = originalAmount * 0.5;
            }else {
                throw new RuntimeException("Refund request cannot be approved after 7 days");
            }
            service.refundPayment(
                    refundRequest.getBooking().getPaymentEntity().getSalesId(),
                    refundAmount,
                    refundRequest.getBooking().getPaymentEntity().getCurrency()
            );

            emailService.sendEmail(
                    refundRequest.getBooking().getReservation().getTourist().getApplicationUser().getEmail(),
                    "Refund Request Approved",
                    "Your refund request has been approved. Amount refunded: " + refundAmount
            );
        }
        if (status == RefundStatus.REJECTED) {
            emailService.sendEmail(
                    refundRequest.getBooking().getReservation().getTourist().getApplicationUser().getEmail(),
                    "Refund Request Rejected",
                    "Your refund request has been rejected. Please contact support for more information."
            );
        }
    }

    @Override
    public Page<RefundResponseDto> searchByKeywordAndFilters(int page, int size, RefundStatus status, String keyword) {
        Page<RefundRequest> refunds = refundRepo.searchByKeywordAndFilters(PageRequest.of(page,size), status, keyword);
        return refunds.map(this::mapToDto);
    }

    @Override
    public RefundResponseDto getRefundRequest(String refundId) {
        return mapToDto(refundRepo.findById(refundId).orElseThrow(() -> new RuntimeException("Refund request not found")));
    }
    public RefundResponseDto mapToDto(RefundRequest refundRequest){
        return RefundResponseDto.builder()
                .propertyId(refundRequest.getPropertyId())
                .createdAt(refundRequest.getCreatedAt())
                .updatedAt(refundRequest.getUpdatedAt())
                .status(refundRequest.getStatus())
                .reason(refundRequest.getReason())
                .bookingId(refundRequest.getBooking().getPropertyId())
                .build();
    }
}
