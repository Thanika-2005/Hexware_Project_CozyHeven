package com.springBoot.cozyheven.service;

import com.springBoot.cozyheven.dto.AmenityDto;
import com.springBoot.cozyheven.dto.HotelDetailResDto;
import com.springBoot.cozyheven.exception.ResourceNotFoundException;
import com.springBoot.cozyheven.model.Hotel;
import com.springBoot.cozyheven.repository.AmenityRepository;
import com.springBoot.cozyheven.repository.HotelRepository;
import lombok.extern.slf4j.Slf4j;
import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.Mockito;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;

import java.util.List;
import java.util.Optional;

import static com.springBoot.cozyheven.mapper.HotelMapper.mapToHotelDetailResDto;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
public class HotelServiceTest {

    @InjectMocks
    private HotelService  hotelService;
    @Mock
    private HotelRepository hotelRepository;
    @Mock
    private AmenityRepository amenityRepository;

    @Test
    public void getHotelByIdWhenExists() {
        Assertions.assertNotNull(hotelService);

        Hotel hotel = new Hotel();
        hotel.setHotelId(1L);
        hotel.setHotelName("Grand Chola");
        hotel.setLocation("Chennai");
        hotel.setDescription("The ITC Grand Chola in Chennai is a premier 5-star luxury hotel renowned for its immense scale in south india");
        hotel.setRatings(5);

        List<AmenityDto> amenities = List.of(); // or mock some amenities

        // Mock both repositories
        when(hotelRepository.findById(1L)).thenReturn(Optional.of(hotel));
        when(amenityRepository.getAmentiesbyHotelId(1L)).thenReturn(List.of());

        HotelDetailResDto dto = mapToHotelDetailResDto(hotel, amenities);

        Assertions.assertEquals(dto, hotelService.getHotelById(1L));

        Mockito.verify(hotelRepository, times(1)).findById(1L);
        Mockito.verify(amenityRepository, times(1)).getAmentiesbyHotelId(1L);
    }

    @Test
    public void getHotelByIdWhenNotFound(){
        //when repo is empty
        when(hotelRepository.findById(15L)).thenReturn(Optional.empty());

        // Exception call
        Exception e =Assertions.assertThrows(ResourceNotFoundException.class,()->{
            hotelService.getHotelById(15L);
        });

        //check assert
        Assertions.assertEquals("Invalid hotel Id",e.getMessage());
    }

    @Test
    public void getAllHotelsTest(){
        Hotel hotel1 = new Hotel();
        hotel1.setHotelId(1L);
        hotel1.setHotelName("Grand Chola");
        hotel1.setLocation("Chennai");
        hotel1.setDescription("The ITC Grand Chola in Chennai is a premier 5-star luxury hotel");
        hotel1.setRatings(5);

        Hotel hotel2 = new Hotel();
        hotel2.setHotelId(12L);
        hotel2.setHotelName("The Grand Royale");
        hotel2.setLocation("Goa");
        hotel2.setDescription("3-star Treebo Grand Royale Eco Residency in Cavelossim");
        hotel2.setRatings(3);

        List<Hotel> list = List.of(hotel1,hotel2);

        Page<Hotel> hotelPage = new PageImpl<>(list);
        int page = 0;
        int size = 2;
        Pageable pageable = PageRequest.of(page,size);

        when(hotelRepository.findAll(pageable)).thenReturn(hotelPage);


        Page<Hotel> hotelPage1 = new PageImpl<>(list);
        page = 0;
        size = 1;
        Pageable pageable1 = PageRequest.of(page,size);

//        when(hotelRepository.findAll(pageable1)).thenReturn(hotelPage1);

        Assertions.assertEquals(2,hotelService.getAllHotels(0,2).data().size());
//        Assertions.assertEquals(1,hotelService.getAllHotels(0,1).data().size());

    }
}
