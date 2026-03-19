import React, { useState } from 'react';
import { LayoutDashboard, Users, PenTool, Settings, LogOut, MessageSquare, BookOpen, GraduationCap } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import AdminCRM from './components/AdminCRM';
import AdminFormBuilder from './components/AdminFormBuilder';
import AdminSettings from './components/AdminSettings';
import AdminComments from './components/AdminComments';
import AdminCourses from './components/AdminCourses';
import AdminStudents from './components/AdminStudents';
import './Admin.css';

const Admin = () => {
  const [activeTab, setActiveTab] = useState('crm');
  const navigate = useNavigate();

  const renderContent = () => {
    switch (activeTab) {
      case 'crm':
        return <AdminCRM />;
      case 'form_builder':
        return <AdminFormBuilder />;
      case 'settings':
        return <AdminSettings />;
      case 'comments':
        return <AdminComments />;
      case 'courses':
        return <AdminCourses />;
      case 'students':
        return <AdminStudents />;
      default:
        return <AdminCRM />;
    }
  };

  return (
    <div className="admin-container">
      {/* Sidebar */}
      <aside className="admin-sidebar glass">
        <div className="admin-sidebar-header">
          <h2 className="text-gradient">Thiago IA</h2>
          <span className="admin-badge">Admin Panel</span>
        </div>

        <nav className="admin-nav">
          <button 
            className={`admin-nav-item ${activeTab === 'crm' ? 'active' : ''}`}
            onClick={() => setActiveTab('crm')}
          >
            <Users size={20} />
            CRM Pipeline
          </button>
          
          <button 
            className={`admin-nav-item ${activeTab === 'students' ? 'active' : ''}`}
            onClick={() => setActiveTab('students')}
          >
            <GraduationCap size={20} />
            Central de Alunos
          </button>

          <button 
            className={`admin-nav-item ${activeTab === 'courses' ? 'active' : ''}`}
            onClick={() => setActiveTab('courses')}
          >
            <BookOpen size={20} />
            Vídeo Aulas (LMS)
          </button>
          
          <button 
            className={`admin-nav-item ${activeTab === 'form_builder' ? 'active' : ''}`}
            onClick={() => setActiveTab('form_builder')}
          >
            <PenTool size={20} />
            Construtor de Diagnóstico
          </button>
          
          <button 
            className={`admin-nav-item ${activeTab === 'comments' ? 'active' : ''}`}
            onClick={() => setActiveTab('comments')}
          >
            <MessageSquare size={20} />
            Central de Comentários
          </button>
          
          <button 
            className={`admin-nav-item ${activeTab === 'settings' ? 'active' : ''}`}
            onClick={() => setActiveTab('settings')}
          >
            <Settings size={20} />
            Configurações
          </button>
        </nav>

        <div className="admin-sidebar-footer">
          <button className="admin-nav-item logout" onClick={() => navigate('/dashboard')}>
            <LogOut size={20} />
            Sair do Admin
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="admin-content-area">
        {renderContent()}
      </main>
    </div>
  );
};

export default Admin;
