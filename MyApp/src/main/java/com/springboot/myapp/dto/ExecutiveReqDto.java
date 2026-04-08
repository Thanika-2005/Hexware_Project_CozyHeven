package com.springboot.myapp.dto;

import com.springboot.myapp.enums.JobTitle;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

public record ExecutiveReqDto(
        @NotBlank(message = "name cannot be blank")
        @NotNull
        @Size(min = 2, max = 255, message = "name size is defined as 2-255")
        String name,

        JobTitle jobtitle,
        String username,
        String password
) { }
