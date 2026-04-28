package com.springBoot.cozyheven.config;

import com.springBoot.cozyheven.service.UserService;
import com.springBoot.cozyheven.utility.JwtUtility;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.AllArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;
import org.springframework.web.servlet.HandlerExceptionResolver;

import java.io.IOException;

@Component

public class JwtFilter extends OncePerRequestFilter{
    private final JwtUtility jwtUtility;
    private final UserService userService;

    public JwtFilter(JwtUtility jwtUtility, UserService userService) {
        this.jwtUtility = jwtUtility;
        this.userService = userService;
    }

    @Autowired
    @Qualifier("handlerExceptionResolver") // this qualifies to be used directly
    private HandlerExceptionResolver resolver;



    @Override
    protected void doFilterInternal(HttpServletRequest request,
                                    HttpServletResponse response,
                                    FilterChain filterChain)
            throws ServletException, IOException {
        final String authorizationHeader = request.getHeader("Authorization");

        String username = null;
        String jwt = null;
        try {
            if (authorizationHeader != null && authorizationHeader.startsWith("Bearer ")) {
                jwt = authorizationHeader.substring(7);
                username = jwtUtility.extractUsername(jwt);
            }
            //user shd not be already logged In.
            if (username != null && SecurityContextHolder.getContext().getAuthentication() == null) {

                UserDetails userDetails = userService.loadUserByUsername(username);

                if (jwtUtility.validateToken(jwt, userDetails.getUsername())) {

                    UsernamePasswordAuthenticationToken usernamePasswordAuthenticationToken =
                            new UsernamePasswordAuthenticationToken(userDetails, null, userDetails.getAuthorities());
                    usernamePasswordAuthenticationToken
                            .setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
                    SecurityContextHolder.getContext().setAuthentication(usernamePasswordAuthenticationToken);
                }

            }
            filterChain.doFilter(request,response);
        }
        catch(Exception e){
            resolver.resolveException(request,response,null,e);
        }
    }


}
