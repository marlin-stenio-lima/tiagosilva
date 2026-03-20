import React, { useState } from 'react';
import { X, ArrowRight, ArrowLeft, CheckCircle2 } from 'lucide-react';
import { supabase } from '../lib/supabase';

const questions = [
  {
    id: 'info',
    title: 'Qual é o seu nome e email corporativo?',
    type: 'inputs',
    fields: [
      { name: 'name', type: 'text', placeholder: 'Seu Nome Completo' },
      { name: 'email', type: 'email', placeholder: 'seu@empresa.com.br' }
    ]
  },
  {
    id: 'maturity',
    title: 'Qual o nível de automação atual da sua operação?',
    type: 'radio',
    options: [
      'Totalmente Manual (Zero IA)',
      'Iniciante (Usamos ChatGPT ocasionalmente)',
      'Intermediário (Alguns processos automatizados)',
      'Avançado (Cultura de dados e IA enraizada)'
    ]
  },
  {
    id: 'employees',
    title: 'Qual o tamanho atual da sua equipe?',
    type: 'radio',
    options: ['Solo / Autônomo', '1 a 10 colaboradores', '11 a 50 colaboradores', 'Mais de 50']
  },
  {
    id: 'focus',
    title: 'Qual o seu principal objetivo estratégico hoje?',
    type: 'radio',
    options: [
      'Aumentar Valuation / Preparar para Exit',
      'Dobrar Lucro sem aumentar time (Escala)',
      'Reduzir Erros e Operação Manual',
      'Criar um Produto com IA proprietária'
    ]
  },
  {
    id: 'urgency',
    title: 'Quão urgente é a aceleração desses resultados?',
    type: 'scale',
    min: 1,
    max: 5
  }
];

