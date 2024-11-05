import React from 'react';
import { createBrowserRouter, RouterProvider, Route } from 'react-router-dom';
import BasicLayout from './layouts/basics';



const isLoggedIn = true;


const router = createBrowserRouter([
    {
        path: '/',
        element: <BasicLayout />,
    },
]);

const App: React.FC = () => {
    return <RouterProvider router={router} />;
};

export default App;