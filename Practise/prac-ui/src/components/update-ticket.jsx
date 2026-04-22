 import {useParams } from "react-router-dom";

     const {status} = useParams();


    const updateApi = "http://localhost:8080/api/ticket/update/status/"
    const navigate = useNavigate()


     const closeTicket = async (ticketId)=>{
        const config = {
                headers: {
                    "Authorization": 'Bearer ' + localStorage.getItem('token')
                }
            }
        try{
            await axios.put(updateApi + `${ticketId}/v2?ticketStatus=CLOSED`, {}, config)
            let filteredTicket = [...tickets].filter(t=> !(t.id === ticketId))
            setTickets(filteredTicket) 
            navigate("/customer-dashboard/show-ticket/CLOSED")
        }
        catch(err){
            //handle errMsg 
        }
    }

        <td><button className="btn btn-warning" onClick={()=>closeTicket(ticket.id)}>Close Ticket</button></td>