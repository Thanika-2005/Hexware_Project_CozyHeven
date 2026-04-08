package com.springboot.myapp.controller;

import com.springboot.myapp.dto.ExecutivePageResDto;
import com.springboot.myapp.dto.ExecutiveReqDto;
import com.springboot.myapp.dto.ExecutiveResqDto;
import com.springboot.myapp.dto.FilterExecutiveReqDto;
import com.springboot.myapp.model.Executive;
import com.springboot.myapp.service.ExecutiveService;
import jakarta.validation.Valid;
import lombok.AllArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@AllArgsConstructor
@RequestMapping("/api/executive")
public class ExecutiveController {
    private ExecutiveService executiveService;

    @PostMapping("/add")
    public Executive addExecutive( @Valid @RequestBody ExecutiveReqDto executiveReqDto){
        return executiveService.addExecutive(executiveReqDto);
    }

    @GetMapping("/get-all")
    public ExecutivePageResDto getAllExecutive(@RequestParam (value = "page",required = false,defaultValue = "0")int page,
                                             @RequestParam(value = "size",required = false,defaultValue = "5")int size) {

        return executiveService.getAllExecutive(page, size);
    }

    @GetMapping("/get/{id}")
    public ExecutiveResqDto getById(@PathVariable long id){
        return executiveService.getById(id);
    }

    @PostMapping("/filter")
    public List<Executive> getFilterByExecutive(@RequestBody FilterExecutiveReqDto filterExecutiveReqDto){
        return executiveService.getFilterByExecutive(filterExecutiveReqDto);
    }

}
