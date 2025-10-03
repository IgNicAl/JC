import React, { useState, useEffect, useContext } from 'react';
import PropTypes from 'prop-types';
import { useForm } from 'react-hook-form';
import { engagementService } from '../../lib/api';
import { AuthContext } from '../../features/auth/contexts/AuthContext';
import { useApi } from '../../hooks/useApi';
import './CommentSection.css';

/**
 * Seção de comentários de uma notícia.
 * @param {{ newsId: string }} props
 */
function CommentSection({ newsId }) {
  const { user, isAuthenticated } = useContext(AuthContext);
  const { data: comments, loading, error, request: fetchComments } = useApi(engagementService.getComments);
  const [commentList, setCommentList] = useState([]);
  const { register, handleSubmit, reset, formState: { isSubmitting } } = useForm();

  useEffect(() => {
    if (newsId) {
      fetchComments(newsId);
    }
  }, [newsId, fetchComments]);

  useEffect(() => {
    if (comments) {
      setCommentList(comments);
    }
  }, [comments]);

  const onCommentSubmit = async (data) => {
    try {
      const newComment = await engagementService.addComment(newsId, data.content);
      setCommentList(prev => [newComment.data, ...prev]);
      reset();
    } catch (err) {
      console.error("Erro ao adicionar comentário:", err);
      alert("Não foi possível enviar seu comentário. Tente novamente.");
    }
  };

  const handleDeleteComment = async (commentId) => {
    if (!window.confirm("Tem certeza que deseja deletar este comentário?")) return;
    try {
      await engagementService.deleteComment(newsId, commentId);
      setCommentList(prev => prev.filter(c => c.id !== commentId));
    } catch (err) {
      console.error("Erro ao deletar comentário:", err);
      alert("Não foi possível deletar o comentário.");
    }
  };

  return (
    <div className="comment-section">
      <h3>Comentários ({commentList.length})</h3>
      {isAuthenticated() ? (
        <form onSubmit={handleSubmit(onCommentSubmit)} className="comment-form">
          <textarea
            {...register("content", { required: true })}
            placeholder="Escreva seu comentário..."
            rows="3"
            disabled={isSubmitting}
          />
          <button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Enviando..." : "Comentar"}
          </button>
        </form>
      ) : (
        <p className="login-prompt">
          <a href="/login">Faça login</a> para comentar.
        </p>
      )}
      <div className="comment-list">
        {loading && <p>Carregando comentários...</p>}
        {error && <p className="error-message">Não foi possível carregar os comentários.</p>}
        {commentList.map((comment) => (
          <div key={comment.id} className="comment-item">
            <div className="comment-author">
              <img src={comment.userProfileImageUrl || 'https://via.placeholder.com/40'} alt={comment.userName} />
              <strong>{comment.userName}</strong>
              <span>{new Date(comment.createdAt).toLocaleString('pt-BR')}</span>
            </div>
            <p className="comment-content">{comment.content}</p>
            {(user?.isAdmin || user?.id === comment.userId) && (
              <button onClick={() => handleDeleteComment(comment.id)} className="delete-comment-btn">
                <i className="fas fa-trash-alt" />
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

CommentSection.propTypes = {
  newsId: PropTypes.string.isRequired,
};

export default CommentSection;