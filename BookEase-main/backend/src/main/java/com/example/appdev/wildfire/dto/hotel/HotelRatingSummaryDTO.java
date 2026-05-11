package com.example.appdev.wildfire.dto.hotel;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class HotelRatingSummaryDTO {
    private Long hotelId;
    private Double averageRating;
    private Long totalReviews;
}

