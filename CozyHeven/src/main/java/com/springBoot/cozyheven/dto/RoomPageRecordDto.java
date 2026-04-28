package com.springBoot.cozyheven.dto;

import java.util.List;

public record RoomPageRecordDto(
        List<RoomResDto> data,
        long totalRecords,
        int totalPages
) {
}
