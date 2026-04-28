package com.springBoot.cozyheven.dto;


public record AdminReqDto(
        String username,
        String password,
        String email
) {
}

