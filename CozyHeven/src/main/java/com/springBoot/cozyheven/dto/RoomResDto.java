package com.springBoot.cozyheven.dto;

import com.springBoot.cozyheven.enums.AcType;
import com.springBoot.cozyheven.enums.BedType;
import com.springBoot.cozyheven.enums.RoomStatus;

import java.math.BigDecimal;

public record RoomResDto(
        long roomId,
        String roomSize,
        BedType bedType,
        BigDecimal basePrice,
        int maxPeople,
        int availability,
        AcType acType,
        RoomStatus status
) {}
