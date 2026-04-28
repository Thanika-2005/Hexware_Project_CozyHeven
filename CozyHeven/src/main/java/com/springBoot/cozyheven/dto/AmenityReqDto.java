package com.springBoot.cozyheven.dto;

import com.springBoot.cozyheven.enums.AmenityCategory;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public record AmenityReqDto(
        @NotBlank String name,
        @NotNull AmenityCategory category,
        long hotelId
) {}