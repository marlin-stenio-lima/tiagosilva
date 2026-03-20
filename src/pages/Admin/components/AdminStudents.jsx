import React, { useState, useEffect } from 'react';
import { supabase } from '../../../lib/supabase';
import { Users, Search, Filter, ShieldAlert, X, Mail, Phone, Calendar, PlayCircle } from 'lucide-react';
import './AdminStudents.css';

const AdminStudents = () => {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newStudent, setNewStudent] = useState({ name: '', email: '', phone: '' });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchStudents();
  }, []);

  const fetchStudents = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('students')
        .select('*')
        .order('created_at', { ascending: false });
        
      if (error) throw error;
      if (data) setStudents(data);
    } catch (err) {
      console.error('Erro ao buscar alunos:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="admin-students-hub animate-fade-in" style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <div className="admin-page-header section-header">
        <div>
          <h2>Central de Alunos</h2>
          <p className="text-muted">Visualize a carteira completa de alunos, seus progressos e dados avançados.</p>
        </div>
        <div style={{ display: 'flex', gap: '15px' }}>
          <div className="search-bar glass" style={{ display: 'flex', alignItems: 'center', padding: '0.5rem 1rem', borderRadius: '50px', gap: '10px' }}>
             <Search size={18} color="#666" />
             <input type="text" placeholder="Buscar aluno por nome..." style={{ background: 'transparent', border: 'none', color: '#fff', outline: 'none' }} />
          </div>
          <button 
            className="btn-add-student" 
            onClick={() => setShowAddModal(true)}
            style={{ 
              background: 'linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%)',
              border: 'none',
              borderRadius: '50px',
              color: 'white',
              padding: '0.5rem 1.5rem',
              fontWeight: '600',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}
          >
            <Users size={18} /> Novo Aluno
          </button>
        </div>
      </div>
      
      <div className="students-table-container glass" style={{ padding: '1.5rem', borderRadius: '12px', flexGrow: 1, overflowY: 'auto' }}>
        {loading ? (
          <p>Carregando carteira de alunos...</p>
        ) : students.length === 0 ? (
          <div className="empty-state" style={{ textAlign: 'center', padding: '4rem 2rem' }}>
             <Users size={48} color="#444" style={{ marginBottom: '1rem' }} />
             <h3>Nenhum aluno cadastrado</h3>
             <p className="text-muted">Quando novos usuários acessarem a plataforma, eles aparecerão aqui automaticamente.</p>
          </div>
        ) : (
          <table className="students-table">
            <thead>
              <tr>
                <th>Nome do Aluno</th>
                <th>Email</th>
                <th>Data de Cadastro</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {students.map(student => (
                <tr key={student.id} className="student-row" onClick={() => setSelectedStudent(student)}>
                  <td>
                     <div className="student-name-cell">
                        <div className="student-avatar">
                          {student.avatar_url ? <img src={student.avatar_url} alt="" style={{width:'100%',height:'100%',borderRadius:'50%'}} /> : student.name.substring(0, 2).toUpperCase()}
                        </div>
                        <span style={{ fontWeight: 600 }}>{student.name}</span>
                     </div>
                  </td>
                  <td>{student.email}</td>
                  <td>{new Date(student.created_at).toLocaleDateString('pt-BR')}</td>
                  <td>
                    <span className={`status-badge ${student.status}`}>
                       {student.status.toUpperCase()}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Drawer: Perfil 360 do Aluno */}
      {selectedStudent && (
        <div className="student-drawer-overlay" onClick={() => setSelectedStudent(null)}>
          <div className="student-drawer-content" onClick={e => e.stopPropagation()}>
            <div className="drawer-header">
               <div className="drawer-profile">
                 <div className="drawer-avatar">
                   {selectedStudent.name.substring(0, 2).toUpperCase()}
                 </div>
                 <div className="drawer-info">
                   <h3>{selectedStudent.name}</h3>
                   <p><Mail size={14}/> {selectedStudent.email}</p>
                 </div>
               </div>
               <button className="btn-close-drawer" onClick={() => setSelectedStudent(null)}>
                 <X size={20} />
               </button>
            </div>
            
            <div className="drawer-body">
               <div className="drawer-section">
                  <h4><ShieldAlert size={18} color="#3b82f6"/> Visão Geral (CRM)</h4>
                  <div className="stat-grid">
                     <div className="stat-box">
                       <span className="stat-label">Aulas Assistidas</span>
                       <span className="stat-value">0</span>
                     </div>
                     <div className="stat-box">
                       <span className="stat-label">Comentários</span>
                       <span className="stat-value">0</span>
                     </div>
                  </div>
               </div>

               <div className="drawer-section">
                  <h4><Users size={18} color="#8b5cf6"/> Dados Cadastrais</h4>
                  <div className="contact-list">
                     <div className="contact-item">
                       <span>Data de Inscrição</span>
                       <span>{new Date(selectedStudent.created_at).toLocaleDateString('pt-BR')}</span>
                     </div>
                     <div className="contact-item">
                       <span>Status da Conta</span>
                       <span style={{color: selectedStudent.status==='active'?'#22c55e':'#ef4444'}}>{selectedStudent.status.toUpperCase()}</span>
                     </div>
                     <div className="contact-item">
                       <span>Telefone</span>
                       <span>{selectedStudent.phone || 'Não informado'}</span>
                     </div>
                  </div>
               </div>

               <div className="drawer-section">
                  <h4><PlayCircle size={18} color="#f59e0b"/> Progresso Recente</h4>
                  <p style={{color: '#888', fontSize: '0.9rem', textAlign: 'center', margin: '2rem 0'}}>
                    Nenhum curso iniciado ainda.
                  </p>
               </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal: Adicionar Novo Aluno */}
      {showAddModal && (
        <div className="admin-modal-overlay" onClick={() => setShowAddModal(false)}>
          <div className="admin-modal-content glass" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Cadastrar Novo Aluno</h3>
              <button className="btn-close" onClick={() => setShowAddModal(false)}><X size={20}/></button>
            </div>
            <form className="admin-form" onSubmit={async (e) => {
              e.preventDefault();
              setSaving(true);
              try {
                const { error } = await supabase.from('students').insert([newStudent]);
                if (error) throw error;
                setShowAddModal(false);
                setNewStudent({ name: '', email: '', phone: '' });
                fetchStudents();
              } catch (err) {
                alert('Erro ao cadastrar aluno: ' + err.message);
              } finally {
                setSaving(false);
              }
            }}>
              <div className="form-group">
                <label>Nome Completo</label>
                <input 
                  type="text" 
                  value={newStudent.name} 
                  onChange={e => setNewStudent({...newStudent, name: e.target.value})} 
                  required 
                />
              </div>
              <div className="form-group">
                <label>E-mail (Acesso)</label>
                <input 
                  type="email" 
                  value={newStudent.email} 
                  onChange={e => setNewStudent({...newStudent, email: e.target.value})} 
                  required 
                />
              </div>
              <div className="form-group">
                <label>WhatsApp / Telefone</label>
                <input 
                  type="text" 
                  value={newStudent.phone} 
                  onChange={e => setNewStudent({...newStudent, phone: e.target.value})} 
                />
              </div>
              <div className="modal-actions">
                <button type="button" className="btn-secondary" onClick={() => setShowAddModal(false)}>Cancelar</button>
                <button type="submit" className="btn-primary" disabled={saving}>
                  {saving ? 'Cadastrando...' : 'Salvar Aluno'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};

export default AdminStudents;
