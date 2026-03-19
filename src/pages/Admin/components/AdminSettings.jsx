import React, { useState } from 'react';
import { Save, Link as LinkIcon, AlertCircle } from 'lucide-react';

const AdminSettings = () => {
  const [webhookUrl, setWebhookUrl] = useState(() => localStorage.getItem('n8nWebhookUrl') || 'https://n8n.seuservidor.com/webhook/diagnostico');
  const [isSaved, setIsSaved] = useState(false);

  const handleSave = () => {
    localStorage.setItem('n8nWebhookUrl', webhookUrl);
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 3000);
  };

  return (
    <div className="animate-fade-in" style={{ maxWidth: '700px', margin: '0 auto', position: 'relative', zIndex: 1 }}>
      <div className="admin-page-header">
        <div>
          <h1>Configurações do Sistema</h1>
          <p>Gerencie as integrações técnicas da plataforma</p>
        </div>
      </div>

      <div className="admin-card" style={{ padding: '3rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem', color: '#3b82f6' }}>
          <LinkIcon size={28} />
          <h2 style={{ margin: 0, fontSize: '1.5rem', color: 'var(--text-primary)', fontFamily: 'Outfit, sans-serif' }}>Integração N8N (Webhook)</h2>
        </div>
        
        <p style={{ color: 'var(--text-secondary)', marginBottom: '2.5rem', fontSize: '1.05rem', lineHeight: '1.6' }}>
          Configure a URL do Webhook do seu N8N. Quando um lead preencher o formulário de diagnóstico, 
          todos os dados serão enviados via POST para esta URL, permitindo que o N8N gere o PDF com IA e envie por e-mail.
        </p>

        <div className="admin-input-group">
          <label>URL Dinâmica do Webhook (N8N)</label>
          <input 
            type="url" 
            className="admin-input" 
            placeholder="https://n8n.seu-dominio.com.br/webhook/..." 
            value={webhookUrl}
            onChange={(e) => setWebhookUrl(e.target.value)}
            style={{ fontSize: '1.1rem' }}
          />
        </div>

        <div style={{ 
          background: 'rgba(59, 130, 246, 0.05)', 
          border: '1px solid rgba(59, 130, 246, 0.2)', 
          padding: '1.5rem', 
          borderRadius: '12px',
          display: 'flex',
          gap: '1rem',
          alignItems: 'flex-start',
          marginTop: '2.5rem',
          marginBottom: '2.5rem'
        }}>
          <AlertCircle size={24} style={{ color: '#3b82f6', flexShrink: 0, marginTop: '2px' }} />
          <p style={{ margin: 0, color: 'var(--text-secondary)', fontSize: '0.95rem', lineHeight: '1.6' }}>
            <strong style={{ color: '#3b82f6' }}>Importante:</strong> Certifique-se de que o seu workflow no N8N está ativo (Production URL) 
            e configurado para receber requisições do tipo POST.
          </p>
        </div>

        <button 
          className="admin-btn-primary" 
          style={{ width: '100%', justifyContent: 'center', padding: '1.2rem', fontSize: '1.1rem' }}
          onClick={handleSave}
        >
          {isSaved ? 'Configurações Salvas!' : (
            <>
              <Save size={20} />
              Salvar Configurações
            </>
          )}
        </button>
      </div>
    </div>
  );
};

export default AdminSettings;
