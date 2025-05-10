package com.uor.group_14.touripearl_backend.service.serviceImpl;

import com.paypal.base.rest.PayPalRESTException;
import com.uor.group_14.touripearl_backend.entity.payment.PayOutEntity;
import com.uor.group_14.touripearl_backend.entity.payment.PaymentEntity;
import com.uor.group_14.touripearl_backend.repository.payment.PayOutRepo;
import com.uor.group_14.touripearl_backend.service.PayOutService;
import com.uor.group_14.touripearl_backend.service.PaypalService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import software.amazon.awssdk.services.s3.endpoints.internal.Value;

import java.util.UUID;

@Service
@RequiredArgsConstructor
public class PayOutServiceImpl implements PayOutService {
    private final PayOutRepo payOutRepo;

    @Override
    public void handlePayOut(double amount , PaymentEntity paymentEntity) throws PayPalRESTException {
        double serviceCharge = 1000.00;
        double payOutAmount = amount - serviceCharge;

        /*paypalService.createPayout(guideEmail, (double) payOutAmount,"USD");*/

        PayOutEntity payOutEntity = PayOutEntity.builder()
                .payoutId(UUID.randomUUID().toString())
                .serviceCharge(serviceCharge)
                .payoutAmount(payOutAmount)
                .paymentEntity(paymentEntity)
                .build();

        payOutRepo.save(payOutEntity);
    }
}
