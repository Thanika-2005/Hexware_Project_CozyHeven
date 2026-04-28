package com.springBoot.cozyheven.service;

import com.springBoot.cozyheven.dto.HotelDetailResDto;
import com.springBoot.cozyheven.dto.UserResDto;
import com.springBoot.cozyheven.enums.Role;
import com.springBoot.cozyheven.exception.ResourceNotFoundException;
import com.springBoot.cozyheven.model.User;
import com.springBoot.cozyheven.repository.UserRepository;
import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.Mockito;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.Instant;
import java.util.Optional;

import static org.mockito.Mockito.times;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
public class UserServiceTest {

    @InjectMocks
    private UserService userService;

    @Mock
    private UserRepository userRepository;


    @Test
    public void getUserByIdWhenExists(){
        // check null
        Assertions.assertNotNull(userService);

        // data for mock
        User user = new User();
        user.setId(9L);
        user.setUsername("Monica");
        user.setEmail("Monica@gmail.com");
        user.setRole(Role.HOTEL_OWNER);
        user.setCreatedAt(Instant.now());

        //Mocking
        when(userRepository.findById(9L)).thenReturn(Optional.of(user));
        // DTO
        UserResDto dto = new UserResDto(
                user.getId(),
                user.getUsername(),
                user.getEmail(),
                user.getRole(),
                user.getCreatedAt()
        );

        //mockito when returning

        Assertions.assertEquals(dto, userService.getUserById(9));
        //API processing

        Mockito.verify(userRepository,times(1)).findById(9L);

    }

    @Test
    public void getUserByIdWhenNotFound(){
        //when repo is empty
        when(userRepository.findById(15L)).thenReturn(Optional.empty());

        // Exception call
        Exception e =Assertions.assertThrows(ResourceNotFoundException.class,()->{
            userService.getUserById(15L);
        });

        //check assert
        Assertions.assertEquals("Invalid userId given",e.getMessage());
    }

}
