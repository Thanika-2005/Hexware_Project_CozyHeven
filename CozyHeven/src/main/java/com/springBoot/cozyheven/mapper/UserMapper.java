package com.springBoot.cozyheven.mapper;

import com.springBoot.cozyheven.dto.GuestSignUpDto;
import com.springBoot.cozyheven.dto.UserResDto;
import com.springBoot.cozyheven.model.User;
import jakarta.validation.Valid;

public class UserMapper {

    public static User mapToEntity(@Valid GuestSignUpDto guestSignUpDto) {
        User user = new User();
        user.setUsername(guestSignUpDto.username());
        user.setPassword(guestSignUpDto.password());
        user.setEmail(guestSignUpDto.email());
        return user;
    }
}
