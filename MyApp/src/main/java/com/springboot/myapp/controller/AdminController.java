package com.springboot.myapp.controller;


import com.springboot.myapp.dto.AdminReqDto;
import com.springboot.myapp.service.AdminService;
import lombok.AllArgsConstructor;
import org.springframework.web.bind.annotation.*;

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
