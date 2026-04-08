package com.springboot.myapp.mapper;

import com.springboot.myapp.dto.ExecutiveReqDto;
import com.springboot.myapp.dto.ExecutiveResqDto;
import com.springboot.myapp.model.Executive;

public class ExecutiveMapper {
    public static Executive  mapToEntityexecutive(ExecutiveReqDto executiveReqDto){
        Executive executive = new Executive();
        executive.setName(executiveReqDto.name());
        executive.setJobTitle(executiveReqDto.jobtitle());
        return executive;
    }

    public static ExecutiveResqDto mapToDto(Executive executive) {
        return new ExecutiveResqDto(
                executive.getId(),
                executive.getJobTitle(),
                executive.getName()

        );
    }
}
