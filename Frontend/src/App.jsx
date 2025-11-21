import React from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Applayout from "./Applayout/Applayout";
import FileUpload from "./Pages/User/FileUpload.jsx";
import Dashboard from "./Pages/User/Dashboard.jsx";
import Myorders from "./Pages/User/Myorders.jsx";
import Profile from "./Pages/User/Profile.jsx";
import ShopOrders from "./Pages/Shop/ShopOrders.jsx";

function App() {
  // How login credentials are sent From the server

  // Login Test
  const loginTest = () => {
    fetch("http://localhost/printease/Backend/backend/login.php", {
      method: "GET",
      credentials: "include",
    })
      .then((res) => res.json())
      .then((data) => {
        console.log(data);

        if (data.status === "success") {
          // Save user info session for testing
          sessionStorage.setItem("user", JSON.stringify(data.user));

          // Save token
          sessionStorage.setItem("token", data.token);

          console.log("Login successful!");
        }
      })
      .catch((err) => console.error("Error:", err));
  };

  loginTest();

  // Dashboard data fetching with card info and recent activity
  const user = JSON.parse(sessionStorage.getItem("user"));
  const token = sessionStorage.getItem("token");

  fetch("http://localhost/printease/Backend/api/dashboard.php", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      email: user.email,
      token: token,
    }),
  })
    // yoo data JSON me de ga to tu dhek liya kese karna ha
    .then((res) => res.json())
    .then((data) => {
      console.log(data);
    });

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
