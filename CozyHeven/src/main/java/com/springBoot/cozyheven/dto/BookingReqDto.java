package com.springBoot.cozyheven.dto;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;

import java.time.LocalDate;
import java.util.List;

public record BookingReqDto(
        @NotNull(message = "Check-in date required")
        LocalDate checkIn,
        @NotNull(message = "Check-out date required")
        LocalDate checkOut,
        @Min(value = 1, message = "At least 1 adult required")
        int adults,
        @Min(value = 0, message = "Children cannot be negative")
        int children,
        int totalPeople,
        Long roomId,
        @NotEmpty(message = "At least one guest is required")
        List<BookingGuestReqDto> guests
) { }
