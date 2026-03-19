import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Login.css';

const Login = () => {
  const navigate = useNavigate();

  const handleAuth = (e) => {
    e.preventDefault();
    navigate('/dashboard');
  };

  return (
    <div className="login-container">
      <div className="login-header">
        <div className="logo">
          <img src="/logo.png" alt="Thiago Silva IA" className="logo-icon" />
          <span>Thiago Silva <strong>IA</strong></span>
        </div>
        <Link to="/" className="back-link">VOLTAR AO SITE</Link>
      </div>

      <div className="login-card animate-fade-in">
        <div className="login-visual-pane">
          <div className="visual-content">
            <div className="visual-icon">
              <div className="icon-shape"></div>
            </div>
            <h1>Inicie sua <br /> jornada <br /> <span>futurista</span></h1>
            <p>Sincronize sua produtividade com a inteligência artificial de próxima geração.</p>
          </div>
          <div className="visual-footer">
            <div className="status-badge">
              <span className="dot"></span>
              NUCLEUS AI ATIVO
            </div>
          </div>
        </div>

        <div className="login-form-pane">
          <div className="form-head">
            <label>ACESSO IDENTIFICADO</label>
          </div>
          <div className="input-group">
            <input type="email" placeholder="seu@email.com" />
          </div>

          <div className="form-head">
            <label>CHAVE DE SEGURANÇA</label>
            <a href="#" className="forgot-link">ESQUECI SENHA</a>
          </div>
          <div className="input-group password-group">
            <input type="password" placeholder="••••••••" />
            <button className="view-password">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>
            </button>
          </div>

          <button className="auth-button" onClick={handleAuth}>
            ENTRAR
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4M10 17l5-5-5-5M13.8 12H3"></path></svg>
          </button>


        </div>
      </div>

      <div className="login-footer">
        SEM AUTORIZAÇÃO? <a href="#">CONSULTAR THIAGO</a>
      </div>
    </div>
  );
};

export default Login;
