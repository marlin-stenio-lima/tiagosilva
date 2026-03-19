import React from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../../components/Sidebar';
import { Play, PenTool, BarChart2, Bell, ChevronRight, ExternalLink } from 'lucide-react';
import './Dashboard.css';

const Dashboard = () => {
  const navigate = useNavigate();

  return (
    <div className="dashboard-container">
      <Sidebar />
      
      <main className="dashboard-content">
        <header className="content-header">
          <div className="breadcrumbs">
            <span>Área de Membros</span>
            <span className="separator">/</span>
            <span className="current">Início</span>
          </div>
          
          <div className="header-actions">
            <span className="welcome-text">Olá, <strong>Thiago</strong></span>
            <button className="notification-btn glass">
              <Bell size={18} />
              <span className="notification-dot"></span>
            </button>
          </div>
        </header>

        <section className="progress-section animate-fade-in">
          <div className="progress-card card-gradient">
            <div className="progress-info">
              <h2>Sua jornada de IA</h2>
              <p>Progresso contínuo nos módulos de especialização</p>
              
              <div className="progress-bar-container">
                <div className="progress-bar" style={{width: '30%'}}></div>
              </div>
            </div>
            <div className="progress-stats">
              <span className="percentage">30%</span>
              <span className="label">CONCLUÍDO</span>
            </div>
          </div>
        </section>

        <section className="shortcuts-section">
          <h3>Atalhos Rápidos</h3>
          <div className="shortcut-grid">
            <div className="shortcut-card glass" onClick={() => navigate('/lesson')}>
              <div className="icon gold-vibe">
                <Play size={24} fill="#3b82f6" color="#3b82f6" />
              </div>
              <div className="card-content">
                <h4>Continuar trilha</h4>
                <p>Módulo 3: Prompt Engineering Avançado</p>
              </div>
              <div className="arrow-icon">
                <ChevronRight size={20} />
              </div>
            </div>

            <div className="shortcut-card glass" onClick={() => navigate('/tools')}>
              <div className="icon">
                <PenTool size={24} />
              </div>
              <div className="card-content">
                <h4>Ver ferramentas</h4>
                <p>Explore +50 IAs selecionadas</p>
              </div>
              <div className="arrow-icon">
                <ChevronRight size={20} />
              </div>
            </div>

            <div className="shortcut-card glass" onClick={() => navigate('/diagnosis')}>
              <div className="icon">
                <BarChart2 size={24} />
              </div>
              <div className="card-content">
                <h4>Meu diagnóstico</h4>
                <p>Veja sua evolução técnica mensal</p>
              </div>
              <div className="arrow-icon">
                <ChevronRight size={20} />
              </div>
            </div>
          </div>
        </section>

        <section className="featured-section">
          <div className="section-header">
            <h3>Ferramentas em destaque</h3>
            <a href="#" className="view-all">VER TODAS</a>
          </div>
          <div className="tool-grid">
            <div className="tool-card glass">
              <div className="tool-visual">
                <img src="https://cdn-icons-png.flaticon.com/512/2103/2103633.png" alt="Tool" />
              </div>
              <div className="tool-info">
                <h4>Auto-GPT Master</h4>
                <p>Automação completa de tarefas complexas</p>
                <span className="tool-tag tag-blue">PRODUTIVIDADE</span>
              </div>
              <button className="tool-action">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6M15 3h6v6M10 14L21 3"></path></svg>
              </button>
            </div>

            <div className="tool-card glass">
              <div className="tool-visual">
                <img src="https://cdn-icons-png.flaticon.com/512/4712/4712139.png" alt="Tool" />
              </div>
              <div className="tool-info">
                <h4>Claude 3 Opus Helper</h4>
                <p>Templates para análise de dados e documentos</p>
                <span className="tool-tag tag-cyan">ANÁLISE</span>
              </div>
              <button className="tool-action">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6M15 3h6v6M10 14L21 3"></path></svg>
              </button>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default Dashboard;
