import { useEffect, useState } from 'react'
import { BrowserRouter as Router, Routes, Route, Link as RouterLink } from 'react-router-dom'
import { useContent } from './context/ContentContext'
import type { SiteContent } from './context/ContentContext'
import Admin from './pages/Admin'

import { Sun, Moon } from 'lucide-react'

export function LandingPage({ customContent, isPreview }: { customContent?: SiteContent, isPreview?: boolean }) {
  const { content: contextContent, updateContent } = useContent();
  const [previewContent, setPreviewContent] = useState<SiteContent | null>(null);
  const content = previewContent || customContent || contextContent;
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    // Sync logic for iFrame preview
    if (isPreview) {
      const handleMessage = (event: MessageEvent) => {
        if (event.data.type === 'UPDATE_CONTENT') {
          setPreviewContent(event.data.payload);
        }
      };
      window.addEventListener('message', handleMessage);
      
      // Request initial state from parent
      window.parent.postMessage({ type: 'PREVIEW_READY' }, '*');
      
      return () => window.removeEventListener('message', handleMessage);
    }
  }, [isPreview]);

  useEffect(() => {
    // Apply dynamic theme
    document.documentElement.style.setProperty('--primary', content.theme.primaryColor);
    document.documentElement.style.setProperty('--accent', content.theme.accentColor);
    document.documentElement.style.setProperty('--font-family', content.theme.fontFamily);
    
    if (content.theme.colorMode === 'dark') {
      document.body.classList.add('dark-mode');
    } else {
      document.body.classList.remove('dark-mode');
    }

    const handleScroll = (e: Event) => {
      const target = isPreview ? (e.target as HTMLElement) : window;
      const scrollY = isPreview ? (target as HTMLElement).scrollTop : window.scrollY;
      setIsScrolled(scrollY > 50);
    };

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('active');
          }
        });
      },
      { 
        threshold: 0.1,
        root: isPreview ? document.querySelector('.preview-scroll-root') : null
      }
    );

    const scrollTarget = isPreview ? document.querySelector('.preview-scroll-root') : window;
    scrollTarget?.addEventListener('scroll', handleScroll);
    
    const reveals = document.querySelectorAll('.reveal');
    reveals.forEach((el) => observer.observe(el));

    // Force active state for all reveals in preview to ensure visibility
    if (isPreview) {
      reveals.forEach(el => el.classList.add('active'));
    }

    return () => {
      scrollTarget?.removeEventListener('scroll', handleScroll);
      observer.disconnect();
    };
  }, [content, isPreview]);

  return (
    <div className={`app ${isPreview ? 'is-preview' : ''}`} style={{ fontFamily: content.theme.fontFamily, position: isPreview ? 'relative' : undefined }}>
      <nav className={`navbar ${isScrolled ? 'scrolled' : ''} ${isPreview ? 'preview-nav' : ''}`}>
        <div className="container nav-content">
          <div className="logo">
            <div className="logo-icon" style={{ background: content.theme.primaryColor }}>GPS</div>
            <span>Global Prosperity Shift</span>
          </div>
          
          <div className={`nav-links ${isMenuOpen ? 'active' : ''}`}>
            <a href="#about" onClick={() => setIsMenuOpen(false)}>About</a>
            <a href="#pillars" onClick={() => setIsMenuOpen(false)}>Pillars</a>
            <a href="#mission" onClick={() => setIsMenuOpen(false)}>Mission</a>
            <a href="#contact" onClick={() => setIsMenuOpen(false)}>Contact</a>
            
            {!isPreview && (
              <button 
                className="theme-toggle"
                onClick={() => {
                  updateContent({...content, theme: {...content.theme, colorMode: content.theme.colorMode === 'light' ? 'dark' : 'light'}})
                }}
                style={{ 
                  background: 'none', 
                  border: 'none', 
                  cursor: 'pointer', 
                  display: 'flex', 
                  alignItems: 'center', 
                  padding: '0.5rem', 
                  color: isScrolled ? 'var(--text-color)' : 'white',
                  marginLeft: '1rem',
                  opacity: 0.8,
                  transition: 'opacity 0.3s ease'
                }}
              >
                {content.theme.colorMode === 'light' ? <Moon size={20} /> : <Sun size={20} />}
              </button>
            )}
            {isPreview && (
              <button 
                className="theme-toggle"
                onClick={() => {
                   const newMode: 'light' | 'dark' = content.theme.colorMode === 'light' ? 'dark' : 'light';
                   const newContent = {...content, theme: {...content.theme, colorMode: newMode}};
                   setPreviewContent(newContent);
                   window.parent.postMessage({ type: 'UPDATE_THEME_FROM_PREVIEW', payload: newMode }, '*');
                }}
                style={{ 
                  background: 'none', 
                  border: 'none', 
                  cursor: 'pointer', 
                  display: 'flex', 
                  alignItems: 'center', 
                  padding: '0.5rem', 
                  color: isScrolled ? 'var(--text-color)' : 'white',
                  marginLeft: '1rem',
                  opacity: 0.8,
                  transition: 'opacity 0.3s ease'
                }}
              >
                {content.theme.colorMode === 'light' ? <Moon size={20} /> : <Sun size={20} />}
              </button>
            )}
          </div>

          <div className="mobile-toggle" onClick={() => setIsMenuOpen(!isMenuOpen)}>
            <span style={{ background: isScrolled ? 'var(--text-color)' : 'white', transform: isMenuOpen ? 'rotate(45deg) translate(5px, 6px)' : '' }}></span>
            <span style={{ background: isScrolled ? 'var(--text-color)' : 'white', opacity: isMenuOpen ? 0 : 1 }}></span>
            <span style={{ background: isScrolled ? 'var(--text-color)' : 'white', transform: isMenuOpen ? 'rotate(-45deg) translate(5px, -6px)' : '' }}></span>
          </div>
        </div>
      </nav>

      <header className="hero" style={{ backgroundImage: `url("${content.hero.imageUrl}")` }}>
        <div className="hero-overlay" style={{ background: `linear-gradient(135deg, rgba(0,0,0,${content.theme.heroOverlayOpacity}) 0%, rgba(0,0,0,${content.theme.heroOverlayOpacity / 2}) 50%, rgba(0,0,0,${content.theme.heroOverlayOpacity / 4}) 100%)` }}></div>
        <div className="container">
          <div className="hero-content">
            <div className="reveal">
              <h1>{content.hero.title}</h1>
              <p>{content.hero.description}</p>
              <div className="hero-actions">
                <a href="#mission" className="cta-button" style={{ background: content.theme.primaryColor, borderColor: content.theme.primaryColor }}>Experience the Shift</a>
              </div>
            </div>
          </div>
        </div>
      </header>

      <section id="pillars" className="section">
        <div className="container">
          <div className="section-header reveal">
            <h2>Our Core Pillars</h2>
            <p>Strategic focus areas designed to catalyze a new era of continental prosperity.</p>
          </div>
          <div className="grid">
            {content.pillars.map((pillar, index) => (
              <div key={pillar.id} className="card reveal" style={{ transitionDelay: `${index * 0.2}s` }}>
                <div className="card-img-wrapper">
                  <img src={pillar.imageUrl} alt={pillar.title} className="card-img" />
                </div>
                <div className="card-icon" style={{ color: content.theme.accentColor }}>{pillar.icon}</div>
                <h3 style={{ color: content.theme.primaryColor }}>{pillar.title}</h3>
                <p>{pillar.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="mission" className="section mission-section" style={{ backgroundImage: `url("${content.mission.imageUrl}")` }}>
        <div className="mission-overlay" style={{ background: `linear-gradient(to right, ${content.theme.primaryColor} 0%, ${content.theme.primaryColor} 65%, rgba(0,0,0,0.5) 75%, transparent 100%)` }}></div>
        <div className="container mission-content">
          <div className="mission-text">
            <h2>{content.mission.title}</h2>
            <p style={{ whiteSpace: 'pre-line' }}>
              {content.mission.description}
            </p>
          </div>
        </div>
      </section>

      <section id="about" className="section">
        <div className="container">
          <div className="reveal" style={{ maxWidth: '900px', margin: '0 auto', textAlign: 'center' }}>
            <h2 style={{ fontSize: 'clamp(2.5rem, 5vw, 4rem)', marginBottom: '2rem' }}>{content.about.title}</h2>
            <p style={{ fontSize: '1.25rem', color: '#4a4a4a', marginBottom: '3rem', lineHeight: '1.8' }}>
              {content.about.description}
            </p>
            <div style={{ display: 'flex', gap: '1.5rem', justifyContent: 'center', flexWrap: 'wrap' }}>
              {content.about.stats.map((stat, index) => (
                <div key={index} style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
                  <div style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: '3rem', fontWeight: '800', color: content.theme.primaryColor }}>{stat.value}</div>
                    <div style={{ fontSize: '0.9rem', fontWeight: '600', opacity: 0.6 }}>{stat.label}</div>
                  </div>
                  {index < content.about.stats.length - 1 && <div style={{ width: '1px', height: '50px', background: '#eee' }}></div>}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <footer style={{ background: '#0a0a0a', color: 'white', padding: '6rem 0' }}>
        <div className="container">
          <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: '4rem', marginBottom: '4rem' }}>
            <div style={{ flex: '1', minWidth: '300px' }}>
              <div className="logo" style={{ marginBottom: '1.5rem', color: 'white' }}>
                <div className="logo-icon" style={{ background: content.theme.primaryColor }}>GPS</div>
                Global Prosperity Shift
              </div>
              <p style={{ opacity: 0.6, maxWidth: '400px' }}>
                Empowering the African continent through locally-led innovation and strategic investment.
              </p>
            </div>
            <div style={{ display: 'flex', gap: '4rem' }}>
              <div>
                <h4 style={{ marginBottom: '1.5rem', fontSize: '1.1rem' }}>Platform</h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', opacity: 0.6 }}>
                  <a href="#about">About</a>
                  <a href="#pillars">Pillars</a>
                  <a href="#mission">Mission</a>
                  <RouterLink to="/admin" style={{ opacity: 0.5, fontSize: '0.8rem' }}>Admin Access</RouterLink>
                </div>
              </div>
              <div>
                <h4 style={{ marginBottom: '1.5rem', fontSize: '1.1rem' }}>Contact</h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', opacity: 0.6 }}>
                  <a href="mailto:info@gpshift.org">info@gpshift.org</a>
                  <a href="#">LinkedIn</a>
                  <a href="#">Twitter</a>
                </div>
              </div>
            </div>
          </div>
          <div style={{ borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '2.5rem', display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem', opacity: 0.4, fontSize: '0.85rem' }}>
            <p>&copy; {new Date().getFullYear()} Global Prosperity Shift. All rights reserved.</p>
            <p>Designed for the Future of Africa.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/admin" element={<Admin />} />
        <Route path="/preview" element={<LandingPage isPreview={true} />} />
      </Routes>
    </Router>
  );
}

export default App
