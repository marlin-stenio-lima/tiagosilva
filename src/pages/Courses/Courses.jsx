import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../../components/Sidebar';
import { Search, Play, CheckCircle, Sparkles, Layout } from 'lucide-react';
import './Courses.css';

const Courses = () => {
  const navigate = useNavigate();
  const [activeCategory, setActiveCategory] = useState('Tudo');

  const categories = ['Tudo', 'Estratégia de IA', 'Prompt Engineering', 'Automação', 'Valuation & IA'];

  const modules = [
    {
      id: 1,
      title: 'N8N',
      subtitle: 'Agentes de IA',
      category: 'Automação',
      icon: <Sparkles size={20} />
    },
    {
      id: 2,
      title: 'RAG',
      subtitle: 'Banco de dados',
      category: 'Estratégia de IA',
      icon: <Sparkles size={20} />
    },
    {
      id: 3,
      title: 'Vendas',
      subtitle: 'Processo comercial',
      category: 'Estratégia de IA',
      icon: <Sparkles size={20} />
    },
    {
      id: 4,
      title: 'Vibe Coding',
      subtitle: 'Criação de ferramentas',
      category: 'Prompt Engineering',
      icon: <Sparkles size={20} />
    },
    {
      id: 5,
      title: 'Chatwoot',
      subtitle: 'Atendimento IA',
      category: 'Automação',
      icon: <Sparkles size={20} />
    },
    {
      id: 6,
      title: 'Business IA',
      subtitle: 'com Pedro Goiozo',
      category: 'Valuation & IA',
      icon: <Sparkles size={20} />
    }
  ];

  const filteredModules = activeCategory === 'Tudo' 
    ? modules 
    : modules.filter(m => m.category === activeCategory);

  return (
    <div className="dashboard-container">
      <Sidebar />
      <main className="dashboard-content courses-page">
        <header className="content-header">
          <div className="breadcrumbs">
            <span>Área de Membros</span>
            <span className="separator">/</span>
            <span className="current">Cursos</span>
          </div>
          <div className="header-title-row">
            <h1>Todos os Módulos</h1>
            <div className="view-controls">
               <button className="view-btn active"><Layout size={18} /></button>
               <button className="view-btn"><Layout size={18} style={{transform: 'rotate(90deg)'}} /></button>
            </div>
          </div>
        </header>

        <section className="search-filter-section glass">
          <div className="filter-chips">
            {categories.map(cat => (
              <button 
                key={cat} 
                className={`chip ${activeCategory === cat ? 'active' : ''}`}
                onClick={() => setActiveCategory(cat)}
              >
                {cat}
              </button>
            ))}
          </div>
        </section>

        <section className="modules-vertical-grid animate-fade-in">
          {filteredModules.map(mod => (
            <div key={mod.id} className="module-card-vertical" onClick={() => navigate('/lesson')}>
              <div className="module-bg-overlay"></div>
              <div className="module-icon-top">
                {mod.icon}
              </div>
              <div className="module-content-center">
                <h2>{mod.title}</h2>
                <p>{mod.subtitle}</p>
              </div>
              <div className="module-footer-shine"></div>
            </div>
          ))}
        </section>
      </main>
    </div>
  );
};

export default Courses;
