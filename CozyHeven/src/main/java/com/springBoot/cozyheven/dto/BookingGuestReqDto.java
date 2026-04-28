package com.springBoot.cozyheven.dto;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jdk.jfr.MemoryAddress;

public record BookingGuestReqDto(
        @NotBlank(message = "Guest name is required")
        String name,

        @Min(value = 0, message = "Age cannot be negative")
        int age,
        String gender,

        @NotBlank
        String address,

        @NotBlank
        @NotNull(message = "phone no call be null")
        String phone,

        String aadhaarPath
) {
}
