package com.example.appdev.wildfire.controller;

import com.example.appdev.wildfire.dto.hotel.HotelRatingSummaryDTO;
import com.example.appdev.wildfire.dto.review.ReviewRequestDTO;
import com.example.appdev.wildfire.dto.review.ReviewResponseDTO;
import com.example.appdev.wildfire.entity.Review;
import com.example.appdev.wildfire.entity.User;
import com.example.appdev.wildfire.service.ReviewService;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/reviews")
@RequiredArgsConstructor
public class ReviewController {

    private final ReviewService reviewService;
    private final ModelMapper mapper;

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public ReviewResponseDTO createReview(
            @RequestBody ReviewRequestDTO dto,
            @AuthenticationPrincipal User user
    ) {
        Review review = reviewService.createReview(dto, user);
        return mapper.map(review, ReviewResponseDTO.class);
    }

    @PutMapping("/{id}")
    public Review updateReview(
            @PathVariable Long id,
            @RequestBody ReviewRequestDTO dto,
            @AuthenticationPrincipal User user
    ) {
        return reviewService.updateReview(id, dto, user);
    }

    @GetMapping
    public List<ReviewResponseDTO> getAllReviews() {
        return reviewService.getAllReviews()
                .stream()
                .map(r -> {
                    ReviewResponseDTO dto = mapper.map(r, ReviewResponseDTO.class);
                    dto.setUserName(r.getUser().getName());
                    dto.setHotelName(r.getHotel().getName());
                    dto.setHotelId(r.getHotel().getId());
                    dto.setUserId(r.getUser().getId());
                    dto.setCreatedAt(r.getCreatedAt().toString());
                    return dto;
                })
                .toList();
    }

    @GetMapping("/hotel/{hotelId}")
    public List<ReviewResponseDTO> getReviewsByHotel(@PathVariable Long hotelId) {
        return reviewService.getReviewsByHotel(hotelId)
                .stream()
                .map(r -> {
                    ReviewResponseDTO dto = mapper.map(r, ReviewResponseDTO.class);
                    dto.setUserName(r.getUser().getName());
                    dto.setHotelId(r.getHotel().getId());
                    dto.setUserId(r.getUser().getId());
                    dto.setCreatedAt(r.getCreatedAt().toString());
                    return dto;
                })
                .toList();
    }

    @GetMapping("/user/{userId}")
    public List<ReviewResponseDTO> getReviewsByUser(@PathVariable Long userId) {
        return reviewService.getReviewsByUser(userId)
                .stream()
                .map(r -> mapper.map(r, ReviewResponseDTO.class))
                .collect(Collectors.toList());
    }

    @GetMapping("/me")
    public List<ReviewResponseDTO> getMyReviews(
            @AuthenticationPrincipal User user
    ) {
        return reviewService.getReviewsByUser(user.getId())
                .stream()
                .map(r -> {
                    ReviewResponseDTO dto = mapper.map(r, ReviewResponseDTO.class);
                    dto.setUserName(r.getUser().getName());
                    dto.setHotelId(r.getHotel().getId());
                    dto.setUserId(r.getUser().getId());
                    dto.setCreatedAt(r.getCreatedAt().toString());
                    return dto;
                })
                .toList();
    }

    // ✅ DELETE OWN REVIEW ONLY
    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deleteReview(
            @PathVariable Long id,
            @AuthenticationPrincipal User user
    ) {
        reviewService.deleteOwnedReview(id, user);
    }

    @GetMapping("/hotel/{hotelId}/average")
    public Double getAverageRating(@PathVariable Long hotelId) {
        return reviewService.getAverageRatingByHotel(hotelId);
    }

    @GetMapping("/hotel/{hotelId}/rating-summary")
    public HotelRatingSummaryDTO getHotelRatingSummary(@PathVariable Long hotelId) {
        return reviewService.getHotelRatingSummary(hotelId);
    }

//    @DeleteMapping("/{id}")
//    @ResponseStatus(HttpStatus.NO_CONTENT)
//    public void deleteReview(@PathVariable Long id) {
//        reviewService.deleteReview(id);
//    }
}
