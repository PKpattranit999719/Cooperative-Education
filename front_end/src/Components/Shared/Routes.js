//admin
import React, { useState, useEffect } from "react";
import { Outlet, createBrowserRouter } from "react-router-dom";
import Home from "../Pages/AdminPage/Home/HomePage";
import Lesson from "../Pages/AdminPage/Lesson/LessonPage";
import Class from "../Pages/AdminPage/Class/ClassPage";
import Result from "../Pages/AdminPage/Result/ResultPage";
import HistoryCharts from "../Pages/AdminPage/History/HistoryCharts";
import Uploadpage from "../Pages/AdminPage/Upload/UploadPage";
// shared
import Login from "../Pages/Shared/Login/LoginPage";
import Register from "../Pages/Shared/Register/RegisterPage";
import Navbar from "./Navbar";
import Sidebar from "../Pages/Shared/Sidebar/Sidebar";
import PrivateRoute from "../Shared/PrivateRoutes";
import "../../App.css";
import History from "../Pages/AdminPage/History/HistoryPage";
import Welcome from "../Pages/Shared/Welcome/WelcomePage";
import Score from "../Pages/AdminPage/Class/Scores/Score";

// student
import QuizPage from "../Pages/StudentPage/Quizbylesson/Quiz/QuizPage";
import HomeStudent from "../Pages/StudentPage/Home/HomeStudent";
import LessonStudent from "../Pages/StudentPage/Lesson/StudentLesson";
import Dashbord from "../Pages/StudentPage/Dashbord/Dashbord";
import Sidebarstudent from "../Pages/StudentPage/Sidebarstudent/Sidestu";
import Quizcheck from '../Pages/StudentPage/Lesson/check/quizcheck'
import LessonQuiz from "../Pages/StudentPage/Quizbylesson/Lessonquiz";
import Dashboard from "../Pages/StudentPage/Dashbord/Dashbord";

//ref CSS
import "./Sidebar.css"

// Admin Layout
const AdminLayout = () => (
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

// User Layout
const UserLayout = () => (
  <>
    <div className="app-layout">
      <Navbar />
      <div className="app-body">
        <Sidebarstudent />
        <div className="main-content">
          <Outlet />
        </div>
      </div>
    </div>
  </>
);

// RoleChecker component
const RoleChecker = () => {
  const [role, setRole] = useState(null);

  useEffect(() => {
    const storedRole = localStorage.getItem("role");
    setRole(storedRole);
  }, []);

  // If role is not determined yet, show loading or a placeholder
  if (!role) {
    return <div>Loading...</div>;
  }

  // Render appropriate layout based on role
  return role === "admin" ? <AdminLayout /> : <UserLayout />;
};

// Define the router
const router = createBrowserRouter([
  {
    path: "/", // Set the root path
    element: <Welcome />, // Make Welcome the default page when "/" is accessed
  },
  {
    element: <RoleChecker />, // Use RoleChecker to determine layout
    children: [
      {
        path: "/home", // Admin homepage
        element: <PrivateRoute element={Home} />,
      },
      {
        path: "/history",
        element: <PrivateRoute element={History} />,
      },
      {
        path: "/lesson",
        element: <PrivateRoute element={Lesson} />,
      },
      {
        path: "/class",
        element: <PrivateRoute element={Class} />,
      },
      {
        path: "/result",
        element: <PrivateRoute element={Result} />,
      },
      {
        path: "/quiz",
        element: <QuizPage />,
      },
      {
        path: "/homestudent", // Student homepage
        element: <HomeStudent />,
      },
      {
        path: "/lessonstudent",
        element: <LessonStudent />,
      },
      {
        path: "/score",
        element: <Score />,
      },
      {
        path: "/room/:ID_Room",
        element: <HistoryCharts />,
      },
      {
        path: "/check",
        element: <Quizcheck />,
      },
      {
        path: "/lessonQuiz",
        element: <LessonQuiz />,
      },
      {
        path: "/upload",
        element: <Uploadpage />,
      },
      {
        path: "/dashboard",
        element: <Dashboard/>
      }
    ],
  },
  {
    children: [
      {
        path: "/login",
        element: <Login />,
      },
      {
        path: "/register",
        element: <Register />,
      },
      {
        path: "/dashbord",
        element: <Dashbord />,
      },
    ],
  },
]);

export default router;
