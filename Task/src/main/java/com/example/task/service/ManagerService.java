package com.example.task.service;

import com.example.task.dto.ManagerSignUpDto;
import com.example.task.enums.Role;
import com.example.task.mapper.ManagerMapper;
import com.example.task.mapper.UserMapper;
import com.example.task.model.Manager;
import com.example.task.model.User;
import com.example.task.repository.ManagerRepository;
import jakarta.validation.Valid;
import lombok.AllArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@AllArgsConstructor
public class ManagerService {

    private final ManagerRepository managerRepository;
    public final UserService userService;
    @Autowired
    private final PasswordEncoder passwordEncoder;

    public void addManagerSignUp(@Valid ManagerSignUpDto managerSignUpDto) {
        Manager manager = ManagerMapper.mapToEntity(managerSignUpDto);
        // Step 2: Map DTO to User entity
        User user = UserMapper.mapToEntity(managerSignUpDto);

        // Step 3: Add role and other details to User entity -- ensure password in encrypted
        user.setRole(Role.TASK_MANAGER);
        user.setPassword(passwordEncoder.encode(managerSignUpDto.password()));
        // Step 4 Save User in Db : so that, we get ID of the user attached to it
        user = userService.insertUser(user);

        // Step 5: Attach user to Customer object
        manager.setUser(user);
        // Step 6: Save Customer Object
        managerRepository.save(manager);
    }
}
