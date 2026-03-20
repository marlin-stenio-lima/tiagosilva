import React, { useState, useEffect } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { ChevronLeft, ChevronRight, Star, Check, CheckCheck, Circle, Layout, RotateCcw, Play, MessageSquare, Send, HelpCircle, Volume2, Maximize, ChevronDown, Plus, Info, FileText, Loader2 } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import './LessonView.css';

const LessonView = () => {
  const { lessonId } = useParams();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('sobre');
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [isCompleted, setIsCompleted] = useState(false);
  
  const [lesson, setLesson] = useState(null);
  const [moduleLessons, setModuleLessons] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const [commentText, setCommentText] = useState('');
  const [commentsList, setCommentsList] = useState([]);
  const [isSubmittingComment, setIsSubmittingComment] = useState(false);

  useEffect(() => {
    if (lessonId) {
      fetchLessonDetails();
      fetchApprovedComments();
    }
  }, [lessonId]);

  const fetchLessonDetails = async () => {
    setLoading(true);
    try {
      const { data: lessonData, error } = await supabase
        .from('lessons')
        .select(`
          *,
          module:course_modules(*)
        `)
        .eq('id', lessonId)
        .single();

      if (error) throw error;
      setLesson(lessonData);

      // Fetch other lessons in the same module
      const { data: siblingLessons } = await supabase
        .from('lessons')
        .select('*')
        .eq('module_id', lessonData.module_id)
        .order('order_index', { ascending: true });

      setModuleLessons(siblingLessons || []);

      // Check if completed
      const { data: progress } = await supabase
        .from('lesson_progress')
        .select('*')
        .eq('lesson_id', lessonId)
        .eq('status', 'completed')
        .limit(1);
      
      setIsCompleted(progress && progress.length > 0);

    } catch (err) {
      console.error('Erro ao buscar detalhes da aula:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchApprovedComments = async () => {
    try {
      const { data, error } = await supabase
        .from('lesson_comments')
        .select('*')
        .eq('lesson_id', lessonId)
        .in('status', ['approved', 'replied'])
        .order('created_at', { ascending: false });

      if (data) {
        setCommentsList(data);
      }
    } catch (err) {
      console.error('Erro ao buscar comentários da aula:', err);
    }
  };

  const handleLessonToggle = async () => {
    const newStatus = !isCompleted;
    setIsCompleted(newStatus);

    try {
      if (newStatus) {
        await supabase.from('lesson_progress').insert([
          { lesson_id: lessonId, status: 'completed' }
        ]);
      } else {
        await supabase.from('lesson_progress').delete()
          .eq('lesson_id', lessonId);
      }
    } catch (err) {
      console.error('Erro ao atualizar progresso:', err);
    }
  };

  const handleSendComment = async () => {
    if (!commentText.trim()) return;
    setIsSubmittingComment(true);

    const newCommentPayload = {
      lesson_id: lessonId,
      student_name: 'Usuário Teste',
      student_avatar: 'UT',
      content: commentText,
      status: 'pending'
    };

    try {
      const { error } = await supabase.from('lesson_comments').insert([newCommentPayload]);
      if (error) throw error;
      
      setCommentsList([ { ...newCommentPayload, id: Date.now(), created_at: new Date().toISOString() }, ...commentsList ]);
      setCommentText('');
    } catch (err) {
      console.error('Erro ao postar comentário:', err);
      alert('Erro ao enviar o comentário.');
    } finally {
      setIsSubmittingComment(false);
    }
  };

  if (loading) {
    return (
      <div className="loading-container-full">
        <Loader2 className="animate-spin" size={48} color="#3b82f6" />
        <p>Preparando sua aula...</p>
      </div>
    );
  }

  if (!lesson) {
    return (
      <div className="error-container-full">
        <h3>Aula não encontrada</h3>
        <Link to="/courses" className="btn-primary">Voltar aos Cursos</Link>
      </div>
    );
  }

  const currentIndex = moduleLessons.findIndex(l => l.id === lessonId);
  const prevLesson = currentIndex > 0 ? moduleLessons[currentIndex - 1] : null;
  const nextLesson = currentIndex < moduleLessons.length - 1 ? moduleLessons[currentIndex + 1] : null;

  return (
    <div className="classroom-wrapper">
      <header className="classroom-top-bar refactored-top">
        <div className="top-left">
          <Link to="/courses" className="back-portal-link">
             <ChevronLeft size={16} />
             Voltar para o Portal
          </Link>
        </div>

        <div className="top-center-unified">
           <div className="star-rating">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star 
                  key={star} 
                  size={18} 
                  color={(hoverRating || rating) >= star ? '#facc15' : '#555'}
                  fill={(hoverRating || rating) >= star ? '#facc15' : 'transparent'}
                  onMouseEnter={() => setHoverRating(star)}
                  onMouseLeave={() => setHoverRating(0)}
                  onClick={() => setRating(star)}
                />
              ))}
           </div>
           
           <button 
             className={`btn-aula-concluida ${isCompleted ? 'active' : ''}`}
             onClick={handleLessonToggle}
           >
             <Check size={16} /> {isCompleted ? 'Aula concluída' : 'Marcar concluída'}
           </button>
           
           <div className="nav-arrows">
             <button 
               className="nav-text-btn" 
               disabled={!prevLesson}
               onClick={() => navigate(`/lesson/${prevLesson.id}`)}
             >
               <ChevronLeft size={16} /> Anterior
             </button>
             <button 
               className="nav-text-btn"
               disabled={!nextLesson}
               onClick={() => navigate(`/lesson/${nextLesson.id}`)}
             >
               Próximo <ChevronRight size={16} />
             </button>
           </div>
        </div>

        <div className="top-right">
           <button className="btn-ver-modulos">
             <Layout size={16} /> {lesson.module?.name || 'Módulo'}
           </button>
        </div>
      </header>

      <main className="classroom-layout">
        <div className="main-content-area">
          <div className="video-container-wrapper">
            <div className="video-player-professional glass">
              {lesson.video_url ? (
                <iframe 
                  src={lesson.video_url.includes('preview') ? lesson.video_url : `${lesson.video_url}?autoplay=0`}
                  className="lesson-iframe"
                  allowFullScreen
                  title={lesson.title}
                ></iframe>
              ) : (
                <div className="no-video-placeholder">
                  <Play size={48} color="#333" />
                  <p>Vídeo não disponível</p>
                </div>
              )}
            </div>
          </div>

          <div className="lesson-tabs-nav">
             <button 
               className={`tab-btn ${activeTab === 'sobre' ? 'active' : ''}`}
               onClick={() => setActiveTab('sobre')}
             >
               <Info size={16} /> Sobre a aula
             </button>
             <button 
               className={`tab-btn ${activeTab === 'anotacoes' ? 'active' : ''}`}
               onClick={() => setActiveTab('anotacoes')}
             >
               <FileText size={16} /> Anotações
             </button>
          </div>

          <div className="tab-container-content animate-fade-in">
            {activeTab === 'sobre' ? (
              <section className="about-lesson-section">
                <h2 className="lesson-main-title">{lesson.title}</h2>
                <div className="lesson-description-text">
                  <p>{lesson.description || 'Nenhuma descrição fornecida para esta aula.'}</p>
                </div>
              </section>
            ) : (
              <section className="notes-tab-section">
                <div className="empty-notes-area">
                  <button className="btn-big-note">
                    <Plus size={24} />
                    <span>Crie uma nova anotação</span>
                  </button>
                </div>
              </section>
            )}
          </div>

          <section className="unified-comments-container glass animate-fade-in">
             <h3 className="comments-unified-title">Deixe abaixo seu comentário</h3>
             
             <div className="unified-editor-area">
               <div className="editor-avatar">UT</div>
               <div className="editor-input-wrapper">
                 <textarea 
                   placeholder="Escreva seu comentário aqui..."
                   value={commentText}
                   onChange={(e) => setCommentText(e.target.value)}
                   disabled={isSubmittingComment}
                 ></textarea>
                 <button className="btn-send-icon" onClick={handleSendComment} disabled={isSubmittingComment}>
                   <Send size={18} />
                 </button>
               </div>
             </div>
             
             <div className="unified-comments-list">
               {commentsList.length === 0 && <p style={{color: 'var(--text-muted)', textAlign: 'center'}}>Nenhum comentário nesta aula ainda. Seja o primeiro!</p>}
               {commentsList.map(comment => (
                 <div key={comment.id} className="unified-comment-item">
                   <div className="comment-avatar">{comment.student_avatar || comment.student_name.substring(0, 2).toUpperCase()}</div>
                   <div className="comment-content-wrapper">
                     <div className="comment-header-row">
                       <div className="ch-left">
                         <h4>{comment.student_name}</h4>
                         <span className="comment-time">
                           {comment.created_at ? new Date(comment.created_at).toLocaleDateString('pt-BR') : 'agora'}
                         </span>
                       </div>
                       {comment.status === 'pending' && (
                         <div className="ch-right">
                           <span className="status-badge-pending">Pendente de Revisão</span>
                         </div>
                       )}
                     </div>
                     <div className="comment-text">
                       <p>{comment.content}</p>
                     </div>
                     
                     {comment.reply_content && (
                       <div className="comment-text" style={{ marginTop: '10px', padding: '10px', background: 'rgba(59, 130, 246, 0.1)', borderRadius: '8px', borderLeft: '2px solid #3b82f6' }}>
                         <p style={{ margin: 0, fontSize: '0.85rem', color: '#3b82f6', fontWeight: 600 }}>Resposta do Administrador:</p>
                         <p style={{ margin: '5px 0 0 0' }}>{comment.reply_content}</p>
                       </div>
                     )}
                     
                     <div className="comment-actions-row">
                        <button className="btn-reply-text"><MessageSquare size={14} /> Responder</button>
                     </div>
                   </div>
                 </div>
               ))}
             </div>
          </section>
        </div>

        <aside className="classroom-sidebar">
          <div className="sidebar-progress-header">
            <div className="circular-progress">
              <svg viewBox="0 0 36 36" className="circular-chart">
                <path className="circle-bg" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
                <path className="circle" strokeDasharray="56, 100" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
                <text x="18" y="20.35" className="percentage">56%</text>
              </svg>
            </div>
            <div className="progress-text">
               <h4>{lesson.module?.name || 'Aulas'}</h4>
               <ChevronDown size={18} color="#666" />
            </div>
          </div>

          <div className="sidebar-actions-top">
             <button className="btn-sidebar-action"><Plus size={16} /> Baixar Material</button>
          </div>

          <div className="lesson-list-scroll">
             {moduleLessons.map((l, idx) => (
                <div 
                  key={l.id} 
                  className={`lesson-list-item ${l.id === lessonId ? 'active' : ''}`}
                  onClick={() => navigate(`/lesson/${l.id}`)}
                >
                  <span className="lesson-check">
                     {l.id === lessonId ? <Play size={14} color="#3b82f6" /> : <Circle size={14} color="#666" />}
                  </span>
                  <span className="lesson-title-text">{String(idx + 1).padStart(2, '0')}. {l.title}</span>
                </div>
             ))}
          </div>

        </aside>
      </main>
    </div>
  );
};

export default LessonView;
