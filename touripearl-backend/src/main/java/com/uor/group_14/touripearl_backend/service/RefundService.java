package com.uor.group_14.touripearl_backend.service;

import com.paypal.base.rest.PayPalRESTException;
import com.uor.group_14.touripearl_backend.dto.request.booking.BookingCancelRequestDto;
import com.uor.group_14.touripearl_backend.dto.response.refund.RefundResponseDto;
import com.uor.group_14.touripearl_backend.entity.refund.RefundStatus;
import org.springframework.data.domain.Page;

public interface RefundService {
    void requestRefund(BookingCancelRequestDto dto);
    void updateRefundStatus(String refundId, RefundStatus status) throws PayPalRESTException;

    Page<RefundResponseDto> searchByKeywordAndFilters(int page, int size, RefundStatus status, String keyword);

    RefundResponseDto getRefundRequest(String refundId);
}
