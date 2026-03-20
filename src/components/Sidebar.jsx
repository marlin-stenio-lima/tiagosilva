import React from 'react';
import { NavLink } from 'react-router-dom';
import { Sparkles, Layout, Monitor, PenTool, BarChart2, MessageSquare, LogOut } from 'lucide-react';
import './Sidebar.css';

const Sidebar = () => {
  return (
    <aside className="sidebar">
      <div className="sidebar-brand">
        <div className="logo">
          <Sparkles className="logo-icon" color="#3b82f6" />
          <span>Thiago Silva <strong>IA</strong></span>
        </div>
      </div>

      <div className="sidebar-user">
        <div className="user-avatar">
          <img src="https://ui-avatars.com/api/?name=Thiago+Silva&background=0D8ABC&color=fff" alt="Thiago Silva" />
        </div>
        <div className="user-info">
          <span className="user-name">Thiago Silva</span>
          <span className="user-badge">PRO EDITION</span>
        </div>
      </div>

      <nav className="sidebar-nav">
        <ul>
          <li>
            <NavLink to="/dashboard" className={({ isActive }) => isActive ? 'active' : ''}>
              <Layout size={20} />
              Início
            </NavLink>
          </li>
          <li>
            <NavLink to="/courses" className={({ isActive }) => isActive ? 'active' : ''}>
              <Monitor size={20} />
              Cursos
            </NavLink>
          </li>
          <li>
            <NavLink to="/tools" className={({ isActive }) => isActive ? 'active' : ''}>
              <PenTool size={20} />
              Ferramentas
            </NavLink>
          </li>
        </ul>
      </nav>

      <div className="sidebar-footer">
        <NavLink to="/login" className="logout-btn">
          <LogOut size={20} />
          Sair
        </NavLink>
      </div>
    </aside>
  );
};

export default Sidebar;
