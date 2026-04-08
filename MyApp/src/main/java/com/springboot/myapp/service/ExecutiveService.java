package com.springboot.myapp.service;

import com.springboot.myapp.dto.ExecutivePageResDto;
import com.springboot.myapp.dto.ExecutiveReqDto;
import com.springboot.myapp.dto.ExecutiveResqDto;
import com.springboot.myapp.dto.FilterExecutiveReqDto;
import com.springboot.myapp.enums.JobTitle;
import com.springboot.myapp.enums.TicketPriority;
import com.springboot.myapp.exceptions.ResourceNotFoundException;
import com.springboot.myapp.mapper.ExecutiveMapper;
import com.springboot.myapp.model.Executive;
import com.springboot.myapp.repository.ExecutiveRepository;
import lombok.AllArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@AllArgsConstructor
public class ExecutiveService {

    private ExecutiveRepository executiveRepository;
    public Executive addExecutive(ExecutiveReqDto executiveReqDto) {

        // 1.mapper la create pannadha idhula Dto oda connect pannanum
        Executive executive = ExecutiveMapper.mapToEntityexecutive(executiveReqDto);

        //2.add extra details in my case no --->

        //3. save to the db
        return executiveRepository.save(executive);

    }

    public ExecutivePageResDto getAllExecutive(int page, int size) {
        Pageable pageable = PageRequest.of(page, size);
        Page<Executive> executivePage = executiveRepository.findAll(pageable);
        long totalRecords = executivePage.getTotalElements();
        int totalPages = executivePage.getTotalPages();
        List<ExecutiveResqDto> listDto = executivePage
                .toList()
                .stream()
                .map(ExecutiveMapper::mapToDto)
                .toList();
        return  new ExecutivePageResDto(
                listDto,
                totalRecords,
                totalPages
        );
    }

    public ExecutiveResqDto getById(long id) {
        Executive executive = executiveRepository.findById(id)
                .orElseThrow(()-> new ResourceNotFoundException("Invalid executive id given"));
        return  new ExecutiveResqDto(
                executive.getId(),
                executive.getJobTitle(),
                executive.getName()

        );
    }
    public Executive getByExecutiveId(long executiveId) {
        return executiveRepository.findById(executiveId)
                .orElseThrow(()-> new ResourceNotFoundException("Executive ID given is Invalid."));
    }

    public List<Executive> getFilterByExecutive(FilterExecutiveReqDto filterExecutiveReqDto) {
        if(filterExecutiveReqDto.jobTitle() == null) return List.of();
        JobTitle jobtitle = (filterExecutiveReqDto.jobTitle() != null && !filterExecutiveReqDto.jobTitle().isEmpty())
                ? JobTitle.valueOf(filterExecutiveReqDto.jobTitle()) : null;

        return executiveRepository.getFilterByExecutive(jobtitle);

    }
}
