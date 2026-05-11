package com.example.appdev.wildfire.dto.hotel;

import lombok.Data;

@Data
public class HotelResponseDTO {
    private Long id;
    private String name;
    private String address;
    private String city;
    private String country;
    private Double starRating;
    private String description;
    private String contactNumber;
}