const DiagnosisModal = ({ isOpen, onClose }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  if (!isOpen) return null;

  const handleNext = () => {
    if (currentStep < questions.length - 1) {
      setCurrentStep(prev => prev + 1);
    } else {
      handleSubmit();
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
    }
  };

  const handleInputChange = (field, value) => {
    setAnswers(prev => ({
      ...prev,
      [questions[currentStep].id]: {
        ...prev[questions[currentStep].id],
        [field]: value
      }
    }));
  };

  const handleRadioChange = (value) => {
    setAnswers(prev => ({
      ...prev,
      [questions[currentStep].id]: value
    }));
  };

  const isCurrentStepValid = () => {
    const q = questions[currentStep];
    const answer = answers[q.id];
    
    if (q.type === 'inputs') {
      return answer?.name && answer?.email && answer.email.includes('@');
    }
    return answer !== undefined && answer !== '';
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    
    try {
      // Get Webhook URL from localStorage or use a fallback
      const webhookUrl = localStorage.getItem('n8nWebhookUrl') || 'https://hook.us1.make.com/mock-url-thiago-ia';
      
      const payload = {
        timestamp: new Date().toISOString(),
        leadData: answers
      };

      // Inserção real no Supabase (CRM Pipeline)
      const leadName = answers.info?.name || 'Lead Desconhecido';
      const leadEmail = answers.info?.email || 'N/A';
      const leadCompany = 'Não informado'; // Em uma v2 este campo poderia vir do formulário

      await supabase.from('crm_leads').insert([
        { 
          name: leadName,
          email: leadEmail,
          company: leadCompany,
          status: 'col-1' 
        }
      ]);

      // 💥 Fire-and-forget logic for Webhook N8N
      fetch(webhookUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      }).catch(err => console.log('Webhook call (ignoring for fire-and-forget):', err));

      setIsSuccess(true);
    } catch (e) {
      console.error('Erro ao salvar no Supabase:', e);
      // Mostra tela de sucesso para não bloquear fluxo do usuário final
      setIsSuccess(true); 
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderQuestion = (q) => {
    if (q.type === 'inputs') {
      return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {q.fields.map(f => (
            <input 
              key={f.name}
              type={f.type} 
              placeholder={f.placeholder}
              value={answers[q.id]?.[f.name] || ''}
              onChange={(e) => handleInputChange(f.name, e.target.value)}
              className="modal-input"
            />
          ))}
        </div>
      );
    }

    if (q.type === 'radio') {
      return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
          {q.options.map(opt => (
            <div 
              key={opt}
              className={`modal-radio-option ${answers[q.id] === opt ? 'selected' : ''}`}
              onClick={() => handleRadioChange(opt)}
            >
              <div className="radio-circle"></div>
              <span>{opt}</span>
            </div>
          ))}
        </div>
      );
    }

    if (q.type === 'scale') {
      return (
        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '1rem' }}>
          {[1,2,3,4,5].map(num => (
            <div 
              key={num}
              className={`modal-scale-btn ${answers[q.id] === num ? 'selected' : ''}`}
              onClick={() => handleRadioChange(num)}
            >
              {num}
            </div>
          ))}
        </div>
      );
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content glass">
        <button className="modal-close" onClick={onClose} disabled={isSubmitting}>
          <X size={24} />
        </button>

        {isSuccess ? (
          <div className="modal-success animate-fade-in">
            <CheckCircle2 size={64} style={{ color: '#3b82f6', marginBottom: '1.5rem' }} />
            <h2>Diagnóstico Recebido!</h2>
            <p>
              Obrigado pelas respostas. Nossa Inteligência Artificial já está analisando o seu negócio avançado de {answers.info?.name.split(' ')[0]}.
              <br/><br/>
              Em instantes, vamos enviar um <strong>Plano de Ação PDF</strong> direto para o seu email corporativo.
            </p>
            <button className="btn-primary" style={{ marginTop: '2rem', justifyContent: 'center' }} onClick={onClose}>
              Voltar ao Site
            </button>
          </div>
        ) : (
          <div className="modal-step-container animate-fade-in">
            <div className="modal-progress-bar">
              <div 
                className="modal-progress-fill" 
                style={{ width: `${((currentStep + 1) / questions.length) * 100}%` }}
              ></div>
            </div>
            
            <h3 style={{ fontSize: '1.5rem', marginBottom: '2rem', color: '#fff', paddingRight: '2rem' }}>
              {questions[currentStep].title}
            </h3>

            <div className="modal-body-form">
              {renderQuestion(questions[currentStep])}
            </div>

            <div className="modal-footer">
              <button 
                className="modal-btn-secondary" 
                onClick={handleBack}
                style={{ visibility: currentStep === 0 ? 'hidden' : 'visible' }}
                disabled={isSubmitting}
              >
                <ArrowLeft size={18} style={{ marginRight: '8px' }}/> Voltar
              </button>

              <button 
                className="modal-btn-primary"
                onClick={handleNext}
                disabled={!isCurrentStepValid() || isSubmitting}
              >
                {isSubmitting ? 'Processando...' : (currentStep === questions.length - 1 ? 'Finalizar e Enviar' : 'Próximo')} 
                {!isSubmitting && <ArrowRight size={18} style={{ marginLeft: '8px' }}/>}
              </button>
            </div>
          </div>
        )}
      </div>

      <style jsx>{`
        .modal-overlay {
          position: fixed;
          top: 0; left: 0; right: 0; bottom: 0;
          background: rgba(0,0,0,0.85);
          backdrop-filter: blur(8px);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 1000;
          padding: 1rem;
        }
        .modal-content {
          width: 100%;
          max-width: 600px;
          background: rgba(15, 18, 25, 0.95);
          border: 1px solid rgba(59, 130, 246, 0.3);
          border-radius: 20px;
          padding: 3rem;
          position: relative;
          box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.7);
        }
        .modal-close {
          position: absolute;
          top: 1.5rem;
          right: 1.5rem;
          background: transparent;
          color: var(--text-secondary);
          border: none;
          cursor: pointer;
          transition: all 0.2s;
        }
        .modal-close:hover {
          color: #3b82f6;
          transform: rotate(90deg);
        }
        .modal-progress-bar {
          height: 4px;
          background: rgba(255,255,255,0.1);
          border-radius: 2px;
          margin-bottom: 2rem;
          overflow: hidden;
        }
        .modal-progress-fill {
          height: 100%;
          background: #3b82f6;
          transition: width 0.3s ease;
        }
        .modal-input {
          width: 100%;
          padding: 1rem 1.2rem;
          background: rgba(0, 0, 0, 0.4);
          border: 1px solid rgba(59, 130, 246, 0.2);
          border-radius: 8px;
          color: #fff;
          font-size: 1.1rem;
          transition: all 0.2s;
        }
        .modal-input:focus {
          outline: none;
          border-color: #3b82f6;
          box-shadow: 0 0 15px rgba(59, 130, 246, 0.2);
        }
        .modal-radio-option {
          display: flex;
          align-items: center;
          padding: 1rem 1.2rem;
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 8px;
          cursor: pointer;
          transition: all 0.2s;
          color: #fff;
        }
        .modal-radio-option:hover {
          background: rgba(59, 130, 246, 0.05);
          border-color: rgba(59, 130, 246, 0.3);
        }
        .modal-radio-option.selected {
          border-color: #3b82f6;
          background: rgba(59, 130, 246, 0.1);
        }
        .radio-circle {
          width: 20px;
          height: 20px;
          border-radius: 50%;
          border: 2px solid rgba(255,255,255,0.2);
          margin-right: 1rem;
          position: relative;
        }
        .modal-radio-option.selected .radio-circle {
          border-color: #3b82f6;
        }
        .modal-radio-option.selected .radio-circle::after {
          content: '';
          position: absolute;
          top: 50%; left: 50%;
          transform: translate(-50%, -50%);
          width: 10px; height: 10px;
          background: #3b82f6;
          border-radius: 50%;
        }
        .modal-scale-btn {
          width: 50px;
          height: 50px;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 50%;
          border: 1px solid rgba(255,255,255,0.1);
          cursor: pointer;
          font-size: 1.2rem;
          font-weight: 600;
          transition: all 0.2s;
        }
        .modal-scale-btn:hover, .modal-scale-btn.selected {
          border-color: #3b82f6;
          background: rgba(59, 130, 246, 0.1);
          color: #3b82f6;
        }
        .modal-footer {
          display: flex;
          justify-content: space-between;
          margin-top: 3rem;
          padding-top: 2rem;
          border-top: 1px solid rgba(255,255,255,0.05);
        }
        .modal-btn-primary {
          background: linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%);
          color: #000;
          padding: 12px 24px;
          border-radius: 8px;
          font-weight: 700;
          display: flex;
          align-items: center;
          border: none;
          cursor: pointer;
        }
        .modal-btn-primary:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }
        .modal-btn-secondary {
          background: transparent;
          color: var(--text-secondary);
          border: none;
          display: flex;
          align-items: center;
          cursor: pointer;
          font-weight: 600;
        }
        .modal-btn-secondary:hover:not(:disabled) {
          color: #fff;
        }
        .modal-success {
          text-align: center;
        }
        .modal-success h2 {
          color: #fff;
          font-size: 2rem;
          margin-bottom: 1rem;
        }
        .modal-success p {
          color: var(--text-secondary);
          line-height: 1.6;
          font-size: 1.1rem;
        }
      `}</style>
    </div>
  );
};

export default DiagnosisModal;
