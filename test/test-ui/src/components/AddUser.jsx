import axios from "axios"
import { useState } from "react"
import { Link } from "react-router-dom"

function AddUser() {
    const [name, setName] = useState(undefined)
    const [email, setEmail] = useState(undefined)
    const [phone, setPhone] = useState(undefined)
    const [company, setCompany] = useState(undefined)
    const [successMsg, setSuccessMsg] = useState(undefined)
    const [errMsg, setErrorMsg] = useState(undefined)

    const api = "https://jsonplaceholder.typicode.com/users"

    const addUser = async (e) => {
        e.preventDefault()
        try {
            const response = await axios.post(api, {
                name: name,
                email: email,
                phone: phone,
                company: { name: company }
            }
            )
            console.log(response.data)
            setSuccessMsg("User added successfully!")
            setErrorMsg(undefined)
        } catch (err) {
            setErrorMsg(err.message)
            setSuccessMsg(undefined)
        }
    }

    return (
        <div className="container">
            <form onSubmit={(e) => addUser(e)}>
                <div className="card">
                    <div className="card-header">
                        <h2>Add New User</h2>
                    </div>
                    <div className="card-body">
                        {
                            errMsg == undefined ? "" :
                                <div clasName="row">
                                    <div className="col lg -12">
                                        <div className="alert alert-danger">
                                            {errMsg}
                                        </div>
                                    </div>
                                </div>
                        }
                        {
                            successMsg == undefined ? "" :
                                <div clasName="row">
                                    <div className="col lg -12">
                                        <div className="alert alert-primary">
                                            {successMsg}
                                        </div>
                                    </div>
                                </div>
                        }

                        <div className="row">
                            <div className="col md-3">
                                <label> Enter the Name</label>
                            </div>
                            <div className="col sm-8">
                                <input type="text" className="form-control " required="required"
                                    onChange={(e) => setName(e.target.value)} />
                            </div>

                        </div>

                        <div clasName="row">
                            <div className="col md-3">
                                <label> Enter the Email</label>
                            </div>
                            <div className="col sm-8">
                                <input type="email" className="form-control "
                                    onChange={(e) => setEmail(e.target.value)} />
                            </div>

                        </div>
                        <div clasName="row">
                            <div className="col md-3">
                                <label> Enter the phone</label>
                            </div>
                            <div className="col sm-8">
                                <input type="phone" className="form-control "
                                    onChange={(e) => setPhone(e.target.value)} />
                            </div>

                        </div>

                        <div clasName="row" mt-4>
                            <div className="col md-3">
                                <label> Enter the Company Name</label>
                            </div>
                            <div className="col sm-8">
                                <input type="text" className="form-control "
                                    onChange={(e) => setCompany(e.target.value)} />
                            </div>

                        </div>

                        <div clasName="row mb-4">
                            <div className="col sm mt-3">
                                <input type="submit" value="Add User" className="btn btn-success" />
                                {/* Link — go back to users */}
                                <Link to="/users" className="btn btn-secondary ms-2">
                                    Back to Users
                                </Link>

                            </div>

                        </div>

                        <div>
                            <div className="card-footer row mt-4" >
                                <p>User details form</p>
                            </div>

                        </div>

                    </div>

                </div>

            </form>

        </div>
    )

}
export default AddUser