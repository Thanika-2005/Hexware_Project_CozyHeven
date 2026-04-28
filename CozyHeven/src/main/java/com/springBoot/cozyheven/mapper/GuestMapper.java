package com.springBoot.cozyheven.mapper;

import com.springBoot.cozyheven.dto.GuestResponseDto;
import com.springBoot.cozyheven.dto.GuestSignUpDto;
import com.springBoot.cozyheven.model.Guest;
import jakarta.validation.Valid;

public class GuestMapper {
    public static Guest mapToEntity(@Valid GuestSignUpDto guestSignUpDto) {
        Guest guest = new Guest();
        guest.setName(guestSignUpDto.name());
        guest.setCity(guestSignUpDto.city());
        guest.setEmail(guestSignUpDto.email());
        return guest;
    }

    public static GuestResponseDto mapEntityToDto(Guest guest) {
        return new GuestResponseDto(
                guest.getId(),
                guest.getName(),
                guest.getEmail(),
                guest.getCity()
        );
    }
}
