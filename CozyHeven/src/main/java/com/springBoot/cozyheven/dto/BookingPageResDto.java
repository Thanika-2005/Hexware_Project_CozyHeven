package com.springBoot.cozyheven.dto;

import java.util.List;

public record BookingPageResDto(
        List<BookingResDto> data,
        long totalRecords,
        int totalPages


) {
}
