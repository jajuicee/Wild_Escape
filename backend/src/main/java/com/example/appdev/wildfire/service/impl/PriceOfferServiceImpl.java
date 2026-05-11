package com.example.appdev.wildfire.service.impl;

import com.example.appdev.wildfire.dto.priceoffer.PriceOfferRequestDTO;
import com.example.appdev.wildfire.entity.PriceOffer;
import com.example.appdev.wildfire.entity.Room;
import com.example.appdev.wildfire.entity.User;
import com.example.appdev.wildfire.repository.PriceOfferRepository;
import com.example.appdev.wildfire.repository.RoomRepository;
import com.example.appdev.wildfire.service.PriceOfferService;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class PriceOfferServiceImpl implements PriceOfferService {

    private final PriceOfferRepository priceOfferRepository;
    private final RoomRepository roomRepository;

    @Override
    public PriceOffer createPriceOffer(PriceOffer priceOffer) {
        return priceOfferRepository.save(priceOffer);
    }

    @Override
    public PriceOffer getOfferByRoom(Long roomId) {
        return priceOfferRepository.findByRoomId(roomId)
                .orElseThrow(() -> new RuntimeException("No price offer found for this room"));
    }

    @Override
    public void deletePriceOffer(Long id) {
        priceOfferRepository.deleteById(id);
    }

    @Override
    public PriceOffer createOfferForOwner(Long roomId, PriceOfferRequestDTO dto, User owner) {
        Room room = roomRepository.findById(roomId)
                .orElseThrow(() -> new RuntimeException("Room not found"));

        if (!room.getHotel().getOwner().getId().equals(owner.getId())) {
            throw new AccessDeniedException("You do not own this room");
        }

        PriceOffer offer = new PriceOffer();
        offer.setRoom(room);
        offer.setPricePerNight(dto.getPricePerNight());
        offer.setCurrency(dto.getCurrency());

        return priceOfferRepository.save(offer);
    }

    @Override
    public PriceOffer updateOwnedOffer(Long offerId, PriceOfferRequestDTO dto, User owner) {
        PriceOffer offer = priceOfferRepository.findById(offerId)
                .orElseThrow(() -> new RuntimeException("Offer not found"));

        if (!offer.getRoom().getHotel().getOwner().getId().equals(owner.getId())) {
            throw new AccessDeniedException("You do not own this offer");
        }

        offer.setPricePerNight(dto.getPricePerNight());
        offer.setCurrency(dto.getCurrency());

        return priceOfferRepository.save(offer);
    }

    @Override
    @Transactional
    public void deleteOwnedOffer(Long offerId, User owner) {

        if (priceOfferRepository.checkOwnership(offerId, owner.getId()) == 0) {
            throw new AccessDeniedException("You do not own this offer");
        }

        priceOfferRepository.fastDelete(offerId);
    }

    @Override
    public List<PriceOffer> getOffersByOwner(Long ownerId) {
        return priceOfferRepository.findAll().stream()
                .filter(offer -> offer.getRoom() != null &&
                        offer.getRoom().getHotel() != null &&
                        offer.getRoom().getHotel().getOwner().getId().equals(ownerId))
                .toList();
    }

}
