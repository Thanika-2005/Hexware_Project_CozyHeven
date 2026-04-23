import { createRoot } from 'react-dom/client'
import { createBrowserRouter, RouterProvider, Navigate } from 'react-router-dom'
import UserList from './components/UserList.jsx'
import AddUser from './components/AddUser.jsx'

const routes = createBrowserRouter([
   {
    path: "/",
    element: <Navigate to="/users" /> 
  },
  {
    path: "/users",
    element: <UserList />
  },
  {
    path: "/add-user",
    element: <AddUser />
  }
])

createRoot(document.getElementById('root')).render(
  <RouterProvider router={routes} />
)