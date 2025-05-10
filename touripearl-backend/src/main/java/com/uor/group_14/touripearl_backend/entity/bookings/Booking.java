package com.uor.group_14.touripearl_backend.entity.bookings;

import com.uor.group_14.touripearl_backend.entity.ConfirmCustomTour;
import com.uor.group_14.touripearl_backend.entity.CustomTour;
import com.uor.group_14.touripearl_backend.entity.payment.PaymentEntity;
import com.uor.group_14.touripearl_backend.entity.reservation.Reservation;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;

@Getter
@Setter
@Entity(name = "booking")
@AllArgsConstructor
@Builder
@NoArgsConstructor
public class Booking {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String propertyId;

    @ManyToOne
    private Reservation reservation;

    @ManyToOne
    private ConfirmCustomTour confirmCustomTour;

    @Column(nullable = false)
    private LocalDate startDate;

    @Column(nullable = false)
    private LocalDate endDate;

    @OneToOne
    private PaymentEntity paymentEntity;

    @Enumerated(EnumType.STRING)
    private BookingStatus status;
}
