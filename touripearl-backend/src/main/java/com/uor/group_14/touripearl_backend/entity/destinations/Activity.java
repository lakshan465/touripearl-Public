package com.uor.group_14.touripearl_backend.entity.destinations;

import jakarta.persistence.*;
import lombok.*;


@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
@Entity(name = "activity")
public class Activity {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String activityId;

    @Column(name = "activity_name", nullable = false, length = 50)
    private String activityName;

    @OneToOne(cascade = CascadeType.ALL)
    @JoinColumn(name = "activity_image_id")
    private ActivityImage activityImage;

    @ManyToOne
    @JoinColumn(name = "destination_id")
    private Destination destination;
}
