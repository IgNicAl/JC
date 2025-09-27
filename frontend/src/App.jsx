import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate } from 'react-router-dom';

import { AuthProvider } from './features/auth/contexts/AuthContext';
import ProtectedRoute from './features/auth/routes/ProtectedRoute';
import Navbar from './components/ui/Navbar/Navbar';

import Home from './pages/Home/Home';
import Login from './features/auth/pages/Login/Login';
import UserRegistration from './features/auth/pages/UserRegistration/UserRegistration';
import InternalRegistration from './features/auth/pages/InternalRegistration/InternalRegistration';
import UserList from './features/auth/pages/UserList/UserList';
import CreateNews from './features/news/pages/CreateNews/CreateNews';
import ManageNews from './features/news/pages/ManageNews/ManageNews';
import EditNews from './features/news/pages/EditNews/EditNews';

/**
 * @description Componente que não renderiza UI, mas gerencia o redirecionamento
 * quando um evento 'unauthorized' é recebido de qualquer parte da aplicação.
 * @returns {null}
 */
const RedirectController = () => {
  const navigate = useNavigate();
  useEffect(() => {
    const handleUnauthorized = () => {
      navigate('/login');
    };
    window.addEventListener('unauthorized', handleUnauthorized);
    return () => {
      window.removeEventListener('unauthorized', handleUnauthorized);
    };
  }, [navigate]);
  return null;
};

/**
 * @description Componente principal da aplicação que configura o provedor de autenticação,
 * o roteamento e a estrutura de layout geral com Navbar e conteúdo principal.
 * @returns {JSX.Element} O componente raiz da aplicação.
 */
export function App() {
  return (
    <AuthProvider>
      <Router>
        <RedirectController />
        <div className="App">
          <Navbar />
          <main className="main-content">
            <Routes>
              {/* Rotas Públicas */}
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/cadastro" element={<UserRegistration />} />

              {/* Rota para cadastro de admin/jornalista, deve ser protegida */}
              <Route
                path="/cadastro-interno"
                element={
                  <ProtectedRoute roles={['ADMIN']}>
                    <InternalRegistration />
                  </ProtectedRoute>
                }
              />

              {/* Rotas de Admin */}
              <Route
                path="/admin/usuarios"
                element={
                  <ProtectedRoute roles={['ADMIN']}>
                    <UserList />
                  </ProtectedRoute>
                }
              />

              {/* Rotas Protegidas para Jornalistas e Admins */}
              <Route
                path="/noticias/criar"
                element={
                  <ProtectedRoute roles={['JOURNALIST', 'ADMIN']}>
                    <CreateNews />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/noticias/gerenciar"
                element={
                  <ProtectedRoute roles={['JOURNALIST', 'ADMIN']}>
                    <ManageNews />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/noticias/editar/:id"
                element={
                  <ProtectedRoute roles={['JOURNALIST', 'ADMIN']}>
                    <EditNews />
                  </ProtectedRoute>
                }
              />

              {/* Rotas Protegidas apenas para Admins */}
              <Route
                path="/users"
                element={
                  <ProtectedRoute roles={['ADMIN']}>
                    <UserList />
                  </ProtectedRoute>
                }
              />
               <Route
                path="/cadastro-admin"
                element={
                  <ProtectedRoute roles={['ADMIN']}>
                    <InternalRegistration />
                  </ProtectedRoute>
                }
              />

              {/* Rota de fallback */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </main>
        </div>
      </Router>
    </AuthProvider>
  );
}
