package com.example.appdev.wildfire.dto.room;

import lombok.Data;

@Data
public class RoomSummaryDTO {
    private Long id;
    private String roomType;
    private Integer capacity;
}
