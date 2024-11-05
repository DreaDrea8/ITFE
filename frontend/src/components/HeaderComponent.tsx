import React from 'react';
import { Link } from 'react-router-dom'; // Importation de Link pour la navigation
import './headerComponent.css'; // Importation du fichier CSS

const HeaderComponent: React.FC = () => {
    return (
        <header className="header">
            <div className="header__logo">
                <h1>ITFE</h1>
            </div>
            <nav className="header__nav">
                <ul>
                    <li><Link to="/">Home</Link></li>
                    <li><Link to="/download">Download</Link></li>
                    <li><Link to="/features">Features</Link></li>
                    <li><Link to="/support">Support</Link></li>
                </ul>
            </nav>
            <div className="header__auth">
                <Link to="/signin" className="button">Sign In</Link>
                <Link to="/signup" className="button">Sign Up</Link>
            </div>
        </header>
    );
};

export default HeaderComponent;