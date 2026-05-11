package com.example.appdev.wildfire.config;

import com.example.appdev.wildfire.dto.booking.BookingRequestDTO;
import com.example.appdev.wildfire.dto.booking.BookingResponseDTO;
import com.example.appdev.wildfire.dto.room.RoomResponseDTO;
import com.example.appdev.wildfire.entity.Booking;
import com.example.appdev.wildfire.entity.Room;
import org.modelmapper.ModelMapper;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class ModelMapperConfig {

    @Bean
    public ModelMapper modelMapper() {
        ModelMapper mapper = new ModelMapper();

        // Custom mapping for Booking → BookingResponseDTO
        mapper.typeMap(Booking.class, BookingResponseDTO.class).addMappings(m -> {
            m.map(src -> src.getUser().getId(), BookingResponseDTO::setUserId);
            m.map(src -> src.getRoom().getId(), BookingResponseDTO::setRoomId);
        });


        return mapper;
    }


}
