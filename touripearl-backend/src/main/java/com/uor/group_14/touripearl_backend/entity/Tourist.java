package com.uor.group_14.touripearl_backend.entity;

import com.uor.group_14.touripearl_backend.entity.applicationUser.ApplicationUser;
import com.uor.group_14.touripearl_backend.entity.enumEntity.Interests;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.type.SqlTypes;

import java.util.Date;
import java.util.List;
import java.util.Map;

@Setter
@Getter
@NoArgsConstructor
@AllArgsConstructor
@Entity(name = "tourist")
@Builder
public class Tourist {
    @Id
    @Column(name = "property_id")
    private String propertyId;

    @Column(name = "first_name", nullable = false)
    private String firstName;

    @Column(name = "last_name", nullable = false)
    private String lastName;

    @Column(name="bio", length = 1000)
    private String bio;

    @JdbcTypeCode(SqlTypes.JSON)
    @Column(name = "languages", columnDefinition = "json")
    private Map<String, String> languages;

    @ElementCollection
    @Enumerated(EnumType.STRING)
    private List<Interests> interests;

    @Column(name = "joined_date")
    private Date joinDate;

    @OneToOne(cascade = CascadeType.ALL)
    private ApplicationUser applicationUser;

//    @OneToOne(mappedBy = "tourist", cascade = CascadeType.ALL)
//    private CustomTour customTour;

    @OneToMany(mappedBy = "tourist", cascade = CascadeType.ALL)
    private List<Review> reviews;

    @OneToMany(mappedBy = "tourist", cascade = CascadeType.ALL)
    private List<CustomTour> tourRequests;
}
