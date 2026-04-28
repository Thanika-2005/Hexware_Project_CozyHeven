package com.springBoot.cozyheven.mapper;

import com.springBoot.cozyheven.dto.AmenityDto;
import com.springBoot.cozyheven.model.Amenity;

public class AmentityMapper {

    public static AmenityDto mapToDto(Amenity amenity) {
        return new AmenityDto(
                amenity.getId(),
                amenity.getName(),
                amenity.getCategory()
        );
    }
}
