package com.springboot.myapp.controller;

import com.springboot.myapp.utility.JwtUtility;
import lombok.AllArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import java.util.HashMap;
import java.util.Map;
import java.security.Principal;

@RestController
@RequestMapping("/api/auth")
@AllArgsConstructor
public class AuthController {

    private final JwtUtility jwtUtility;
    @GetMapping("/login")
    public ResponseEntity<?> login(Principal principal){
        String loggedInUser = principal.getName();
        Map<String,String> map = new HashMap<>();
        map.put("token", jwtUtility.generateToken(loggedInUser));
        return ResponseEntity.status(HttpStatus.OK)
                .body(map);
    }

}
