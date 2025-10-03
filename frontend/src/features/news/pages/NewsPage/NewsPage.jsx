import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { newsService, engagementService } from '../../../../lib/api';
import Output from 'editorjs-react-renderer';
import EngagementBar from '../../../../components/engagement/EngagementBar';
import CommentSection from '../../../../components/engagement/CommentSection';
import './NewsPage.css';

function NewsPage() {
  const { slug } = useParams();
  const [news, setNews] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchNews = async () => {
      try {
        setLoading(true);
        const response = await newsService.getBySlug(slug);
        setNews(response.data);
        // Registra a visualização assim que a notícia é carregada
        await engagementService.trackView(response.data.id);
      } catch (err) {
        setError('Notícia não encontrada.');
        console.error('Erro ao buscar notícia:', err);
      } finally {
        setLoading(false);
      }
    };
    if (slug) {
      fetchNews();
    }
  }, [slug]);

  if (loading) {
    return <div className="news-page-container">Carregando...</div>;
  }

  if (error) {
    return <div className="news-page-container">{error}</div>;
  }

  return (
    <div className="news-page-container">
      <article className="news-article">
        <h1>{news.title}</h1>
        <p className="news-summary">{news.summary}</p>
        <div className="news-meta">
          <span>Por <a href={`/perfil/${news.author.username}`}>{news.author.name}</a></span>
          <span>{new Date(news.publicationDate).toLocaleDateString('pt-BR')}</span>
        </div>
        {news.featuredImageUrl && (
          <img src={news.featuredImageUrl} alt={news.title} className="featured-image" />
        )}
        <div className="news-content">
          {news.contentJson ? (
            <Output data={JSON.parse(news.contentJson)} />
          ) : (
            <div dangerouslySetInnerHTML={{ __html: news.content }}></div>
          )}
        </div>
      </article>

      {/* Seção de Engajamento */}
      <EngagementBar newsId={news.id} />
      <CommentSection newsId={news.id} />
    </div>
  );
}

export default NewsPage;
