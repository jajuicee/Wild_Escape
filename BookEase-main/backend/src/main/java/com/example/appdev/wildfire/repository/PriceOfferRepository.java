package com.example.appdev.wildfire.repository;

import com.example.appdev.wildfire.entity.PriceOffer;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface PriceOfferRepository extends JpaRepository<PriceOffer, Long> {
    Optional<PriceOffer> findByRoomId(Long roomId);

    @Query("""
    SELECT COUNT(o) FROM PriceOffer o
    WHERE o.id = :offerId
    AND o.room.hotel.owner.id = :ownerId
""")
    int checkOwnership(Long offerId, Long ownerId);

    @Modifying
    @Query("DELETE FROM PriceOffer o WHERE o.id = :offerId")
    void fastDelete(Long offerId);
}
