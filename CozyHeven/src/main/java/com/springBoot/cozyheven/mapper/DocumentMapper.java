package com.springBoot.cozyheven.mapper;

import com.springBoot.cozyheven.dto.DocumentReqDto;
import com.springBoot.cozyheven.model.Document;

public class DocumentMapper {
    public static DocumentReqDto mapToDto(Document document) {
        return new DocumentReqDto(
                document.getId(),
                document.getProfileImage(),
                document.getGuest().getName(),
                document.getGuest().getEmail(),
                document.getGuest().getCity()
        );
    }
}

