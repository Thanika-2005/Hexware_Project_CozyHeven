package com.springboot.myapp.service;

import com.springboot.myapp.dto.TicketResqDto;
import com.springboot.myapp.enums.TicketPriority;
import com.springboot.myapp.enums.TicketStatus;
import com.springboot.myapp.exceptions.ResourceNotFoundException;
import com.springboot.myapp.model.Ticket;
import com.springboot.myapp.repository.TicketRepository;
import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.Mockito;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;

import java.time.Instant;
import java.util.List;
import java.util.Optional;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.when;


@ExtendWith(MockitoExtension.class)
public class TicketServiceTest {

    @InjectMocks
    private TicketService ticketService;
    @Mock
    private TicketRepository ticketRepository;

    @Test
    public void getTicketByIdWhenExits(){
        // Check if ticketService is not null
        Assertions.assertNotNull(ticketService);


        //Preparing the data for mock
        Ticket ticket = new Ticket();
        ticket.setId(1L);
        ticket.setSubject("test subject");
        ticket.setTicketPriority(TicketPriority.HIGH);
        ticket.setTicketStatus(TicketStatus.OPEN);
        ticket.setCreatedAt(Instant.now());


        // Actual Mocking: if any when you encounter a call  ticketRepository.findById(12L)
        // must return this above ticket object instead of going to DB
        // this is virtual record used only for testing purpose
        when(ticketRepository.findById(1L)).thenReturn(Optional.of(ticket));


        //Prepare the DTO for above ticket object
        // So we know that DTO is getting prepared properly in our actual service class too.
        TicketResqDto dto = new TicketResqDto(
                ticket.getId(),
                ticket.getSubject(),
                ticket.getTicketPriority(),
                ticket.getTicketStatus(),
                ticket.getCreatedAt()
        );
        TicketResqDto dto1 = new TicketResqDto(
                ticket.getId(),
                ticket.getSubject(),
                ticket.getTicketPriority(),
                TicketStatus.IN_PROCESS,
                ticket.getCreatedAt()
        );

        // i CHECK if getById(12) gives me the ticket object that i mentioned earlier during mocking
        //   Mockito.when(ticketRepository.findById(12L)).thenReturn(Optional.of(ticket));
        Assertions.assertEquals(dto, ticketService.getTicketById(1));
        Assertions.assertNotEquals(dto1,ticketService.getTicketById(1));

        // Here i am verifying that my repository call to DB happens only once for this findById method
        // which is ideal for fast API processing
        Mockito.verify(ticketRepository,times(2)).findById(1L);
    }

    @Test
    public void getTicketByWhenNotFound(){
        when(ticketRepository.findById(10L)).thenReturn(Optional.empty());

        Exception e  = Assertions.assertThrows(ResourceNotFoundException.class ,() ->{
            ticketService.getTicketById(10L);
        });

        Assertions.assertEquals("Invalid id given", e.getMessage());
    }

    @Test
    public void getAllTicketsTest() {
        /* Prepare the List. */
        Ticket ticket1 = new Ticket();
        ticket1.setId(12L);
        ticket1.setSubject("test subject");
        ticket1.setTicketPriority(TicketPriority.LOW);
        ticket1.setTicketStatus(TicketStatus.OPEN);
        ticket1.setCreatedAt(Instant.now());
        Ticket ticket2 = new Ticket();
        ticket2.setId(14L);
        ticket2.setSubject("test subject");
        ticket2.setTicketPriority(TicketPriority.HIGH);
        ticket2.setTicketStatus(TicketStatus.CLOSED);
        ticket2.setCreatedAt(Instant.now());
        List<Ticket> list = List.of(ticket1, ticket2);


        Page<Ticket> ticketPage = new PageImpl<>(list);
        int page = 0;
        int size = 2;

        Pageable pageable = PageRequest.of(page, size);
        // Mock the repository call for findALL()
        when(ticketRepository.findAll(pageable)).thenReturn(ticketPage);  // pageable for size 2

        Page<Ticket> ticketPage1 = new PageImpl<>(list.subList(0,1));
         page = 0;
         size = 1;

        Pageable pageable1 = PageRequest.of(page, size);

        // Mock the repository call for findALL()
//        when(ticketRepository.findAll(pageable1)).thenReturn(ticketPage1);  // pageable for size 1



        // Actual Call  (call only 1 ) which page , size you need
        Assertions.assertEquals(2,ticketService.getAllTickets(0,2).data().size());
//        Assertions.assertEquals(1,ticketService.getAllTickets(0,1).data().size());

    }
}
