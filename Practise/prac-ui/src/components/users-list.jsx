import axios from "axios";
import { useEffect, useState } from "react";

function UserList() {
    const [users, setUsers] = useState([])
    const [errMsg, setErrorMsg] = useState(undefined)
    const api = "https://jsonplaceholder.typicode.com/users"

    useEffect(() => {
        const getUsers = async () => {
            try {
                const response = await axios.get(api);
                setUsers(response.data)
                setErrorMsg(undefined)
            }
            catch (err) {
                setErrorMsg(err.msg)
            }
        }
        getUsers()
    }, [])

    return (
        <div className="container">
            <h1>Users List</h1>

            {!(errMsg == undefined) ? <div> {errMsg} </div> : ""}

            <table className="table">
                <thead>
                    <tr>
                        <th scope="col">#</th>
                        <th scope="col">Name</th>
                        <th scope="col">UserName</th>
                        <th scope="col">Email</th>
                        <th scope="col">City</th>
                        <th scope="col">Phone</th>
                        <th scope="col">CompanyName</th>
                    </tr>
                </thead>
                <tbody>
                    {
                         users.map((user,index) => ( 
                        <tr>
                      
                        <th scope="row">{index +1 }</th>
                        <td>{user.name}</td>
                        <td>{user.username}</td>
                        <td>{user.email}</td>
                        <td>{user.address.city}</td>
                        <td>{user.phone}</td>
                        <td>{user.company.name}</td>
                        
                         
                    </tr>
                         ))
                    }
                       

                    
                    

                </tbody>
            </table>
        </div>
    )
}

export default UserList