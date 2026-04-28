package com.springBoot.cozyheven.dto;

import java.math.BigDecimal;

public record RoomFilterReqDto(
        String bedType,
        String acType,
        BigDecimal maxPrice
) {}
