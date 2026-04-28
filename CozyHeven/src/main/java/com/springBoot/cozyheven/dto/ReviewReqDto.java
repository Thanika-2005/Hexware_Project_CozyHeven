package com.springBoot.cozyheven.dto;

public record ReviewReqDto(
        Long hotelId,
        Long bookingId,
        Integer rating,
        String title,
        String comment
) {}
