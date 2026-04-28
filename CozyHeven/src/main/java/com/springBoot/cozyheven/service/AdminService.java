package com.springBoot.cozyheven.service;

import com.springBoot.cozyheven.dto.AdminReqDto;
import com.springBoot.cozyheven.enums.Role;
import com.springBoot.cozyheven.model.User;
import com.springBoot.cozyheven.repository.UserRepository;
import lombok.AllArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@AllArgsConstructor
public class AdminService {
    private final PasswordEncoder passwordEncoder;
    private final UserRepository userRepository;

    public void addAdmin(AdminReqDto adminReqDto) {
        User user = new User();
        user.setUsername(adminReqDto.username());
        user.setPassword(passwordEncoder.encode(adminReqDto.password()));
        user.setEmail(adminReqDto.email());
        user.setRole(Role.ADMIN);
        userRepository.save(user);
    }
}
