package com.example.appdev.wildfire.service.impl;

import com.example.appdev.wildfire.dto.booking.BookingRequestDTO;
import com.example.appdev.wildfire.dto.hotel.HotelSummaryDTO;
import com.example.appdev.wildfire.entity.*;
import com.example.appdev.wildfire.entity.enums.BookingStatus;
import com.example.appdev.wildfire.entity.enums.PaymentStatus;
import com.example.appdev.wildfire.repository.*;
import com.example.appdev.wildfire.service.BookingService;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.temporal.ChronoUnit;
import java.util.List;

@Service
@RequiredArgsConstructor
public class BookingServiceImpl implements BookingService {

    private final BookingRepository bookingRepository;
    private final UserRepository userRepository;
    private final RoomRepository roomRepository;
    private final PriceOfferRepository priceOfferRepository;
    private final ReviewRepository reviewRepository;

    // =====================================
    // CREATE BOOKING (Authenticated User)
    // =====================================
    @Override
    @Transactional
    public Booking createBooking(Long userId, BookingRequestDTO dto) {

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User does not exist."));

        Room room = roomRepository.findById(dto.getRoomId())
                .orElseThrow(() -> new RuntimeException("Room does not exist."));

        PriceOffer offer = priceOfferRepository.findByRoomId(room.getId())
                .orElseThrow(() -> new RuntimeException("No price found for room."));

        if (!dto.getCheckOutDate().isAfter(dto.getCheckInDate())) {
            throw new RuntimeException("Check-out must be after check-in.");
        }

        boolean isTaken = bookingRepository.existsByRoomIdAndDateOverlap(
                room.getId(),
                dto.getCheckInDate(),
                dto.getCheckOutDate()
        );

        if (isTaken) {
            throw new RuntimeException("Room is not available for selected dates.");
        }

        if (dto.getGuests() > room.getCapacity()) {
            throw new RuntimeException("Guests exceed room capacity.");
        }

        long nights = ChronoUnit.DAYS.between(dto.getCheckInDate(), dto.getCheckOutDate());
        double totalPrice = nights * offer.getPricePerNight();

        Booking booking = Booking.builder()
                .user(user)
                .room(room)
                .checkInDate(dto.getCheckInDate())
                .checkOutDate(dto.getCheckOutDate())
                .totalPrice(totalPrice)
                .bookingStatus(BookingStatus.Pending)
                .paymentStatus(PaymentStatus.Unpaid)
                .build();

        // 🔴 MARK ROOM AS UNAVAILABLE
        room.setAvailable(false);
        roomRepository.save(room);

        return bookingRepository.save(booking);
    }


    // =====================================
    // GETTERS
    // =====================================
    @Override
    public Booking getBookingById(Long id) {
        return bookingRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Booking not found."));
    }

    @Override
    public List<Booking> getBookingsByUser(Long userId) {
        return bookingRepository.findByUserId(userId);
    }

    @Override
    public List<Booking> getBookingsByRoom(Long roomId) {
        return bookingRepository.findByRoomId(roomId);
    }

    @Override
    public List<Booking> getBookingsByStatus(BookingStatus status) {
        return bookingRepository.findByBookingStatus(status);
    }

    // =====================================
    // UPDATE STATUS
    // =====================================
    @Override
    @Transactional
    public Booking updateBookingStatus(Long id, BookingStatus status) {

        Booking booking = getBookingById(id);
        booking.setBookingStatus(status);

        // 🟢 RESTORE ROOM AVAILABILITY
        if (status == BookingStatus.Completed || status == BookingStatus.Cancelled) {
            Room room = booking.getRoom();
            room.setAvailable(true);
            roomRepository.save(room);
        }

        return bookingRepository.save(booking);
    }

    @Override
    public Booking markAsPaid(Long bookingId) {
        Booking booking = getBookingById(bookingId);

        if (booking.getPaymentStatus() == PaymentStatus.Paid) {
            throw new RuntimeException("Booking is already paid.");
        }

        booking.setPaymentStatus(PaymentStatus.Paid);
        booking.setBookingStatus(BookingStatus.Confirmed);

        return bookingRepository.save(booking);
    }

    @Override
    public Booking markAsRefunded(Long bookingId) {
        Booking booking = getBookingById(bookingId);

        if (booking.getPaymentStatus() != PaymentStatus.Paid) {
            throw new RuntimeException("Cannot refund an unpaid booking.");
        }

        booking.setPaymentStatus(PaymentStatus.Refunded);
        booking.setBookingStatus(BookingStatus.Cancelled);

        // 🟢 RESTORE ROOM AVAILABILITY
        Room room = booking.getRoom();
        room.setAvailable(true);
        roomRepository.save(room);

        return bookingRepository.save(booking);
    }

    // =====================================
    // Hotel Owners
    // =====================================
    @Override
    public List<Booking> getBookingsByHotelOwner(User owner) {
        return bookingRepository.findAll().stream()
                .filter(b -> b.getRoom() != null &&
                        b.getRoom().getHotel() != null &&
                        b.getRoom().getHotel().getOwner().getId().equals(owner.getId()))
                .toList();
    }

    // =====================================
    // DELETE BOOKING
    // =====================================
    @Override
    public void deleteBooking(Long id) {
        bookingRepository.deleteById(id);
    }

    @Override
    public boolean canUserReviewHotel(Long userId, Long hotelId) {

        boolean hasCompletedBooking =
                bookingRepository.existsByUserIdAndRoom_Hotel_IdAndBookingStatusAndCheckOutDateBefore(
                        userId,
                        hotelId,
                        BookingStatus.Completed,
                        LocalDate.now() // ⚠️ Use LocalDate (important)
                );

        boolean alreadyReviewed =
                reviewRepository.existsByUserIdAndHotelId(userId, hotelId);

        return hasCompletedBooking && !alreadyReviewed;
    }

    @Override
    public List<HotelSummaryDTO> getHotelsUserCanReview(Long userId) {
        return bookingRepository.findDistinctHotelsUserCanReview(
                userId,
                BookingStatus.Completed,
                LocalDate.now()
        );
    }

    @Override
    public boolean hasUserCompletedAnyBooking(Long userId) {
        return bookingRepository.findByUserId(userId).stream()
                .anyMatch(b ->
                        b.getBookingStatus() == BookingStatus.Completed &&
                                b.getCheckOutDate().isBefore(LocalDate.now())
                );
    }

    @Override
    public long countConfirmedBookingsByUser(Long userId) {
        return bookingRepository.countByUser_IdAndBookingStatus(
                userId,
                BookingStatus.Confirmed
        );
    }


}
