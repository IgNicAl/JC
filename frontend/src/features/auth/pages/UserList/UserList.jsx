import { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { userService } from '@/lib/api';
import { AuthContext } from '@/features/auth/contexts/AuthContext';
import './UserList.css';

/**
 * @description Página para administradores gerenciarem todos os usuários do sistema.
 * Permite visualizar, criar e excluir usuários.
 * @returns {JSX.Element} A página de gerenciamento de usuários.
 */
function UserList() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [deletingId, setDeletingId] = useState(null);
  const { user: currentUser } = useContext(AuthContext);
  const navigate = useNavigate();

  /**
   * @description Carrega a lista de usuários da API.
   */
  const loadUsers = async () => {
    try {
      setLoading(true);
      setError('');
      const response = await userService.getAllUsers();
      setUsers(response.data);
    } catch (err) {
      setError('Erro ao carregar usuários. Tente novamente.');
      console.error('Erro:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUsers();
  }, []);

  /**
   * @description Lida com a exclusão de um usuário.
   * @param {string} id O ID do usuário a ser excluído.
   */
  const handleDelete = async (id) => {
    // Regra de negócio: Impede que o administrador exclua a própria conta.
    if (id === currentUser.id) {
      alert('Você não pode excluir sua própria conta!');
      return;
    }
    if (!window.confirm('Tem certeza que deseja excluir este usuário?')) return;

    try {
      setDeletingId(id);
      await userService.deleteUser(id);
      await loadUsers(); // Recarrega a lista após a exclusão.
    } catch (err) {
      alert('Erro ao excluir usuário. Tente novamente.');
      console.error('Erro:', err);
    } finally {
      setDeletingId(null);
    }
  };

  if (loading) {
    return (
      <div className="user-list-container">
        <div className="user-list-loading">
          <i className="fas fa-spinner fa-spin" />
          <p>Carregando usuários...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="user-list-container">
        <div className="user-list-error">
          <i className="fas fa-exclamation-circle" />
          <p>{error}</p>
          <button type="button" onClick={loadUsers} className="retry-btn">
            <i className="fas fa-sync-alt" />
            Tentar Novamente
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="user-list-container">
      <div className="user-list-header">
        <h1><i className="fas fa-users" /> Gerenciar Usuários</h1>
        <button
          type="button"
          onClick={() => navigate('/cadastro-admin')}
          className="create-user-btn"
        >
          <i className="fas fa-user-plus" />
          Novo Usuário
        </button>
      </div>

      {users.length === 0 ? (
        <div className="no-users">
          <i className="fas fa-users-slash" />
          <p>Nenhum usuário cadastrado.</p>
          <button
            type="button"
            onClick={() => navigate('/cadastro-admin')}
            className="create-first-btn"
          >
            <i className="fas fa-user-plus" />
            Cadastrar Primeiro Usuário
          </button>
        </div>
      ) : (
        <div className="users-grid">
          {users.map((user) => (
            <div key={user.id} className="user-card">
              <div className="user-avatar">
                {user.urlImagemPerfil ? (
                  <img src={user.urlImagemPerfil} alt={user.name} />
                ) : (
                  <i className="fas fa-user" />
                )}
              </div>
              <div className="user-info">
                <h3>{user.name}</h3>
                <p className="user-username">@{user.username}</p>
                <p className="user-email">
                  <i className="fas fa-envelope" />
                  {user.email}
                </p>
                <span className={`user-type ${user.userType.toLowerCase()}`}>
                  <i className={`fas ${user.userType === 'ADMIN' ? 'fa-user-shield' : 'fa-user'}`} />
                  {user.userType === 'ADMIN' ? 'Administrador' : 'Jornalista'}
                </span>
              </div>
              <div className="user-actions">
                <button
                  type="button"
                  onClick={() => handleDelete(user.id)}
                  className="delete-btn"
                  disabled={deletingId === user.id || user.id === currentUser.id}
                >
                  {deletingId === user.id ? (
                    <>
                      <i className="fas fa-spinner fa-spin" />
                      Excluindo...
                    </>
                  ) : (
                    <>
                      <i className="fas fa-trash-alt" />
                      Excluir
                    </>
                  )}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default UserList;
