package com.uor.group_14.touripearl_backend.entity.dispute;

import jakarta.persistence.*;
import lombok.*;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
@Entity(name="dispute_image")
public class DisputeImage {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String disputeImageId;

    @Lob
    private byte[] disputeImageDirectory;

    @Lob
    private byte[] disputeImageResourceUrl;

    @Lob
    private byte[] disputeImageHash;

    @Lob
    private byte[] disputeImageFileName;

    @ManyToOne(fetch = FetchType.LAZY,cascade = CascadeType.ALL)
    @JoinColumn(name = "dispute_id")
    private Dispute dispute;
    
}
