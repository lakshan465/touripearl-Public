package com.uor.group_14.touripearl_backend.service;

import com.paypal.api.payments.Payment;
import com.paypal.api.payments.Refund;
import com.paypal.base.rest.PayPalRESTException;

import java.util.Map;

public interface PaypalService {
    String createPayment(Double amount, String currency, String method, String intent,String invoiceId, String description, String cancelUrl, String successUrl) throws PayPalRESTException;
    Payment executePayment(Map<String, String> paymentData) throws PayPalRESTException;
    void createPayout(String receiverEmail, Double amount, String currency) throws PayPalRESTException;
    Refund refundPayment(String saleId, double amount, String currency) throws PayPalRESTException;

}
