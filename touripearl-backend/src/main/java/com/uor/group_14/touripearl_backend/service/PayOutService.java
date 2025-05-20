package com.uor.group_14.touripearl_backend.service;

import com.paypal.base.rest.PayPalRESTException;
import com.uor.group_14.touripearl_backend.entity.payment.PaymentEntity;

public interface PayOutService {
    void handlePayOut(double amount , PaymentEntity paymentEntity) throws PayPalRESTException;
}
