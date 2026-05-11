package com.example.appdev.wildfire.service;

import com.example.appdev.wildfire.dto.booking.BookingRequestDTO;
import com.example.appdev.wildfire.dto.hotel.HotelSummaryDTO;
import com.example.appdev.wildfire.entity.Booking;
import com.example.appdev.wildfire.entity.User;
import com.example.appdev.wildfire.entity.enums.BookingStatus;

import java.util.List;

public interface BookingService {

    Booking createBooking(Long userId, BookingRequestDTO dto);

    Booking getBookingById(Long id);

    List<Booking> getBookingsByUser(Long userId);

    List<Booking> getBookingsByRoom(Long roomId);

    List<Booking> getBookingsByStatus(BookingStatus status);

    Booking updateBookingStatus(Long id, BookingStatus status);

    void deleteBooking(Long id);

    Booking markAsPaid(Long bookingId);

    Booking markAsRefunded(Long bookingId);

    List<Booking> getBookingsByHotelOwner(User owner);

    boolean canUserReviewHotel(Long userId, Long hotelId);

    List<HotelSummaryDTO> getHotelsUserCanReview(Long userId);

    boolean hasUserCompletedAnyBooking(Long userId);

    long countConfirmedBookingsByUser(Long userId);

}
