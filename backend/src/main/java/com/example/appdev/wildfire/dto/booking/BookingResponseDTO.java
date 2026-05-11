package com.example.appdev.wildfire.dto.booking;

import lombok.Data;

import java.time.LocalDate;

@Data
public class BookingResponseDTO {
    private Long id;
    private Long userId;
    private Long roomId;
    private String hotelName;
    private String roomType;
    private LocalDate checkInDate;
    private LocalDate checkOutDate;
    private String bookingStatus;
    private String paymentStatus;
    private Double totalPrice;
}
