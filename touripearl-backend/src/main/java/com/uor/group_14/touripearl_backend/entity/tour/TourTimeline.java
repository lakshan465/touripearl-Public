package com.uor.group_14.touripearl_backend.entity.tour;

import jakarta.persistence.*;
import lombok.*;

@Getter
@Setter
@Entity
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class TourTimeline {

    @Id
    private String id;

    @ManyToOne
    @JoinColumn(name = "tour_id", nullable = false)
    private Tour tour;

    @Column(nullable = false)
    private String time;

    @Column(nullable = false)
    private String activity;//Description of activity
    private String location;//Optional, where the activity happens

    @Column(nullable = false)
    private int sequenceOrder;//Order of events in the timeline

    //Getters & Setters
}
