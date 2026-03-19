import React, { useState, useEffect } from 'react';
import { MessageSquare, Check, X, CornerDownRight, Search, Filter, Clock } from 'lucide-react';
import { supabase } from '../../../lib/supabase';
import './AdminComments.css';

const AdminComments = () => {
  const [comments, setComments] = useState([]);
  const [filter, setFilter] = useState('pending'); // all, pending, approved
  const [replyingTo, setReplyingTo] = useState(null);
  const [replyText, setReplyText] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchComments();
  }, []);

  const fetchComments = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('lesson_comments')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      
      // format to match local structure
      if (data) {
        const formatted = data.map(c => ({
          id: c.id,
          studentName: c.student_name,
          studentAvatar: c.student_avatar || c.student_name.slice(0, 2).toUpperCase(),
          lessonName: c.lesson_id,
          content: c.content,
          date: new Date(c.created_at).toLocaleDateString('pt-BR'),
          status: c.status,
          reply: c.reply_content
        }));
        setComments(formatted);
      }
    } catch (err) {
      console.error('Erro ao buscar comentários do Supabase:', err);
    } finally {
      setLoading(false);
    }
  };

  const filteredComments = comments.filter(c => {
    if (filter === 'all') return true;
    return c.status === filter || (filter === 'approved' && c.status === 'replied'); 
  });

  const handleApprove = async (id) => {
    setComments(comments.map(c => c.id === id ? { ...c, status: 'approved' } : c));
    try {
      await supabase.from('lesson_comments').update({ status: 'approved' }).eq('id', id);
    } catch (err) {
      console.error('Erro ao aprovar comentário:', err);
    }
  };

  const handleReject = async (id) => {
    setComments(comments.filter(c => c.id !== id));
    try {
       await supabase.from('lesson_comments').delete().eq('id', id);
    } catch (err) {
       console.error('Erro ao rejeitar/deletar comentário:', err);
    }
  };

  const submitReply = async (id) => {
    if (!replyText.trim()) return;
    const text = replyText;
    setComments(comments.map(c => c.id === id ? { ...c, status: 'replied', reply: text } : c));
    setReplyingTo(null);
    setReplyText('');
    
    try {
      await supabase.from('lesson_comments').update({ status: 'replied', reply_content: text }).eq('id', id);
    } catch (err) {
      console.error('Erro ao responder comentário:', err);
    }
  };

  return (
    <div className="admin-comments-central animate-fade-in">
      <div className="admin-header-row section-header">
        <div>
          <h2>Central de Comentários</h2>
          <p className="text-muted">Aprove, rejeite e responda às dúvidas e interações dos alunos nas aulas.</p>
        </div>
        
        <div className="comments-search-bar glass">
           <Search size={18} color="#666" />
           <input type="text" placeholder="Buscar aluno ou comentário..." />
        </div>
      </div>

      <div className="comments-dashboard-controls">
        <div className="filter-group glass">
           <button className={`filter-btn ${filter === 'pending' ? 'active' : ''}`} onClick={() => setFilter('pending')}>
             <Clock size={16} /> Pendentes
           </button>
           <button className={`filter-btn ${filter === 'approved' ? 'active' : ''}`} onClick={() => setFilter('approved')}>
             <Check size={16} /> Aprovados / Respondidos
           </button>
           <button className={`filter-btn ${filter === 'all' ? 'active' : ''}`} onClick={() => setFilter('all')}>
             <Filter size={16} /> Todos
           </button>
        </div>
      </div>

      <div className="comments-list-container">
        {filteredComments.map(comment => (
          <div key={comment.id} className="admin-comment-card glass">
             <div className="acc-header">
               <div className="acc-user">
                 <div className="acc-avatar">{comment.studentAvatar}</div>
                 <div className="acc-info">
                   <h4>{comment.studentName}</h4>
                   <span className="acc-lesson">{comment.lessonName} • {comment.date}</span>
                 </div>
               </div>
               <div className="acc-status">
                 {comment.status === 'pending' && <span className="badge-pending">Pendente</span>}
                 {(comment.status === 'approved' || comment.status === 'replied') && <span className="badge-approved">Publicado</span>}
               </div>
             </div>
             
             <div className="acc-body">
               <p>{comment.content}</p>
             </div>

             {comment.reply && (
               <div className="acc-reply-box">
                 <div className="reply-indicator"><CornerDownRight size={16} /></div>
                 <div className="reply-content">
                   <strong>Sua Resposta:</strong>
                   <p>{comment.reply}</p>
                 </div>
               </div>
             )}

             <div className="acc-actions">
                {comment.status === 'pending' && (
                  <button className="btn-approve" onClick={() => handleApprove(comment.id)}>
                    <Check size={16} /> Aprovar Publicação
                  </button>
                )}
                
                {replyingTo === comment.id ? (
                  <div className="inline-reply-editor">
                    <textarea 
                      autoFocus
                      placeholder="Escreva sua resposta para o aluno..."
                      value={replyText}
                      onChange={(e) => setReplyText(e.target.value)}
                    ></textarea>
                    <div className="inline-reply-actions">
                      <button className="btn-cancel-reply" onClick={() => setReplyingTo(null)}>Cancelar</button>
                      <button className="btn-submit-reply" onClick={() => submitReply(comment.id)}>Enviar Resposta</button>
                    </div>
                  </div>
                ) : (
                  <button className="btn-reply" onClick={() => setReplyingTo(comment.id)}>
                    <CornerDownRight size={16} /> Responder
                  </button>
                )}
                
                <button className="btn-reject" onClick={() => handleReject(comment.id)}>
                  <X size={16} /> Rejeitar/Apagar
                </button>
             </div>
          </div>
        ))}

        {filteredComments.length === 0 && (
          <div className="empty-comments-state glass">
             <MessageSquare size={48} color="#333" />
             <h3>Nenhum comentário encontrado</h3>
             <p>A central está limpa no momento.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminComments;
