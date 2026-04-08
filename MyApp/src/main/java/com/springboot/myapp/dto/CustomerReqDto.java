package com.springboot.myapp.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

public record CustomerReqDto(
        @NotBlank(message = "name cannot be blank")
        @NotNull
        @Size(min = 3, max = 255, message = "name size is defined as 3-255")
        String name,

        @NotBlank(message = "email cant be blank")
        @NotNull
        @Size(min = 3, max = 1000)
        String email,

        @NotBlank(message = "city cannot be blank")
        @NotNull
        @Size(min = 3, max = 255, message = "city size is defined as 3-255")
        String city
)
{}
