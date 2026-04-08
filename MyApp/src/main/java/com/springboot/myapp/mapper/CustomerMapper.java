package com.springboot.myapp.mapper;

import com.springboot.myapp.dto.*;
import com.springboot.myapp.model.Customer;
public class CustomerMapper{

public static Customer mapToEntity(CustomerReqDto customerReqDto) {
    Customer customer = new Customer();
    customer.setName(customerReqDto.name());
    customer.setCity(customerReqDto.city());
    customer.setEmail(customerReqDto.email());
    return customer;
}

    public static CustomerResqDto mapToDto(Customer customer) {
    return new CustomerResqDto(
            customer.getId(),
            customer.getCity(),
            customer.getName()    
    );
        
    }

    public static Customer mapToEntitys(CustomerSignUpDto customerSignUpDto) {
        Customer customer = new Customer();
        customer.setName(customerSignUpDto.name());
        customer.setCity(customerSignUpDto.city());
        customer.setEmail(customerSignUpDto.email());
        return customer;
    }
}
