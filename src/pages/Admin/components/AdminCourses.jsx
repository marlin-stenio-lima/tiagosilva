import React, { useState, useEffect } from 'react';
import { supabase } from '../../../lib/supabase';
import { Plus, Video, Layout, List, Edit2, Trash2, ArrowLeft, PlayCircle } from 'lucide-react';
import './AdminCourses.css';

const AdminCourses = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Navigation State
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [modules, setModules] = useState([]);
  const [lessons, setLessons] = useState({}); // { moduleId: [lessons] }

  // Modal States
  const [courseModalOpen, setCourseModalOpen] = useState(false);
  const [moduleModalOpen, setModuleModalOpen] = useState(false);
  const [lessonModalOpen, setLessonModalOpen] = useState(false);
  
  const [formData, setFormData] = useState({});
  const [activeModuleId, setActiveModuleId] = useState(null); // Para saber onde adicionar a aula

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase.from('courses').select('*').order('created_at', { ascending: false });
      if (error) throw error;
      setCourses(data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenCourse = async (course) => {
    setSelectedCourse(course);
    fetchModulesAndLessons(course.id);
  };

  const fetchModulesAndLessons = async (courseId) => {
    try {
      const { data: mods, error: modErr } = await supabase.from('course_modules').select('*').eq('course_id', courseId).order('order_index', { ascending: true });
      if (modErr) throw modErr;
      setModules(mods || []);

      const { data: less, error: lessErr } = await supabase.from('lessons').select('*').in('module_id', (mods || []).map(m => m.id)).order('order_index', { ascending: true });
      if (lessErr) throw lessErr;

      const groupedLessons = {};
      (less || []).forEach(l => {
         if (!groupedLessons[l.module_id]) groupedLessons[l.module_id] = [];
         groupedLessons[l.module_id].push(l);
      });
      setLessons(groupedLessons);

    } catch (err) {
       console.error(err);
    }
  };

  // --- CRUD Handlers ---
  const handleCreateCourse = async (e) => {
    e.preventDefault();
    try {
      const { data, error } = await supabase.from('courses').insert([{ title: formData.title, description: formData.description, is_published: true }]).select();
      if (error) throw error;
      setCourses([data[0], ...courses]);
      setCourseModalOpen(false);
      setFormData({});
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteCourse = async (id, e) => {
    e.stopPropagation();
    if (!window.confirm('Tem certeza? Isso apagará todas as aulas.')) return;
    try {
      await supabase.from('courses').delete().eq('id', id);
      setCourses(courses.filter(c => c.id !== id));
    } catch (err) {
      console.error(err);
    }
  };

  const handleCreateModule = async (e) => {
    e.preventDefault();
    try {
      const { data, error } = await supabase.from('course_modules').insert([{ course_id: selectedCourse.id, title: formData.moduleTitle, order_index: modules.length }]).select();
      if (error) throw error;
      setModules([...modules, data[0]]);
      setModuleModalOpen(false);
      setFormData({});
    } catch (err) {
      console.error(err);
    }
  };

  const handleCreateLesson = async (e) => {
    e.preventDefault();
    try {
      const currentModLessons = lessons[activeModuleId] || [];
      const { data, error } = await supabase.from('lessons').insert([{ 
        module_id: activeModuleId, 
        title: formData.lessonTitle, 
        description: formData.lessonDesc,
        video_url: formData.lessonVideo,
        order_index: currentModLessons.length
      }]).select();
      
      if (error) throw error;
      
      setLessons({
        ...lessons,
        [activeModuleId]: [...currentModLessons, data[0]]
      });
      setLessonModalOpen(false);
      setFormData({});
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteLesson = async (lessonId, moduleId) => {
    if(!window.confirm('Excluir aula?')) return;
    try {
      await supabase.from('lessons').delete().eq('id', lessonId);
      setLessons({
        ...lessons,
        [moduleId]: lessons[moduleId].filter(l => l.id !== lessonId)
      });
    } catch (err) {
      console.error(err);
    }
  };

  // --- Renderers ---
  if (selectedCourse) {
    return (
      <div className="admin-courses-hub course-detail-view" style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
        <div className="admin-page-header section-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
            <button className="icon-btn" onClick={() => setSelectedCourse(null)}><ArrowLeft size={24} /></button>
            <div>
              <h2>{selectedCourse.title}</h2>
              <p className="text-muted">Gerencie os módulos e aulas deste curso.</p>
            </div>
          </div>
          <button className="admin-btn-primary" onClick={() => setModuleModalOpen(true)}>
            <Plus size={18} /> Novo Módulo
          </button>
        </div>

        <div style={{ flexGrow: 1, overflowY: 'auto', paddingBottom: '2rem' }}>
           {modules.length === 0 ? (
             <div className="empty-state glass">
                <List size={48} color="#444" style={{ marginBottom: '1rem' }} />
                <h3>Nenhum módulo criado</h3>
                <p className="text-muted">Crie seu primeiro módulo para começar a adicionar vídeo aulas.</p>
             </div>
           ) : (
             modules.map(mod => (
                <div key={mod.id} className="module-card">
                   <div className="module-header">
                      <h3>{mod.title}</h3>
                      <button className="icon-btn" style={{ color: '#3b82f6', background: 'rgba(59,130,246,0.1)' }} onClick={() => { setActiveModuleId(mod.id); setLessonModalOpen(true); }}>
                        <Plus size={16} style={{marginRight: '6px'}}/> Adicionar Aula
                      </button>
                   </div>
                   
                   <div className="lessons-list">
                      {(!lessons[mod.id] || lessons[mod.id].length === 0) ? (
                        <p style={{color: '#666', fontSize: '0.9rem', margin: 0}}>Nenhuma aula neste módulo ainda.</p>
                      ) : (
                        lessons[mod.id].map(lesson => (
                           <div key={lesson.id} className="lesson-item">
                              <div className="lesson-info">
                                 <PlayCircle size={18} color="#8b5cf6" />
                                 <h4>{lesson.title}</h4>
                              </div>
                              <div className="lesson-actions">
                                 <button className="icon-btn danger" onClick={() => handleDeleteLesson(lesson.id, mod.id)}><Trash2 size={16} /></button>
                              </div>
                           </div>
                        ))
                      )}
                   </div>
                </div>
             ))
           )}
        </div>

        {/* Modal: Add Module */}
        {moduleModalOpen && (
          <div className="admin-modal-overlay">
            <div className="admin-modal-content">
              <h3>Novo Módulo</h3>
              <form onSubmit={handleCreateModule}>
                <div className="admin-form-group">
                  <label>Título do Módulo</label>
                  <input required autoFocus placeholder="Ex: Módulo 1 - Fundamentos" value={formData.moduleTitle || ''} onChange={e => setFormData({...formData, moduleTitle: e.target.value})} />
                </div>
                <div className="admin-modal-actions">
                  <button type="button" className="btn-cancel" onClick={() => setModuleModalOpen(false)}>Cancelar</button>
                  <button type="submit" className="admin-btn-primary">Criar Módulo</button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Modal: Add Lesson */}
        {lessonModalOpen && (
          <div className="admin-modal-overlay">
            <div className="admin-modal-content">
              <h3>Adicionar Vídeo Aula</h3>
              <form onSubmit={handleCreateLesson}>
                <div className="admin-form-group">
                  <label>Título da Aula</label>
                  <input required autoFocus placeholder="Ex: Aula 01 - O que é IA" value={formData.lessonTitle || ''} onChange={e => setFormData({...formData, lessonTitle: e.target.value})} />
                </div>
                <div className="admin-form-group">
                  <label>URL do Vídeo (Link Youtube / Vimeo / Servidor)</label>
                  <input required placeholder="https://..." value={formData.lessonVideo || ''} onChange={e => setFormData({...formData, lessonVideo: e.target.value})} />
                </div>
                <div className="admin-form-group">
                  <label>Descrição Opcional</label>
                  <textarea placeholder="Resumo da aula..." value={formData.lessonDesc || ''} onChange={e => setFormData({...formData, lessonDesc: e.target.value})} />
                </div>
                <div className="admin-modal-actions">
                  <button type="button" className="btn-cancel" onClick={() => {setLessonModalOpen(false); setActiveModuleId(null);}}>Cancelar</button>
                  <button type="submit" className="admin-btn-primary">Salvar Aula</button>
                </div>
              </form>
            </div>
          </div>
        )}

      </div>
    );
  }

  return (
    <div className="admin-courses-hub animate-fade-in" style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <div className="admin-page-header section-header">
        <div>
          <h2>Central de Vídeo Aulas</h2>
          <p className="text-muted">Gerencie cursos, módulos e hospede as aulas diretamente na plataforma.</p>
        </div>
        <button className="admin-btn-primary" onClick={() => setCourseModalOpen(true)}>
          <Plus size={18} /> Novo Curso
        </button>
      </div>
      
      <div className="courses-grid" style={{ flexGrow: 1, overflowY: 'auto', paddingBottom: '2rem' }}>
        {loading ? (
          <p>Carregando cursos...</p>
        ) : courses.length === 0 ? (
          <div className="empty-state glass">
             <Video size={48} color="#444" style={{ marginBottom: '1rem' }} />
             <h3>Nenhum curso cadastrado</h3>
             <p className="text-muted">Crie seu primeiro curso para começar a organizar as vídeo aulas.</p>
          </div>
        ) : (
          courses.map(course => (
             <div key={course.id} className="course-card glass" onClick={() => handleOpenCourse(course)}>
                <h3>{course.title}</h3>
                <p>{course.description || 'Sem descrição'}</p>
                <div className="course-card-actions">
                   <button className="icon-btn danger" onClick={(e) => handleDeleteCourse(course.id, e)}><Trash2 size={16} /></button>
                </div>
             </div>
          ))
        )}
      </div>

      {/* Modal: Add Course */}
      {courseModalOpen && (
        <div className="admin-modal-overlay">
          <div className="admin-modal-content animate-fade-in">
            <h3>Criar Novo Curso</h3>
            <form onSubmit={handleCreateCourse}>
              <div className="admin-form-group">
                <label>Nome do Curso</label>
                <input required autoFocus placeholder="Ex: Formação N8N Avançado" value={formData.title || ''} onChange={e => setFormData({...formData, title: e.target.value})} />
              </div>
              <div className="admin-form-group">
                <label>Descrição Curta</label>
                <textarea placeholder="Descreva sobre o que é o curso..." value={formData.description || ''} onChange={e => setFormData({...formData, description: e.target.value})} />
              </div>
              <div className="admin-modal-actions">
                <button type="button" className="btn-cancel" onClick={() => setCourseModalOpen(false)}>Cancelar</button>
                <button type="submit" className="admin-btn-primary">Criar Curso</button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};

export default AdminCourses;
