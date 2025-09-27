import { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '@/features/auth/contexts/AuthContext';
import { authService } from '@/lib/api';
import './Login.css';

const INITIAL_FORM_STATE = {
  username: '',
  password: '',
};

/**
 * @description Renderiza a página de login, permitindo que os usuários se autentiquem na aplicação.
 * @returns {JSX.Element} A página de login com formulário.
 */
function Login() {
  const [formData, setFormData] = useState(INITIAL_FORM_STATE);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleChange = ({ target: { name, value } }) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  /**
   * @description Valida o formulário de login.
   * @returns {string} Uma mensagem de erro se a validação falhar, ou uma string vazia se for bem-sucedida.
   */
  const validateForm = () => {
    if (!formData.username || !formData.password) {
      return 'Por favor, preencha todos os campos.';
    }
    return '';
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ type: '', text: '' });

    const validationError = validateForm();
    if (validationError) {
      setMessage({ type: 'error', text: validationError });
      setLoading(false);
      return;
    }

    try {
      const response = await authService.login({
        username: formData.username,
        password: formData.password,
      });

      // Mapeia a resposta da API para o formato esperado pelo contexto de autenticação.
      const userData = {
        id: response.data.id,
        username: response.data.username,
        email: response.data.email,
        name: response.data.name,
        userType: response.data.userType,
        token: response.data.token,
      };

      login(userData);
      setMessage({ type: 'success', text: 'Login realizado com sucesso!' });
      setTimeout(() => {
        navigate('/');
      }, 1000);
    } catch (error) {
      let errorMessage = 'Erro ao fazer login. Tente novamente.';
      if (error.response?.status === 401) {
        errorMessage = error.response.data?.message || 'Username ou senha incorretos.';
      } else if (error.response?.status === 404) {
        errorMessage = 'Usuário não encontrado.';
      } else if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      }
      setMessage({ type: 'error', text: errorMessage });
      console.error('Erro no login:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <div className="login-header">
          <h1><i className="fas fa-sign-in-alt" /> Login</h1>
          <p>Entre com suas credenciais para acessar o sistema</p>
        </div>

        {message.text && (
          <div className={`message ${message.type}`}>
            <i className={`fas ${message.type === 'success' ? 'fa-check-circle' : 'fa-exclamation-circle'}`} />
            {message.text}
          </div>
        )}

        <form onSubmit={handleSubmit} className="login-form">
          <div className="form-group">
            <label htmlFor="username">Usuário</label>
            <input
              type="text"
              id="username"
              name="username"
              value={formData.username}
              onChange={handleChange}
              disabled={loading}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Senha</label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              disabled={loading}
              required
            />
          </div>

          <div className="form-actions">
            <button type="submit" className="btn-primary" disabled={loading}>
              {loading ? 'Entrando...' : 'Entrar'}
            </button>
          </div>
        </form>

        <div className="login-footer">
          <p>
            Não tem uma conta?
            <a href="/cadastro">
              <i className="fas fa-user-plus" /> Cadastre-se aqui
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Login;
