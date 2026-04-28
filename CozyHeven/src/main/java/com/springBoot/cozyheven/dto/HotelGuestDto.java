package com.springBoot.cozyheven.dto;

public record HotelGuestDto(
          long HotelId,
          String hotelName,
          String location,
          int ratings,
          String guestName

) {
}
