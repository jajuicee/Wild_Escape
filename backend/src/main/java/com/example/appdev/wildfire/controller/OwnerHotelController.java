package com.example.appdev.wildfire.controller;

import com.example.appdev.wildfire.dto.hotel.HotelRequestDTO;
import com.example.appdev.wildfire.dto.hotel.HotelResponseDTO;
import com.example.appdev.wildfire.entity.Hotel;
import com.example.appdev.wildfire.entity.User;
import com.example.appdev.wildfire.service.HotelService;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/owner/hotels")
@RequiredArgsConstructor
public class OwnerHotelController {

    private final HotelService hotelService;
    private final ModelMapper mapper;

    @PostMapping
    public Hotel createHotel(@RequestBody HotelRequestDTO dto, @AuthenticationPrincipal User owner) {
        return hotelService.createHotelForOwner(dto, owner);
    }

    @PutMapping("/{hotelId}")
    public Hotel updateHotel(
            @PathVariable Long hotelId,
            @RequestBody HotelRequestDTO dto,
            @AuthenticationPrincipal User owner
    ) {
        return hotelService.updateOwnedHotel(hotelId, dto, owner);
    }

    @DeleteMapping("/{hotelId}")
    public void deleteHotel(@PathVariable Long hotelId, @AuthenticationPrincipal User owner) {
        hotelService.deleteOwnedHotel(hotelId, owner);
    }

    @GetMapping
    public List<HotelResponseDTO> getMyHotels(@AuthenticationPrincipal User owner) {
        return hotelService.getHotelsByOwner(owner.getId())
                .stream()
                .map(h -> mapper.map(h, HotelResponseDTO.class))
                .toList();
    }

}

