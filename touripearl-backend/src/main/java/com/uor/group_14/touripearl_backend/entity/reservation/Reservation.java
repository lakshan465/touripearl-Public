package com.uor.group_14.touripearl_backend.entity.reservation;

import com.uor.group_14.touripearl_backend.entity.Tourist;
import com.uor.group_14.touripearl_backend.entity.tour.Tour;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import lombok.*;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
@Builder
@Entity(name = "reservation")
@EntityListeners(AuditingEntityListener.class)
public class Reservation {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String propertyId;

    @ManyToOne
    @NotNull
    private Tour tour;

    @ManyToOne
    @NotNull
    private Tourist tourist;

    @NotNull
    private LocalDate startDate;

    @NotNull
    private LocalDate endDate;

    @Enumerated(EnumType.STRING)
    private ReservationStatus status;

    @Column(nullable = true)
    private String cancellationReason;

    private Double totalCost;

    @OneToMany(mappedBy = "reservation", cascade = CascadeType.ALL)
    private List<TourPerson>  tourPeoples;

    @CreatedDate
    @Column(updatable = false, nullable = false)
    private LocalDateTime createdAt;

    @LastModifiedDate
    @Column(nullable = false)
    private LocalDateTime updatedAt;


}
