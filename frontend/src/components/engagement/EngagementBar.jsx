import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../../features/auth/contexts/AuthContext';
import { engagementService } from '../../lib/api';
import './EngagementBar.css';

/**
 * Barra de engajamento que exibe curtidas, comentários e permite interações.
 * @param {{ newsId: string }} props
 */
function EngagementBar({ newsId }) {
  const { isAuthenticated, user } = useContext(AuthContext);
  const [stats, setStats] = useState({ likeCount: 0, commentCount: 0, isLikedByCurrentUser: false });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      if (!newsId) return;
      try {
        setIsLoading(true);
        const response = await engagementService.getEngagementStats(newsId);
        setStats(response.data);
      } catch (error) {
        console.error("Erro ao buscar estatísticas de engajamento:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchStats();
  }, [newsId, user]);

  const handleLike = async () => {
    if (!isAuthenticated()) {
      // Idealmente, redirecionaria para o login ou mostraria um modal
      alert("Você precisa estar logado para curtir.");
      return;
    }
    try {
      const response = await engagementService.toggleLike(newsId);
      setStats(prev => ({
        ...prev,
        likeCount: response.data.likeCount,
        isLikedByCurrentUser: !prev.isLikedByCurrentUser,
      }));
    } catch (error) {
      console.error("Erro ao curtir:", error);
    }
  };

  if (isLoading) {
    return <div className="engagement-bar-loading">Carregando...</div>;
  }

  return (
    <div className="engagement-bar">
      <button onClick={handleLike} className={`engagement-btn like-btn ${stats.isLikedByCurrentUser ? 'active' : ''}`} disabled={!isAuthenticated()}>
        <i className={stats.isLikedByCurrentUser ? 'fas fa-heart' : 'far fa-heart'} />
        <span>{stats.likeCount}</span>
      </button>
      <div className="engagement-btn comment-btn">
        <i className="far fa-comment" />
        <span>{stats.commentCount}</span>
      </div>
      {/* Futuramente, botão de compartilhamento */}
      <button className="engagement-btn share-btn">
        <i className="fas fa-share" />
        <span>Compartilhar</span>
      </button>
    </div>
  );
}

export default EngagementBar;