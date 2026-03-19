import React from 'react';
import Sidebar from '../../components/Sidebar';
import { Target, TrendingUp, Zap, Shield, CheckCircle2 } from 'lucide-react';
import './DiagnosisView.css';

const DiagnosisView = () => {
  const metrics = [
    { name: 'Nível de Automação', score: 85, icon: <Zap size={20} /> },
    { name: 'Cultura de IA', score: 40, icon: <Target size={20} /> },
    { name: 'Eficiência Operacional', score: 70, icon: <TrendingUp size={20} /> },
    { name: 'Escalabilidade', score: 60, icon: <Shield size={20} /> }
  ];

  const recommendations = [
    { title: 'Implementar Agente de Vendas', desc: 'Sua automação comercial está no nível básico.', status: 'Urgente' },
    { title: 'Padronização de Prompts', desc: 'Equipe gastando muito tempo refinando outputs.', status: 'Recomendado' },
    { title: 'Database IA Integration', desc: 'Conectar seus dados proprietários ao LLM.', status: 'Estratégico' }
  ];

  return (
    <div className="dashboard-container">
      <Sidebar />
      <main className="dashboard-content diagnosis-page">
        <header className="content-header">
          <div className="breadcrumbs">
            <span>Área de Membros</span>
            <span className="separator">/</span>
            <span className="current">Diagnóstico</span>
          </div>
          <h1>Análise de Maturidade</h1>
        </header>

        <section className="diagnosis-hero glass gold-border animate-fade-in">
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
             {/* Simulação de Gráfico de Radar Premium */}
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
        </section>

        <section className="metrics-grid">
          {metrics.map(m => (
            <div key={m.name} className="metric-card glass">
              <div className="metric-header">
                <div className="m-icon gold-glow">{m.icon}</div>
                <h4>{m.name}</h4>
              </div>
              <div className="m-progress-bar">
                <div className="m-progress-fill" style={{ width: `${m.score}%` }}></div>
              </div>
              <span className="m-score-tag">{m.score}%</span>
            </div>
          ))}
        </section>

        <section className="recommendations-view">
          <h3>Próximos Passos Recomendados</h3>
          <div className="rec-list">
            {recommendations.map(r => (
              <div key={r.title} className="rec-item glass">
                <div className="rec-status-col">
                  <CheckCircle2 size={24} color="#3b82f6" />
                </div>
                <div className="rec-content-col">
                  <h4>{r.title}</h4>
                  <p>{r.desc}</p>
                </div>
                <div className="rec-action-col">
                  <span className={`status-badge ${r.status.toLowerCase()}`}>{r.status}</span>
                  <button className="btn-rec">Ver Plano</button>
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
};

export default DiagnosisView;
