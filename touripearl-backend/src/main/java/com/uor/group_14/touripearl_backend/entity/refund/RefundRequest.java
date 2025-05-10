package com.uor.group_14.touripearl_backend.entity.refund;

import com.uor.group_14.touripearl_backend.entity.bookings.Booking;
import jakarta.persistence.*;
import lombok.*;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.time.LocalDateTime;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
@Entity
@EntityListeners(AuditingEntityListener.class)
public class RefundRequest {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String propertyId;
    @ManyToOne
    @JoinColumn(name = "booking_id")
    private Booking booking;
    @Column(nullable = false)
    private String reason;
    @Enumerated(EnumType.STRING)
    private RefundStatus status;
    @CreatedDate
    private LocalDateTime createdAt;
    @LastModifiedDate
    private LocalDateTime updatedAt;
}
