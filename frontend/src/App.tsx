import React from 'react'
import BasicLayout from './layouts/basics'
import { createBrowserRouter, Navigate, RouterProvider } from 'react-router-dom'

import './assets/base.css'
import './assets/reset.css'
import './assets/button.css'
import './assets/variable.css'
import AppProvider from './AppContext'
import PrivateRoute from './PrivateRoute'
import ErrorPage from './pages/error-page'
import AuthLayout from './layouts/AuthLayout'
import HomeComponent from './components/HomeComponent'
import SigninComponent from './components/SigninComponent'
import SignupComponent from './components/SignupComponent'
import DownloadComponent from './components/DownloadComponent'

const router = createBrowserRouter([
	{
		path: '',
		element: <BasicLayout />,
		children: [
			{
				path: '',
				element: (
					<PrivateRoute>
						<HomeComponent/><DownloadComponent/>
					</PrivateRoute>
				),
			}
		],
		errorElement: <ErrorPage />,
	},
	{
		path: 'auth',
		element: <AuthLayout />,
		children: [
			{
        path: '',
        element: <Navigate to="signin" />,
      },
			{
				path: 'signin',
				element: <SigninComponent />
			},
			{
				path: 'signup',
				element: <SignupComponent />
			}
		],
		errorElement: <ErrorPage />
	},
	{
		path: 'download',
		element: <AuthLayout />,
		children: [
			{
				path: '',
				element: <DownloadComponent />
			}
		],
		errorElement: <ErrorPage />
	}
])

const App: React.FC = () => {
	return (
		<AppProvider>
			<RouterProvider router={router} />
		</AppProvider>
	)
}

export default App