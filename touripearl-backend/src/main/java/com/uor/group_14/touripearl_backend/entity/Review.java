package com.uor.group_14.touripearl_backend.entity;

import com.uor.group_14.touripearl_backend.entity.applicationUser.ApplicationUser;
import com.uor.group_14.touripearl_backend.entity.guide.Guide;
import jakarta.persistence.*;
import lombok.*;

import java.util.Date;

@Entity(name = "reviews")
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@Builder
public class Review {
    @Id
    @Column(name = "review_id", length = 80)
    private String id;

    @ManyToOne
    @JoinColumn(name = "guide_id", nullable = false,
            referencedColumnName = "property_id")
    private Guide guide;

    @ManyToOne
    @JoinColumn(name = "tourist_id", nullable = false,
            referencedColumnName = "property_id")
    private Tourist tourist;

    private int rating;

    private String comment;

    private Date createdAt;
}
