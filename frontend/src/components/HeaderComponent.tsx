import React, { useContext } from 'react';
import { Link } from 'react-router-dom'; // Importation de Link pour la navigation
import './../assets/components/headerComponent.css'; // Importation du fichier CSS
import { AppContext } from '../AppContext';

const HeaderComponent: React.FC = () => {
  const route = window.location.pathname;
	const appContext = useContext(AppContext)
	const isConnect = appContext?.verifyToken()

  const handleLogout = (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    event.preventDefault()
    appContext?.deleteToken()
    window.location.pathname = '/'
  }

  const generateNavElements = (route: string) => {
    if (['', '/', '/download'].includes(route) && isConnect){
      return (
        <>
          <Link to="/">Home</Link>
          <Link to="/download">Download</Link>
          <button className="button-outline-primary" onClick={handleLogout}>Déconnexion</button>
        </>
      );
    }
    if (['', '/', '/download'].includes(route) && !isConnect ) {
      return (
        <>
          <Link to="/auth/signup" className="button-outline-primary">Inscription</Link>
          <Link to="/auth/signin" className="button-primary">Connexion</Link>
        </>
      );
    }
    if (route.startsWith('/auth')) {
      return (
        <>
          <Link to="/">Home</Link>
          <Link to="/download">Download</Link>
          <Link to="/auth/signup" className="button-outline-primary">Inscription</Link>
          <Link to="/auth/signin" className="button-primary">Connexion</Link>
        </>
      );
    }
    return null;
  };

  return (
    <header className="header">
      <div className="header__logo">
        <h1>ITFE</h1>
      </div>
      <nav className="header__nav">
        {generateNavElements(route)}
      </nav>
    </header>
  );
};

export default HeaderComponent;