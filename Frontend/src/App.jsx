import React from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Applayout from "./Applayout/Applayout";
import FileUpload from "./Pages/User/FileUpload.jsx";
import Dashboard from "./Pages/User/Dashboard.jsx";
import Myorders from "./Pages/User/Myorders.jsx";
import Profile from "./Pages/User/Profile.jsx";
import Login from "./Pages/Login.jsx";
import ShopOrderPage from "./Pages/User/ShopOrderPage.jsx"
import ShopDashboard from "./Pages/Shop/ShopDashboard.jsx";
import { OrderDetailsPage } from "./Pages/Shop/OrderDetailsPage.jsx";
import ShopOrders from "./Pages/Shop/ShopOrder.jsx";
import PrintOrders from "./Pages/Shop/PrintOrders.jsx";
import ShopProfile from "./Pages/Shop/ShopProfile.jsx";
<<<<<<< HEAD
=======
<<<<<<< HEAD
import { Toaster } from "react-hot-toast";
=======
>>>>>>> 9ea7287b694333ca94547853c977315cf122dfd1
>>>>>>> d8fadf7 (push notifcation)

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
          path: "/ShopOrders",
          element: <ShopOrders />,
        },
        {
          path: "/PrintOrders",
          element: <PrintOrders />,
        },
        {
          path: "/Profile",
          element: <Profile />,
        },
     
        {
          path: "/Login",
          element: <Login />,
        },
        {
          path: "/ShopOrderPage",
          element: <ShopOrderPage />,
        },
        {
          path: "/ShopDashboard",
          element: <ShopDashboard />,
        },
        {
          path: "/ShopProfile",
          element: <ShopProfile />,
        },
     
        {
          path: "/OrderDetailsPage",
          element: <OrderDetailsPage />,
        },
      ],
    },
  ]);

  return (
    <>
    <Toaster/>
      <RouterProvider router={router} />
    </>
  );
}

export default App;
