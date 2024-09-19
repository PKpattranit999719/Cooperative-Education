import { Outlet, createBrowserRouter } from 'react-router-dom';
import Home from '../Pages/AdminPage/Home/Home'; 
import Lesson from '../Pages/AdminPage/Lesson/Lesson';
import Class from '../Pages/AdminPage/Class/Class';
import Quiz from '../Pages/AdminPage/Quiz/Quiz';
import Login from '../Pages/Shared/Login/Login';
import Register from '../Pages/Shared/Register/Register';
import Navbar from './Navbar';
import Sidebar from './Sidebar';
import PrivateRoute from '../Shared/PrivateRoutes';
import '../../App.css';
import History from '../Pages/AdminPage/History/History';

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
        path: "/",
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
        path: "/quiz",
        element: <PrivateRoute element={Quiz} />, 
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
    ],
  },
]);

export default router;
