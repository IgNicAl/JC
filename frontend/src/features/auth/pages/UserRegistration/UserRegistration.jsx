import { useState } from 'react';
import { authService } from '@/lib/api';
import './UserRegistration.css';

const INITIAL_FORM_STATE = {
  name: '',
  username: '',
  email: '',
  password: '',
  confirmPassword: '',
  birthDate: '',
  gender: '',
};

/**
 * @description Renderiza a página de cadastro de usuário comum, permitindo que novos
 * usuários criem uma conta na aplicação.
 * @returns {JSX.Element} A página de cadastro de usuário.
 */
function UserRegistration() {
  const [formData, setFormData] = useState(INITIAL_FORM_STATE);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  const handleChange = ({ target: { name, value } }) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage({ type: '', text: '' });

    if (formData.password !== formData.confirmPassword) {
      setMessage({ type: 'error', text: 'As senhas não coincidem.' });
      return;
    }

    setLoading(true);
    try {
      const userData = {
        name: formData.name,
        username: formData.username,
        email: formData.email,
        password: formData.password,
        confirmPassword: formData.confirmPassword,
        birthDate: formData.birthDate || null,
        gender: formData.gender,
      };
      await authService.register(userData);
      setMessage({ type: 'success', text: 'Usuário cadastrado com sucesso!' });
      setFormData(INITIAL_FORM_STATE);
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Erro ao cadastrar usuário. Verifique os dados e tente novamente.';
      setMessage({ type: 'error', text: errorMessage });
      console.error('Erro:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="registration-container">
      <div className="registration-card">
        <div className="registration-header">
          <h1><i className="fas fa-user-plus" /> Cadastro de Usuário</h1>
          <p>Preencha os dados abaixo para criar uma nova conta</p>
        </div>

        {message.text && (
          <div className={`message ${message.type}`}>
            <i className={`fas ${message.type === 'success' ? 'fa-check-circle' : 'fa-exclamation-circle'}`} />
            {message.text}
          </div>
        )}

        <form onSubmit={handleSubmit} className="registration-form">
          <div className="form-group">
            <label htmlFor="name"><i className="fas fa-user" /> Nome Completo *</label>
            <input type="text" id="name" name="name" value={formData.name} onChange={handleChange} required placeholder="Digite seu nome completo" />
          </div>

           <div className="form-group">
            <label htmlFor="username"><i className="fas fa-at" /> Usuário *</label>
            <input type="text" id="username" name="username" value={formData.username} onChange={handleChange} required placeholder="Digite seu nome de usuário" />
          </div>

          <div className="form-group">
            <label htmlFor="email"><i className="fas fa-envelope" /> E-mail *</label>
            <input type="email" id="email" name="email" value={formData.email} onChange={handleChange} required placeholder="Digite seu e-mail" />
          </div>

          <div className="form-group">
            <label htmlFor="password"><i className="fas fa-lock" /> Senha *</label>
            <input type="password" id="password" name="password" value={formData.password} onChange={handleChange} required placeholder="Mínimo 6 caracteres" />
          </div>

          <div className="form-group">
            <label htmlFor="confirmPassword"><i className="fas fa-lock" /> Confirmar Senha *</label>
            <input type="password" id="confirmPassword" name="confirmPassword" value={formData.confirmPassword} onChange={handleChange} required placeholder="Repita sua senha" />
          </div>

          <div className="form-group">
            <label htmlFor="birthDate"><i className="fas fa-calendar-alt" /> Data de Nascimento</label>
            <input type="date" id="birthDate" name="birthDate" value={formData.birthDate} onChange={handleChange} />
          </div>

          <div className="form-group">
            <label htmlFor="gender"><i className="fas fa-venus-mars" /> Gênero</label>
            <select id="gender" name="gender" value={formData.gender} onChange={handleChange}>
              <option value="">Selecione...</option>
              <option value="Masculino">Masculino</option>
              <option value="Feminino">Feminino</option>
              <option value="Outro">Outro</option>
            </select>
          </div>

          <button type="submit" className="submit-btn" disabled={loading}>
            {loading ? (
              <><i className="fas fa-spinner fa-spin" /> Cadastrando...</>
            ) : (
              <><i className="fas fa-save" /> Cadastrar Usuário</>
            )}
          </button>
        </form>

        <div className="registration-footer">
          <p>
            Já tem uma conta? <a href="/login"><i className="fas fa-sign-in-alt" /> Faça Login</a>
          </p>
        </div>
      </div>
    </div>
  );
}

export default UserRegistration;
