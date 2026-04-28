package com.springBoot.cozyheven.repository;

import com.springBoot.cozyheven.dto.HotelDetailResDto;
import com.springBoot.cozyheven.dto.RoomResDto;
import com.springBoot.cozyheven.enums.AcType;
import com.springBoot.cozyheven.enums.BedType;
import com.springBoot.cozyheven.model.Room;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.util.Collection;
import java.util.List;

@Repository
public interface RoomRepository extends JpaRepository<Room,Long> {

    @Query("""
    SELECT r FROM Room r
    WHERE r.hotel.hotelId = ?1
    """)

    List<Room> getRoombyHotelId(long hotelId);
    @Query("""
    SELECT r FROM Room r
    WHERE r.hotel.hotelId = ?1
    AND (?2 IS NULL OR r.bedType = ?2)
    AND (?3 IS NULL OR r.acType = ?3)
    AND (?4 IS NULL OR r.basePrice <= ?4)
    """)
    List<Room> filterRooms(long hotelId, BedType bedType, AcType acType, BigDecimal bigDecimal);


    @Query("""
    select r from Room r
    where r.hotel.hotelOwner.user.username = ?1
    """)
    List<Room> getRoomsByOwnerUsername(String username);
}
