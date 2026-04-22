import axios from "axios"
import { useEffect, useState } from "react"

function AddPost() {

    
    const [userId, setUserId] = useState(undefined)
    const [title, setTitle] = useState(undefined)
    const [body, setBody] = useState(undefined)

    const [errorMsg, setErrorMsg] = useState(undefined)
    const [successMsg, setSuccessMsg] = useState(undefined)

    const api = "https://jsonplaceholder.typicode.com/posts"

    const insertPost = async (e) => {
        e.preventDefault();

        // const config = {
        //     headers:{
        //         'Authorization':'Bearer' + localStorage.getItem('token')
        //     }
        // }

        try {
            const response = axios.post(api, {
                userId: userId,
                title: title,
                body: body
            })
            setSuccessMsg("Successfully inserted!!!")
            setErrorMsg(undefined)

        }
        catch (err) {
            setErrorMsg(err.message)
            setSuccessMsg(undefined)
        }
    }
    return (
        <div className="container mt-4">
            <form onSubmit={(e) => insertPost(e)}>
                <div className="row mt-4">
                    <div className="col lg-12">
                        <div className="card">
                            <div className="card-header">
                                <p>Add Post</p>
                            </div>


                            <div className="card-body">
                                {
                                    errorMsg == undefined ? "" :
                                        <div className="row ">
                                            <div className="col lg-12">
                                                <div className="alert alert-danger">
                                                    {errorMsg}
                                                </div>
                                            </div>
                                        </div>

                                }
                                {
                                    successMsg == undefined ? "" :
                                        <div className="row ">
                                            <div className="col lg-12">
                                                <div className="alert alert-primary">
                                                    {successMsg}
                                                </div>
                                            </div>
                                        </div>

                                }
                                <div className="row ">
                                    <div className="col sm-3">
                                        <label>Enter the Title</label>
                                    </div>
                                    <div className="col md-8">
                                        <input type="text" className="form-control" required="required"
                                            onChange={(e) => setTitle(e.target.value)} />

                                    </div>
                                </div>


                                <div className="row">
                                    <div className="col md-3">
                                       <label>Enter the UserId</label>
                                    </div>
                                    <div className = "col sm-8">
                                        <input type = "number" className = "form-control"
                                        onChange={(e) => setUserId(e.target.value)}/>
                                    </div>
                                </div>


                                <div className= "row">
                                    <div className = "col md-3">
                                        <label>
                                           Enter the details
                                        </label>
                                    </div>
                                    <div className = "col sm-8">
                                        <textarea className = "form-control"
                                        onChange={(e) => setBody(e.target.value)}>
                                            </textarea>
                                    </div>
                                </div>
                                <div className="row mb-4">
                                    <div className="col-sm-3">
                                        <input type="submit" value = "Add Post" className="btn btn-secondary" />
                                    </div>
                                    <div className="col-md-8">

                                    </div>
                                </div>
                            </div>

                            <div className="card-footer">
                                <p>done</p>
                            </div>

                        </div>

                    </div>
                </div>

            </form>

        </div>
    )


}
export default AddPost