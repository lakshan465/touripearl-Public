package com.uor.group_14.touripearl_backend.dto.request;

import com.uor.group_14.touripearl_backend.entity.tour.TourTimeline;
import jakarta.validation.constraints.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class TourCreateRequestDto {

    @NotBlank(message = "Tour name is required")
    private String name;

    private String description;

    @NotNull(message = "Date is required")
    @Future(message = "Date must be in future")
    private LocalDate date;

    private int duration;

    @NotNull(message = "Price is required")
    @Min(value = 1, message = "Price must be at least 1")
    private Double price;

    @NotNull(message = "Available Slots is required")
    @Min(value = 1, message = "Available Slots must be at least 1")
    private int availableSlots;

    private String difficultyLevel;

    private boolean includesTransport;

    private boolean includesMeals;

    private String meetingPoint;

    private String departureTime;

    private List<TourTimeline> timeline;

    private List<String> destinations;

    private boolean isAvailable;

    private LocalDateTime createdAt;
}

