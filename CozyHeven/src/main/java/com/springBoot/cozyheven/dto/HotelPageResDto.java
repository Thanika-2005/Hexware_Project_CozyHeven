package com.springBoot.cozyheven.dto;

import java.math.BigDecimal;

public record HotelPageResDto(
        long hotelId,
        String hotelName,
        String location ,
        String description,
        int ratings
) {}
