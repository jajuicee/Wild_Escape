package com.example.appdev.wildfire.entity;

import com.fasterxml.jackson.annotation.JsonBackReference;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "priceoffer")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PriceOffer {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "price_id")
    private Long id;

    @OneToOne
    @JoinColumn(name = "room_id")
    @JsonBackReference
    private Room room;

    @Column(name = "price_per_night")
    private Double pricePerNight;

    private String currency = "PHP";
}
