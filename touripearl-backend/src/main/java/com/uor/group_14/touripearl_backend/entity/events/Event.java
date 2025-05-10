package com.uor.group_14.touripearl_backend.entity.events;

import com.uor.group_14.touripearl_backend.entity.applicationUser.ApplicationUser;
import com.uor.group_14.touripearl_backend.entity.events.embeds.Accessibility;
import com.uor.group_14.touripearl_backend.entity.events.embeds.Restrictions;
import com.uor.group_14.touripearl_backend.entity.events.embeds.TicketPrice;
import jakarta.persistence.*;
import jakarta.validation.constraints.Future;
import jakarta.validation.constraints.NotNull;
import lombok.*;

import java.time.LocalDateTime;
import java.util.Set;

@Getter
@Setter
@Builder
@AllArgsConstructor
@NoArgsConstructor
@Entity(name = "event")
public class Event {
    @Id
    @Column(name = "event_id")
    private String id;
    @Column(nullable = false)
    @NotNull
    private String title;
    @Column(length = 1000)
    private String description;
    private String shortDescription;
    @Column(length = 1000)
    private String location;
    @Future
    private LocalDateTime startDateTime;
    @Future
    private LocalDateTime endDateTime;
    private String venue;
    private String weatherSuitability;
    private LocalDateTime updateAt;
    @ElementCollection
    private Set<String> highlights;
    @Embedded
    private TicketPrice ticketPrice;
    @Embedded
    private Accessibility accessibility;
    @Embedded
    private Restrictions restrictions;
    @OneToMany(mappedBy = "event", cascade = CascadeType.ALL, orphanRemoval = true)
    private Set<EventImages> images;
    @ManyToOne()
    private ApplicationUser updatedBy;

}
