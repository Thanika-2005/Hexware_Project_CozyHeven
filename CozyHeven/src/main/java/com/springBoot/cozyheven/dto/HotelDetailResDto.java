package com.springBoot.cozyheven.dto;

import java.util.List;

public record HotelDetailResDto(
        long hotelId,
        String hotelName,
        String location ,
        String description,
        int ratings,
        List<AmenityDto> amenities

) {
}
