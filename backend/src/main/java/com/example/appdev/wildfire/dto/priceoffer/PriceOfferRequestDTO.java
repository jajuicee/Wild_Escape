package com.example.appdev.wildfire.dto.priceoffer;

import lombok.Data;

@Data
public class PriceOfferRequestDTO {
    private Long roomId;
    private Double pricePerNight;
    private String Currency;
}
