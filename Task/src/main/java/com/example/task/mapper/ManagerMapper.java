package com.example.task.mapper;

import com.example.task.dto.ManagerSignUpDto;
import com.example.task.model.Manager;
import jakarta.validation.Valid;

public class ManagerMapper {
    public static Manager mapToEntity( ManagerSignUpDto managerSignUpDto) {
        Manager manager = new Manager();
        manager.setName(managerSignUpDto.name());
        manager.setEmail(managerSignUpDto.email());
        return manager;
    }
}
