package com.springboot.myapp.dto;

import com.springboot.myapp.enums.JobTitle;

import java.util.List;

public record ExecutivePageResDto(
        List<ExecutiveResqDto> data,
        long totalRecords,
        int totalPages
) {
}
