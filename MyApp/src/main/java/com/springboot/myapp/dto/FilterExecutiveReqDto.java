package com.springboot.myapp.dto;

import com.springboot.myapp.enums.JobTitle;

public record FilterExecutiveReqDto(
        String jobTitle
) {
}
