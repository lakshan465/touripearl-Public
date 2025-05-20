package com.uor.group_14.touripearl_backend.service;

import com.paypal.api.payments.Payment;
import com.paypal.base.rest.PayPalRESTException;

import java.util.Map;

public interface ReservationPayment {
    String createPayment(Double amount, String currency, String method, String intent,String reservationId, String description, String cancelUrl, String successUrl) throws PayPalRESTException;
    Payment executePayment(Map<String, String> paymentData) throws PayPalRESTException;

    Payment executePaymentForCustomTour(Map<String, String> paymentData);
}
