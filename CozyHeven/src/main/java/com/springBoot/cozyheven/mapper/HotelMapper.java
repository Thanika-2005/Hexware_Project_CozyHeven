package com.springBoot.cozyheven.mapper;


import com.springBoot.cozyheven.dto.AmenityDto;
import com.springBoot.cozyheven.dto.HotelDetailResDto;
import com.springBoot.cozyheven.dto.HotelGuestDto;
import com.springBoot.cozyheven.dto.HotelPageResDto;
import com.springBoot.cozyheven.model.Amenity;
import com.springBoot.cozyheven.model.Hotel;

import java.util.List;


public class HotelMapper {

    public static HotelPageResDto mapToDto(Hotel hotel) {
       return new HotelPageResDto(
               hotel.getHotelId(),
               hotel.getHotelName(),
               hotel.getLocation(),
               hotel.getDescription(),
               hotel.getRatings()
       );
    }



    public static HotelDetailResDto mapToHotelDetailResDto(Hotel hotel, List<AmenityDto> amenities) {  // input is Hotel
        return new HotelDetailResDto(
                hotel.getHotelId(),
                hotel.getHotelName(),
                hotel.getLocation(),
                hotel.getDescription(),
                hotel.getRatings(),
                amenities
        );
    }
}
