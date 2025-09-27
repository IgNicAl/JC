import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { authService } from '@/lib/api';
import './InternalRegistration.css';

const INITIAL_FORM_STATE = {
  username: '',
  email: '',
  password: '',
  confirmPassword: '',
  name: '',
  userType: 'ADMIN',
  biography: '',
  profileImageUrl: '',
};

/**
 * @description Renderiza a página de cadastro interno, usada por administradores para
 * criar novas contas de Administrador ou Jornalista.
 * @returns {JSX.Element} A página de cadastro interno.
 */
function InternalRegistration() {
  const [formData, setFormData] = useState(INITIAL_FORM_STATE);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  const navigate = useNavigate();

  const handleChange = ({ target: { name, value } }) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const validateForm = () => {
    if (formData.password !== formData.confirmPassword) {
      return 'As senhas não coincidem.';
    }
    if (formData.password.length < 6) {
      return 'A senha deve ter pelo menos 6 caracteres.';
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
      await authService.register({
        username: formData.username,
        email: formData.email,
        password: formData.password,
        name: formData.name,
        biography: formData.biography,
        profileImageUrl: formData.profileImageUrl,
        userType: formData.userType,
      });
      setMessage({
        type: 'success',
        text: `Usuário ${formData.userType.toLowerCase()} cadastrado com sucesso! Redirecionando...`,
      });
      setFormData(INITIAL_FORM_STATE);
      setTimeout(() => {
        navigate('/admin/usuarios');
      }, 3000);
    } catch (error) {
      let errorMessage = 'Erro ao cadastrar usuário. Tente novamente.';
      if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      }
      setMessage({ type: 'error', text: errorMessage });
      console.error('Erro no cadastro:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="internal-registration-container">
      <div className="internal-registration-card">
        <div className="internal-registration-header">
          <h1><i className="fas fa-cog" />Cadastro Interno</h1>
          <p>Crie novas contas de Administrador ou Jornalista</p>
        </div>

        {message.text && (
          <div className={`message ${message.type}`}>
            <i className={`fas ${message.type === 'success' ? 'fa-check-circle' : 'fa-exclamation-circle'}`} />
            {message.text}
          </div>
        )}

        <form onSubmit={handleSubmit} className="internal-registration-form">
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="name"><i className="fas fa-user" /> Nome Completo *</label>
              <input type="text" id="name" name="name" value={formData.name} onChange={handleChange} required />
            </div>
            <div className="form-group">
              <label htmlFor="username"><i className="fas fa-at" /> Username *</label>
              <input type="text" id="username" name="username" value={formData.username} onChange={handleChange} required />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="email"><i className="fas fa-envelope" /> E-mail *</label>
            <input type="email" id="email" name="email" value={formData.email} onChange={handleChange} required />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="password"><i className="fas fa-lock" /> Senha *</label>
              <input type="password" id="password" name="password" value={formData.password} onChange={handleChange} required />
            </div>
            <div className="form-group">
              <label htmlFor="confirmPassword"><i className="fas fa-check-double" /> Confirmar Senha *</label>
              <input type="password" id="confirmPassword" name="confirmPassword" value={formData.confirmPassword} onChange={handleChange} required />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="userType"><i className="fas fa-user-shield" /> Tipo de Usuário *</label>
            <select id="userType" name="userType" value={formData.userType} onChange={handleChange}>
              <option value="ADMIN">Administrador</option>
              <option value="JOURNALIST">Jornalista</option>
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="profileImageUrl"><i className="fas fa-image" /> URL da Imagem de Perfil</label>
            <input type="text" id="profileImageUrl" name="profileImageUrl" value={formData.profileImageUrl} onChange={handleChange} />
          </div>

          <div className="form-group">
            <label htmlFor="biography"><i className="fas fa-paragraph" /> Biografia</label>
            <textarea id="biography" name="biography" value={formData.biography} onChange={handleChange} />
          </div>

          <button type="submit" className="submit-btn" disabled={loading}>
            {loading ? <><i className="fas fa-spinner fa-spin" /> Cadastrando...</> : <><i className="fas fa-plus" /> Cadastrar Usuário</>}
          </button>
        </form>
      </div>
    </div>
  );
}

export default InternalRegistration;
