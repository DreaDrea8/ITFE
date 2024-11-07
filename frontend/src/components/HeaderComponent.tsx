import React, { useContext } from 'react';
import { Link } from 'react-router-dom'; // Importation de Link pour la navigation
import './../assets/components/headerComponent.css'; // Importation du fichier CSS
import { AppContext } from '../AppContext';

const HeaderComponent: React.FC = () => {
  const route = window.location.pathname;
	const appContext = useContext(AppContext)
	const isConnect = appContext?.verifyToken()

  const generateNavElements = (route: string) => {
    if (route === '/' && isConnect) {
      return (
        <>
          <li><Link to="/">Home</Link></li>
          <li><Link to="/download">Download</Link></li>
        </>
      );
    }
    if ((route === '/' && !isConnect) || route === '/download') {
      return (
        <>
          <li>
            <button className="button-outline-primary">
              <Link to="/auth/signup">Inscription</Link>
            </button>
          </li>
          <li>
            <button>
              <Link to="/auth/signin" className="button">Connexion</Link>
            </button>
          </li>
        </>
      );
    }
    if (route.startsWith('/auth')) {
      return (
        <>
          <li><Link to="/">Home</Link></li>
          <li><Link to="/download">Download</Link></li>
          <li>
            <button className="button-outline-primary">
              <Link to="/auth/signup">Inscription</Link>
            </button>
          </li>
          <li>
            <button>
              <Link to="/auth/signin" className="button">Connexion</Link>
            </button>
          </li>
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
        <ul>
          {generateNavElements(route)}
        </ul>
      </nav>
    </header>
  );
};

export default HeaderComponent;