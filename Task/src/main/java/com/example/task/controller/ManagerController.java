package com.example.task.controller;

import com.example.task.dto.ManagerSignUpDto;
import com.example.task.service.ManagerService;
import jakarta.validation.Valid;
import lombok.AllArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@AllArgsConstructor
@RequestMapping("/api/manager")
public class ManagerController {
    private  final ManagerService managerService;

    @PostMapping("/sign-up")
    public ResponseEntity<?> addManagerWithCredentials(@Valid @RequestBody ManagerSignUpDto managerSignUpDto){
        managerService.addManagerSignUp(managerSignUpDto);
        return ResponseEntity.status(HttpStatus.CREATED)
                .build();
    }
}
