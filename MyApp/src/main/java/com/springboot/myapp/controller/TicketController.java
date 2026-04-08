package com.springboot.myapp.controller;

import com.springboot.myapp.dto.*;
import com.springboot.myapp.enums.TicketStatus;
import com.springboot.myapp.model.Ticket;
import com.springboot.myapp.service.TicketService;
import jakarta.validation.Valid;
import lombok.AllArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.HttpStatusCode;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.List;

@RestController
@AllArgsConstructor
@RequestMapping("/api/ticket")
public class TicketController {

    private final TicketService ticketService;


    @PostMapping("/add")
    public ResponseEntity<?> addTicket(@Valid @RequestBody TicketReqDto ticketReqDto,
                                       Principal principal){
        String username = principal.getName();
        ticketService.addTicket(ticketReqDto,username);
        //asking spring for loggedIn username
        return ResponseEntity.status(HttpStatus.CREATED)
                .build();

    }

    /* Access: permitAll */
    @GetMapping("/get-all")   //List<Ticket> getAllTickets
    public TicketPageResDto getAllTickets(@RequestParam (value = "page",required = false,defaultValue = "0")int page,
                                              @RequestParam(value = "size",required = false,defaultValue = "5")int size){

        return ticketService.getAllTickets(page,size);
    }


    /* Access: Authenticated */
    @GetMapping("/get/{id}")
    public TicketResqDto getTicketById(@PathVariable long id){

        return ticketService.getTicketById(id);
    }

    @PostMapping("/get/filter")
    public List<Ticket> getByFilter(@RequestBody FilterReqDto filterReqDto){
        return ticketService.getByFilter(filterReqDto);
    }

    @PutMapping("/assign-executives/{ticketId}/{executiveId}")
    public ResponseEntity<?> assignExecutiveToTicket(@PathVariable long ticketId,
                                       @PathVariable long executiveId){
        ticketService.assignExecutiveToTicket(ticketId,executiveId);
        return ResponseEntity.status(HttpStatus.CREATED)
                .build();
    }

    @GetMapping("/customer/{customerId}/v1")
    public List<TicketExecCusReqDto> getTicketsByCustomerId(@PathVariable long customerId) {
        return ticketService.getTicketsByCustomerId(customerId);
    }


    @GetMapping("/customer/v2")
    public List<TicketExecCusReqDto> getTicketsByCustomer(Principal principal){
        return ticketService.getTicketsByCustomer(principal.getName());

    }


    @PutMapping("/update/status/{ticketId}/v1")
    public void updateStatus(@RequestParam TicketStatus ticketStatus,
                             @PathVariable long ticketId,
                             Principal principal){
        ticketService.updateStatus(ticketStatus, ticketId, principal.getName());
    }

    @PutMapping("/update/status/{ticketId}/v2")
    public void updateStatusV2(@RequestParam TicketStatus ticketStatus,
                               @PathVariable long ticketId,
                               Principal principal){

        ticketService.updateStatusWithJpql(ticketStatus, ticketId, principal.getName());
    }

}

