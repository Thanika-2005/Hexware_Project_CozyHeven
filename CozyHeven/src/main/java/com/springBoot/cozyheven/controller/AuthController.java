    package com.springBoot.cozyheven.controller;

    import com.springBoot.cozyheven.dto.UserDto;
    import com.springBoot.cozyheven.model.User;
    import com.springBoot.cozyheven.service.UserService;
    import com.springBoot.cozyheven.utility.JwtUtility;
    import lombok.AllArgsConstructor;
    import lombok.extern.slf4j.Slf4j;
    import org.springframework.http.HttpStatus;
    import org.springframework.http.ResponseEntity;
    import org.springframework.stereotype.Component;
    import org.springframework.web.bind.annotation.CrossOrigin;
    import org.springframework.web.bind.annotation.GetMapping;
    import org.springframework.web.bind.annotation.RequestMapping;
    import org.springframework.web.bind.annotation.RestController;
    import org.springframework.web.servlet.HandlerMapping;

    import java.security.Principal;
    import java.util.HashMap;
    import java.util.Map;

    @Slf4j
    @RestController
    @RequestMapping("/api/auth")
    @CrossOrigin(origins = "http://localhost:5173/")
    @AllArgsConstructor
    public class AuthController {
        private final JwtUtility jwtUtility;
        private final UserService userService;

        @GetMapping("/logins")
        public ResponseEntity<Map<String, String>>login (Principal principal){
        String loggedInUser = principal.getName(); // username
            Map<String,String> map = new HashMap<>();
            map.put("Token" , jwtUtility.generateToken(loggedInUser));
            return ResponseEntity.status(HttpStatus.OK)
                    .body(map);
        }
        @GetMapping("/user-details")
        public ResponseEntity<UserDto> getUserDetails(Principal principal){
            String username = principal.getName();
            User user = (User) userService.loadUserByUsername(username);
            return
                    ResponseEntity.ok(new UserDto(
                            username,
                            user.getRole().toString(),
                            user.getEmail()
                    ));
        }
    }
