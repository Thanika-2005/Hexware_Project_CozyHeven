package com.springBoot.cozyheven.dto;

public record GuestResponseDto(
        long id,
        String name,
        String email,
        String city
) {
}
