import { Outlet  , createBrowserRouter } from 'react-router-dom';
import Home from '../Pages/AdminPage/Home/Home'; 
import Lesson from '../Pages/AdminPage/Lesson/Lesson';
import Class from '../Pages/AdminPage/Class/Class';
import Quiz from '../Pages/AdminPage/Quiz/Quiz';
import Login from '../Pages/Shared/Login/Login';
import Register from '../Pages/Shared/Register/Register';
import Navbar from './Navbar'
import Sidebar from './Sidebar'
import '../../App.css'
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
  const LoginLayout = () => (
    <>   
          <div className="login-layout">
            <Outlet />
          </div>
    </>
  );

const router = createBrowserRouter([
  {
    element: <AppLayout />,
    children: [
      {
        path: "/",
        element: <Home />,
      },
      {
        path: "/history",
        element: <History />,
      },
      {
        path: "/lesson",
        element: <Lesson />,
      },
      {
        path: "/class",
        element: <Class />,
      },
      {
        path: "/quiz",
        element: <Quiz />,
      },
    ],
  },
  {
    element: <LoginLayout />,
    children: [
      {
        path: "/login",
        element: <Login />, // Adjusted to the correct component
      },
      {
        path: "/register",
        element: <Register />, // Adjusted to the correct component
      },
    ],
  },
]);

export default router;
