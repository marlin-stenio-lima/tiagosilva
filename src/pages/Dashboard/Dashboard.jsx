import React from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../../components/Sidebar';
import { Play, PenTool, BarChart2, Bell, ChevronRight, Target, TrendingUp, Zap, Shield } from 'lucide-react';
import './Dashboard.css';
import '../Diagnosis/DiagnosisView.css';

const Dashboard = () => {
  const navigate = useNavigate();

  const metrics = [
    { name: 'Nível de Automação', score: 85, icon: <Zap size={20} /> },
    { name: 'Cultura de IA', score: 40, icon: <Target size={20} /> },
    { name: 'Eficiência Operacional', score: 70, icon: <TrendingUp size={20} /> },
    { name: 'Escalabilidade', score: 60, icon: <Shield size={20} /> }
  ];

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

        <section className="featured-section" style={{ marginTop: 0 }}>
          <div className="section-header">
            <h3>Sua jornada de IA</h3>
            <button onClick={() => navigate('/diagnosis')} className="view-all" style={{background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'inherit'}}>VER DIAGNÓSTICO COMPLETO</button>
          </div>
          
          <div className="diagnosis-hero glass gold-border animate-fade-in" style={{ marginTop: '1rem' }}>
            <div className="score-main">
               <div className="score-circle">
                  <span className="score-number">75</span>
                  <span className="score-total">/100</span>
               </div>
               <div className="score-text">
                  <h2>Nível Alpha</h2>
                  <p>Sua empresa está acima da média de mercado em infraestrutura de IA, mas possui gargalos na cultura de inovação interna.</p>
               </div>
            </div>
            <div className="radar-placeholder glass">
               <div className="radar-mock">
                 <div className="radar-line"></div>
                 <div className="radar-line"></div>
                 <div className="radar-line"></div>
                 <div className="radar-area"></div>
                 <span className="label top">Automação</span>
                 <span className="label right">Escala</span>
                 <span className="label bottom">Eficiência</span>
                 <span className="label left">Cultura</span>
               </div>
            </div>
          </div>

          <div className="metrics-grid" style={{ marginTop: '1.5rem', marginBottom: '2rem' }}>
            {metrics.map(m => (
              <div key={m.name} className="metric-card glass">
                <div className="metric-header">
                  <div className="m-icon gold-glow">{m.icon}</div>
                  <h4>{m.name}</h4>
                </div>
                <div className="m-progress-bar">
                  <div className="m-progress-fill" style={{ width: `${m.score}%` }}></div>
                </div>
                <div style={{display: 'flex', justifyContent: 'space-between', marginTop: '0.8rem'}}>
                  <span className="m-score-tag" style={{position: 'static'}}>{m.score}%</span>
                </div>
              </div>
            ))}
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

      </main>
    </div>
  );
};

export default Dashboard;
