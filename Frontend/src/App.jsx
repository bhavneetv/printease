import React from 'react'
import { createBrowserRouter, RouterProvider } from "react-router-dom"
import Applayout from './Applayout/Applayout'
import FileUpload from "./Pages/User/FileUpload.jsx"
import Dashboard from "./Pages/User/Dashboard.jsx"
import Myorders from "./Pages/User/Myorders.jsx"
import Profile from "./Pages/User/Profile.jsx"


function App() {

  const router = createBrowserRouter([
    {
      path: "/",
      element: <Applayout />,
      children: [

        {
          path: "/FileUpload",
          element: <FileUpload />
        },
        {
          path: "/",
          element: <Dashboard />
        },
        {
          path: "/Myorders",
          element: <Myorders />
        },
        {
          path: "/Profile",
          element: <Profile />
        },
        {
          path: "/ShopOrders",
          element: <ShopOrders />
        },
      ]
    }

  ])

  return <>
    <RouterProvider router={router} />
  </>

}

export default App
