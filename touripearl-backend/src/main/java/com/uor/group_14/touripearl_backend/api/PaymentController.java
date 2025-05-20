package com.uor.group_14.touripearl_backend.api;

import com.paypal.api.payments.Payment;
import com.paypal.base.rest.PayPalRESTException;
import com.uor.group_14.touripearl_backend.service.PaypalService;
import com.uor.group_14.touripearl_backend.service.ReservationPayment;
import com.uor.group_14.touripearl_backend.util.StandardResponseDto;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/payments")
@RequiredArgsConstructor
public class PaymentController {
    private final ReservationPayment reservationPayment;
    private final PaypalService paypalService;

    //payment for reservation
    @GetMapping("/payForReservation")
    public ResponseEntity<StandardResponseDto> payForReservation(@RequestParam double amount,
                                                                 @RequestParam String reservationId,
                                                                 @RequestParam (defaultValue = "false")Boolean customTour ) {
        try {
            System.out.println("payForReservation");

            // Attempt to create the payment
            String approvalUrl ;

            if (customTour) {
                //for customTour
                approvalUrl = reservationPayment.createPayment(amount,
                        "USD", "paypal", "sale", reservationId,
                        "TouriPearl Booking Payment", "http://localhost:5173/payment/cancel",
                        "http://localhost:5173/payment/successForCustomer?reservationId=" + reservationId);
            }else{
                //for reservation
                approvalUrl = reservationPayment.createPayment(amount,
                        "USD", "paypal", "sale", reservationId,
                        "TouriPearl Booking Payment", "http://localhost:5173/payment/cancel",
                        "http://localhost:5173/payment/success");
            }
            // Log the approval URL returned by PayPal
            System.out.println("Approval URL: " + approvalUrl);

            if (approvalUrl != null) {
                return new ResponseEntity<>(
                        new StandardResponseDto(201, "Payment Created", approvalUrl),
                        HttpStatus.CREATED
                );
            } else {
                System.err.println("No approval URL returned by PayPal.");
                return new ResponseEntity<>(
                        new StandardResponseDto(500, "Error: No approval URL returned", null),
                        HttpStatus.INTERNAL_SERVER_ERROR
                );
            }
        } catch (PayPalRESTException e) {
            // Log the exception details to help with debugging
            System.err.println("PayPalRESTException: " + e.getMessage());
            e.printStackTrace();  // Optionally print the full stack trace for debugging

            return new ResponseEntity<>(
                    new StandardResponseDto(500, "Error in payment: " + e.getMessage(), null),
                    HttpStatus.INTERNAL_SERVER_ERROR
            );
        } catch (Exception e) {
            // Catch any other exceptions
            System.err.println("Exception: " + e.getMessage());
            e.printStackTrace();

            return new ResponseEntity<>(
                    new StandardResponseDto(500, "Unexpected error: " + e.getMessage(), null),
                    HttpStatus.INTERNAL_SERVER_ERROR
            );
        }
    }
    //payment for reservation
    @PostMapping("/executeForReservation")
    public ResponseEntity<StandardResponseDto> execute(@RequestBody Map<String, String> paymentData) {
        try {
            Payment executedPayment = reservationPayment.executePayment(paymentData);
            return new ResponseEntity<>(

                    new StandardResponseDto(200,"Payment Executed",
                            null

                    ), HttpStatus.OK);
        } catch (PayPalRESTException e) {
            return new ResponseEntity<>(
                    new StandardResponseDto(500, "Error in payment execution",
                            null
                    ), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    //payment for CustomTour
    @PostMapping("/executeForCustomTour")
    public ResponseEntity<StandardResponseDto> executeForCustomTour(@RequestBody Map<String, String> paymentData) {
        Payment executedPayment = reservationPayment.executePaymentForCustomTour(paymentData);

        return new ResponseEntity<>(
                new StandardResponseDto(200, "Payment Executed",
                        executedPayment
                ), HttpStatus.OK);
    }
}
