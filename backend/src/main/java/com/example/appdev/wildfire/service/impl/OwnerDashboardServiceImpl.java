package com.example.appdev.wildfire.service.impl;

import com.example.appdev.wildfire.dto.owner.OwnerDashboardSummaryDTO;
import com.example.appdev.wildfire.entity.enums.BookingStatus;
import com.example.appdev.wildfire.repository.BookingRepository;
import com.example.appdev.wildfire.repository.HotelRepository;
import com.example.appdev.wildfire.repository.ReviewRepository;
import com.example.appdev.wildfire.repository.RoomRepository;
import com.example.appdev.wildfire.service.OwnerDashboardService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class OwnerDashboardServiceImpl implements OwnerDashboardService {

    private final HotelRepository hotelRepository;
    private final RoomRepository roomRepository;
    private final BookingRepository bookingRepository;
    private final ReviewRepository reviewRepository;

    @Override
    public OwnerDashboardSummaryDTO getDashboardSummary(Long ownerId) {

        long totalHotels = hotelRepository.countByOwnerId(ownerId);
        long totalRooms = roomRepository.countRoomsByOwner(ownerId);
        long availableRooms = roomRepository.countAvailableRoomsByOwner(ownerId);

        long activeBookings =
                bookingRepository.countBookingsByStatus(ownerId, BookingStatus.Confirmed);

        long completedBookings =
                bookingRepository.countBookingsByStatus(ownerId, BookingStatus.Completed);

        long pendingBookings =
                bookingRepository.countBookingsByStatus(ownerId, BookingStatus.Pending);

        long cancelledBookings =
                bookingRepository.countBookingsByStatus(ownerId, BookingStatus.Cancelled);

        double avgRating = reviewRepository.getAverageRatingByOwner(ownerId);

        return new OwnerDashboardSummaryDTO(
                totalHotels,
                totalRooms,
                availableRooms,
                activeBookings,
                completedBookings,
                pendingBookings,
                cancelledBookings,
                avgRating
        );
    }
}

