package com.springBoot.cozyheven.dto;

import com.springBoot.cozyheven.enums.Role;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

import java.time.Instant;

public record UserResDto(
        long userId,
        @NotBlank(message = "name cannot be blank")
        @NotNull
        @Size(min = 3, max = 100)
        String name,
        String email,
        Role role,
        Instant createdAt
) {
}
