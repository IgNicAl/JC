import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { newsService } from '@/lib/api';
import './CreateNews.css';

const INITIAL_FORM_STATE = {
  title: '',
  summary: '',
  content: '',
  featuredImageUrl: '',
  priority: 1,
};

/**
 * @description Página com formulário para criação de uma nova notícia.
 * @returns {JSX.Element} A página de criação de notícia.
 */
function CreateNews() {
  const [formData, setFormData] = useState(INITIAL_FORM_STATE);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  const navigate = useNavigate();

  const handleChange = ({ target: { name, value } }) => {
    setFormData((prev) => ({
      ...prev,
      [name]: name === 'priority' ? parseInt(value, 10) : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ type: '', text: '' });
    try {
      await newsService.create(formData);
      setMessage({ type: 'success', text: 'Notícia criada com sucesso!' });
      setTimeout(() => {
        navigate('/noticias/gerenciar');
      }, 2000);
    } catch (error) {
      setMessage({ type: 'error', text: 'Erro ao criar notícia. Tente novamente.' });
      console.error('Erro ao criar:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="create-news-container">
      <div className="create-news-card">
        <div className="create-news-header">
          <h1><i className="fas fa-plus-circle" /> Criar Nova Notícia</h1>
          <p>Preencha os detalhes da nova notícia abaixo</p>
        </div>

        {message.text && (
          <div className={`message ${message.type}`}>
            <i className={`fas ${message.type === 'success' ? 'fa-check-circle' : 'fa-exclamation-circle'}`} />
            {message.text}
          </div>
        )}

        <form onSubmit={handleSubmit} className="create-news-form">
          <div className="form-group">
            <label htmlFor="title"><i className="fas fa-heading" /> Título *</label>
            <input type="text" id="title" name="title" value={formData.title} onChange={handleChange} required />
          </div>

          <div className="form-group">
            <label htmlFor="summary"><i className="fas fa-align-left" /> Resumo *</label>
            <textarea id="summary" name="summary" value={formData.summary} onChange={handleChange} required />
          </div>

          <div className="form-group">
            <label htmlFor="content"><i className="fas fa-file-alt" /> Conteúdo Completo *</label>
            <textarea id="content" name="content" value={formData.content} onChange={handleChange} required />
          </div>

          <div className="form-group">
            <label htmlFor="featuredImageUrl"><i className="fas fa-image" /> URL da Imagem de Capa</label>
            <input type="text" id="featuredImageUrl" name="featuredImageUrl" value={formData.featuredImageUrl} onChange={handleChange} />
          </div>

          <div className="form-group">
            <label htmlFor="priority"><i className="fas fa-star" /> Prioridade *</label>
            <select id="priority" name="priority" value={formData.priority} onChange={handleChange}>
              <option value={1}>Normal</option>
              <option value={2}>Alta</option>
              <option value={3}>Urgente</option>
            </select>
          </div>

          <button type="submit" className="submit-btn" disabled={loading}>
            {loading ? <><i className="fas fa-spinner fa-spin" /> Criando...</> : <><i className="fas fa-save" /> Criar Notícia</>}
          </button>
        </form>
      </div>
    </div>
  );
}

export default CreateNews;
