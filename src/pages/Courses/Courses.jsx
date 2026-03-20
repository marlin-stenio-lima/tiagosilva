import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../../components/Sidebar';
import { Search, Play, CheckCircle, Sparkles, Layout, Loader2 } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import './Courses.css';

const Courses = () => {
  const navigate = useNavigate();
  const [activeCategory, setActiveCategory] = useState('Tudo');
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  const categories = ['Tudo', 'Estratégia de IA', 'Prompt Engineering', 'Automação', 'Valuation & IA'];

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    try {
      const { data, error } = await supabase
        .from('courses')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setCourses(data || []);
    } catch (err) {
      console.error('Erro ao buscar cursos:', err);
    } finally {
      setLoading(false);
    }
  };

  const filteredModules = activeCategory === 'Tudo' 
    ? courses 
    : courses.filter(c => c.category === activeCategory);

  const handleCourseClick = async (courseId) => {
    // Busca a primeira aula desse curso para navegar
    try {
      const { data: modules } = await supabase
        .from('course_modules')
        .select('id')
        .eq('course_id', courseId)
        .order('order_index', { ascending: true })
        .limit(1);

      if (modules && modules.length > 0) {
        const { data: lessons } = await supabase
          .from('lessons')
          .select('id')
          .eq('module_id', modules[0].id)
          .order('order_index', { ascending: true })
          .limit(1);

        if (lessons && lessons.length > 0) {
          navigate(`/lesson/${lessons[0].id}`);
        } else {
          alert('Este curso ainda não possui aulas.');
        }
      } else {
        alert('Este curso ainda não possui módulos.');
      }
    } catch (err) {
      console.error('Erro ao buscar aulas do curso:', err);
    }
  };

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
        </header>

        <div className="header-title-row">
          <h1>Todos os Módulos</h1>
          <div className="view-controls">
             <button className="view-btn active"><Layout size={18} /></button>
             <button className="view-btn"><Layout size={18} style={{transform: 'rotate(90deg)'}} /></button>
          </div>
        </div>

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

        {loading ? (
          <div className="loading-state">
            <Loader2 className="animate-spin" size={48} color="#3b82f6" />
            <p>Carregando sua biblioteca...</p>
          </div>
        ) : (
          <section className="modules-vertical-grid animate-fade-in">
            {filteredModules.length === 0 ? (
              <div className="empty-state-courses">
                <Search size={48} color="#555" />
                <p>Nenhum módulo encontrado nesta categoria.</p>
              </div>
            ) : (
              filteredModules.map(c => (
                <div key={c.id} className="module-card-vertical" onClick={() => handleCourseClick(c.id)}>
                  <div className="module-bg-overlay"></div>
                  <div className="module-icon-top">
                    <Sparkles size={20} />
                  </div>
                  <div className="module-content-center">
                    <h2>{c.name}</h2>
                    <p>{c.description || 'Acesse o conteúdo deste treinamento'}</p>
                  </div>
                  <div className="module-footer-shine"></div>
                </div>
              ))
            )}
          </section>
        )}
      </main>
    </div>
  );
};

export default Courses;
