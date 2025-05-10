package com.uor.group_14.touripearl_backend.entity.reservation;


import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import lombok.*;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.time.LocalDateTime;

@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
@Builder
@Entity(name = "tourPerson")
@EntityListeners(AuditingEntityListener.class)
public class TourPerson {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String propertyId;
    @NotNull
    private String name;

    private String passportNumber;

    @ManyToOne
    private Reservation reservation;

    @NotNull
    private PersonType type;

    @CreatedDate
    @Column(updatable = false, nullable = false)
    private LocalDateTime createdAt;

    @LastModifiedDate
    @Column(nullable = false)
    private LocalDateTime updatedAt;
}
