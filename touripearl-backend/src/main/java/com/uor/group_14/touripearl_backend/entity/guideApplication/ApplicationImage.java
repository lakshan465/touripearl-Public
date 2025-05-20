package com.uor.group_14.touripearl_backend.entity.guideApplication;

import com.uor.group_14.touripearl_backend.entity.enumEntity.ImagePurpose;
import jakarta.persistence.*;
import lombok.*;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
@Entity(name = "application_image")
public class ApplicationImage {
    @Id
    @Column(name = "image_id", length = 100)
    private String imageId;

    @Lob
    private byte[] directory;

    @Lob
    private byte[] resourceUrl;

    @Lob
    private byte[] hash;

    @Lob
    private byte[] fileName;

    @Column(name="purpose")
    @Enumerated(EnumType.STRING)
    private ImagePurpose purpose;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "guide_application_id")
    private GuideApplication guideApplication;
}
