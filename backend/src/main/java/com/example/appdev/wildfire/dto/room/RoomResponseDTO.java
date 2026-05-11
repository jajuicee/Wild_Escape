package com.example.appdev.wildfire.dto.room;

import lombok.Data;

@Data
public class RoomResponseDTO {
    private Long id;
    private Long hotelId;
    private String hotelName;
    private String roomType;
    private Integer capacity;
    private String description;
    private Double pricePerNight;
    private String imageUrl;
    private String currency;
}
