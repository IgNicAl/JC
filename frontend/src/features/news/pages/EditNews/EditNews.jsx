import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { newsService } from '@/lib/api';
import EditorJS from '@editorjs/editorjs';
import Header from '@editorjs/header';
import List from '@editorjs/list';
import ImageTool from '@editorjs/image';
import Embed from '@editorjs/embed';
import Quote from '@editorjs/quote';
import Table from '@editorjs/table';
import CodeTool from '@editorjs/code';
import '../CreateNews/CreateNews.css'; // Reutilizando o mesmo CSS

function EditNews() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  const editorRef = useRef(null);

  // Efeito para buscar os dados da notícia
  useEffect(() => {
    const fetchNews = async () => {
      try {
        setLoading(true);
        const response = await newsService.getById(id);
        setFormData(response.data);
      } catch (error) {
        setMessage({ type: 'error', text: 'Erro ao carregar dados da notícia.' });
        console.error('Erro:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchNews();
  }, [id]);

  // Efeito para inicializar o Editor.js APÓS os dados serem carregados
  useEffect(() => {
    // Só inicializa se não estiver carregando, se tiver dados e se o editor ainda não foi criado
    if (!loading && formData && !editorRef.current) {
      const editor = new EditorJS({
        holder: 'editorjs',
        tools: {
          header: Header,
          list: List,
          image: {
            class: ImageTool,
            config: {
              uploader: {
                async uploadByFile(file) {
                  const formData = new FormData();
                  formData.append('image', file);
                  try {
                    const response = await fetch('/api/upload/image', {
                      method: 'POST',
                      body: formData,
                    });
                    const result = await response.json();
                    return { success: 1, file: { url: result.url } };
                  } catch (error) {
                    console.error('Image upload failed:', error);
                    return { success: 0 };
                  }
                },
              },
            },
          },
          embed: Embed,
          quote: Quote,
          table: Table,
          code: CodeTool,
        },
        data: formData.contentJson ? JSON.parse(formData.contentJson) : { blocks: [] },
        placeholder: 'Edite sua notícia aqui...',
      });
      editorRef.current = editor;
    }

    // Função de limpeza para destruir a instância do editor ao sair do componente
    return () => {
      if (editorRef.current && editorRef.current.destroy) {
        editorRef.current.destroy();
        editorRef.current = null;
      }
    };
  }, [loading, formData]); // Depende do estado de 'loading' e 'formData'

  const handleChange = ({ target: { name, value } }) => {
    setFormData((prev) => ({ ...prev, [name]: name === 'priority' ? parseInt(value, 10) : value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!editorRef.current) {
      setMessage({ type: 'error', text: 'Editor não inicializado.' });
      return;
    }

    setSaving(true);
    setMessage({ type: '', text: '' });

    try {
      const outputData = await editorRef.current.save();

      if (outputData.blocks.length === 0) {
        setMessage({ type: 'error', text: 'O conteúdo da notícia não pode estar vazio.' });
        setSaving(false);
        return;
      }

      const updatedNewsData = {
        ...formData,
        content: JSON.stringify(outputData),
        contentJson: JSON.stringify(outputData),
      };

      await newsService.update(id, updatedNewsData);
      setMessage({ type: 'success', text: 'Notícia atualizada com sucesso!' });
      setTimeout(() => navigate('/noticias/gerenciar'), 2000);
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Erro ao atualizar notícia. Tente novamente.';
      setMessage({ type: 'error', text: errorMessage });
      console.error('Erro ao atualizar:', error);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="create-news-container">
        <div className="loading">
          <i className="fas fa-spinner fa-spin" />
          <p>Carregando notícia...</p>
        </div>
      </div>
    );
  }

  if (!formData) {
    return (
        <div className="create-news-container">
            <div className="message error">
                <i className="fas fa-exclamation-circle" />
                {message.text || 'Não foi possível carregar a notícia.'}
            </div>
        </div>
    );
  }

  return (
    <div className="create-news-container">
      <div className="create-news-card">
        <div className="create-news-header">
          <h1><i className="fas fa-edit" /> Editar Notícia</h1>
          <p>Atualize os detalhes da notícia abaixo</p>
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
            <div id="editorjs" style={{ border: '1px solid #ccc', borderRadius: '5px', minHeight: '300px' }}></div>
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

          <button type="submit" className="submit-btn" disabled={saving}>
            {saving ? <><i className="fas fa-spinner fa-spin" /> Salvando...</> : <><i className="fas fa-save" /> Salvar Alterações</>}
          </button>
        </form>
      </div>
    </div>
  );
}

export default EditNews;
