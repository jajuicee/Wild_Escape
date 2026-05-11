package com.example.appdev.wildfire.controller;

import com.example.appdev.wildfire.dto.room.RoomRequestDTO;
import com.example.appdev.wildfire.dto.room.RoomResponseDTO;
import com.example.appdev.wildfire.entity.Room;
import com.example.appdev.wildfire.entity.User;
import com.example.appdev.wildfire.service.RoomService;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/owner/rooms")
@RequiredArgsConstructor
public class OwnerRoomController {

    private final RoomService roomService;
    private final ModelMapper mapper;

    @GetMapping
    public List<RoomResponseDTO> getMyRooms(@AuthenticationPrincipal User owner) {
        return roomService.getRoomsByOwner(owner.getId())
                .stream()
                .map(room -> {
                    RoomResponseDTO dto = mapper.map(room, RoomResponseDTO.class);

                    // REQUIRED: Hotel ID
                    dto.setHotelId(room.getHotel().getId());

                    // REQUIRED: Price offer mapping (ModelMapper won't do this)
                    if (room.getPriceOffer() != null) {
                        dto.setPricePerNight(room.getPriceOffer().getPricePerNight());
                        dto.setCurrency(room.getPriceOffer().getCurrency());
                    }

                    return dto;
                })
                .toList();
    }



    @PostMapping("/{hotelId}")
    public Room createRoom(
            @PathVariable Long hotelId,
            @RequestBody RoomRequestDTO dto,
            @AuthenticationPrincipal User owner
    ) {
        return roomService.createRoomForOwner(hotelId, dto, owner);
    }

    @PutMapping("/{roomId}")
    public Room updateRoom(
            @PathVariable Long roomId,
            @RequestBody RoomRequestDTO dto,
            @AuthenticationPrincipal User owner
    ) {
        return roomService.updateOwnedRoom(roomId, dto, owner);
    }

    @DeleteMapping("/{roomId}")
    public void deleteRoom(
            @PathVariable Long roomId,
            @AuthenticationPrincipal User owner
    ) {
        roomService.deleteOwnedRoom(roomId, owner);
    }
}

