package com.springBoot.cozyheven.dto;


import com.springBoot.cozyheven.enums.AcType;
import com.springBoot.cozyheven.enums.BedType;
import com.springBoot.cozyheven.enums.RoomStatus;


import java.math.BigDecimal;

public record RoomReqDto (

        long RoomId,
        String roomSize,
        AcType acType,
        BedType bedType,
        BigDecimal basePrice,
        int availability,
        int maxPeople,
        RoomStatus status
){
}
