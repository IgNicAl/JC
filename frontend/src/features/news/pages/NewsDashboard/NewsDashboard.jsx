import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { dashboardService } from '../../../../lib/api';
import { useApi } from '../../../../hooks/useApi';
import StatCard from '../../../../components/dashboard/StatCard';
import ChartComponent from '../../../../components/dashboard/ChartComponent';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import './NewsDashboard.css';

/**
 * Página de dashboard para uma notícia específica.
 */
function NewsDashboard() {
  const { id: newsId } = useParams();
  const { data: dashboardData, loading, error, request: fetchDashboardData } = useApi(dashboardService.getNewsDashboard);
  const [chartData, setChartData] = useState({ labels: [], datasets: [] });

  useEffect(() => {
    if (newsId) {
      fetchDashboardData(newsId);
    }
  }, [newsId, fetchDashboardData]);

  useEffect(() => {
    if (dashboardData?.viewsOverTime) {
      const labels = dashboardData.viewsOverTime.map(item => new Date(item.date).toLocaleDateString('pt-BR'));
      const data = dashboardData.viewsOverTime.map(item => item.views);
      setChartData({
        labels,
        datasets: [{
          label: 'Visualizações por Dia',
          data,
          borderColor: 'rgb(52, 152, 219)',
          backgroundColor: 'rgba(52, 152, 219, 0.5)',
          tension: 0.1,
        }],
      });
    }
  }, [dashboardData]);

  const handleExportPDF = () => {
    if (!dashboardData) return;
    const doc = new jsPDF();
    doc.text(`Relatório da Notícia: ${dashboardData.newsTitle}`, 14, 20);
    
    autoTable(doc, {
      startY: 30,
      head: [['Métrica', 'Total']],
      body: [
        ['Visualizações', dashboardData.totalViews],
        ['Curtidas', dashboardData.totalLikes],
        ['Comentários', dashboardData.totalComments],
      ],
    });
    
    autoTable(doc, {
      startY: doc.previousAutoTable.finalY + 10,
      head: [['Data', 'Visualizações']],
      body: dashboardData.viewsOverTime.map(item => [new Date(item.date).toLocaleDateString('pt-BR'), item.views]),
    });
    
    doc.save(`relatorio_${dashboardData.newsTitle.replace(/\s+/g, '_')}.pdf`);
  };

  if (loading) {
    return <div className="dashboard-container">Carregando dados do dashboard...</div>;
  }
  
  if (error) {
    return <div className="dashboard-container error-message">Erro ao carregar dados: {error}</div>;
  }
  
  if (!dashboardData) {
    return <div className="dashboard-container">Nenhum dado encontrado.</div>;
  }

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <h1>Dashboard: {dashboardData.newsTitle}</h1>
        <button onClick={handleExportPDF} className="export-btn">
          <i className="fas fa-file-pdf" /> Exportar PDF
        </button>
      </div>

      <div className="stats-grid">
        <StatCard title="Visualizações Totais" value={dashboardData.totalViews} icon="fas fa-eye" color="#3498db" />
        <StatCard title="Curtidas Totais" value={dashboardData.totalLikes} icon="fas fa-heart" color="#e74c3c" />
        <StatCard title="Comentários Totais" value={dashboardData.totalComments} icon="fas fa-comments" color="#2ecc71" />
      </div>

      <div className="chart-section">
        <ChartComponent data={chartData} title="Evolução das Visualizações" />
      </div>

      <div className="recent-comments-section">
        <h2>Comentários Recentes</h2>
        <div className="comment-list-dashboard">
          {dashboardData.recentComments.length > 0 ? (
            dashboardData.recentComments.map(comment => (
              <div key={comment.id} className="comment-item-dashboard">
                <p><strong>{comment.userName}:</strong> {comment.content}</p>
                <span>{new Date(comment.createdAt).toLocaleString('pt-BR')}</span>
              </div>
            ))
          ) : (
            <p>Nenhum comentário recente.</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default NewsDashboard;