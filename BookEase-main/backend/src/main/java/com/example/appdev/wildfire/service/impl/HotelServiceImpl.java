package com.example.appdev.wildfire.service.impl;

import com.example.appdev.wildfire.dto.hotel.HotelRequestDTO;
import com.example.appdev.wildfire.entity.Hotel;
import com.example.appdev.wildfire.entity.User;
import com.example.appdev.wildfire.repository.HotelRepository;
import com.example.appdev.wildfire.service.HotelService;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class HotelServiceImpl implements HotelService {

    private final HotelRepository hotelRepository;
    private final ModelMapper mapper;

    @Override
    public Hotel createHotel(Hotel hotel) {
        return hotelRepository.save(hotel);
    }

    @Override
    public Hotel getHotelById(Long id) {
        return hotelRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Hotel not found."));
    }

    @Override
    public List<Hotel> getAllHotels() {
        return hotelRepository.findAll();
    }

    @Override
    public List<Hotel> searchByCity(String city) {
        return hotelRepository.findByCityIgnoreCase(city);
    }

    @Override
    public List<Hotel> searchByCountry(String country) {
        return hotelRepository.findByCountryIgnoreCase(country);
    }

    @Override
    public Hotel createHotelForOwner(HotelRequestDTO dto, User owner) {
        Hotel hotel = mapper.map(dto, Hotel.class);
        hotel.setOwner(owner);
        return hotelRepository.save(hotel);
    }

    @Override
    public List<Hotel> getHotelsByOwner(Long ownerId) {
        return hotelRepository.findByOwnerId(ownerId);
    }

    @Override
    public Hotel updateOwnedHotel(Long hotelId, HotelRequestDTO dto, User owner) {
        Hotel hotel = hotelRepository.findById(hotelId)
                .orElseThrow(() -> new RuntimeException("Hotel not found"));

        if (!hotel.getOwner().getId().equals(owner.getId())) {
            throw new AccessDeniedException("You do not own this hotel");
        }

        mapper.map(dto, hotel);
        return hotelRepository.save(hotel);
    }

    @Override
    public void deleteOwnedHotel(Long hotelId, User owner) {
        Hotel hotel = hotelRepository.findById(hotelId)
                .orElseThrow(() -> new RuntimeException("Hotel not found"));

        if (!hotel.getOwner().getId().equals(owner.getId())) {
            throw new AccessDeniedException("You do not own this hotel");
        }

        hotelRepository.delete(hotel);
    }

    // ❌ You probably won't need these anymore for admins,
    // but you can keep them for SUPER ADMIN if needed
    @Override
    public Hotel updateHotel(Long id, Hotel updated) {
        Hotel existing = getHotelById(id);

        existing.setName(updated.getName());
        existing.setAddress(updated.getAddress());
        existing.setCity(updated.getCity());
        existing.setCountry(updated.getCountry());
        existing.setDescription(updated.getDescription());
        existing.setContactNumber(updated.getContactNumber());

        return hotelRepository.save(existing);
    }

    @Override
    public void deleteHotel(Long id) {
        hotelRepository.deleteById(id);
    }
}
