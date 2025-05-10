package com.uor.group_14.touripearl_backend.entity.payment;

import jakarta.persistence.Entity;
import jakarta.persistence.EntityListeners;
import jakarta.persistence.Id;
import jakarta.persistence.OneToOne;
import lombok.*;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
@Builder
@Entity
@EntityListeners(AuditingEntityListener.class)
public class PayOutEntity {
    @Id
    private String payoutId;

    private double serviceCharge;

    private double payoutAmount;

    @OneToOne
    private PaymentEntity paymentEntity;
}
