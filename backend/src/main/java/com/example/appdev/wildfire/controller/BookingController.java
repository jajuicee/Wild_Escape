package com.example.appdev.wildfire.controller;

import com.example.appdev.wildfire.dto.booking.BookingRequestDTO;
import com.example.appdev.wildfire.dto.booking.BookingResponseDTO;
import com.example.appdev.wildfire.dto.hotel.HotelSummaryDTO;
import com.example.appdev.wildfire.entity.Booking;
import com.example.appdev.wildfire.entity.User;
import com.example.appdev.wildfire.entity.enums.BookingStatus;
import com.example.appdev.wildfire.service.BookingService;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/bookings")
@RequiredArgsConstructor
public class BookingController {

    private final BookingService bookingService;
    private final ModelMapper mapper;

    // ===============================
    //  CREATE BOOKING (AUTH REQUIRED)
    // ===============================
    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public BookingResponseDTO createBooking(
            @RequestBody BookingRequestDTO dto,
            Authentication authentication
    ) {
        if (authentication == null) {
            throw new RuntimeException("You must be logged in to book.");
        }

        User user = (User) authentication.getPrincipal();
        Booking booking = bookingService.createBooking(user.getId(), dto);

        return mapper.map(booking, BookingResponseDTO.class);
    }

    // =======================
    // GET BOOKING BY ID
    // =======================
    @GetMapping("/{id}")
    public BookingResponseDTO getBookingById(@PathVariable Long id) {
        var booking = bookingService.getBookingById(id);
        return mapBooking(booking);
    }

    // =======================
    // GET BOOKINGS OF USER
    // =======================
    @GetMapping("/my")
    public List<BookingResponseDTO> getMyBookings(Authentication auth) {
        User user = (User) auth.getPrincipal();

        return bookingService.getBookingsByUser(user.getId())
                .stream()
                .map(this::mapBooking)
                .toList();
    }

    // =======================
    // GET BOOKINGS BY STATUS
    // =======================
    @GetMapping("/status/{status}")
    public List<BookingResponseDTO> getBookingsByStatus(@PathVariable BookingStatus status) {
        return bookingService.getBookingsByStatus(status)
                .stream()
                .map(b -> mapper.map(b, BookingResponseDTO.class))
                .collect(Collectors.toList());
    }

    // =======================
    // UPDATE BOOKING STATUS (ADMIN USE)
    // =======================
    @PutMapping("/{id}/status")
    public BookingResponseDTO updateStatus(
            @PathVariable Long id,
            @RequestParam BookingStatus status
    ) {
        Booking updated = bookingService.updateBookingStatus(id, status);

        return mapper.map(updated, BookingResponseDTO.class);
    }


    @PutMapping("/{id}/pay")
    public BookingResponseDTO payBooking(@PathVariable Long id) {
        Booking updated = bookingService.markAsPaid(id);
        return mapper.map(updated, BookingResponseDTO.class);
    }

    // =======================
    // REFUND BOOKING (ADMIN USE)
    // =======================
    @PutMapping("/{id}/refund")
    public BookingResponseDTO refundBooking(@PathVariable Long id) {
        Booking updated = bookingService.markAsRefunded(id);
        return mapper.map(updated, BookingResponseDTO.class);
    }

    // =======================
    // DELETE BOOKING
    // =======================
    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deleteBooking(@PathVariable Long id) {
        bookingService.deleteBooking(id);
    }

    private BookingResponseDTO mapBooking(Booking booking) {
        BookingResponseDTO dto = mapper.map(booking, BookingResponseDTO.class);

        dto.setHotelName(booking.getRoom().getHotel().getName());
        dto.setRoomType(booking.getRoom().getRoomType());

        dto.setUserId(booking.getUser().getId());
        dto.setRoomId(booking.getRoom().getId());

        dto.setCheckInDate(booking.getCheckInDate());
        dto.setCheckOutDate(booking.getCheckOutDate());

        dto.setBookingStatus(booking.getBookingStatus().name());
        dto.setPaymentStatus(booking.getPaymentStatus().name());

        return dto;
    }

    @GetMapping("/can-review/{hotelId}")
    public Map<String, Boolean> canReview(
            @PathVariable Long hotelId,
            @AuthenticationPrincipal User user
    ) {
        boolean allowed = bookingService.canUserReviewHotel(user.getId(), hotelId);
        return Map.of("allowed", allowed);
    }

    @GetMapping("/can-review")
    public List<HotelSummaryDTO> getReviewableHotels(
            @AuthenticationPrincipal User user
    ) {
        return bookingService.getHotelsUserCanReview(user.getId());
    }

    @GetMapping("/has-completed-booking")
    public boolean hasCompletedBooking(Authentication auth) {
        Long userId = ((User) auth.getPrincipal()).getId();
        return bookingService.hasUserCompletedAnyBooking(userId);
    }

}
