import React, { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom'; // Importar o Link
import { newsService } from '@/lib/api';
import './Home.css';

// Dados mockados para os widgets
const GAME_SCORES = [
  { team1: 'Sport', score1: 2, team2: 'Santa Cruz', score2: 1, status: 'Final' },
  { team1: 'Náutico', score1: 0, team2: 'América-PE', score2: 0, status: '1º Tempo' },
  { team1: 'Flamengo', score1: 3, team2: 'Palmeiras', score2: 1, status: 'Final' }
];
const WEATHER_FORECAST = {
  city: 'Recife',
  temperature: 28,
  description: 'Parcialmente nublado',
  humidity: 75,
  wind: '15 km/h'
};
const STOCK_MARKET = [
  { stock: 'PETR4', value: 32.45, variation: '+2.1%', color: 'green' },
  { stock: 'VALE3', value: 58.90, variation: '-1.3%', color: 'red' },
  { stock: 'ITUB4', value: 28.75, variation: '+0.8%', color: 'green' }
];

function Home() {
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    async function loadNews() {
      try {
        setLoading(true);
        setError('');
        const response = await newsService.getAll();
        const receivedNews = Array.isArray(response?.data) ? response.data : [];

        receivedNews.sort((a, b) => b.priority - a.priority || new Date(b.publicationDate) - new Date(a.publicationDate));

        setNews(receivedNews);
      } catch (err) {
        setError('Não foi possível carregar as notícias.');
      } finally {
        setLoading(false);
      }
    }
    loadNews();
  }, []);

  const featured = useMemo(() => (news.length > 0 ? news[0] : null), [news]);
  const remaining = useMemo(() => (news.length > 1 ? news.slice(1) : []), [news]);
  const main = useMemo(() => remaining.slice(0, 2), [remaining]);
  const small = useMemo(() => remaining.slice(2), [remaining]);

  if (loading) {
    return (
      <div className="home-container">
        <div className="home-loading">
          <i className="fas fa-spinner fa-spin" />
          <p>Carregando notícias...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="home-container">
        <div className="home-message error">
          <i className="fas fa-exclamation-circle" />
          {error}
        </div>
      </div>
    );
  }

  return (
    <div className="home-container">
      {/* Sidebar com widgets */}
      <div className="home-sidebar">
        <div className="widget score-widget">
          <h3><i className="fas fa-futbol" /> Placar dos Jogos</h3>
          <div className="game-list">
            {GAME_SCORES.map((game, index) => (
              <div key={index} className="game-item">
                <div className="game-teams">
                  <span className="team">{game.team1}</span>
                  <span className="score">{game.score1} x {game.score2}</span>
                  <span className="team">{game.team2}</span>
                </div>
                <div className="game-status">{game.status}</div>
              </div>
            ))}
          </div>
        </div>
        <div className="widget weather-widget">
          <h3><i className="fas fa-cloud-sun" /> Previsão do Tempo</h3>
          <div className="weather-info">
            <div className="weather-main">
              <span className="city">{WEATHER_FORECAST.city}</span>
              <span className="temperature">{WEATHER_FORECAST.temperature}°C</span>
              <span className="description">{WEATHER_FORECAST.description}</span>
            </div>
            <div className="weather-details">
              <div className="detail">
                <i className="fas fa-tint" />
                <span>Umidade: {WEATHER_FORECAST.humidity}%</span>
              </div>
              <div className="detail">
                <i className="fas fa-wind" />
                <span>Vento: {WEATHER_FORECAST.wind}</span>
              </div>
            </div>
          </div>
        </div>
        <div className="widget stock-widget">
          <h3><i className="fas fa-chart-line" /> Bolsa de Valores</h3>
          <div className="stock-list">
            {STOCK_MARKET.map((stock, index) => (
              <div key={index} className="stock-item">
                <span className="stock-name">{stock.stock}</span>
                <span className="stock-value">R$ {stock.value}</span>
                <span className={`stock-variation ${stock.color}`}>{stock.variation}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Conteúdo principal */}
      <div className="home-main">
        {/* Destaques (1 grande + 2 médios) */}
        <section className="hero-grid">
          {featured && (
            <Link to={`/noticia/${featured.slug}`} className="card-link">
              <article className="hero-large">
                <div className="card-media" style={{ backgroundImage: `url(${featured.featuredImageUrl || ''})` }} />
                <div className="card-overlay">
                  <span className="card-tag">Destaque</span>
                  <h1 className="card-title">{featured.title}</h1>
                  <p className="card-subtitle">{featured.summary}</p>
                </div>
              </article>
            </Link>
          )}
          {main.map((n) => (
            <Link key={n.id} to={`/noticia/${n.slug}`} className="card-link">
              <article className="hero-medium">
                <div className="card-media" style={{ backgroundImage: `url(${n.featuredImageUrl || ''})` }} />
                <div className="card-overlay">
                  <h2 className="card-title">{n.title}</h2>
                  <p className="card-subtitle">{n.summary}</p>
                </div>
              </article>
            </Link>
          ))}
        </section>

        {/* Demais notícias (cards menores) */}
        <h3 className="section-title">Últimas Notícias</h3>
        <section className="news-grid">
          {small.map((n) => (
            <Link key={n.id} to={`/noticia/${n.slug}`} className="card-link">
              <article className="news-card">
                <div className="card-media" style={{ backgroundImage: `url(${n.featuredImageUrl || ''})` }} />
                <div className="card-body">
                  <h2 className="card-title">{n.title}</h2>
                  <p className="card-subtitle">{n.summary}</p>
                  <div className="card-meta">
                    <span><i className="far fa-clock" /> {new Date(n.publicationDate || Date.now()).toLocaleDateString('pt-BR')}</span>
                  </div>
                </div>
              </article>
            </Link>
          ))}
        </section>
      </div>
    </div>
  );
}

export default Home;
