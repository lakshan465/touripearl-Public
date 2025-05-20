package com.uor.group_14.touripearl_backend.entity.applicationUser;

import jakarta.persistence.*;
import lombok.*;

@Setter
@Getter
@AllArgsConstructor
@NoArgsConstructor
@Builder
@Entity(name = "profile_image")
public class ProfileImage {
    @Id
    @Column(name = "property_id", length = 100)
    private String propertyId;

    @Lob
    private byte[] directory;

    @Lob
    private byte[] resourceUrl;

    @Lob
    private byte[] hash;

    @Lob
    private byte[] fileName;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id")
    private ApplicationUser applicationUser;
}
