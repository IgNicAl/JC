import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { newsService } from '@/lib/api';
import EditorJS from '@editorjs/editorjs';
import Header from '@editorjs/header';
import List from '@editorjs/list';
import ImageTool from '@editorjs/image';
import Embed from '@editorjs/embed';
import Quote from '@editorjs/quote';
import Table from '@editorjs/table';
import CodeTool from '@editorjs/code';

import './CreateNews.css';

const INITIAL_FORM_STATE = {
  title: '',
  summary: '',
  featuredImageUrl: '',
  priority: 1,
};

function CreateNews() {
  const [formData, setFormData] = useState(INITIAL_FORM_STATE);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  const navigate = useNavigate();
  const editorRef = useRef(null);

  useEffect(() => {
    if (!editorRef.current) {
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
                    return {
                      success: 1,
                      file: {
                        url: result.url,
                      },
                    };
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
        placeholder: 'Comece a escrever sua notícia aqui...',
      });
      editorRef.current = editor;
    }

    return () => {
      if (editorRef.current && editorRef.current.destroy) {
        editorRef.current.destroy();
        editorRef.current = null;
      }
    };
  }, []);

  useEffect(() => {
    const draft = localStorage.getItem('newsDraft');
    if (draft) {
      const draftData = JSON.parse(draft);
      setFormData({
        title: draftData.title || '',
        summary: draftData.summary || '',
        featuredImageUrl: draftData.featuredImageUrl || '',
        priority: draftData.priority || 1,
      });
      if (editorRef.current) {
        editorRef.current.isReady
          .then(() => {
            editorRef.current.render(draftData.contentJson);
          })
          .catch((error) => console.error('Error rendering draft:', error));
      }
    }
  }, []);

  const handleChange = ({ target: { name, value } }) => {
    const updatedFormData = {
      ...formData,
      [name]: name === 'priority' ? parseInt(value, 10) : value,
    };
    setFormData(updatedFormData);
    saveDraft(updatedFormData);
  };

  const saveDraft = async (data) => {
    if (editorRef.current) {
      try {
        const contentJson = await editorRef.current.save();
        const draftData = { ...data, contentJson };
        localStorage.setItem('newsDraft', JSON.stringify(draftData));
      } catch (error) {
        console.error('Error saving draft:', error);
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ type: '', text: '' });

    try {
      const outputData = await editorRef.current.save();

      if (outputData.blocks.length === 0) {
        setMessage({ type: 'error', text: 'O conteúdo da notícia não pode estar vazio.' });
        setLoading(false);
        return;
      }

      const newsData = {
        ...formData,
        content: JSON.stringify(outputData),
        contentJson: JSON.stringify(outputData),
        status: 'PUBLICADO',
      };

      await newsService.create(newsData);
      setMessage({ type: 'success', text: 'Notícia criada com sucesso!' });
      localStorage.removeItem('newsDraft');

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
            <label htmlFor="editorjs"><i className="fas fa-file-alt" /> Conteúdo Completo *</label>
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

          <button type="submit" className="submit-btn" disabled={loading}>
            {loading ? <><i className="fas fa-spinner fa-spin" /> Criando...</> : <><i className="fas fa-save" /> Criar Notícia</>}
          </button>
        </form>
      </div>
    </div>
  );
}

export default CreateNews;
