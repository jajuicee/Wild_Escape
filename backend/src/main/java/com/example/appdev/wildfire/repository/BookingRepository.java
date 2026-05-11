package com.example.appdev.wildfire.repository;

import com.example.appdev.wildfire.dto.hotel.HotelSummaryDTO;
import com.example.appdev.wildfire.entity.Booking;
import com.example.appdev.wildfire.entity.enums.BookingStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

public interface BookingRepository extends JpaRepository<Booking, Long> {

    List<Booking> findByUserId(Long userId);

    List<Booking> findByRoomId(Long roomId);

    List<Booking> findByBookingStatus(BookingStatus status);

    // CHECK IF ROOM IS ALREADY BOOKED FOR GIVEN DATE RANGE
    @Query("""
       SELECT CASE WHEN COUNT(b) > 0 THEN true ELSE false END
       FROM Booking b
       WHERE b.room.id = :roomId
       AND b.bookingStatus <> com.example.appdev.wildfire.entity.enums.BookingStatus.Cancelled
       AND (
             (b.checkInDate <= :checkOut AND b.checkOutDate >= :checkIn)
           )
       """)
    boolean existsByRoomIdAndDateOverlap(
            Long roomId,
            LocalDate checkIn,
            LocalDate checkOut
    );


    boolean existsByUserIdAndRoom_Hotel_IdAndBookingStatusAndCheckOutDateBefore(
            Long userId,
            Long hotelId,
            BookingStatus bookingStatus,
            LocalDate checkOutDate
    );

    @Query("""
    SELECT DISTINCT new com.example.appdev.wildfire.dto.hotel.HotelSummaryDTO(
        h.id,
        h.name
    )
    FROM Booking b
    JOIN b.room r
    JOIN r.hotel h
    WHERE b.user.id = :userId
      AND b.bookingStatus = :status
      AND b.checkOutDate <= :today
      AND NOT EXISTS (
          SELECT 1 FROM Review rev
          WHERE rev.user.id = :userId
            AND rev.hotel.id = h.id
      )
""")
    List<HotelSummaryDTO> findDistinctHotelsUserCanReview(
            Long userId,
            BookingStatus status,
            LocalDate today
    );


    @Query("""
        SELECT COUNT(b)
        FROM Booking b
        WHERE b.room.hotel.owner.id = :ownerId
        AND b.bookingStatus = :status
    """)
    long countBookingsByStatus( @Param("ownerId") Long ownerId, @Param("status") BookingStatus status);


    @Query("""
        SELECT COUNT(b)
        FROM Booking b
        WHERE b.room.hotel.owner.id = :ownerId
    """)
    Long countBookingsByOwner(@Param("ownerId") Long ownerId);

    long countByUser_IdAndBookingStatus(Long userId, BookingStatus status);

}
