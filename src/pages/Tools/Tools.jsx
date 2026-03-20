import React, { useState } from 'react';
import Sidebar from '../../components/Sidebar';
import { Search, ExternalLink, Star } from 'lucide-react';
import './Tools.css';

const Tools = () => {
  const [activeTab, setActiveTab] = useState('Tudo');

  const categories = ['Tudo', 'Produtividade', 'Design', 'Conteúdo', 'Análise'];

  const tools = [
    {
      id: 1,
      name: 'Auto-GPT Master',
      desc: 'Configuração completa de agentes autônomos para tarefas complexas.',
      cat: 'Produtividade',
      isFeatured: true
    },
    {
      id: 2,
      name: 'Claude 3 Opus Helper',
      desc: 'Prompt Engineering avançado para análise de grandes documentos.',
      cat: 'Análise',
      isFeatured: true
    },
    {
      id: 3,
      name: 'Midjourney Elite Guide',
      desc: 'Parâmetros ocultos para geração de imagens ultra-realistas.',
      cat: 'Design',
      isFeatured: false
    },
    {
      id: 4,
      name: 'Copywriting AI Engine',
      desc: 'Templates de prompts para VSL e páginas de alta conversão.',
      cat: 'Conteúdo',
      isFeatured: false
    }
  ];

  const filteredTools = activeTab === 'Tudo' 
    ? tools 
    : tools.filter(t => t.cat === activeTab);

  return (
    <div className="dashboard-container">
      <Sidebar />
      <main className="dashboard-content tools-page">
        <header className="content-header">
          <div className="breadcrumbs">
            <span>Área de Membros</span>
            <span className="separator">/</span>
            <span className="current">Ferramentas</span>
          </div>
          <h1>Arsenal de Elite</h1>
        </header>

        <section className="featured-tools-section">
          <div className="section-title">
            <Star size={18} color="#3b82f6" fill="#3b82f6" />
            <h3>Top 1% Picks</h3>
          </div>
          <div className="featured-grid">
            {tools.filter(t => t.isFeatured).map(t => (
              <div key={t.id} className="featured-card-tool glass gold-border">
                <div className="tool-header">
                  <h4>{t.name}</h4>
                  <span className="tag-gold">FAVORITO</span>
                </div>
                <p>{t.desc}</p>
                <button className="btn-tool-primary">
                  Acessar Ferramenta <ExternalLink size={14} />
                </button>
              </div>
            ))}
          </div>
        </section>

      </main>
    </div>
  );
};

export default Tools;
