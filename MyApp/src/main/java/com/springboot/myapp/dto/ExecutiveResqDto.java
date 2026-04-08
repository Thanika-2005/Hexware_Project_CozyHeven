package com.springboot.myapp.dto;

import com.springboot.myapp.enums.JobTitle;

public record ExecutiveResqDto(
        long id,
        JobTitle jobTitle,
        String name
) {
}
