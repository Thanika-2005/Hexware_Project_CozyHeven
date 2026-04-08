package com.springboot.myapp.controller;


import com.springboot.myapp.dto.*;
import com.springboot.myapp.model.Customer;
import com.springboot.myapp.model.Executive;
import com.springboot.myapp.service.CustomerService;
import jakarta.validation.Valid;
import lombok.AllArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@AllArgsConstructor
@RequestMapping("/api/customer")
public class CustomerController {

    private CustomerService customerService;

    @PostMapping("/add")
    public ResponseEntity<?> addCustomer(@Valid @RequestBody CustomerReqDto customerReqDto){
        customerService.addCustomer(customerReqDto);
        return ResponseEntity.status(HttpStatus.CREATED)
                .build();
    }
    @GetMapping("/get-all")
    public CustomerPageResDto getAlllCustomers(@RequestParam (value = "page",required = false,defaultValue = "0")int page,
                                            @RequestParam(value = "size",required = false,defaultValue = "5")int size) {

        return customerService.getAllCustomers(page, size);
    }
    @GetMapping("/get/{id}")
    public CustomerResqDto getCustomerById(@PathVariable long id){
        return customerService.getCustomerById(id);
    }

    @PostMapping("/filter")
    public List<Customer> getFilterByCustomer(@RequestBody FilterCustomerReqDto filterCustomerReqDto){
        return  customerService.getFilterByCustomer(filterCustomerReqDto);
    }

    @PostMapping("/sign-up")
    public ResponseEntity<?> addCustomerWithCredentials(@Valid @RequestBody CustomerSignUpDto customerSignUpDto){
        customerService.addCustomerSignUp(customerSignUpDto);
        return ResponseEntity.status(HttpStatus.CREATED)
                .build();
    }
}
