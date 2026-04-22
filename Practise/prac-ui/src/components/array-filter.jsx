import { useState } from "react"
import { tickets_data } from "../sample-data/ticket-data"

function ArrayOps(){
    const [tickets,setTickets] = useState(tickets_data)
    const [ticketsBackup, setTicketsBackup] = useState(tickets)

    const highPriorityFilter =()=>{
        const temp = [...tickets].filter(ticket => ticket.priority == 'HIGH')
        setTickets(temp)
    }

    const openStatusFilter = ()=>{
        const temp = [...tickets].filter(ticket => ticket.status == 'OPEN')
        setTickets(temp)
    }

    const showAllTickets= ()=>{
        // Here, I am setting the value of all tickets to tickets state. 
        // restoring all original values
        setTickets(ticketsBackup) 
    }
    return (
        <div>
            <h2>All Tickets </h2>
             <hr />
                <button onClick={highPriorityFilter}> Show HIGH Priority </button> 
                <button onClick={openStatusFilter}> Show State OPEN</button>
                <button onClick={showAllTickets}> Show All Tickets</button>
            <hr />

            {/** Displaying all tickets  */}
            {
                tickets.map((ticket,index)=>(
                    <li key={index}> 
                        {index + 1}. {ticket.subject} -- {ticket.priority} -- {ticket.status}
                    </li>
                ))
            }
        </div>
    )
}
export default ArrayOps


// export const tickets_data = [    
//     {
//         id: 1,
//         subject: 'Internet down',
//         details: 'Some details',
//         priority: 'HIGH',
//         status: 'OPEN'
//     },
//     {
//         id: 2,
//         subject: 'Internet slow',
//         details: 'Some details',
//         priority: 'MEDIUM',
//         status: 'CLOSED'
//     },
//     {
//         id: 3,
//         subject: 'Internet dead',
//         details: 'Some details',
//         priority: 'HIGH',
//         status: 'OPEN'
//     }]