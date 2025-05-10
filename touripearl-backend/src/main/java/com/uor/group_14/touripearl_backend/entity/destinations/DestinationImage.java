package com.uor.group_14.touripearl_backend.entity.destinations;

import com.uor.group_14.touripearl_backend.entity.enumEntity.DestinationImagePurpose;
import jakarta.persistence.*;
import lombok.*;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
@Entity(name="destination_image")
public class DestinationImage {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String destinationImageId;

    @Lob
    private byte[] destinationImageDirectory;//

    @Lob
    private byte[] destinationImageResourceUrl;//

    @Lob
    private byte[] destinationImageHash;//

    @Lob
    private byte[] destinationImageFileName;//

    @Column(name="purpose")
    @Enumerated(EnumType.STRING)
    private DestinationImagePurpose destinationImagePurpose;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "destination_id")
    private Destination destination;
}
