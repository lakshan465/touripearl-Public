package com.uor.group_14.touripearl_backend.entity.events;

import com.uor.group_14.touripearl_backend.entity.events.entityEnum.EventImageType;
import jakarta.persistence.*;
import lombok.*;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Entity(name = "event_images")
public class EventImages {
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

    @Column(name="image_type")
    @Enumerated(EnumType.STRING)
    private EventImageType eventImageType;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "event_id")
    private Event event;
}
