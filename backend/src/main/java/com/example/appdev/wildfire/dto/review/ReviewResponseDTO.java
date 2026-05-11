package com.example.appdev.wildfire.dto.review;

import lombok.Data;

@Data
public class ReviewResponseDTO {
    private Long id;
    private Long hotelId;
    private Long userId;
    private String userName;
    private String hotelName;
    private Double rating;
    private String comment;
    private String createdAt;
}
