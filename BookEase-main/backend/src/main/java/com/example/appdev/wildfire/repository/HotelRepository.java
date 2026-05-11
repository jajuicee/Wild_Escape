package com.example.appdev.wildfire.repository;

import com.example.appdev.wildfire.entity.Hotel;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface HotelRepository extends JpaRepository<Hotel, Long> {
    List<Hotel> findByCityIgnoreCase(String city);

    List<Hotel> findByCountryIgnoreCase(String country);

    List<Hotel> findByOwnerId(Long ownerId);

    @Query("""
        SELECT COUNT(h)
        FROM Hotel h
        WHERE h.owner.id = :ownerId
    """)
    long countByOwnerId(Long ownerId);

}
