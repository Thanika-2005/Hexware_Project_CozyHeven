package com.springBoot.cozyheven.dto;

import java.util.List;

public record HotelPageRecordDto (
    List<HotelPageResDto> data,
    long totalRecords,
    int totalPages
){}
