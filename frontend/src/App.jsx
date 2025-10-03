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
import EditUser from './features/auth/pages/EditUser/EditUser';
import UserProfile from './features/auth/pages/UserProfile/UserProfile'; // Novo
import CreateNews from './features/news/pages/CreateNews/CreateNews';
import ManageNews from './features/news/pages/ManageNews/ManageNews';
import EditNews from './features/news/pages/EditNews/EditNews';
import NewsPage from './features/news/pages/NewsPage/NewsPage';
import NewsDashboard from './features/news/pages/NewsDashboard/NewsDashboard'; // Novo

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
              <Route path="/noticia/:slug" element={<NewsPage />} />
              <Route path="/perfil/:username" element={<UserProfile />} /> {/* Novo */}

              <Route
                path="/cadastro-interno"
                element={
                  <ProtectedRoute roles={['ADMIN']}>
                    <InternalRegistration />
                  </ProtectedRoute>
                }
              />

              <Route
                path="/admin/usuarios/editar/:id"
                element={
                  <ProtectedRoute roles={['ADMIN']}>
                    <EditUser />
                  </ProtectedRoute>
                }
              />

              <Route
                path="/admin/usuarios"
                element={
                  <ProtectedRoute roles={['ADMIN']}>
                    <UserList />
                  </ProtectedRoute>
                }
              />

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
              <Route
                path="/noticias/:id/dashboard"
                element={
                  <ProtectedRoute roles={['JOURNALIST', 'ADMIN']}>
                    <NewsDashboard />
                  </ProtectedRoute>
                }
              />

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

              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </main>
        </div>
      </Router>
    </AuthProvider>
  );
}
