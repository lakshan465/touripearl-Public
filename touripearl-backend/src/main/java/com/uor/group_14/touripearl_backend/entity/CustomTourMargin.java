package com.uor.group_14.touripearl_backend.entity;


import com.uor.group_14.touripearl_backend.entity.applicationUser.ApplicationUser;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.Cascade;

import java.util.List;

@Setter
@Getter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Entity
@Data
@Table(name = "custom_tour_margin")
public class CustomTourMargin {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String  guideId;

    private Long tourId;

    private double margin;

    private double vehicleCost;

    private double hotelCost;

    private double visitTicketCost;


}
