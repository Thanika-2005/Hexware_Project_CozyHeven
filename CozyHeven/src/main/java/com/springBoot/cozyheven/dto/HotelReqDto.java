package com.springBoot.cozyheven.dto;

public record HotelReqDto(
        String hotelName,
        String location,
        String description,
        Integer ratings
) {}
