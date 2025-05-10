package com.uor.group_14.touripearl_backend.repository.payment;

import com.uor.group_14.touripearl_backend.entity.payment.PayOutEntity;
import org.springframework.data.jpa.repository.JpaRepository;

public interface PayOutRepo extends JpaRepository<PayOutEntity, String> {
}
