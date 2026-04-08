package com.springboot.myapp.config;

import com.springboot.myapp.service.UserService;
import lombok.AllArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.AuthenticationProvider;
import org.springframework.security.authentication.ProviderManager;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

@Configuration
@AllArgsConstructor
public class SecurityConfig {
    private final UserService userService;
    private final JwtFilter jwtFilter;
    /** This was my Phase-1 In-Memory Auth Manager */

    /*@Bean
    public UserDetailsService users() {
        // The builder will ensure the passwords are encoded before saving in memory

        UserDetails customer1 = User.builder()
                .username("harry")
                .password("{noop}potter")
                .roles("CUSTOMERS")
                .build();
        UserDetails customer2 = User.builder()
                .username("ronald")
                .password("{noop}weasley")
                .authorities("CUSTOMER")
                .build();
        UserDetails executive1 = User.builder()
                .username("hermione")
                .password("{noop}granger")
                .authorities("EXECUTIVE")
                .build();
        UserDetails admin = User.builder()
                .username("admin")
                .password("{noop}admin")
                .authorities("ADMIN")
                .build();
        return new InMemoryUserDetailsManager(customer1, customer2, executive1, admin);
    } */  //-->2 UserDetail service cant be there
    @Bean
    public SecurityFilterChain bankingSecurityFilterChain(HttpSecurity http) throws Exception {
        http
                .csrf(AbstractHttpConfigurer::disable)
                .cors(Customizer.withDefaults())
                .authorizeHttpRequests((authorize) -> authorize

                        .requestMatchers(HttpMethod.OPTIONS,"/**").permitAll()


                        .requestMatchers(HttpMethod.POST,"/api/customer/sign-up").permitAll()
                        .requestMatchers(HttpMethod.GET,"/api/auth/login").authenticated()
                        // CUSTOMER APIs
                        .requestMatchers(HttpMethod.POST,"/api/customer/add").hasAnyAuthority("CUSTOMER","ADMIN")
                        .requestMatchers(HttpMethod.GET,"/api/customer/get-all").permitAll()
                        .requestMatchers(HttpMethod.GET,"/api/customer/get/*").hasAnyRole("CUSTOMER")
                        .requestMatchers(HttpMethod.POST,"/api/customer/filter").hasAuthority("ADMIN")
                        .requestMatchers(HttpMethod.POST, "/api/customer/plan/add/{planId}/v1").hasAuthority("CUSTOMER")
                        .requestMatchers(HttpMethod.POST, "/api/customer/plan/add/admin/{customerId}/{planId}/v2").hasAuthority("ADMIN")

                        // TICKET APIs
                        .requestMatchers(HttpMethod.GET,"/api/ticket/get-all").permitAll()
                        .requestMatchers(HttpMethod.GET,"/api/ticket/get/*").authenticated()
                        .requestMatchers(HttpMethod.GET,"/api/ticket/customer/{customerId}/v1").hasAuthority("CUSTOMER")
                        .requestMatchers(HttpMethod.GET,"/api/ticket/customer/v2").hasAuthority("CUSTOMER")
                        .requestMatchers(HttpMethod.POST, "/api/ticket/add").hasAnyAuthority("ADMIN","CUSTOMER")
                        .requestMatchers(HttpMethod.PUT, "/api/ticket/assign-executive/*/*").permitAll()

                        // EXECUTIVE APIs
                        .requestMatchers(HttpMethod.POST,"/api/executive/add").hasAuthority("ADMIN")
                        .requestMatchers(HttpMethod.GET,"/api/executive/get-all").permitAll()
                        .requestMatchers(HttpMethod.GET,"/api/executive/get/{id}").hasAnyRole("EXECUTIVE")
                        .requestMatchers(HttpMethod.PUT, "/api/ticket/update/status/{ticketId}/v1").hasAnyAuthority("CUSTOMER", "EXECUTIVE")
                        .requestMatchers(HttpMethod.PUT, "/api/ticket/update/status/{ticketId}/v2").hasAnyAuthority("CUSTOMER", "EXECUTIVE")
                        .requestMatchers(HttpMethod.POST,"/api/executive/filter").authenticated()


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

//    /** This was my Phase-2 Auth Provider */
//    @Bean
//    public AuthenticationManager authenticationManager(
//            UserDetailsService userDetailsService,
//            PasswordEncoder passwordEncoder) {
//        DaoAuthenticationProvider authenticationProvider = new DaoAuthenticationProvider(userService);
//        authenticationProvider.setPasswordEncoder(passwordEncoder());
//        return new ProviderManager(authenticationProvider);
//    }
//    /** This is my Phase-3 JWT Manager */
//    @Bean
//    public  AuthenticationManager authManager(AuthenticationConfiguration config) throws Exception {
//        return config.getAuthenticationManager();
//    }


}

