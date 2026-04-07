package com.example.task.dto;

import java.util.List;

public record TaskPageResDto(
        List<TaskResDto> data,
        long totalRecords,
        int totalPages
) {
}
