import React from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Applayout from "./Applayout/Applayout";
import FileUpload from "./Pages/User/FileUpload.jsx";
import Dashboard from "./Pages/User/Dashboard.jsx";
import Myorders from "./Pages/User/Myorders.jsx";
import Profile from "./Pages/User/Profile.jsx";
import ShopOrders from "./Pages/Shop/ShopOrders.jsx";
import Login from "./Pages/Login.jsx";
import ShopOrderPage from "./Pages/User/ShopOrderPage.jsx"

function App() {
  // How login credentials are sent From the server

  // Login Test
 

  const router = createBrowserRouter([
    {
      path: "/",
      element: <Applayout />,
      children: [
        {
          path: "/",
          element: <Dashboard />,
        },
        {
          path: "/FileUpload",
          element: <FileUpload />,
        },
        {
          path: "/Myorders",
          element: <Myorders />,
        },
        {
          path: "/Profile",
          element: <Profile />,
        },
        {
          path: "/ShopOrders",
          element: <ShopOrders />,
        },
        {
          path: "/Login",
          element: <Login />,
        },
        {
          path: "/ShopOrderPage",
          element: <ShopOrderPage />,
        },
      ],
    },
  ]);

  return (
    <>
      <RouterProvider router={router} />
    </>
  );
}

export default App;
