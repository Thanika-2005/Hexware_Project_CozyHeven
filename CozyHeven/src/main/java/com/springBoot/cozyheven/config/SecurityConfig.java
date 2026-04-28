package com.springBoot.cozyheven.config;

import com.springBoot.cozyheven.service.UserService;
import lombok.AllArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.Customizer;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

@Configuration
@AllArgsConstructor
public class SecurityConfig {

    private final UserService userService;
    private final JwtFilter jwtFilter;


    static final String ROLE_GUEST       = "GUEST";
    static final String ROLE_ADMIN       = "ADMIN";
    static final String ROLE_HOTEL_OWNER = "HOTEL_OWNER";


    @Bean
    public SecurityFilterChain bankingSecurityFilterChain(HttpSecurity http) throws Exception {
        http
                .csrf(AbstractHttpConfigurer::disable)
                .cors(Customizer.withDefaults())

                .authorizeHttpRequests(authorize -> authorize

                        .requestMatchers(HttpMethod.OPTIONS, "/**").permitAll()
                        .requestMatchers(HttpMethod.POST, "/api/hotel/owner/add").permitAll()
                        .requestMatchers(HttpMethod.POST, "/api/guest/sign-up").permitAll()
                        .requestMatchers(HttpMethod.POST, "/api/admin/add").permitAll()
                        .requestMatchers(HttpMethod.GET,  "/api/auth/logins").authenticated()
                        .requestMatchers(HttpMethod.GET,  "/api/auth/user-details").authenticated()

                        // ADMIN
                        .requestMatchers(HttpMethod.PUT, "/api/hotel/owner/assign/{hotelId}/{ownerId}").hasAuthority(ROLE_ADMIN)

                        // HOTEL APIs
                        .requestMatchers(HttpMethod.GET,    "/api/hotel/get-allhotel").permitAll()
                        .requestMatchers(HttpMethod.GET,    "/api/hotel/get/{hotelId}").permitAll()
                        .requestMatchers(HttpMethod.POST,   "/api/hotel/get/filter").permitAll()
                        .requestMatchers(HttpMethod.GET,    "/api/hotel/guests/{guestId}/v1").hasAuthority(ROLE_ADMIN)
                        .requestMatchers(HttpMethod.GET,    "/api/hotel/guests/v2").hasAuthority(ROLE_GUEST)
                        .requestMatchers(HttpMethod.GET,    "/api/guest/get-one").hasAuthority(ROLE_GUEST)
                        .requestMatchers(HttpMethod.POST,   "/api/document/upload").hasAuthority(ROLE_GUEST)
                        .requestMatchers(HttpMethod.GET,    "/api/hotel/my-hotels").hasAuthority(ROLE_HOTEL_OWNER)
                        .requestMatchers(HttpMethod.POST,   "/api/hotel/add").hasAnyAuthority(ROLE_ADMIN, ROLE_HOTEL_OWNER)
                        .requestMatchers(HttpMethod.PUT,    "/api/hotel/update/{hotelId}").hasAnyAuthority(ROLE_ADMIN, ROLE_HOTEL_OWNER)
                        .requestMatchers(HttpMethod.DELETE, "/api/hotel/delete/{hotelId}").hasAuthority(ROLE_ADMIN)

                        // BOOKING APIs
                        .requestMatchers(HttpMethod.POST,   "/api/booking/add").hasAuthority(ROLE_GUEST)
                        .requestMatchers(HttpMethod.GET,    "/api/booking/get-allBooking").hasAuthority(ROLE_ADMIN)
                        .requestMatchers(HttpMethod.GET,    "/api/booking/my-hotel/bookings").hasAuthority(ROLE_HOTEL_OWNER)
                        .requestMatchers(HttpMethod.POST,   "/api/booking/get/filter").authenticated()
                        .requestMatchers(HttpMethod.PUT,    "/api/booking/cancel/{bookingId}").hasAnyAuthority(ROLE_GUEST, ROLE_ADMIN)
                        .requestMatchers(HttpMethod.PUT,    "/api/booking/refund/{bookingId}").hasAnyAuthority(ROLE_HOTEL_OWNER, ROLE_ADMIN)
                        .requestMatchers(HttpMethod.GET,    "/api/booking/my-bookings").hasAuthority(ROLE_GUEST)
                        .requestMatchers(HttpMethod.GET,    "/api/booking/hotel/{hotelId}").hasAnyAuthority(ROLE_HOTEL_OWNER, ROLE_ADMIN)

                        // USER APIs
                        .requestMatchers(HttpMethod.GET, "/api/user/getUser/{userId}").hasAuthority(ROLE_ADMIN)
                        .requestMatchers(HttpMethod.PUT, "/api/user/updateUser/{userId}").hasAuthority(ROLE_ADMIN)

                        // ROOM APIs
                        .requestMatchers(HttpMethod.POST,   "/api/room/add/{hotelId}").hasAnyAuthority(ROLE_ADMIN, ROLE_HOTEL_OWNER)
                        .requestMatchers(HttpMethod.GET,    "/api/room/get-allRooms").permitAll()
                        .requestMatchers(HttpMethod.GET,    "/api/room/{hotelId}/rooms/v1").permitAll()
                        .requestMatchers(HttpMethod.GET,    "/api/room/my-rooms/v2").hasAuthority(ROLE_HOTEL_OWNER)
                        .requestMatchers(HttpMethod.POST,   "/api/room/filter/{hotelId}").permitAll()
                        .requestMatchers(HttpMethod.PUT,    "/api/room/update/{roomId}").hasAnyAuthority(ROLE_ADMIN, ROLE_HOTEL_OWNER)
                        .requestMatchers(HttpMethod.DELETE, "/api/room/delete/{roomId}").hasAnyAuthority(ROLE_ADMIN, ROLE_HOTEL_OWNER)

                        // AMENITY APIs
                        .requestMatchers(HttpMethod.GET,    "/api/amenity/all").permitAll()
                        .requestMatchers(HttpMethod.GET,    "/api/amenity/hotel/{hotelId}").permitAll()
                        .requestMatchers(HttpMethod.DELETE, "/api/amenity/delete/{id}").hasAuthority(ROLE_HOTEL_OWNER)
                        .requestMatchers(HttpMethod.POST,   "/api/amenity/add").hasAuthority(ROLE_ADMIN)

                        // REVIEW APIs
                        .requestMatchers(HttpMethod.GET,  "/api/review/hotel/{hotelId}").permitAll()
                        .requestMatchers(HttpMethod.POST, "/api/review/add").hasAuthority(ROLE_GUEST)

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