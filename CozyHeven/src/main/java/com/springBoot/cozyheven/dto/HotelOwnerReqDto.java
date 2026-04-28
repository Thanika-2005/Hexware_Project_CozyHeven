package com.springBoot.cozyheven.dto;

public record HotelOwnerReqDto(
        String name,
        String username,
        String password,
        String email,
        String hotelName,
        String location,
        String description,
        Integer ratings
) {
}
