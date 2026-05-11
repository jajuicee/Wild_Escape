package com.example.appdev.wildfire.service.impl;

import com.example.appdev.wildfire.dto.room.RoomRequestDTO;
import com.example.appdev.wildfire.dto.room.RoomResponseDTO;
import com.example.appdev.wildfire.entity.Hotel;
import com.example.appdev.wildfire.entity.PriceOffer;
import com.example.appdev.wildfire.entity.Room;
import com.example.appdev.wildfire.entity.User;
import com.example.appdev.wildfire.repository.BookingRepository;
import com.example.appdev.wildfire.repository.HotelRepository;
import com.example.appdev.wildfire.repository.PriceOfferRepository;
import com.example.appdev.wildfire.repository.RoomRepository;
import com.example.appdev.wildfire.service.ImageStorageService;
import com.example.appdev.wildfire.service.RoomService;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class RoomServiceImpl implements RoomService {

    private final RoomRepository roomRepository;
    private final PriceOfferRepository  priceOfferRepository;
    private final ModelMapper mapper;
    private final BookingRepository bookingRepository;
    private final HotelRepository hotelRepository;
    private final ImageStorageService imageStorageService;

    @Override
    public Room createRoom(Room room) {
        return roomRepository.save(room);
    }

    @Override
    public Room getRoomById(Long id) {
        return roomRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Room not found."));
    }

    @Override
    public List<Room> getRoomsByHotel(Long hotelId) {
        return roomRepository.findByHotelId(hotelId);
    }

    @Override
    public List<RoomResponseDTO> getRoomsWithPricing(Long hotelId) {
        List<Room> rooms = roomRepository.findByHotelId(hotelId);

        return rooms.stream().map(room -> {
            RoomResponseDTO dto = mapper.map(room, RoomResponseDTO.class);
            dto.setHotelName(room.getHotel().getName());

            PriceOffer offer = priceOfferRepository.findByRoomId(room.getId()).orElse(null);

            if (offer != null) {
                dto.setPricePerNight(offer.getPricePerNight());
                dto.setCurrency(offer.getCurrency());
            }

            return dto;
        }).collect(Collectors.toList());
    }


    @Override
    public List<RoomResponseDTO> getAllRoomsWithPricing() {
        List<Room> rooms = roomRepository.findAll();

        return rooms.stream().map(room -> {
            RoomResponseDTO dto = mapper.map(room, RoomResponseDTO.class);
            dto.setHotelName(room.getHotel().getName());

            PriceOffer offer = priceOfferRepository.findByRoomId(room.getId())
                    .orElse(null);

            if (offer != null) {
                dto.setPricePerNight(offer.getPricePerNight());
                dto.setCurrency(offer.getCurrency());
            } else {
                dto.setCurrency("₱");
            }

            return dto;
        }).toList();
    }


    @Override
    public List<Room> getAllRooms() {
        return roomRepository.findAll();
    }

    @Override
    @Transactional
    public Room updateRoom(Long roomId, Room updatedData) {

        Room room = roomRepository.findById(roomId)
                .orElseThrow(() -> new RuntimeException("Room not found"));

        // 🔥 DELETE OLD IMAGE IF CHANGED
        if (
                updatedData.getImageUrl() != null &&
                        !updatedData.getImageUrl().equals(room.getImageUrl())
        ) {
            imageStorageService.deleteImageIfExists(room.getImageUrl());
            room.setImageUrl(updatedData.getImageUrl());
        }

        room.setRoomType(updatedData.getRoomType());
        room.setCapacity(updatedData.getCapacity());
        room.setDescription(updatedData.getDescription());

        return roomRepository.save(room);
    }

    @Override
    public void deleteRoom(Long id) {
        roomRepository.deleteById(id);
    }


    @Override
    public Room createRoomForOwner(Long hotelId, RoomRequestDTO dto, User owner) {
        Hotel hotel = hotelRepository.findById(hotelId)
                .orElseThrow(() -> new RuntimeException("Hotel not found"));

        if (!hotel.getOwner().getId().equals(owner.getId())) {
            throw new AccessDeniedException("You do not own this hotel");
        }

        Room room = mapper.map(dto, Room.class);
        room.setHotel(hotel);

        return roomRepository.save(room);
    }

    @Transactional
    public Room updateOwnedRoom(
            Long roomId,
            RoomRequestDTO dto,
            User owner
    ) {
        Room room = roomRepository.findById(roomId)
                .orElseThrow(() -> new RuntimeException("Room not found"));

        // ✅ Ownership check
        if (!room.getHotel().getOwner().getId().equals(owner.getId())) {
            throw new RuntimeException("Unauthorized");
        }

        // 🔥 Image handling
        if (dto.getImageUrl() != null &&
                !dto.getImageUrl().equals(room.getImageUrl())) {

            imageStorageService.deleteImageIfExists(room.getImageUrl());
            room.setImageUrl(dto.getImageUrl());
        }

        // ✅ Update allowed fields ONLY
        room.setRoomType(dto.getRoomType());
        room.setCapacity(dto.getCapacity());
        room.setDescription(dto.getDescription());

        // ❌ DO NOT TOUCH room.setId()
        // ❌ DO NOT TOUCH room.setHotel()

        return roomRepository.save(room);
    }


    @Override
    public void deleteOwnedRoom(Long roomId, User owner) {
        Room room = roomRepository.findById(roomId)
                .orElseThrow(() -> new RuntimeException("Room not found"));

        if (!room.getHotel().getOwner().getId().equals(owner.getId())) {
            throw new AccessDeniedException("You do not own this room");
        }

        imageStorageService.deleteImageIfExists(room.getImageUrl());

        roomRepository.delete(room);
    }


    @Override
    public List<RoomResponseDTO> searchAvailableRooms(
            Long hotelId,
            LocalDate checkIn,
            LocalDate checkOut,
            int guests
    ) {
        List<Room> rooms = roomRepository.findByHotelId(hotelId);

        return rooms.stream()
                .filter(room -> room.getCapacity() >= guests)
                .filter(room -> !bookingRepository.existsByRoomIdAndDateOverlap(
                        room.getId(), checkIn, checkOut
                ))
                .map(room -> {
                    RoomResponseDTO dto = mapper.map(room, RoomResponseDTO.class);

                    PriceOffer offer = priceOfferRepository.findByRoomId(room.getId()).orElse(null);
                    if (offer != null) {
                        dto.setPricePerNight(offer.getPricePerNight());
                        dto.setCurrency(offer.getCurrency());
                    }

                    return dto;
                })
                .toList();
    }

    @Override
    public List<Room> getRoomsByOwner(Long ownerId) {
        return roomRepository.findAll().stream()
                .filter(r -> r.getHotel() != null &&
                        r.getHotel().getOwner() != null &&
                        r.getHotel().getOwner().getId().equals(ownerId))
                .toList();
    }

}
