package com.example.appdev.wildfire.dto.booking;

import lombok.Data;
import java.time.LocalDate;

@Data
public class BookingRequestDTO {
    private Long roomId;
    private LocalDate checkInDate;
    private LocalDate checkOutDate;
    private int guests;
}
