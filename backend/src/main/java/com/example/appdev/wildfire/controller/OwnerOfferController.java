package com.example.appdev.wildfire.controller;

import com.example.appdev.wildfire.dto.priceoffer.PriceOfferRequestDTO;
import com.example.appdev.wildfire.dto.priceoffer.PriceOfferResponseDTO;
import com.example.appdev.wildfire.entity.PriceOffer;
import com.example.appdev.wildfire.entity.User;
import com.example.appdev.wildfire.service.PriceOfferService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/owner/offers")
@RequiredArgsConstructor
public class OwnerOfferController {
    private final PriceOfferService offerService;

    @GetMapping
    public List<PriceOfferResponseDTO> getMyOffers(@AuthenticationPrincipal User owner) {
        return offerService.getOffersByOwner(owner.getId())
                .stream()
                .map(offer -> {
                    PriceOfferResponseDTO dto = new PriceOfferResponseDTO();
                    dto.setId(offer.getId());
                    dto.setPricePerNight(offer.getPricePerNight());
                    dto.setCurrency(offer.getCurrency());

                    // Add ROOM info
                    dto.setRoomId(offer.getRoom().getId());
                    dto.setRoomType(offer.getRoom().getRoomType());

                    // Add HOTEL info
                    dto.setHotelId(offer.getRoom().getHotel().getId());
                    dto.setHotelName(offer.getRoom().getHotel().getName());

                    return dto;
                })
                .toList();
    }

    @PutMapping("/{offerId}")
    public PriceOffer updateOffer(
            @PathVariable Long offerId,
            @RequestBody PriceOfferRequestDTO dto,
            @AuthenticationPrincipal User owner
    ) {
        return offerService.updateOwnedOffer(offerId, dto, owner);
    }


    @PostMapping("/{roomId}")
    public PriceOffer createOffer(
            @PathVariable Long roomId,
            @RequestBody PriceOfferRequestDTO dto,
            @AuthenticationPrincipal User owner
    ) {
        return offerService.createOfferForOwner(roomId, dto, owner);
    }

    @DeleteMapping("/{offerId}")
    public void deleteOffer(
            @PathVariable Long offerId,
            @AuthenticationPrincipal User owner
    ) {
        offerService.deleteOwnedOffer(offerId, owner);
    }
}
