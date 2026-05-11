package com.example.appdev.wildfire.repository;

import com.example.appdev.wildfire.entity.Room;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface RoomRepository extends JpaRepository<Room, Long> {
    List<Room> findByHotelId(Long hotelId);

    List<Room> findByRoomTypeContainingIgnoreCase(String roomType);


    @Query("""
        SELECT COUNT(r)
        FROM Room r
        WHERE r.hotel.owner.id = :ownerId
    """)
    long countRoomsByOwner(Long ownerId);

    @Query("""
        SELECT COUNT(r)
        FROM Room r
        WHERE r.hotel.owner.id = :ownerId
        AND r.isAvailable = true
    """)
    long countAvailableRoomsByOwner(Long ownerId);

}
