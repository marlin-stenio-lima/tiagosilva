import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { supabase } from '../../lib/supabase';
import './Login.css';

const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleAuth = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // 1. Verificar se o e-mail existe na tabela students e não está bloqueado
      const { data: student, error: studentError } = await supabase
        .from('students')
        .select('status')
        .eq('email', email)
        .single();

      if (studentError || !student) {
        setError('Este e-mail não está cadastrado em nossa base de alunos.');
        setLoading(false);
        return;
      }

      if (student.status === 'blocked' || student.status === 'inactive') {
        setError('Seu acesso está temporariamente suspenso. Entre em contato com o suporte.');
        setLoading(false);
        return;
      }

      // 2. Tentar fazer o login oficial com o Supabase Auth
      const { error: authError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (authError) {
        if (authError.message === 'Invalid login credentials') {
          setError('Sua chave de segurança (senha) está incorreta.');
        } else {
          setError(authError.message);
        }
        setLoading(false);
        return;
      }

      // Sucesso!
      navigate('/dashboard');
    } catch (err) {
      setError('Ocorreu um erro inesperado. Tente novamente mais tarde.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-header">
        <div className="logo">
          {/* Nome e logo removidos conforme solicitado */}
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
            <input 
              type="email" 
              placeholder="seu@email.com" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="form-head">
            <label>CHAVE DE SEGURANÇA</label>
            <a href="#" className="forgot-link">ESQUECI SENHA</a>
          </div>
          <div className="input-group password-group">
            <input 
              type="password" 
              placeholder="••••••••" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <button className="view-password" type="button">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>
            </button>
          </div>

          {error && <div className="login-error-message">{error}</div>}

          <button 
            className={`auth-button ${loading ? 'loading' : ''}`} 
            onClick={handleAuth}
            disabled={loading}
          >
            {loading ? 'PROCESSANDO...' : 'ENTRAR'}
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4M10 17l5-5-5-5M13.8 12H3"></path></svg>
          </button>
        </div>
      </div>

      <div className="login-footer">
        SEM AUTORIZAÇÃO? <Link to="/">SOLICITAR DIAGNÓSTICO</Link>
      </div>
    </div>
  );
};

export default Login;
