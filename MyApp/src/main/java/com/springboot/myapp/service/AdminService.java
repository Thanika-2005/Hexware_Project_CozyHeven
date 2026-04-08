package com.springboot.myapp.service;

import com.springboot.myapp.dto.AdminReqDto;
import com.springboot.myapp.enums.Role;
import com.springboot.myapp.model.User;
import com.springboot.myapp.repository.UserRepository;
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
        user.setRole(Role.ADMIN);
        userRepository.save(user);
    }


}
