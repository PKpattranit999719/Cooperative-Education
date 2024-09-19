import React from "react";
import { createRoot } from "react-dom/client";
import {
  createBrowserRouter,
  RouterProvider,
  Route,
  Outlet,
  createRoutesFromElements,
} from "react-router-dom";
import "./App.css"
import Home from "./Components/Home/HomeForm";
import Navbar from "./Components/share/Navbar";
import History from "./Components/History/History";
import Lesson from "./Components/Lesson/Lesson";
import Class from "./Components/Class/Class"
import Sidebar from "./Components/share/Sidebar";
import Quize from "./Components/Lesson/Quize";

const AppLayout = () => (
  <>
    <div className="app-layout">
      <Navbar />
      <div className="app-body">
        <Sidebar />
        <div className="main-content">
          <Outlet />
        </div>
      </div>
    </div>
  </>
);

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route element={<AppLayout />}>
      <Route path="/" element={<Home />} />
      <Route path="/history" element={<History />} />
      <Route path="/lesson" element={<Lesson />} />
      <Route path="/class" element={<Class />} />
      <Route path="/quize" element={<Quize />} />
    </Route>
  )
);

// const router = createBrowserRouter([
//   {
//     element: <AppLayout />,
//     children: [
//       {
//         path: "/",
//         element: <Home />,
//       },
//       {
//         path: "products",
//         element: <Products />,
//       },
//       {
//         path: "reports",
//         element: <Reports />,
//       },
//     ],
//   },
// ]);

createRoot(document.getElementById("root")).render(
  <RouterProvider router={router} />
);