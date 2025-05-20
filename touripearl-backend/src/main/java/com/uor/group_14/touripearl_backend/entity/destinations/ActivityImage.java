package com.uor.group_14.touripearl_backend.entity.destinations;

import jakarta.persistence.*;
import lombok.*;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
@Entity(name = "activityImage")
public class ActivityImage {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String activityImageId;

    @Column(name = "image_directory")
    private byte[] activityImageDirectory;

    @Column(name = "image_resource_url")
    private byte[] activityImageResourceUrl;

    @Column(name = "image_hash")
    private byte[] activityImageHash;

    @Column(name = "image_filename")
    private byte[] activityImageFileName;
}
