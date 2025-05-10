package com.uor.group_14.touripearl_backend.entity.payment;

import com.uor.group_14.touripearl_backend.entity.ConfirmCustomTour;
import com.uor.group_14.touripearl_backend.entity.reservation.Reservation;
import jakarta.persistence.*;
import lombok.*;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.time.LocalDateTime;

@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
@Builder
@Entity
@EntityListeners(AuditingEntityListener.class)
public class PaymentEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String propertyId;

    private String paymentId;

    private String payerId;

    private String amount;

    private String salesId;

    private String currency;

    @OneToOne
    @JoinColumn(name = "reservation_property_id",nullable = true)
    private Reservation reservation;


    @OneToOne
    @JoinColumn(name = "confirm_custom_tour_id",nullable = true)
    private ConfirmCustomTour confirmCustomTour;

    @CreatedDate
    private LocalDateTime createdDate;

    @OneToOne(mappedBy = "paymentEntity")
    private PayOutEntity payOutEntity;

}
