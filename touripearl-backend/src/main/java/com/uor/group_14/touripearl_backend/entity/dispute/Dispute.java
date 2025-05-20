package com.uor.group_14.touripearl_backend.entity.dispute;

import com.uor.group_14.touripearl_backend.entity.applicationUser.ApplicationUser;
import com.uor.group_14.touripearl_backend.entity.bookings.Booking;
import jakarta.persistence.*;
import lombok.*;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
@Entity
@EntityListeners(AuditingEntityListener.class)
public class Dispute {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String propertyId;

    @ManyToOne
    @JoinColumn(name = "raised_by_user_id")
    private ApplicationUser raisedBy;

    @ManyToOne
    @JoinColumn(name = "booking_id")
    private Booking booking;

    @OneToMany(mappedBy = "dispute", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<DisputeImage> disputeImages ;

    private String description;
    @Enumerated(EnumType.STRING)
    private DisputeStatus status;
    @Column(nullable = true)
    private String decision;
    private disputeReason reason;
    @CreatedDate
    private LocalDateTime createdAt;
    @LastModifiedDate
    private LocalDateTime updatedAt;
}
