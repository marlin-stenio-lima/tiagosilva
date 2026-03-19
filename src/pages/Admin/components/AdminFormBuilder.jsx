import React, { useState } from 'react';
import { PlusCircle, Trash2, GripVertical, Save } from 'lucide-react';

const AdminFormBuilder = () => {
  const [questions, setQuestions] = useState([
    {
      id: 'q-1',
      title: 'Neste ano sua empresa:',
      type: 'single_choice',
      options: ['Está Crescendo', 'Está Estável', 'Está Caindo']
    },
    {
      id: 'q-2',
      title: 'Qual sua taxa de conversão das vendas?',
      type: 'single_choice',
      options: ['0% a 30%', '31% a 70%', 'Acima de 70%']
    }
  ]);

  const addQuestion = () => {
    const newQuestion = {
      id: `q-${Date.now()}`,
      title: 'Nova Pergunta',
      type: 'single_choice',
      options: ['Opção 1', 'Opção 2']
    };
    setQuestions([...questions, newQuestion]);
  };

  const removeQuestion = (id) => {
    setQuestions(questions.filter(q => q.id !== id));
  };

  const updateQuestionTitle = (id, newTitle) => {
    setQuestions(questions.map(q => q.id === id ? { ...q, title: newTitle } : q));
  };

  const addOption = (questionId) => {
    setQuestions(questions.map(q => {
      if (q.id === questionId) {
        return { ...q, options: [...q.options, `Nova Opção ${q.options.length + 1}`] };
      }
      return q;
    }));
  };

  const removeOption = (questionId, optionIndex) => {
    setQuestions(questions.map(q => {
      if (q.id === questionId) {
        const newOptions = [...q.options];
        newOptions.splice(optionIndex, 1);
        return { ...q, options: newOptions };
      }
      return q;
    }));
  };

  const updateOption = (questionId, optionIndex, newValue) => {
    setQuestions(questions.map(q => {
      if (q.id === questionId) {
        const newOptions = [...q.options];
        newOptions[optionIndex] = newValue;
        return { ...q, options: newOptions };
      }
      return q;
    }));
  };

  return (
    <div className="animate-fade-in" style={{ maxWidth: '850px', margin: '0 auto', position: 'relative', zIndex: 1 }}>
      <div className="admin-page-header">
        <div>
          <h1>Construtor de Diagnóstico</h1>
          <p>Personalize as perguntas do formulário para os seus leads</p>
        </div>
        <button className="admin-btn-primary" onClick={addQuestion}>
          <PlusCircle size={20} />
          Nova Pergunta
        </button>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
        {questions.map((q, index) => (
          <div key={q.id} className="admin-card" style={{ padding: '2rem', borderRadius: '16px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.5rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flexGrow: 1 }}>
                <GripVertical size={24} style={{ color: 'var(--text-muted)', cursor: 'grab' }} />
                <span style={{ color: '#3b82f6', fontWeight: 'bold', fontSize: '1.2rem' }}>#{index + 1}</span>
                <input 
                  type="text" 
                  className="admin-input" 
                  value={q.title} 
                  onChange={(e) => updateQuestionTitle(q.id, e.target.value)}
                  style={{ flexGrow: 1, fontSize: '1.2rem', fontWeight: '600', padding: '1rem' }}
                />
              </div>
              <button 
                onClick={() => removeQuestion(q.id)}
                style={{ background: 'rgba(255, 77, 77, 0.1)', color: '#ff4d4d', padding: '0.8rem', borderRadius: '10px', marginLeft: '1rem', border: '1px solid rgba(255, 77, 77, 0.2)', transition: 'all 0.2s' }}
                title="Remover Pergunta"
                onMouseOver={(e) => e.currentTarget.style.background = 'rgba(255, 77, 77, 0.2)'}
                onMouseOut={(e) => e.currentTarget.style.background = 'rgba(255, 77, 77, 0.1)'}
              >
                <Trash2 size={20} />
              </button>
            </div>

            <div style={{ paddingLeft: '3.5rem' }}>
              <h5 style={{ color: 'var(--text-secondary)', marginBottom: '1rem', fontSize: '1rem', fontWeight: '500' }}>Opções de Resposta:</h5>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
                {q.options.map((opt, optIndex) => (
                  <div key={optIndex} style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <div style={{ width: '20px', height: '20px', borderRadius: '50%', border: '2px solid rgba(59, 130, 246, 0.5)', background: 'rgba(59, 130, 246, 0.1)' }}></div>
                    <input 
                      type="text" 
                      className="admin-input" 
                      value={opt}
                      onChange={(e) => updateOption(q.id, optIndex, e.target.value)}
                      style={{ padding: '0.8rem 1rem', flexGrow: 1, backgroundColor: 'rgba(0,0,0,0.3)' }}
                    />
                    <button 
                      onClick={() => removeOption(q.id, optIndex)}
                      style={{ background: 'transparent', color: 'var(--text-muted)', padding: '0.5rem', transition: 'color 0.2s' }}
                      onMouseOver={(e) => e.currentTarget.style.color = '#ff4d4d'}
                      onMouseOut={(e) => e.currentTarget.style.color = 'var(--text-muted)'}
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                ))}
              </div>
              <button 
                className="admin-btn-secondary" 
                onClick={() => addOption(q.id)}
                style={{ marginTop: '1.5rem', padding: '0.6rem 1.2rem', fontSize: '0.9rem' }}
              >
                + Adicionar Nova Opção
              </button>
            </div>
          </div>
        ))}
      </div>

      <div style={{ marginTop: '3rem', display: 'flex', justifyContent: 'flex-end', borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: '2.5rem', paddingBottom: '2rem' }}>
         <button className="admin-btn-primary" style={{ padding: '1.2rem 2.5rem', fontSize: '1.1rem' }}>
            <Save size={20} /> Salvar Formulário
         </button>
      </div>
    </div>
  );
};

export default AdminFormBuilder;
