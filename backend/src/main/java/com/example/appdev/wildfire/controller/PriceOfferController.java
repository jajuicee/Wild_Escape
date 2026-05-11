package com.example.appdev.wildfire.controller;

import com.example.appdev.wildfire.dto.priceoffer.PriceOfferRequestDTO;
import com.example.appdev.wildfire.dto.priceoffer.PriceOfferResponseDTO;
import com.example.appdev.wildfire.entity.PriceOffer;
import com.example.appdev.wildfire.service.PriceOfferService;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/offers")
@RequiredArgsConstructor
public class PriceOfferController {

    private final PriceOfferService priceOfferService;
    private final ModelMapper mapper;

    @GetMapping("/room/{roomId}")
    public PriceOfferResponseDTO getOfferByRoom(@PathVariable Long roomId) {
        PriceOffer offer = priceOfferService.getOfferByRoom(roomId);
        return mapper.map(offer, PriceOfferResponseDTO.class);
    }

}

