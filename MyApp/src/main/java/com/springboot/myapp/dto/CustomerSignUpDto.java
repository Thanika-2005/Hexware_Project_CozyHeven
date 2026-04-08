package com.springboot.myapp.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

public record CustomerSignUpDto(
        @NotBlank
        String name,
        @Email
        String email,
        String city,
        @NotBlank
        @NotNull
        @Size(min = 3 , max = 15)
        String userName,
        String password
) {
}
