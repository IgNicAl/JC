import React, { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from '@/features/auth/contexts/AuthContext';

const ROUTE = {
  LOGIN: '/login',
  HOME: '/',
};

/**
 * @description Componente de ordem superior que protege rotas. Redireciona usuários
 * não autenticados ou sem as permissões necessárias.
 * @param {object} props As propriedades do componente.
 * @param {React.ReactNode} props.children O componente a ser renderizado se o usuário tiver permissão.
 * @param {string[]} [props.roles=[]] Uma lista de papéis (roles) que têm permissão para acessar a rota.
 * @returns {JSX.Element} O componente filho, um redirecionamento ou um indicador de carregamento.
 */
function ProtectedRoute({ children, roles = [] }) {
  const { user, isAuthenticated, loading } = useContext(AuthContext);

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading">
          <i className="fas fa-spinner fa-spin" />
          <p>Carregando...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated()) {
    return <Navigate to={ROUTE.LOGIN} replace />;
  }

  // Se a rota exige papéis específicos, verifica se o usuário tem algum deles.
  if (roles.length > 0 && !roles.includes(user.userType)) {
    return <Navigate to={ROUTE.HOME} replace />; // Redireciona se não tiver permissão
  }

  return children;
}

export default ProtectedRoute;
