package com.uor.group_14.touripearl_backend.service.serviceImpl;

import com.paypal.api.payments.*;
import com.paypal.base.rest.APIContext;
import com.paypal.base.rest.PayPalRESTException;
import com.uor.group_14.touripearl_backend.config.PaypalConfig;
import com.uor.group_14.touripearl_backend.repository.payment.PaymentRepository;
import com.uor.group_14.touripearl_backend.repository.reservation.ReservationRepository;
import com.uor.group_14.touripearl_backend.service.PaypalService;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.UUID;

@Service
@Transactional
@RequiredArgsConstructor
public class paypalServiceImpl implements PaypalService {
    private final PaypalConfig config;
    @Override
    public String createPayment(Double amount, String currency, String method, String intent,String invoiceId, String description, String cancelUrl, String successUrl) throws PayPalRESTException {
        Amount amountObj = new Amount();
        amountObj.setCurrency(currency);
        amountObj.setTotal(String.format("%.2f", amount));

        Transaction transaction = new Transaction();
        transaction.setDescription(description);
        transaction.setAmount(amountObj);
        transaction.setInvoiceNumber(invoiceId);

        List<Transaction> transactions = new ArrayList<>();
        transactions.add(transaction);

        Payer payer = new Payer();
        payer.setPaymentMethod(method);

        Payment payment = new Payment();
        payment.setIntent(intent);
        payment.setPayer(payer);
        payment.setTransactions(transactions);

        RedirectUrls redirectUrls = new RedirectUrls();
        redirectUrls.setCancelUrl(cancelUrl);
        redirectUrls.setReturnUrl(successUrl);
        payment.setRedirectUrls(redirectUrls);

        APIContext apiContext = config.apiContext();

        Payment createdPayment = payment.create(apiContext);

        for (Links link : createdPayment.getLinks()) {
            if (link.getRel().equals("approval_url")) {
                return link.getHref();
            }
        }
        return null;
    }

    @Override
    @Transactional
    public Payment executePayment(Map<String, String> paymentData) throws PayPalRESTException {
        String paymentId = paymentData.get("paymentId");
        String payerId = paymentData.get("payerId");

        APIContext apiContext = config.apiContext();
        Payment payment = new Payment();
        payment.setId(paymentId);

        PaymentExecution paymentExecution = new PaymentExecution();
        paymentExecution.setPayerId(payerId);

        //execute payment
        return payment.execute(apiContext, paymentExecution);
    }
    @Override
    @Transactional
    public void createPayout(String receiverEmail, Double amount, String currency) throws PayPalRESTException {
        PayoutSenderBatchHeader senderBatchHeader = new PayoutSenderBatchHeader();
        senderBatchHeader.setSenderBatchId(UUID.randomUUID().toString()).setEmailSubject("TouriPearl Payout");

        Currency payoutAmount = new Currency();
        payoutAmount.setValue(String.format("%.2f", amount)).setCurrency(currency);

        PayoutItem payoutItem = new PayoutItem();
        payoutItem.setRecipientType("EMAIL")
                .setReceiver(receiverEmail)
                .setAmount(payoutAmount)
                .setSenderItemId(UUID.randomUUID().toString());

        List<PayoutItem> payoutItems = new ArrayList<>();
        payoutItems.add(payoutItem);

        Payout payout = new Payout();
        payout.setSenderBatchHeader(senderBatchHeader).setItems(payoutItems);

        APIContext apiContext = config.apiContext();
        payout.create(apiContext, null);
    }
    @Override
    @Transactional
    public Refund refundPayment(String saleId, double amount, String currency) throws PayPalRESTException {
        APIContext apiContext = config.apiContext();

        Amount refundAmount = new Amount();
        refundAmount.setCurrency(currency);
        refundAmount.setTotal(String.format("%.2f", amount));

        RefundRequest refundRequest = new RefundRequest();
        refundRequest.setAmount(refundAmount);

        Sale sale = new Sale();
        sale.setId(saleId);

        return sale.refund(apiContext, refundRequest);
    }
}
