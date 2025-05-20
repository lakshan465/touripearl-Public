package com.uor.group_14.touripearl_backend.service.serviceImpl;

import com.paypal.api.payments.Payment;
import com.paypal.base.rest.PayPalRESTException;
import com.uor.group_14.touripearl_backend.entity.ConfirmCustomTour;
import com.uor.group_14.touripearl_backend.entity.payment.PaymentEntity;
import com.uor.group_14.touripearl_backend.entity.reservation.Reservation;
import com.uor.group_14.touripearl_backend.entity.reservation.ReservationStatus;
import com.uor.group_14.touripearl_backend.exception.EntryNotFoundException;
import com.uor.group_14.touripearl_backend.repository.ConfirmCustomTourRepo;
import com.uor.group_14.touripearl_backend.repository.payment.PaymentRepository;
import com.uor.group_14.touripearl_backend.repository.reservation.ReservationRepository;
import com.uor.group_14.touripearl_backend.service.PayOutService;
import com.uor.group_14.touripearl_backend.service.PaypalService;
import com.uor.group_14.touripearl_backend.service.ReservationPayment;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.Map;
import java.util.Optional;

@Service
@Transactional
@RequiredArgsConstructor
public class ReservationPaymentImpl implements ReservationPayment {
    private final PaypalService paypalService;
    private final ReservationRepository reservationRepository;
    private final PaymentRepository paymentRepository;
    private final BookingServiceImpl bookingService;
    private final PayOutService payOutService;
    private final ConfirmCustomTourRepo confirmCustomTourRepo;
    @Override
    public String createPayment(Double amount, String currency, String method, String intent, String reservationId, String description, String cancelUrl, String successUrl) throws PayPalRESTException {
        return paypalService.createPayment(amount, currency, method, intent,reservationId, description, cancelUrl, successUrl);
    }

    @Override
    public Payment executePayment(Map<String, String> paymentData) throws PayPalRESTException {
        //execute payment from paypal service
        Payment executedpayment = paypalService.executePayment(paymentData);

        Reservation reservation = reservationRepository.findById(executedpayment.getTransactions().get(0).getInvoiceNumber()).orElseThrow(() -> new EntryNotFoundException("Reservation not found"));
        //update reservation status
        reservation.setStatus(ReservationStatus.PAID);


        reservationRepository.save(reservation);
        //save payment to payment entity
        PaymentEntity paymentEntity = PaymentEntity.builder()
                .paymentId(executedpayment.getId())
                .payerId(executedpayment.getPayer().getPayerInfo().getPayerId())
                .amount(executedpayment.getTransactions().get(0).getAmount().getTotal())
                .currency(executedpayment.getTransactions().get(0).getAmount().getCurrency())
                .reservation(reservation)
                .confirmCustomTour(null)
                .salesId(executedpayment.getTransactions().get(0).getRelatedResources().get(0).getSale().getId())
                .build();
        paymentRepository.save(paymentEntity);

        payOutService.handlePayOut(Double.parseDouble(executedpayment.getTransactions().get(0).getAmount().getTotal()), paymentEntity);

        //save payment to booking
        bookingService.addBooking(reservation, null, paymentEntity, reservation.getStartDate(), reservation.getEndDate());

        return executedpayment;
    }

    @Override
    public Payment executePaymentForCustomTour(Map<String, String> paymentData) {
        try {
            // Execute payment from PayPal service
            Payment executedPayment = paypalService.executePayment(paymentData);

            // Extract tourId properly
            Long tourId = Long.parseLong(paymentData.get("tourId"));
            System.out.println(paymentData.get("tourId"));

            // Fetch confirm custom tour
            ConfirmCustomTour confirmCustomTour = confirmCustomTourRepo.findById(tourId)
                    .orElseThrow(() -> new RuntimeException("Custom Tour not found"));

            // Save payment entity
            PaymentEntity paymentEntity = PaymentEntity.builder()
                    .paymentId(executedPayment.getId())
                    .payerId(executedPayment.getPayer().getPayerInfo().getPayerId())
                    .amount(executedPayment.getTransactions().get(0).getAmount().getTotal())
                    .currency(executedPayment.getTransactions().get(0).getAmount().getCurrency())
                    .reservation(null)
                    .confirmCustomTour(confirmCustomTour)
                    .salesId(executedPayment.getTransactions().get(0).getRelatedResources().get(0).getSale().getId())
                    .build();
            paymentRepository.save(paymentEntity);

            // Parse start and end dates
            LocalDate startDate = LocalDate.parse(confirmCustomTour.getStartDatec());
            LocalDate endDate = LocalDate.parse(confirmCustomTour.getEndDatec());

            // Save booking
            bookingService.addBooking(null, confirmCustomTour, paymentEntity, startDate, endDate);

            return executedPayment;

        } catch (PayPalRESTException e) {
            throw new RuntimeException("Error executing PayPal payment", e);
        }
    }

}
