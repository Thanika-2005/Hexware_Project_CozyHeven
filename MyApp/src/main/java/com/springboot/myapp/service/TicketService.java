package com.springboot.myapp.service;


import com.springboot.myapp.dto.*;
import com.springboot.myapp.enums.Role;
import com.springboot.myapp.enums.TicketPriority;
import com.springboot.myapp.enums.TicketStatus;
import com.springboot.myapp.exceptions.ResourceNotFoundException;
import com.springboot.myapp.exceptions.TicketUpdatePermissionException;
import com.springboot.myapp.mapper.TicketMapper;
import com.springboot.myapp.model.*;
import com.springboot.myapp.repository.TicketRepository;
import jakarta.validation.Valid;
import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.slf4j.event.Level;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import java.util.List;


@Service
@AllArgsConstructor
@Slf4j
public class TicketService {

    private final TicketRepository ticketRepository;
    private final CustomerService customerService;
    private final ExecutiveService executiveService;
    private final UserService userService;

    public void addTicket(@Valid TicketReqDto ticketReqDto,String username) {
        // Step 0: Fetch Customer from DB or throw an Exception
        Customer customer = customerService.getByUsername(username);
        // Step 1: Convert DTO to Entity using mapper
        Ticket ticket = TicketMapper.mapToEntity(ticketReqDto);

        // Step 2: Add Additional Details to Entity
        ticket.setTicketStatus(TicketStatus.OPEN);
        ticket.setCustomer(customer);

        //Step 3: Save Entity in DB
        ticketRepository.save(ticket);

    }


    public TicketPageResDto getAllTickets(int page, int size) { // accessible to all
        // Create an object of Pageable interface using this page and size and pass it to me
        Pageable pageable = PageRequest.of(page, size);
        // From TicketRepository , use findAll method to get all tickets
        Page<Ticket> PageTicket = ticketRepository.findAll(pageable);
        long totalRecords = PageTicket.getTotalElements();
        int totalPages = PageTicket.getTotalPages();

        List<TicketResqDto> listDto = PageTicket
                .toList()
                .stream()
                .map(TicketMapper::mapToDto)
                .toList();


        /*
        List<TicketRespDto> listDto = new ArrayList<>(); //[ticketRepDto, ticketRepDto]
        for(Ticket ticket  : pageTicket.toList()){
            TicketRespDto dto =  TicketMapper.mapToDto(ticket);
            listDto.add(dto);
        }
        */

        return new TicketPageResDto(
                listDto,
                totalRecords,
                totalPages
        );


    }

    public TicketResqDto getTicketById(long id) {
        Ticket ticket = ticketRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Invalid id given"));
        return new TicketResqDto(
                ticket.getId(),
                ticket.getSubject(),
                ticket.getTicketPriority(),
                ticket.getTicketStatus(),
                ticket.getCreatedAt()
        );

    }

    public List<Ticket> getByFilter(FilterReqDto filterReqDto) {

        if (filterReqDto.priority() == null && filterReqDto.status() == null)
             return List.of();

        TicketPriority ticketPriority = (filterReqDto.priority() != null && !filterReqDto.priority().isEmpty())
                ? TicketPriority.valueOf(filterReqDto.priority()) : null;

        TicketStatus ticketStatus = (filterReqDto.status() != null && !filterReqDto.status().isEmpty())
                ? TicketStatus.valueOf(filterReqDto.status()) : null;

        return ticketRepository.getPriorityAndStatus(ticketPriority, ticketStatus);

    }

    public void assignExecutiveToTicket(long ticketId, long executiveId) {
        log.atLevel(Level.INFO).log("Called: assignExecutiveToTicket - assigning ticket to executive by ids");
        // Step 1: Fetch Ticket from ticketId
        Ticket ticket =  ticketRepository.findById(ticketId)
                .orElseThrow(()->new ResourceNotFoundException("Ticket Id given is Invalid."));

        // Step 2: Fetch Executive from executiveId
        Executive executive = executiveService.getByExecutiveId(executiveId);

        // Step 3: Attach executive to Ticket
        ticket.setExecutive(executive);

        // Step 4: Save Ticket again
        ticketRepository.save(ticket);
        log.atLevel(Level.INFO).log("Assigned Executive to Ticket Completed: assignExecutiveToTicket");
    }


    public List<TicketExecCusReqDto> getTicketsByCustomerId(long customerId) {
        // Step 0: Validation
        customerService.getById(customerId);

        /*
         * 1. I can write JPQL for this
         * 2. I can use JPA Derived Query for this
         * */

        // Step 1: Fetch from repository
        List<Ticket> list = ticketRepository.getTicketsByCustomerId(customerId);

        // Step 2: Stream, Map, and Return
        return list
                .stream()
                .map(TicketMapper::mapToTicketCustomerDto)
                .toList();
    }

    public List<TicketExecCusReqDto> getTicketsByCustomer(String username) {
        List<Ticket> list =  ticketRepository.getTicketsByCustomer(username);
        // convert list to dto : List<Ticket> to List<TicketCustomerDto>
        return list
                .stream()
                .map(TicketMapper :: mapToTicketCustomerDto)
                .toList();
    }

    public void updateStatus(TicketStatus ticketStatus, long ticketId, String loggedInUsername) {
        Ticket ticket  = ticketRepository.findById(ticketId)
                .orElseThrow(()-> new ResourceNotFoundException("Ticket Id Invalid."));

        // This user is trying to update ticket
        User user = (User) userService.loadUserByUsername(loggedInUsername);

        // Check if the ticket belongs to this user
        //If id of loggedIn user is equal to the id of ticket that needs to be updated. then let it go thru
        //else throw an Exception

        if(user.getRole().equals(Role.CUSTOMER)){
            if( ticket.getCustomer().getUser().getId() != user.getId())
                throw new TicketUpdatePermissionException("Customer does not own this ticket");

        }
        if(user.getRole().equals(Role.EXECUTIVE)){
            if(ticket.getExecutive() == null)
                throw new TicketUpdatePermissionException("Executive does not own this ticket");

            if( ticket.getExecutive().getUser().getId() != user.getId())
                throw new TicketUpdatePermissionException("Executive does not manage this ticket");

        }

        ticket.setTicketStatus(ticketStatus);
        ticketRepository.save(ticket);

    }

    public void updateStatusWithJpql(TicketStatus ticketStatus, long ticketId, String loggedInUsername) {
        Ticket ticket = ticketRepository.findById(ticketId)
                .orElseThrow(()-> new ResourceNotFoundException("Ticket Id Invalid."));


        // This user is trying to update ticket
        User user = (User) userService.loadUserByUsername(loggedInUsername);

        // Check if the icket belongs to this user
        //If id of loggedIn user is equal to the id of ticket that needs to be updated. then let it go thru
        //else throw an Exception

        if(user.getRole().equals(Role.CUSTOMER)){
            if( ticket.getCustomer().getUser().getId() != user.getId())
                throw new TicketUpdatePermissionException("Customer does not own this ticket");

        }
        if(user.getRole().equals(Role.EXECUTIVE)){
            if(ticket.getExecutive() == null)
                throw new TicketUpdatePermissionException("Executive does not own this ticket");

            if( ticket.getExecutive().getUser().getId() != user.getId())
                throw new TicketUpdatePermissionException("Executive does not manage this ticket");

        }
        ticketRepository.updateStatusWithJpql(ticketStatus,ticketId);
    }


}
