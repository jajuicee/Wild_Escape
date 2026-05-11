package com.example.appdev.wildfire.dto.review;

import lombok.Data;

@Data
public class ReviewRequestDTO {
    private Long hotelId;
    private Double rating;
    private String comment;
}
