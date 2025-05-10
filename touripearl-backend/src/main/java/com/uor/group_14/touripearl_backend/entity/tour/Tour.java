package com.uor.group_14.touripearl_backend.entity.tour;

import com.uor.group_14.touripearl_backend.entity.destinations.Destination;
import com.uor.group_14.touripearl_backend.entity.guide.Guide;
import jakarta.persistence.*;
import jakarta.validation.constraints.Future;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Setter
@Getter
@Builder
@Entity
@NoArgsConstructor
@AllArgsConstructor
public class Tour {

    @Id
    private String id;

    @Column(nullable = false)
    @NotBlank(message = "Tour name is required")
    private String name;

    @Column(columnDefinition = "TEXT")
    private String description;

    @Column(nullable = false)
    @NotNull(message = "Date is required")
    @Future(message = "Date must be in future")
    private LocalDate date;

    @Column(nullable = false)
    private int duration;

    @Column(nullable = false)
    @Min(value = 1, message = "Price must be at least 1")
    private Double price;

    @Column(nullable = false)
    @Min(value = 1, message = "Available Slots must be at least 1")
    private Integer availableSlots;

    @Column(nullable = false)
    private String difficultyLevel;

    @Column(nullable = false)
    private boolean includesTransport;

    @Column(nullable = false)
    private boolean includesMeals;

    @Column(nullable = false)
    private String meetingPoint;

    @Column(nullable = false)
    private String departureTime;

    @OneToMany(mappedBy = "tour", cascade = CascadeType.ALL,orphanRemoval = true)
    private List<TourTimeline> timeline;

    @ManyToMany
    @JoinTable(
            name = "tour_destination",
            joinColumns = @JoinColumn(name = "tour_id"),
            inverseJoinColumns = @JoinColumn(name = "destination_id")
    )
    private List<Destination> destinations;

    @ManyToOne
    @JoinColumn(name = "guide_id")
    private Guide guide;

    @Column(nullable = false)
    private boolean isAvailable;

    @CreationTimestamp
    private LocalDateTime createdAt;
}
