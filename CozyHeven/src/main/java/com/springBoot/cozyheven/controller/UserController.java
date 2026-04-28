package com.springBoot.cozyheven.controller;

import com.springBoot.cozyheven.dto.UserResDto;
import com.springBoot.cozyheven.dto.UserUpdateReqDto;
import com.springBoot.cozyheven.service.UserService;
import jakarta.validation.Valid;
import lombok.AllArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RequestMapping("/api/user")
@RestController
@AllArgsConstructor
public class UserController {

    private final UserService userService;

    @GetMapping("/getUser/{userId}")
    public UserResDto getUserById(@Valid @PathVariable long userId) {
       return  userService.getUserById(userId);
    }

    @PutMapping("/updateUser/{userId}")
    public ResponseEntity<Void> updateUser(@Valid @RequestBody UserUpdateReqDto userUpdateReqDto,
                                        @PathVariable long userId){
        userService.updateUser(userUpdateReqDto,userId);
        return ResponseEntity.status(HttpStatus.CREATED)
                .build();


    }
}
