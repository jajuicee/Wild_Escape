package com.example.appdev.wildfire.dto.priceoffer;

import lombok.Data;

@Data
public class PriceOfferResponseDTO {
    private Long id;
    private Long roomId;
    private String roomType;
    private Long hotelId;
    private String hotelName;
    private Double pricePerNight;
    private String Currency;
}
