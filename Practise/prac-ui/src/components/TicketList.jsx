function TicketList(){

    const Tickets = [
        {
            id :1,
            name : "thanika",
            age : 12
        },
        {
            id :2,
            name : "thanikzz",
            age : 14
        },
        {
            id :3,
            name : "thanikadhanusri",
            age : 17
        }
    ]
    return (
        <div>
            <h2> getAllTickets</h2>
            {
                  Tickets.map((ticket,index)=>(
                     <li key = {index}>
                        {index + 1} {ticket.id} --- {ticket.name}
                     </li>
                  ))
            }
           
        </div>
    )

}
export default TicketList;