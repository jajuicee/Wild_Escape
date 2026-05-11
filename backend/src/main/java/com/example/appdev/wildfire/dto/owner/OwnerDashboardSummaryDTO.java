package com.example.appdev.wildfire.dto.owner;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class OwnerDashboardSummaryDTO {
    private long totalHotels;
    private long totalRooms;
    private long availableRooms;
    private long activeBookings;
    private long completedBookings;
    private long pendingBookings;
    private long cancelledBookings;
    private double averageHotelRating;
}

