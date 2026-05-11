package com.example.appdev.wildfire.repository;

import com.example.appdev.wildfire.entity.Review;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ReviewRepository extends JpaRepository<Review, Long> {
    List<Review> findByHotelId(Long hotelId);
    List<Review> findByUserId(Long userId);

    @Query("SELECT AVG(r.rating) FROM Review r WHERE r.hotel.id = :hotelId")
    Double getAverageRatingByHotel(@Param("hotelId") Long hotelId);

    @Query("""
        SELECT AVG(r.rating), COUNT(r)
        FROM Review r
        WHERE r.hotel.id = :hotelId
    """)
    Object getHotelRatingSummary(@Param("hotelId") Long hotelId);

    @Query("""
        SELECT COALESCE(AVG(r.rating), 0)
        FROM Review r
        WHERE r.hotel.owner.id = :ownerId
    """)
    double getAverageRatingByOwner(@Param("ownerId") Long ownerId);


    boolean existsByUserIdAndHotelId(Long userId, Long hotelId);

    long countByUserId(Long userId);

}
