import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { userService } from '@/lib/api';
import './EditUser.css';

function EditUser() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  useEffect(() => {
    const fetchUser = async () => {
      try {
        setLoading(true);
        const response = await userService.getUserById(id);
        setFormData(response.data);
      } catch (error) {
        setMessage({ type: 'error', text: 'Erro ao carregar dados do usuário.' });
        console.error('Erro:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, [id]);

  const handleChange = ({ target: { name, value } }) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setMessage({ type: '', text: '' });
    try {
      await userService.updateUser(id, formData);
      setMessage({ type: 'success', text: 'Usuário atualizado com sucesso!' });
      setTimeout(() => navigate('/admin/usuarios'), 2000);
    } catch (error) {
      setMessage({ type: 'error', text: 'Erro ao atualizar usuário. Tente novamente.' });
      console.error('Erro ao atualizar:', error);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="edit-user-container">Carregando...</div>;
  }

  if (!formData) {
    return <div className="edit-user-container">Usuário não encontrado.</div>;
  }

  return (
    <div className="edit-user-container">
      <div className="edit-user-card">
        <div className="edit-user-header">
          <h1><i className="fas fa-edit" /> Editar Usuário</h1>
          <p>Altere os dados de <strong>{formData.name}</strong></p>
        </div>

        {message.text && (
          <div className={`message ${message.type}`}>
            <i className={`fas ${message.type === 'success' ? 'fa-check-circle' : 'fa-exclamation-circle'}`} />
            {message.text}
          </div>
        )}

        <form onSubmit={handleSubmit} className="edit-user-form">
          <div className="form-group">
            <label htmlFor="name">Nome Completo</label>
            <input type="text" id="name" name="name" value={formData.name || ''} onChange={handleChange} required />
          </div>
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input type="email" id="email" name="email" value={formData.email || ''} onChange={handleChange} required />
          </div>
          <div className="form-group">
            <label htmlFor="userType">Tipo de Usuário</label>
            <select id="userType" name="userType" value={formData.userType} onChange={handleChange}>
              <option value="ADMIN">Administrador</option>
              <option value="JOURNALIST">Jornalista</option>
              <option value="USER">Usuário Padrão</option>
            </select>
          </div>
          <div className="form-group">
            <label htmlFor="urlImagemPerfil">URL da Imagem de Perfil</label>
            <input type="text" id="urlImagemPerfil" name="urlImagemPerfil" value={formData.urlImagemPerfil || ''} onChange={handleChange} />
          </div>
          <div className="form-group">
            <label htmlFor="biografia">Biografia</label>
            <textarea id="biografia" name="biografia" value={formData.biografia || ''} onChange={handleChange} />
          </div>
          <button type="submit" className="submit-btn" disabled={saving}>
            {saving ? 'Salvando...' : 'Salvar Alterações'}
          </button>
        </form>
      </div>
    </div>
  );
}

export default EditUser;
