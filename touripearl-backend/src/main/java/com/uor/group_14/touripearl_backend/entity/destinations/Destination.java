package com.uor.group_14.touripearl_backend.entity.destinations;


import jakarta.persistence.*;
import lombok.*;

import java.util.Set;


@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
@Entity(name="destination")
public class Destination {
    @Id
    @Column(name="destination_id", nullable=false, length=100)
    private String destinationId;

    @Column(name = "destination_name", nullable = false, length=30, unique=true)
    private String destinationName;

    @Column( name="short_description",nullable = false, length=500)
    private String shortDescription;

    @Column( name="full_description",nullable = false, length=1500)
    private String fullDescription;

    @Column(name = "location", nullable = false, length=100)
    private String location;

    @OneToMany(mappedBy = "destination", cascade = CascadeType.ALL, orphanRemoval = true)
    private Set<Activity> activities;

    @OneToMany(mappedBy = "destination", cascade = CascadeType.ALL, orphanRemoval = true)
    private Set<DestinationImage> allDestinationImages;

    @Column(name = "best_time_to_visit", length = 200)
    private String bestTimeToVisit;

    @Column(name="status",length=10)
    private boolean isActive;

}
