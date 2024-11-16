import React from 'react'
import { Provider } from 'react-redux'
import BasicLayout from './layouts/basics'
import { createBrowserRouter, Navigate, RouterProvider } from 'react-router-dom'

import './assets/base.css'
import './assets/reset.css'
import './assets/button.css'
import './assets/variable.css'

import store from './redux/store'
import AppProvider from './AppContext'
import PrivateRoute from './PrivateRoute'
import ErrorPage from './pages/error-page'
import AuthLayout from './layouts/AuthLayout'
import { ModalProvider } from './ModalContext'
import HomeComponent from './components/HomeComponent'
import SigninComponent from './components/SigninComponent'
import SignupComponent from './components/SignupComponent'
import DownloadComponent from './components/ShareComponent'
import ShareComponent from './components/ShareComponent'

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
		path: 'share',
		element: <AuthLayout />,
		children: [
			{
				path: '',
				element: <ShareComponent />
			}
		],
		errorElement: <ErrorPage />
	},
	{
		path: 'file',
		element: <BasicLayout />,
		children: [
			{
				path: '',
				element: (
					<PrivateRoute>
						<HomeComponent/><ShareComponent/>
					</PrivateRoute>
				)
			}
		],
		errorElement: <ErrorPage />
	}
])

const App: React.FC = () => {
	return (
		<AppProvider>
			<Provider store={store}>
				<ModalProvider>
					<RouterProvider router={router} />
				</ModalProvider>
			</Provider>
		</AppProvider>
	)
}

export default App
