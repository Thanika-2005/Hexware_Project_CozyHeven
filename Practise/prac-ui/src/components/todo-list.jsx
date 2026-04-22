import axios from "axios"
import { useState, useEffect } from "react"

function TodoList() {
    const [todos, setTodo] = useState([])
    const [errMsg, setErrorMsg] = useState(undefined)
    const api = "https://jsonplaceholder.typicode.com/todos"

    useEffect(() => {
        const getAllTodos = async () => {
            try {
                const response = await axios.get(api)
                setTodo(response.data)
                setErrorMsg(undefined)
            }
            catch (err) {
                setErrorMsg(err.message)
            }
        }
        getAllTodos()
    }, [])

    return (
        <div className="container">
            <h2>TodoList</h2>

            {!(errMsg== undefined) ? <div> {errMsg} </div> : ""}

            <table className="table">
                <thead>
                    <tr>
                        <th scope="col">#</th>
                        <th scope="col">UserId</th>
                        <th scope="col">id</th>
                        <th scope="col">Title</th>
                        <th scope="col">Completed</th>

                    </tr>
                </thead>
                <tbody>
                    {
                        todos.map((todo, index) => (
                            <tr>
                                <th scope="row"></th>
                                <td>{todo.userId}</td>
                                <td>{todo.id}</td>
                                <td>{todo.title}</td>
                                <td>{todo.completed == true? "true" :"false"}</td>
                            </tr>
                        ))

                    }
                    
                </tbody>
            </table>
        </div>
    )
}
export default TodoList


            // {
            //     todos.map((todo, index) => (
            //         <div className="row mt-2" key={index}>
            //             <div className="col-lg-12">
            //                 <div className="card">
            //                     <div className="card-header">
            //                         {todo.title}
            //                     </div>
            //                     <div className="card-body">
            //                         <p>Completed:  {todo.completed == true? "YES" : "PENDING"}</p>
            //                     </div>
            //                     <div className="card-footer">
            //                         some action buttons (delete) (edit)
            //                     </div>
            //                 </div>
            //             </div>
            //         </div>
            //     ))
            // }
