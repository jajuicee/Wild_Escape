package com.example.appdev.wildfire.controller;

import com.example.appdev.wildfire.dto.room.RoomRequestDTO;
import com.example.appdev.wildfire.dto.room.RoomResponseDTO;
import com.example.appdev.wildfire.entity.Room;
import com.example.appdev.wildfire.service.RoomService;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/rooms")
@RequiredArgsConstructor
public class RoomController {

    private final RoomService roomService;
    private final ModelMapper mapper;


    @GetMapping("/{id}")
    public RoomResponseDTO getRoomById(@PathVariable Long id) {
        return mapper.map(roomService.getRoomById(id), RoomResponseDTO.class);
    }

    @GetMapping
    public List<RoomResponseDTO> getAllRooms() {
        return roomService.getAllRoomsWithPricing();
    }


}
