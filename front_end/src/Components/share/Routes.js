import { createBrowserRouter } from 'react-router-dom';
import Home from './Home'; 
import Lesson from './Lesson';
import Class from './Class';
import Quiz from './Quiz';
import Login from './Login';
import Register from './Register';

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
