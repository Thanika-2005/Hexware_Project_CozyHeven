package com.springboot.myapp.mapper;

import com.springboot.myapp.dto.CustomerSignUpDto;
import com.springboot.myapp.model.User;

public class UserMapper {
    public static User mapToEntity(CustomerSignUpDto customerSignUpDto) {
        User user = new User();
        user.setUsername(customerSignUpDto.userName());
        user.setPassword(customerSignUpDto.password());
        return user;
    }
}
