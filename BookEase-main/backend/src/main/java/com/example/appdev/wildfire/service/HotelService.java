package com.example.appdev.wildfire.service;

import com.example.appdev.wildfire.dto.hotel.HotelRequestDTO;
import com.example.appdev.wildfire.entity.Hotel;
import com.example.appdev.wildfire.entity.User;

import java.util.List;

public interface HotelService {

    Hotel createHotel(Hotel hotel);

    Hotel getHotelById(Long id);

    List<Hotel> getAllHotels();

    List<Hotel> searchByCity(String city);

    List<Hotel> searchByCountry(String country);

    Hotel updateHotel(Long id, Hotel hotel);

    void deleteHotel(Long id);

    Hotel createHotelForOwner(HotelRequestDTO dto, User owner);

    Hotel updateOwnedHotel(Long hotelId, HotelRequestDTO dto, User owner);

    void deleteOwnedHotel(Long hotelId, User owner);

    List<Hotel> getHotelsByOwner(Long ownerId);
}