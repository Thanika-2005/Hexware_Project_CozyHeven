package com.springBoot.cozyheven.controller;

import com.springBoot.cozyheven.dto.RoomFilterReqDto;
import com.springBoot.cozyheven.dto.RoomPageRecordDto;
import com.springBoot.cozyheven.dto.RoomReqDto;
import com.springBoot.cozyheven.dto.RoomResDto;
import com.springBoot.cozyheven.service.RoomService;
import lombok.AllArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.List;

@RestController
@RequestMapping("/api/room")
@AllArgsConstructor
@CrossOrigin(origins = "http://localhost:5173")
public class RoomController {

    private RoomService roomService;

    @GetMapping("/get-allRooms")
    public RoomPageRecordDto getAllRooms(@RequestParam(value = "page",required = false,defaultValue = "0")int page,
                                         @RequestParam(value = "size",required = false,defaultValue = "5")int size){

        return roomService.getAllRooms(page,size);
    }

    @PostMapping("/add/{hotelId}")
    public ResponseEntity<Void> addRooms(@RequestBody RoomReqDto roomReqDto,
                                         @PathVariable long hotelId) {

        roomService.addRooms(roomReqDto, hotelId);
        return ResponseEntity.status(HttpStatus.CREATED).build();
    }

    //  Rooms that belongs a particular hotel
    // v1 — Public/Admin: rooms for any hotel by hotelId
    @GetMapping("/{hotelId}/rooms/v1")
    public List<RoomResDto> getRoomsByHotelId(@PathVariable long hotelId) {
        return roomService.getRoomsByHotel(hotelId);
    }

    // v2 — Hotel Owner: rooms across their own hotels via Principal
    @GetMapping("/my-rooms/v2")
    public List<RoomResDto> getMyRooms(Principal principal) {
        return roomService.getRoomsByOwner(principal.getName());
    }



    @PostMapping("/filter/{hotelId}")
    public List<RoomResDto> getfilterRooms(@PathVariable long hotelId,  @RequestBody RoomFilterReqDto filterReqDto) {
        return roomService.getfilterRooms(hotelId, filterReqDto);
    }

    // Update room - HOTEL_OWNER or ADMIN
    @PutMapping("/update/{roomId}")
    public ResponseEntity<Void> updateRoom(@RequestBody RoomReqDto roomReqDto,
                                        @PathVariable long roomId) {
        roomService.updateRoom(roomReqDto, roomId);
        return ResponseEntity.status(HttpStatus.OK).build();
    }

    // Delete room - HOTEL_OWNER or ADMIN
    @DeleteMapping("/delete/{roomId}")
    public ResponseEntity<Void> deleteRoom(@PathVariable long roomId) {
        roomService.deleteRoom(roomId);
        return ResponseEntity.status(HttpStatus.OK).build();
    }
}
