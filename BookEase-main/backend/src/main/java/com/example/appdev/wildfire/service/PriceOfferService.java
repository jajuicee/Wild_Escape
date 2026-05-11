package com.example.appdev.wildfire.service;

import com.example.appdev.wildfire.dto.priceoffer.PriceOfferRequestDTO;
import com.example.appdev.wildfire.entity.PriceOffer;
import com.example.appdev.wildfire.entity.User;

import java.util.List;

public interface PriceOfferService {
    PriceOffer createPriceOffer(PriceOffer priceOffer);

    PriceOffer getOfferByRoom(Long roomId);

    void deletePriceOffer(Long id);

    // Owner creates an offer for their room
    PriceOffer createOfferForOwner(Long roomId, PriceOfferRequestDTO dto, User owner);

    // Owner updates an existing offer
    PriceOffer updateOwnedOffer(Long offerId, PriceOfferRequestDTO dto, User owner);

    void deleteOwnedOffer(Long offerId, User owner);

    List<PriceOffer> getOffersByOwner(Long ownerId);

}
