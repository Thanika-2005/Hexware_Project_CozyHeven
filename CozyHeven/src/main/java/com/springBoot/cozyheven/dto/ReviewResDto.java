package com.springBoot.cozyheven.dto;

import java.time.Instant;
import java.time.LocalDate;

public record ReviewResDto(
        Long reviewId,
        Integer rating,
        String title,
        String comment,
        String username,
        LocalDate stayDate,
        Instant createdAt
) {}
