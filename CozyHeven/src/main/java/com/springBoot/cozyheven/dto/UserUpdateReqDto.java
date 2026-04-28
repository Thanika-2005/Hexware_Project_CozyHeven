package com.springBoot.cozyheven.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

public record UserUpdateReqDto(
        @NotBlank
        @NotNull
        @Size(min = 3 , max = 100)
        String name,
        @Size(max = 12)
        String phone,
        @Size(max= 1000, message = "Address cant be null")
        String address
) {
}
