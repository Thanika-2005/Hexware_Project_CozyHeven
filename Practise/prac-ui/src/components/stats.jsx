import axios from "axios"
import { useEffect, useState } from "react"

const Stats = () => {
    const statsApi = "http://localhost:8080/api/ticket/stats"
    const [statData, setStatData] = useState([]);

    useEffect(() => {

        const fetchStats = async () => {
            const config = {
                headers: {
                    "Authorization": 'Bearer ' + localStorage.getItem('token')
                }
            }
            try {
                const response = await axios.get(statsApi, config)
                setStatData(response.data)
            }
            catch (err) {

            }
        }

        fetchStats();
    }, [])
    return (
        <div className="card">
            <div className="card-body">
                <div className="row">
                    {
                        statData.map((stat, index) => (
                            <div className="col-sm-4" key={index}>
                                <div className="card">
                                    <div className="card-body">
                                        <div style={{ 'textAlign': "center" }}>
                                            <h4>{stat.status}</h4>
                                            <h1>{stat.count}</h1>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))
                    }


                </div>
            </div>

        </div>
    )
}

export default Stats

//    @CrossOrigin(origins = "http://localhost:5173")
//    @GetMapping("/stats")
//     public List<StatDto> getTicketStatsForCustomer(Principal principal){
//         String customerUsername = principal.getName();
//         return ticketService.getTicketStatsForCustomer(customerUsername);
//     }
//     package com.springboot.myapp.dto;

// public record StatDto(
//         String status,
//         int count
// ) {
// }
//     @Query("""
//             select t
//             from Ticket t
//             where t.customer.user.username=?1
//             """)
//     List<Ticket> getTicketsByCustomerUsernameV1(String customerUsername);
// }  public List<StatDto> getTicketStatsForCustomer(String customerUsername) {
//         List<Ticket> listTickets =  ticketRepository.getTicketsByCustomerUsernameV1(customerUsername);
//         // Compute Open tickets
//         List<Ticket> openTickets =  listTickets
//                                         .stream()
//                                         .filter(t-> t.getTicketStatus().equals(TicketStatus.OPEN))
//                                         .toList();
//         List<Ticket> inProcessTickets =  listTickets
//                 .stream()
//                 .filter(t-> t.getTicketStatus().equals(TicketStatus.IN_PROCESS))
//                 .toList();
//         List<Ticket> closedTickets =  listTickets
//                 .stream()
//                 .filter(t-> t.getTicketStatus().equals(TicketStatus.CLOSED))
//                 .toList();

//         StatDto statDto1 = new StatDto(
//                 "OPEN TICKETS",
//                 openTickets.size()
//         );
//         StatDto statDto2 = new StatDto(
//                 "IN_PROCESS TICKETS",
//                 inProcessTickets.size()
//         );
//         StatDto statDto3 = new StatDto(
//                 "CLOSED TICKETS",
//                 closedTickets.size()
//         );

//         return List.of(statDto1,statDto2,statDto3);
//     }


// -----version 2---
// public record StatDtoV1(
//         TicketStatus status,
//         Long count
// ) {
// }
//    @ Query("""
//             select new com.springboot.myapp.dto.StatDtoV1(t.ticketStatus, count(t.id))
//             from Ticket t
//             where t.customer.user.username=?1
//             group by t.ticketStatus
//             """)
//     List<StatDtoV1> getTicketsByCustomerUsernameV2(String customerUsername);

//     @GetMapping("/stats/v2")
//     public List<StatDtoV1> getTicketStatsForCustomerV1(Principal principal){
//         String customerUsername = principal.getName();
//         return ticketService.getTicketStatsForCustomerV1(customerUsername);
//     }

//       public List<StatDtoV1> getTicketStatsForCustomerV1(String customerUsername){
//          return ticketRepository.getTicketsByCustomerUsernameV2(customerUsername);
//     }