package com.springBoot.cozyheven.controller;

import com.springBoot.cozyheven.dto.AdminReqDto;
import com.springBoot.cozyheven.service.AdminService;
import lombok.AllArgsConstructor;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("api/admin")
@AllArgsConstructor
public class AdminController {

    private final AdminService adminService;
    @PostMapping("/add")
    public void addAdmin(@RequestBody AdminReqDto adminReqDto){
        adminService.addAdmin(adminReqDto);
    }
}