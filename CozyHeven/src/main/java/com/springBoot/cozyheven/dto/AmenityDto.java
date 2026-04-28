package com.springBoot.cozyheven.dto;

import com.springBoot.cozyheven.enums.AmenityCategory;

public record AmenityDto(
        Long id,
        String name,
        AmenityCategory category
) {}
