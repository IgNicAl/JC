import React, { useEffect, useState, useContext } from 'react';
import { useParams } from 'react-router-dom';
import { userService } from '../../../../lib/api';
import { AuthContext } from '../../contexts/AuthContext';
import { useApi } from '../../../../hooks/useApi';
import './UserProfile.css';

/**
 * Página de perfil de usuário.
 */
function UserProfile() {
  const { username } = useParams();
  const { user: currentUser } = useContext(AuthContext);
  const { data: profile, loading, error, request: fetchProfile } = useApi(userService.getPublicProfile);
  const [isFollowing, setIsFollowing] = useState(false);

  useEffect(() => {
    if (username) {
      fetchProfile(username);
    }
  }, [username, fetchProfile]);
  
  useEffect(() => {
      if (profile) {
          setIsFollowing(profile.isFollowedByCurrentUser);
      }
  }, [profile]);

  const handleFollow = async () => {
    try {
      await userService.followUser(profile.id);
      setIsFollowing(!isFollowing);
      // Atualizar contagem de seguidores localmente para feedback instantâneo
      fetchProfile(username); // Re-fetch para dados atualizados
    } catch (err) {
      alert("Não foi possível seguir o usuário.");
    }
  };
  
  if (loading) return <div className="profile-container">Carregando perfil...</div>;
  if (error) return <div className="profile-container error-message">{error}</div>;
  if (!profile) return <div className="profile-container">Usuário não encontrado.</div>;
  
  const isOwnProfile = currentUser?.id === profile.id;

  return (
    <div className="profile-container">
      <header className="profile-header">
        <img src={profile.profileImageUrl || 'https://via.placeholder.com/150'} alt={profile.name} className="profile-avatar" />
        <div className="profile-info">
          <h2>{profile.name} (@{profile.username})</h2>
          <p className="profile-bio">{profile.biography}</p>
          <div className="profile-stats">
            <span><strong>{profile.publishedNews?.length || 0}</strong> publicações</span>
            <span><strong>{profile.followersCount}</strong> seguidores</span>
            <span><strong>{profile.followingCount}</strong> seguindo</span>
          </div>
          {currentUser && !isOwnProfile && (
            <button onClick={handleFollow} className="follow-btn">
              {isFollowing ? 'Deixar de Seguir' : 'Seguir'}
            </button>
          )}
          {isOwnProfile && (
              <button className="edit-profile-btn">Editar Perfil</button>
          )}
        </div>
      </header>
      
      {profile.userType === 'JOURNALIST' && (
        <main className="profile-content">
          <h3>Publicações</h3>
          <div className="news-grid-profile">
            {profile.publishedNews.map(news => (
              <a href={`/noticia/${news.slug}`} key={news.slug} className="news-card-profile">
                <img src={news.featuredImageUrl} alt={news.title} />
                <div className="news-card-overlay">
                  <h4>{news.title}</h4>
                </div>
              </a>
            ))}
          </div>
        </main>
      )}
    </div>
  );
}

export default UserProfile;