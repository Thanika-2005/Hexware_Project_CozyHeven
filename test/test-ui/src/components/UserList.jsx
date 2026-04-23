import axios from "axios"
import { useState, useEffect } from "react"
import { Link } from "react-router-dom"

function UserList() {
    const [users, setUsers] = useState([])
    const [errMsg, setErrorMsg] = useState(undefined)
    const api = "https://jsonplaceholder.typicode.com/users"

    useEffect(() => {
        const getUsers = async () => {
            try {
                const response = await axios.get(api)
                setUsers(response.data)
                setErrorMsg(undefined)


            } catch (err) {
                setErrorMsg(err.message)

            }
        }
        getUsers()
    }, [])

    const handleDelete = async (id) => {
        await axios.delete(`https://jsonplaceholder.typicode.com/users/${id}`)
        setUsers(users.filter(u => !(u.id == id)))
    }

    return (
        <div className="container">
            
            <div className=" mt-3 mb-3">
                <h4>User List</h4>
                <Link to="/add-user" className="btn btn-primary">+ Add User</Link>
            </div>

            {errMsg != undefined && <div className="alert alert-danger">{errMsg}</div>}
            <table className="table">
                <thead>
                    <tr>
                        <th scope="col">#</th>
                        <th scope="col">Name</th>
                        <th scope="col">Email</th>
                        <th scope="col">Phone</th>
                        <th scope="col">Company Name</th>
                        <th scope="col">Action</th>
                    </tr>
                </thead>
                <tbody>
                    {
                        users.map((user, index) => (
                            <tr>
                                <th scope="row">{index + 1}</th>
                                <td>{user.name}</td>
                                <td>{user.email}</td>
                                <td>{user.phone}</td>
                                <td>{user.company.name}</td>
                                <td><button type="button" className="btn btn-primary"
                                    onClick={() => handleDelete(user.id)}>Delete</button>
                                </td>

                            </tr>
                        ))
                    }

                </tbody>
            </table>
        </div>
    )


}
export default UserList