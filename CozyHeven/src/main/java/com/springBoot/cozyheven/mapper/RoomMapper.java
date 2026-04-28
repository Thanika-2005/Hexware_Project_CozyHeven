package com.springBoot.cozyheven.mapper;

import com.springBoot.cozyheven.dto.RoomReqDto;
import com.springBoot.cozyheven.dto.RoomResDto;
import com.springBoot.cozyheven.enums.BedType;
import com.springBoot.cozyheven.enums.RoomStatus;
import com.springBoot.cozyheven.model.Room;

import java.math.BigDecimal;

public class RoomMapper {
    public static RoomResDto mapToDto(Room room) {
        return new RoomResDto(
                room.getRoomId(),
                room.getRoomSize(),
                room.getBedType(),
                room.getBasePrice(),
                room.getMaxPeople(),
                room.getAvailability(),
                room.getAcType(),
                room.getStatus()
        );
    }

    public static Room mapToEntity(RoomReqDto roomReqDto) {
        Room room = new Room();
        room.setRoomId(roomReqDto.RoomId());
        room.setAcType(roomReqDto.acType());
        room.setRoomSize(roomReqDto.roomSize());
        room.setBedType(roomReqDto.bedType());
        room.setBasePrice(roomReqDto.basePrice());
        room.setAvailability(roomReqDto.availability());
        room.setMaxPeople(roomReqDto.maxPeople());
        room.setStatus(roomReqDto.status());
        return room;

    }

}
