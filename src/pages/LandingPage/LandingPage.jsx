import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, Instagram } from 'lucide-react';
import DiagnosisModal from '../../components/DiagnosisModal';
import './LandingPage.css';

const LandingPage = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const observerOptions = {
      root: null,
      rootMargin: '0px',
      threshold: 0.15
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
        }
      });
    }, observerOptions);

    const revealElements = document.querySelectorAll('.reveal-on-scroll');
    revealElements.forEach(el => observer.observe(el));

    return () => observer.disconnect();
  }, []);

  return (
    <div className="lp-container">
      <main>
        {/* Hero Section - The Elite Specialist */}
        <section className="hero-section hero-centered">
          <div className="hero-overlay"></div>
          <div className="hero-content animate-fade-in">
            <span className="hero-badge">IA GENERATIVA PARA DECISORES E EXECUTIVOS</span>
            <h1>Injete <span>Inteligência Prática</span> no core operacional da sua empresa.</h1>
            <p>Não vendemos ferramentas. Entregamos a arquitetura capaz de reduzir drasticamente o erro humano e escalar resultados com equipes enxutas.</p>
            <div className="hero-actions">
              <button className="btn-primary" onClick={() => setIsModalOpen(true)}>Solicitar Diagnóstico Estratégico <span>→</span></button>
              <Link to="/login" className="btn-secondary">Acesso Exclusivo</Link>
            </div>
          </div>

          <div className="scroll-indicator" onClick={() => document.getElementById('anota-ai')?.scrollIntoView({ behavior: 'smooth' })}>
            <span className="scroll-text">Descubra</span>
            <div className="scroll-line"></div>
          </div>
        </section>

        {/* Infinite Authority Marquee - High Ticket Style */}
        <section className="authority-marquee">
          <div className="marquee-content">
            {/* Logos and Stats duplicated for seamless loop */}
            <div className="marquee-track">
              <span>AWS PARTNER</span>
              <span className="dot">•</span>
              <span>MRV & CO</span>
              <span className="dot">•</span>
              <span>C&A</span>
              <span className="dot">•</span>
              <span>NPS 94</span>
              <span className="dot">•</span>
              <span>AMAZON</span>
              <span className="dot">•</span>
              <span>SEBRAE</span>
              <span className="dot">•</span>
              <span>SOLIDES</span>
              <span className="dot">•</span>
              <span>630+ DECISORES</span>
              <span className="dot">•</span>
              {/* Duplicate for loop */}
              <span>AWS PARTNER</span>
              <span className="dot">•</span>
              <span>MRV & CO</span>
              <span className="dot">•</span>
              <span>C&A</span>
              <span className="dot">•</span>
              <span>NPS 94</span>
              <span className="dot">•</span>
              <span>AMAZON</span>
              <span className="dot">•</span>
              <span>SEBRAE</span>
              <span className="dot">•</span>
              <span>SOLIDES</span>
              <span className="dot">•</span>
              <span>630+ DECISORES</span>
              <span className="dot">•</span>
            </div>
          </div>
        </section>


        {/* Anota AI Section - High End Interviews */}
        <section className="anota-ai-section" id="anota-ai">
          <div className="section-title center reveal-on-scroll">
            <span className="subtitle">Mesa Redonda</span>
            <h2>Anota <span>AI</span></h2>
            <p>Bate-papo com os maiores nomes do empreendedorismo brasileiro sobre o futuro da IA.</p>
          </div>
          <div className="interviews-grid">
            <div className="interview-card card-gradient reveal-on-scroll" style={{ transitionDelay: '0.1s' }}>
              <div className="interview-quote">
                <p>"Se eu fosse criar um funcionário de IA seria para simplificar minha vida."</p>
              </div>
              <div className="interview-profile">
                <div className="author-info">
                  <strong>João Branco</strong>
                  <span>Ex-CMO McDonald's</span>
                </div>
              </div>
            </div>
            <div className="interview-card card-gradient highlight reveal-on-scroll" style={{ transitionDelay: '0.2s' }}>
              <div className="interview-quote">
                <p>"O mundo já escolheu o caminho. Se você insistir em ir contra, quem perde é você."</p>
              </div>
              <div className="interview-profile">
                <div className="author-info">
                  <strong>Diego Barreto</strong>
                  <span>CEO iFood</span>
                </div>
              </div>
            </div>
            <div className="interview-card card-gradient reveal-on-scroll" style={{ transitionDelay: '0.3s' }}>
              <div className="interview-quote">
                <p>"A IA vem facilitando ainda mais a vida do consumidor na Polishop."</p>
              </div>
              <div className="interview-profile">
                <div className="author-info">
                  <strong>João Apolinário</strong>
                  <span>Fundador Polishop</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Training Models - Multi-layered Solution */}
        <section className="training-models-section" id="experiencia">
           <div className="section-title reveal-on-scroll">
             <h2>Modelos de <span>Implementação</span></h2>
             <p>Do treinamento In-Company à mentoria executiva individual.</p>
           </div>
           <div className="models-grid">
              <div className="model-card glass reveal-on-scroll" style={{ transitionDelay: '0.1s' }}>
                 <div className="badge-model">CORPORATIVO</div>
                 <h4>In Company</h4>
                 <p>Workshops intensivos para alinhar seu time de liderança às tecnologias mais disruptivas de IA.</p>
                 <span className="client-list">AWS, MRV, C&A, Matur</span>
              </div>
              <div className="model-card glass reveal-on-scroll" style={{ transitionDelay: '0.2s' }}>
                 <div className="badge-model">PALESTRAS</div>
                 <h4>Keynotes</h4>
                 <p>Palestras magnas para congressos e eventos corporativos de grande porte.</p>
                 <span className="client-list">Sebrae, Amazon, ABAV Talks</span>
              </div>
              <div className="model-card glass gold-border reveal-on-scroll" style={{ transitionDelay: '0.3s' }}>
                 <div className="badge-model gold">ELITE</div>
                 <h4>Masterclasses</h4>
                 <p>Mentorias de alta performance para CEOs e Donos de Negócios (Equity & Valuation).</p>
                 <span className="client-list">SME, Jornada Equity, Leaders</span>
              </div>
           </div>
        </section>

        {/* Biography Section - Personalized */}
        <section className="biography-section" id="biografia">
          <div className="bio-container glass reveal-on-scroll">
            <div className="bio-image-wrapper">
              <img src="/imagem-thiago-biografia.jpeg" alt="Thiago Silva" className="bio-img" />
              <div className="bio-glow"></div>
            </div>
            <div className="bio-text-content">
              <h2>Liderando a Próxima Revolução</h2>
              <h3>Thiago Silva</h3>
              <p className="bio-highlight">
                Estrategista de IA e entusiasta da eficiência operacional mineiro, radicado no centro da inovação.
              </p>
              <p className="bio-paragraph">
                Casado com a Rayssa e movido pela missão de tornar a Inteligência Artificial uma ferramenta de escala acessível ao topo do mercado brasileiro. Thiago Silva construiu seu nome conectando as principais mentes do país à tecnologia de ponta.
              </p>
              <p className="bio-paragraph">
                Seu portfólio inclui participações em eventos de escala nacional (Growth Expo, Seis & Seis Expo) e uma rede de relacionamento que dita as tendências da Nova Economia. Thiago entrega o **"Como Fazer"**, não apenas o "O que é".
              </p>
            </div>
          </div>
        </section>

        {/* Final CTA - Professional Diagnosis */}
        <section className="final-cta-section card-gradient reveal-on-scroll">
          <div className="final-cta-content center">
            <h2>Maturidade Tecnológica</h2>
            <p>Seu negócio está gerando dados ou apenas ruído? Aplique para o Diagnóstico de Inteligência Operacional.</p>
            <button className="btn-primary" onClick={() => setIsModalOpen(true)} style={{ margin: '2rem auto 0 auto' }}>
              Iniciar Aplicação de Diagnóstico <span>→</span>
            </button>
          </div>
        </section>
      </main>

      <footer className="lp-footer">
        <div className="footer-cols">
          <div className="footer-brand">
             <div className="logo" style={{ filter: 'grayscale(1)', opacity: 0.5 }}>
                <Sparkles className="logo-icon" color="#3b82f6" />
                <span>Thiago Silva <strong>IA</strong></span>
             </div>
             <p>Estratégia, IA e Resultados Exponenciais para o topo da pirâmide empresarial.</p>
          </div>
          <div className="footer-nav">
             <h4>CONTATO</h4>
             <a href="https://instagram.com/thiagosilva.ia" target="_blank" rel="noopener noreferrer" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Instagram size={18} />
                @thiagosilva.ia
             </a>
          </div>
        </div>
        <div className="footer-bottom">
           <p>© 2026 THIAGO SILVA IA. RESERVADOS AOS QUE CONSTRUEM O FUTURO.</p>
        </div>
      </footer>

      {/* Diagnosis Modal */}
      <DiagnosisModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </div>
  );
};

export default LandingPage;
