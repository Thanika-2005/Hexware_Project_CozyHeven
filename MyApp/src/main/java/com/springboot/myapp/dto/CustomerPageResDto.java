package com.springboot.myapp.dto;

import java.util.List;

public record CustomerPageResDto(
        List<CustomerResqDto> data,
        long totalRecords,
        int totalPages
) {
}
