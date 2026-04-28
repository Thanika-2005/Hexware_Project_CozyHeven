package com.springBoot.cozyheven.service;

import com.springBoot.cozyheven.dto.UserResDto;
import com.springBoot.cozyheven.dto.UserUpdateReqDto;
import com.springBoot.cozyheven.exception.ResourceNotFoundException;
import com.springBoot.cozyheven.mapper.UserMapper;
import com.springBoot.cozyheven.model.User;
import com.springBoot.cozyheven.repository.UserRepository;
import jakarta.validation.Valid;
import lombok.AllArgsConstructor;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

@Service
@AllArgsConstructor
public class UserService implements UserDetailsService {

    private UserRepository userRepository;
    public UserResDto getUserById(long userId) {

        User user1 = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("Invalid userId given"));
        return new UserResDto(
                user1.getId(),
                user1.getUsername(),
                user1.getEmail(),
                user1.getRole(),
                user1.getCreatedAt()
        );

    }

    public void updateUser(@Valid UserUpdateReqDto userUpdateReqDto, long userId) {
        //step 1: fetch userId from user
        User user1 = userRepository.findById(userId)
                .orElseThrow(()-> new ResourceNotFoundException("user id not found"));

        // step 2: Attach details to user
        user1.setUsername(userUpdateReqDto.name());

        //Step 3: Save Entity in DB
        userRepository.save(user1);


    }
    public User insertUser(User user) {
        return userRepository.save(user);
    }
    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        User user = userRepository.getUserByUsername(username);
        return user;
    }
}
