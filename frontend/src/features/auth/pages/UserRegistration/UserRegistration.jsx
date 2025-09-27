import { useState } from 'react';
import { authService } from '@/lib/api';
import './UserRegistration.css';

const INITIAL_FORM_STATE = {
  name: '',
  username: '',
  email: '',
  senha: '',
  dataNascimento: '',
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
    setLoading(true);
    setMessage({ type: '', text: '' });
    try {
      const userData = {
        name: formData.name,
        username: formData.username,
        email: formData.email,
        password: formData.senha,
        dataNascimento: formData.dataNascimento,
        gender: formData.gender,
      };
      await authService.register(userData);
      setMessage({ type: 'success', text: 'Usuário cadastrado com sucesso!' });
      setFormData(INITIAL_FORM_STATE);
    } catch (error) {
      setMessage({ type: 'error', text: 'Erro ao cadastrar usuário. Tente novamente.' });
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
            <label htmlFor="username"><i className="fas fa-user" /> Usuário *</label>
            <input type="text" id="username" name="username" value={formData.username} onChange={handleChange} required placeholder="Digite seu usuário" />
          </div>

          <div className="form-group">
            <label htmlFor="email"><i className="fas fa-envelope" /> E-mail *</label>
            <input type="email" id="email" name="email" value={formData.email} onChange={handleChange} required placeholder="Digite seu e-mail" />
          </div>

          <div className="form-group">
            <label htmlFor="senha"><i className="fas fa-lock" /> Senha *</label>
            <input type="password" id="senha" name="senha" value={formData.senha} onChange={handleChange} required placeholder="Digite sua senha" />
          </div>

          <div className="form-group">
            <label htmlFor="dataNascimento"><i className="fas fa-calendar-alt" /> Data de Nascimento</label>
            <input type="date" id="dataNascimento" name="dataNascimento" value={formData.dataNascimento} onChange={handleChange} />
          </div>

          <div className="form-group">
            <label htmlFor="gender"><i className="fas fa-venus-mars" /> Gênero</label>
            <select id="gender" name="gender" value={formData.gender} onChange={handleChange}>
              <option value="">Selecione...</option>
              <option value="M">Masculino</option>
              <option value="F">Feminino</option>
              <option value="O">Outro</option>
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
            <a href="/users">
              <i className="fas fa-list" /> Ver lista de usuários
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}

export default UserRegistration;
