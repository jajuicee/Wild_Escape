package com.example.appdev.wildfire.service;

import com.example.appdev.wildfire.dto.room.RoomRequestDTO;
import com.example.appdev.wildfire.dto.room.RoomResponseDTO;
import com.example.appdev.wildfire.entity.Room;
import com.example.appdev.wildfire.entity.User;

import java.time.LocalDate;
import java.util.List;

public interface RoomService {

    Room createRoom(Room room);

    Room getRoomById(Long id);

    List<Room> getRoomsByHotel(Long hotelId);

    List<Room> getAllRooms();

    Room updateRoom(Long id, Room room);

    void deleteRoom(Long id);

    List<RoomResponseDTO> getRoomsWithPricing(Long hotelId);

    List<RoomResponseDTO> getAllRoomsWithPricing();

    List<RoomResponseDTO> searchAvailableRooms(
            Long hotelId,
            LocalDate checkIn,
            LocalDate checkOut,
            int guests
    );

    Room createRoomForOwner(Long hotelId, RoomRequestDTO dto, User owner);

    Room updateOwnedRoom(Long roomId, RoomRequestDTO dto, User owner);

    void deleteOwnedRoom(Long roomId, User owner);

    List<Room> getRoomsByOwner(Long ownerId);
}
