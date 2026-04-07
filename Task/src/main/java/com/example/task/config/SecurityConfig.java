package com.example.task.config;

import com.example.task.service.UserService;
import lombok.AllArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

@Configuration
@AllArgsConstructor

public class SecurityConfig {
    private final UserService userService;
    private final JwtFilter jwtFilter;
    @Bean
    public SecurityFilterChain bankingSecurityFilterChain(HttpSecurity http) throws Exception {
        http
                .csrf(AbstractHttpConfigurer::disable)
                .cors(Customizer.withDefaults())
                .authorizeHttpRequests((authorize) -> authorize

                        .requestMatchers(HttpMethod.OPTIONS,"/**").permitAll()


                        .requestMatchers(HttpMethod.POST,"/api/manager/sign-up").permitAll()
                        .requestMatchers(HttpMethod.GET,"/api/auth/login").authenticated()

                        .requestMatchers(HttpMethod.POST, "/api/task/addtask").hasAnyAuthority("ADMIN","TASK_MANAGER")
                        .requestMatchers(HttpMethod.GET,"/api/task/get-all").permitAll()
                        .requestMatchers(HttpMethod.GET,"/api/task/get/{id}").hasAuthority("TASK_MANAGER")

                        .requestMatchers(HttpMethod.PUT,"/api/task/update/status/{id{").hasAuthority("TASK_MANAGER")
                        .requestMatchers(HttpMethod.DELETE,"/api/task/delete/id").hasAuthority("TASK_MANAGER")



                        .anyRequest().authenticated()
                );
        http.addFilterBefore(jwtFilter, UsernamePasswordAuthenticationFilter.class);
        http.httpBasic(Customizer.withDefaults());

        return http.build();
    }
    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }
}
