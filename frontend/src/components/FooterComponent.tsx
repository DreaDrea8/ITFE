import React from 'react';
import { Link } from 'react-router-dom'; // Importation de Link pour la navigation
import './footerComponent.css'; // Importation du fichier CSS

const FooterComponent: React.FC = () => {
    return (
        <footer className="footer">
            <div className="footer__slogan">
                <h3>Partagez vos fichiers volumineux en toute simplicité!</h3>
            </div>
            <div className="footer__contact">
                <h3>Contactez-nous</h3>
                <p>Email: contact@example.com</p>
                <p>Téléphone: 01 23 45 67 89</p>
                <p>Adresse: 123 Rue Exemple, Paris</p>
                <div className="socials">
                    <a href="#facebook">Facebook</a>
                    <a href="#twitter">Twitter</a>
                    <a href="#instagram">Instagram</a>
                </div>
            </div>
            <div className="footer__links">
                <h3>Liens internes</h3>
                <ul>
                    <li><Link to="/">Home</Link></li>
                    <li><Link to="/download">Download</Link></li>
                    <li><Link to="/features">Features</Link></li>
                    <li><Link to="/support">Support</Link></li>
                </ul>
            </div>
            <div className="footer__copyright">
                <p>© Copyright 2021, All Rights Reserved</p>
            </div>
        </footer>
    );
};

export default FooterComponent;
