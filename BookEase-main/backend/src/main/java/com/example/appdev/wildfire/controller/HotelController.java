package com.example.appdev.wildfire.controller;

import com.example.appdev.wildfire.dto.hotel.HotelRequestDTO;
import com.example.appdev.wildfire.dto.hotel.HotelResponseDTO;
import com.example.appdev.wildfire.dto.room.RoomResponseDTO;
import com.example.appdev.wildfire.entity.Hotel;
import com.example.appdev.wildfire.entity.User;
import com.example.appdev.wildfire.service.HotelService;
import com.example.appdev.wildfire.service.RoomService;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.lang.reflect.Field;
import java.time.LocalDate;
import java.util.Arrays;
import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/hotels")
@RequiredArgsConstructor
public class HotelController {

    private final HotelService hotelService;
    private final ModelMapper mapper;
    private final RoomService roomService;


    @GetMapping("/{id}")
    public HotelResponseDTO getHotelById(@PathVariable Long id) {
        System.out.println("🔥 HotelController reached: " + id);
        return mapper.map(hotelService.getHotelById(id), HotelResponseDTO.class);
    }


    @GetMapping
    public List<HotelResponseDTO> getHotels(
            @RequestParam(value = "city", required = false) String city
    ) {

        System.out.println("City filter received: " + city);

        List<Hotel> hotels;

        if (city != null && !city.isBlank()) {
            hotels = hotelService.searchByCity(city);
        } else {
            hotels = hotelService.getAllHotels();
        }

        return hotels.stream()
                .map(h -> mapper.map(h, HotelResponseDTO.class))
                .toList();
    }

    @GetMapping("/debug-column")
    public String debug() {
        try {
            Field[] fields = Hotel.class.getDeclaredFields();
            return Arrays.stream(fields)
                    .map(Field::getName)
                    .collect(Collectors.joining(", "));
        } catch (Exception e) {
            return e.getMessage();
        }
    }

    @GetMapping("/{hotelId}/rooms")
    public List<RoomResponseDTO> getRoomsByHotel(@PathVariable Long hotelId) {
        return roomService.getRoomsWithPricing(hotelId);
    }

    @GetMapping("/{hotelId}/rooms/available")
    public List<RoomResponseDTO> getAvailableRooms(
            @PathVariable Long hotelId,
            @RequestParam LocalDate checkIn,
            @RequestParam LocalDate checkOut,
            @RequestParam int guests
    ) {
        return roomService.searchAvailableRooms(hotelId, checkIn, checkOut, guests);
    }


}
