package com.uor.group_14.touripearl_backend.service.serviceImpl;

import com.uor.group_14.touripearl_backend.dto.request.ReviewRequestDto;
import com.uor.group_14.touripearl_backend.entity.Review;
import com.uor.group_14.touripearl_backend.entity.Tourist;
import com.uor.group_14.touripearl_backend.entity.applicationUser.ApplicationUser;
import com.uor.group_14.touripearl_backend.entity.bookings.Booking;
import com.uor.group_14.touripearl_backend.entity.bookings.BookingStatus;
import com.uor.group_14.touripearl_backend.entity.guide.Guide;
import com.uor.group_14.touripearl_backend.exception.EntryNotFoundException;
import com.uor.group_14.touripearl_backend.repository.ApplicationUserRepository;
import com.uor.group_14.touripearl_backend.repository.GuideRepo;
import com.uor.group_14.touripearl_backend.repository.ReviewRepository;
import com.uor.group_14.touripearl_backend.repository.TouristRepo;
import com.uor.group_14.touripearl_backend.repository.booking.BookingRepository;
import com.uor.group_14.touripearl_backend.service.ReviewService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.Date;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class ReviewServiceImpl implements ReviewService {
    private final ReviewRepository reviewRepository;
    private final GuideRepo guideRepo;
    private final TouristRepo touristRepo;
    private final ApplicationUserRepository userRepository;
    private final BookingRepository bookingRepository;

    @Override
    public void addReview(ReviewRequestDto dto, String guideId) {

        Optional<Guide> selectedGuide = guideRepo.findById(guideId);
        if (selectedGuide.isEmpty()) {
            throw new EntryNotFoundException(String.format("Guide %s not found", guideId));
        }

        Optional<ApplicationUser> selectedUserTourist = userRepository.findById(dto.getTouristUserId());
        if (selectedUserTourist.isEmpty()) {
            throw new EntryNotFoundException(String.format("User %s not found", dto.getTouristUserId()));
        }

        Optional<Tourist> selectedTourist = touristRepo.findByApplicationUser_Email(selectedUserTourist.get().getEmail());
        if (selectedTourist.isEmpty()) {
            throw new EntryNotFoundException(String.format("Tourist %s not found", dto.getTouristUserId()));
        }

        Review review = Review.builder()
                .id(UUID.randomUUID().toString())
                .guide(selectedGuide.get())
                .tourist(selectedTourist.get())
                .rating(dto.getRating())
                .comment(dto.getComment())
                .createdAt(new Date())
                .build();

        reviewRepository.save(review);
        updateGuide(selectedGuide.get());
        Booking booking =bookingRepository.findById(dto.getBookingId()).orElseThrow(()->new EntryNotFoundException("Booking Not Found"));
        booking.setStatus(BookingStatus.COMPLETED);
        bookingRepository.save(booking);
    }

    private void updateGuide(Guide guide) {
        List<Review> reviews = reviewRepository.findAllByGuide(guide);
        guide.setStarMean(meanOfStars(reviews));

        guideRepo.save(guide);
    }

    private int sumOfStars(List<Review> reviews) {
        int sumOfStars = 0;

        for (Review r : reviews) {
            sumOfStars = sumOfStars + r.getRating();
        }

        return sumOfStars;
    }

    private double meanOfStars(List<Review> reviews) {
        try {
            if (reviews.isEmpty()) return 0;

            double mean = (double) sumOfStars(reviews) / reviews.size();
            return Math.round(mean * 10.0) / 10.0;
        } catch (Exception e) {
            return 0;
        }
    }

    @Override
    public List<Review> getReviewsByProductId(String productId) {
        return List.of();
    }
}
