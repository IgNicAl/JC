import React, { useState, useContext } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../../../features/auth/contexts/AuthContext';
import './Navbar.css';

const ROUTE = {
  HOME: '/',
  MANAGE_NEWS: '/noticias/gerenciar',
  MANAGE_USERS: '/users',
  LOGIN: '/login',
  REGISTER_USER: '/cadastro',
};
const LOGO_TEXT = 'JCPM News';

/**
 * @description Componente de navegação principal da aplicação.
 * @returns {JSX.Element} A barra de navegação.
 */
function Navbar() {
  const { user, logout, isAdmin, isJournalist } = useContext(AuthContext);
  const [isMenuOpen, setMenuOpen] = useState(false);

  const toggleMenu = () => setMenuOpen(!isMenuOpen);
  const closeMobileMenu = () => setMenuOpen(false);

  const renderAuthenticatedActions = () => (
    <>
      {(isAdmin() || isJournalist()) && (
        <Link to={ROUTE.MANAGE_NEWS} className="nav-btn nav-btn-admin" onClick={closeMobileMenu}>
          <i className="fas fa-edit" /> Gerenciar Notícias
        </Link>
      )}
      {isAdmin() && (
        <Link to={ROUTE.MANAGE_USERS} className="nav-btn nav-btn-admin" onClick={closeMobileMenu}>
          <i className="fas fa-users-cog" /> Gerenciar Usuários
        </Link>
      )}
      {user && (
        <div className="nav-user-info">
          <span className="nav-welcome">
            Olá, <strong>{user.name}</strong>
          </span>
          <button type="button" onClick={() => { logout(); closeMobileMenu(); }} className="nav-btn nav-btn-logout">
            <i className="fas fa-sign-out-alt" /> Sair
          </button>
        </div>
      )}
    </>
  );

  const renderVisitorActions = () => (
    <>
      <Link to={ROUTE.LOGIN} className="nav-btn nav-btn-login" onClick={closeMobileMenu}>
        <i className="fas fa-sign-in-alt" /> Login
      </Link>
      <Link to={ROUTE.REGISTER_USER} className="nav-btn nav-btn-register" onClick={closeMobileMenu}>
        <i className="fas fa-user-plus" /> Cadastrar
      </Link>
    </>
  );

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to={ROUTE.HOME} className="navbar-logo" onClick={closeMobileMenu}>
          <i className="fas fa-newspaper" /> {LOGO_TEXT}
        </Link>
        <div className="menu-icon" onClick={toggleMenu}>
          <i className={isMenuOpen ? 'fas fa-times' : 'fas fa-bars'} />
        </div>
        <div className={isMenuOpen ? 'nav-menu active' : 'nav-menu'}>
          {user ? renderAuthenticatedActions() : renderVisitorActions()}
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
