package com.example.task.mapper;

import com.example.task.dto.ManagerSignUpDto;
import com.example.task.model.User;
import jakarta.validation.Valid;

public class UserMapper {
    public static User mapToEntity(@Valid ManagerSignUpDto managerSignUpDto) {
        User user = new User();
        user.setUsername(managerSignUpDto.userName());
        user.setPassword(managerSignUpDto.password());
        return user;
    }
}
