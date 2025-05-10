package com.uor.group_14.touripearl_backend.repository.payment;

import com.uor.group_14.touripearl_backend.entity.payment.PaymentEntity;
import org.springframework.data.jpa.repository.JpaRepository;

public interface PaymentRepository extends JpaRepository<PaymentEntity,String> {
}
