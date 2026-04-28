package com.springBoot.cozyheven.service;


import com.springBoot.cozyheven.enums.AcType;
import com.springBoot.cozyheven.enums.BedType;
import com.springBoot.cozyheven.enums.RoomStatus;
import com.springBoot.cozyheven.model.Booking;
import com.springBoot.cozyheven.model.Room;
import com.springBoot.cozyheven.repository.RoomRepository;
import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
public class RoomServiceTest {

    @InjectMocks
    private RoomService roomService;
    @Mock
    private RoomRepository roomRepository;

    @Test
    public void getAllRooms(){
        Room room = new Room();
        room.setRoomId(40L);
        room.setRoomSize("550 sq feet");
        room.setBedType(BedType.KING);
        room.setBasePrice(BigDecimal.valueOf(1200.00));
        room.setMaxPeople(4);
        room.setAvailability(2);
        room.setAcType(AcType.SPLIT);
        room.setStatus(RoomStatus.AVAILABLE);

        Room room1 = new Room();
        room1.setRoomId(2L);
        room1.setRoomSize("450 sq feet");
        room1.setBedType(BedType.QUEEN);
        room1.setBasePrice(BigDecimal.valueOf(1000.00));
        room1.setMaxPeople(3);
        room1.setAvailability(1);
        room1.setAcType(AcType.CENTRAL);
        room1.setStatus(RoomStatus.OCCUPIED);



        List<Room> list = List.of(room,room1);

        Page<Room> roomPage = new PageImpl<>(list);
        int page = 0;
        int size = 2;
        Pageable pageable = PageRequest.of(page,size);

        when(roomRepository.findAll(pageable)).thenReturn(roomPage);


        Page<Room> roomPage1 = new PageImpl<>(list);
        page = 0;
        size = 1;
        Pageable pageable1 = PageRequest.of(page,size);

//        when(roomRepository.findAll(pageable1)).thenReturn(roomPage1);

        Assertions.assertEquals(2,roomService.getAllRooms(0,2).data().size());
//        Assertions.assertEquals(1,roomService.getAllRooms(0,1).data().size());

    }

}
