package com.example.appdev.wildfire.service.impl;

import com.example.appdev.wildfire.dto.hotel.HotelRatingSummaryDTO;
import com.example.appdev.wildfire.dto.review.ReviewRequestDTO;
import com.example.appdev.wildfire.entity.Hotel;
import com.example.appdev.wildfire.entity.Review;
import com.example.appdev.wildfire.entity.User;
import com.example.appdev.wildfire.repository.HotelRepository;
import com.example.appdev.wildfire.repository.ReviewRepository;
import com.example.appdev.wildfire.service.ReviewService;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ReviewServiceImpl implements ReviewService {

    private final ReviewRepository reviewRepository;
    private final HotelRepository hotelRepository;
    private final ModelMapper mapper;

    @Override
    @Transactional
    public Review createReview(ReviewRequestDTO dto, User user) {

        Hotel hotel = hotelRepository.findById(dto.getHotelId())
                .orElseThrow(() -> new RuntimeException("Hotel not found"));

        // 🚫 BLOCK DUPLICATE REVIEW
        if (reviewRepository.existsByUserIdAndHotelId(user.getId(), hotel.getId())) {
            throw new IllegalStateException("You already reviewed this hotel");
        }

        Review review = new Review();
        review.setHotel(hotel);
        review.setUser(user);
        review.setRating(dto.getRating());
        review.setComment(dto.getComment());

        return reviewRepository.save(review);
    }


    @Override
    public void deleteOwnedReview(Long reviewId, User user) {
        Review review = reviewRepository.findById(reviewId)
                .orElseThrow(() -> new RuntimeException("Review not found"));

        if (!review.getUser().getId().equals(user.getId())) {
            throw new AccessDeniedException("You do not own this review");
        }

        reviewRepository.delete(review);
    }

    @Override
    public Double getAverageRatingByHotel(Long hotelId) {
        Double avg = reviewRepository.getAverageRatingByHotel(hotelId);
        return avg != null ? avg : 0.0;
    }

    @Override
    public HotelRatingSummaryDTO getHotelRatingSummary(Long hotelId) {
        Object result = reviewRepository.getHotelRatingSummary(hotelId);

        Object[] row = (Object[]) result;

        Double avgRating = row[0] != null ? ((Number) row[0]).doubleValue() : 0.0;
        Long totalReviews = ((Number) row[1]).longValue();

        return new HotelRatingSummaryDTO(
                hotelId,
                avgRating,
                totalReviews
        );
    }

    public List<Review> getAllReviews() {
        return reviewRepository.findAll();
    }


    @Override
    @Transactional
    public Review updateReview(Long reviewId, ReviewRequestDTO dto, User user) {

        Review review = reviewRepository.findById(reviewId)
                .orElseThrow(() -> new RuntimeException("Review not found"));

        if (!review.getUser().getId().equals(user.getId())) {
            throw new AccessDeniedException("You do not own this review");
        }

        review.setRating(dto.getRating());
        review.setComment(dto.getComment());

        return reviewRepository.save(review);
    }


    @Override
    public List<Review> getReviewsByHotel(Long hotelId) {
        return reviewRepository.findByHotelId(hotelId);
    }

    @Override
    public List<Review> getReviewsByUser(Long userId) {
        return reviewRepository.findByUserId(userId);
    }

    @Override
    public void deleteReview(Long id) {
        reviewRepository.deleteById(id);
    }

    @Override
    public long countReviewsByUser(Long userId) {
        return reviewRepository.countByUserId(userId);
    }

}