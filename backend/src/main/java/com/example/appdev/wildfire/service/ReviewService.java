package com.example.appdev.wildfire.service;

import com.example.appdev.wildfire.dto.hotel.HotelRatingSummaryDTO;
import com.example.appdev.wildfire.dto.review.ReviewRequestDTO;
import com.example.appdev.wildfire.entity.Review;
import com.example.appdev.wildfire.entity.User;

import java.util.List;

public interface ReviewService {

    Review createReview(ReviewRequestDTO dto, User user);

    List<Review> getReviewsByHotel(Long hotelId);

    List<Review> getReviewsByUser(Long userId);

    void deleteReview(Long id);

    void deleteOwnedReview(Long reviewId, User user);

    Double getAverageRatingByHotel(Long hotelId);

    HotelRatingSummaryDTO getHotelRatingSummary(Long hotelId);

    Review updateReview(Long reviewId, ReviewRequestDTO dto, User user);

    List<Review> getAllReviews();

    long countReviewsByUser(Long userId);
}
