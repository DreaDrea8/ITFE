import { Link } from 'react-router-dom' 
import React, { useContext } from 'react'

import './../assets/components/headerComponent.css' 

import { AppContext } from '../AppContext'
import { useDispatch } from 'react-redux'
import { LinkServices } from '../redux/slice/LinkSlice'


const HeaderComponent: React.FC = () => {
  const route = window.location.pathname
	const appContext = useContext(AppContext)
  const dispatch = useDispatch()
	const isConnect = appContext?.verifyToken()

  const handleLogout = (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    event.preventDefault()
    appContext?.deleteToken()
    dispatch(LinkServices.actions.resetLinkList())
    window.location.pathname = '/'
  }

  const generateNavElements = (route: string) => {
    if (['', '/', '/share'].includes(route) && isConnect){
      return (
        <>
          <Link to="/">Home</Link>
          <Link to="/share">Partage</Link>
          <button className="button-outline-primary" onClick={handleLogout}>Déconnexion</button>
        </>
      )
    }
    if (['', '/', '/share'].includes(route) && !isConnect ) {
      return (
        <>
          <Link to="/auth/signup" className="button-outline-primary">Inscription</Link>
          <Link to="/auth/signin" className="button-primary">Connexion</Link>
        </>
      )
    }
    if (route.startsWith('/auth')) {
      return (
        <>
          <Link to="/">Home</Link>
          <Link to="/share">Partage</Link>
          <Link to="/auth/signup" className="button-outline-primary">Inscription</Link>
          <Link to="/auth/signin" className="button-primary">Connexion</Link>
        </>
      )
    }
    return null
  }

  return (
    <header className="header">
      <div className="header__logo">
        <h1>ITFE</h1>
      </div>
      <nav className="header__nav">
        {generateNavElements(route)}
      </nav>
    </header>
  )
}

export default HeaderComponent