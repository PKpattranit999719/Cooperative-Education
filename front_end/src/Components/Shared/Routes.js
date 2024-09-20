import { Outlet, createBrowserRouter } from 'react-router-dom';
import Home from '../Pages/AdminPage/Home/HomePage'; 
import Lesson from '../Pages/AdminPage/Lesson/LessonPage';
import Class from '../Pages/AdminPage/Class/ClassPage';
import Result from '../Pages/AdminPage/Result/ResultPage';
import Login from '../Pages/Shared/Login/LoginPage';
import Register from '../Pages/Shared/Register/RegisterPage';
import Navbar from './Navbar';
import Sidebar from './Sidebar';
import PrivateRoute from '../Shared/PrivateRoutes';
import '../../App.css';
import History from '../Pages/AdminPage/History/HistoryPage';
import Welcome from '../Pages/Shared/Welcome/WelcomePage';
import QuizPage from '../Pages/StudentPage/Quiz/QuizPage';
import StudentQuize from '../Pages/StudentPage/Quiz/QuizPage';

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

const router = createBrowserRouter([
  {
    element: <AppLayout />,
    children: [
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
        path: "/home",
        element: <PrivateRoute element={Home} />, 
      },
      {
        path: "/quiz",
        element: <QuizPage />, 
      },
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
        path: "/",
        element: <Welcome />, 
      },
      {
        path: "/studentquiz",
        element: <StudentQuize />, 
      },
    ],
  },
]);

export default router;
