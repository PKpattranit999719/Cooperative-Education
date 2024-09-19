import React from 'react';
import { RouterProvider } from 'react-router-dom';
import router from '../src/Components/Shared/Routes'; 

const App = () => {
  return (
    <div>
      <RouterProvider router={router} />
    </div>
  );
};

export default App;
