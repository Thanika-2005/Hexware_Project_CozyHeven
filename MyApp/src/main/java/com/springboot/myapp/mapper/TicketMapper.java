package com.springboot.myapp.mapper;

import com.springboot.myapp.dto.TicketExecCusReqDto;
import com.springboot.myapp.dto.TicketReqDto;
import com.springboot.myapp.dto.TicketResqDto;
import com.springboot.myapp.model.Ticket;

public class TicketMapper {

    public static Ticket mapToEntity(TicketReqDto ticketReqDto){  // we an add @Component also or make it static
        Ticket ticket = new Ticket();
        ticket.setSubject(ticketReqDto.subject());
        ticket.setDetails(ticketReqDto.details());
        ticket.setTicketPriority(ticketReqDto.ticketPriority());
        return ticket;
    }

    public static TicketResqDto mapToDto(Ticket ticket) {
        return new TicketResqDto(
                ticket.getId(),
                ticket.getSubject(),
                ticket.getTicketPriority(),
                ticket.getTicketStatus(),
                ticket.getCreatedAt()
        );
    }
    public static TicketExecCusReqDto mapToTicketCustomerDto(Ticket ticket) {
        String executiveName = "";

        if(ticket.getExecutive() == null){
            executiveName = "NOT YET ASSIGNED";
        }
        else{
            executiveName = ticket.getExecutive().getName();
        }
        return new TicketExecCusReqDto(
                ticket.getId(),
                ticket.getSubject(),
                ticket.getTicketStatus(),
                ticket.getTicketPriority(),
                ticket.getCreatedAt(),
                ticket.getCustomer().getName(),
//                ticket.getExecutive().getName(),
//                ticket.getExecutive().getJobTitle(),
                executiveName,
                ticket.getExecutive() == null?null : ticket.getExecutive().getJobTitle()
        );
    }

}
