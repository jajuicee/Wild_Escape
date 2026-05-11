package com.example.appdev.wildfire.dto.room;

import lombok.Data;

@Data
public class RoomRequestDTO {
    private Long hotelId;
    private String roomType;
    private Integer capacity;
    private String description;
    private String imageUrl;
}
