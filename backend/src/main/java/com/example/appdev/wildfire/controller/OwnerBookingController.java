package com.example.appdev.wildfire.controller;

import com.example.appdev.wildfire.dto.booking.BookingResponseDTO;
import com.example.appdev.wildfire.entity.Booking;
import com.example.appdev.wildfire.entity.User;
import com.example.appdev.wildfire.service.BookingService;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/owner/bookings")
@RequiredArgsConstructor
public class OwnerBookingController {

    private final BookingService bookingService;
    private final ModelMapper mapper;

    @GetMapping(produces = "application/json")
    public List<BookingResponseDTO> getBookingsForOwner(@AuthenticationPrincipal User owner) {
        return bookingService.getBookingsByHotelOwner(owner).stream()
                .map(booking -> {
                    BookingResponseDTO dto = mapper.map(booking, BookingResponseDTO.class);

                    if (booking.getRoom() != null) {
                        dto.setRoomId(booking.getRoom().getId());
                        dto.setRoomType(booking.getRoom().getRoomType());

                        if (booking.getRoom().getHotel() != null) {
                            dto.setHotelName(booking.getRoom().getHotel().getName());
                        }
                    }

                    return dto;
                })
                .toList();
    }

}
