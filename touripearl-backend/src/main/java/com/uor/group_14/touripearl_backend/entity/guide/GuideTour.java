package com.uor.group_14.touripearl_backend.entity.guide;

import jakarta.persistence.*;
import lombok.*;

@Setter
@Getter
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "guide_tour")
@Builder
public class GuideTour {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long propertyId;

    @Column(name="guide_id",nullable=false,length = 50)
    private String guideId;

    @Column(name="tour_id",nullable=false,length = 50)
    private Long tourId;
}
