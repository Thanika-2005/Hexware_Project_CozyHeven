package com.springboot.myapp.service;

import com.springboot.myapp.dto.*;
import com.springboot.myapp.enums.Role;
import com.springboot.myapp.exceptions.ResourceNotFoundException;
import com.springboot.myapp.mapper.CustomerMapper;
import com.springboot.myapp.mapper.UserMapper;
import com.springboot.myapp.model.Customer;
import com.springboot.myapp.model.User;
import com.springboot.myapp.repository.CustomerRepository;
import jakarta.validation.Valid;
import lombok.AllArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@AllArgsConstructor
public class CustomerService {

    private final CustomerRepository customerRepository;
    public final UserService userService;
    @Autowired
    private final PasswordEncoder passwordEncoder;

    public Customer addCustomer(@Valid CustomerReqDto customerReqDto) {

        Customer customer = CustomerMapper.mapToEntity(customerReqDto);
        return customerRepository.save(customer);
    }

    public CustomerPageResDto getAllCustomers(int page, int size) {
        Pageable pageable  = PageRequest.of(page, size);
        Page<Customer> customerPage = customerRepository.findAll(pageable);
        long totalRecords = customerPage.getTotalElements();
        int totalpages = customerPage.getTotalPages();
        List<CustomerResqDto> listDto = customerPage
                .toList()
                .stream()
                .map(CustomerMapper::mapToDto)
                .toList();
        return new CustomerPageResDto(
                listDto,
                totalRecords,
                totalpages

        );

    }

    // with the same structure to be printed in the get method
    public CustomerResqDto getCustomerById(long id) {
        Customer customer = customerRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Invalid customer id given"));
        return new CustomerResqDto(
                customer.getId(),
                customer.getCity(),
                customer.getName()
        );
    }

    // for foreign key add in db of tickets
    public Customer getById(long customerId) {
        return customerRepository.findById(customerId)
                .orElseThrow(()-> new ResourceNotFoundException("Invalid customer id given"));
    }

    public List<Customer> getFilterByCustomer(FilterCustomerReqDto filterCustomerReqDto) {

        if(filterCustomerReqDto.city() != null && filterCustomerReqDto.email() == null) {
            return List.of();
        }


        String customerCity = (filterCustomerReqDto.city() != null && !filterCustomerReqDto.city().isEmpty())
                ? filterCustomerReqDto.city() : null;

        String customerEmail = (filterCustomerReqDto.email() != null && !filterCustomerReqDto.email().isEmpty())
                ? filterCustomerReqDto.email() : null;


        return customerRepository.getFilterByCustomer(customerCity, customerEmail);
    }


    public void addCustomerSignUp( CustomerSignUpDto customerSignUpDto) {
        // Step 1: Map DTO to Customer Entity
         Customer customer = CustomerMapper.mapToEntitys(customerSignUpDto);
        // Step 2: Map DTO to User entity
        User user = UserMapper.mapToEntity(customerSignUpDto);

        // Step 3: Add role and other details to User entity -- ensure password in encrypted
        user.setRole(Role.EXECUTIVE);
        user.setPassword(passwordEncoder.encode(customerSignUpDto.password()));
        // Step 4 Save User in Db : so that, we get ID of the user attached to it
        user = userService.insertUser(user);

        // Step 5: Attach user to Customer object
        customer.setUser(user);
        // Step 6: Save Customer Object
        customerRepository.save(customer);
    }

    public Customer getByUsername(String username) {

        return customerRepository.getByUsername(username);
    }
}
