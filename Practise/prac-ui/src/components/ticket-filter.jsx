import axios from "axios"
import { useEffect, useState } from "react"
import { useParams } from "react-router-dom"

const Ticketfilter = () => {
    const [tickets, setTickets] = useState([])
    const { status } = useParams();

    const api = "http://localhost:8080/api/ticket/customer/v2"
    useEffect(() => {
        const getTickets = async () => {
            const config = {
                headers: {
                    "Authorization": 'Bearer ' + localStorage.getItem('token')
                }
            }

            const response = await axios.get(api, config);
            setTickets(response.data)
            filter(response.data)
        }

        const filter =(ticketData)=>{

            let statusRefinedValue = status.split(" ")[0]
            console.log(statusRefinedValue)
            let filteredData = ticketData.filter(ticket=> ticket.status === statusRefinedValue) 
            console.log(filteredData)
            setTickets([...filteredData])
        }
        getTickets()
    }, [status])
    return (
        <div>
            <table className="table">
                <thead>
                    <tr>
                        <th scope="col">#</th>
                        <th scope="col">Subject</th>
                        <th scope="col">Status</th>
                        <th scope="col">Priority</th>
                        <th scope="col">Creation Date</th>
                        <th scope="col">Executive Name</th>
                        <th scope="col">Excetive Title</th>
                        <th scope="col">Action</th>
                    </tr>
                </thead>
                <tbody>
                    {
                        tickets.map((ticket, index) => (
                            <tr key={index}>
                                <th scope="row">{index}</th>
                                <td>{ticket.subject}</td>
                                <td>{ticket.status}</td>
                                <td>{ticket.priority}</td>
                                <td>{ticket.createdAt}</td>
                                <td>{ticket.executiveName}</td>
                                <td>{ticket.executiveJobTitle}</td>
                                <td><button className="btn btn-warning">Close Ticket</button></td>
                                 
                            </tr>
                        ))
                    }


                </tbody>
            </table>
        </div>
    )
}

export default TicketList


// path: "show-ticket/:status",
// element: <TicketList /> 