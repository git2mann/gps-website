import { useEffect, useState } from 'react'

function App() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('active');
          }
        });
      },
      { threshold: 0.1 }
    );

    window.addEventListener('scroll', handleScroll);
    const reveals = document.querySelectorAll('.reveal');
    reveals.forEach((el) => observer.observe(el));

    return () => {
      window.removeEventListener('scroll', handleScroll);
      observer.disconnect();
    };
  }, []);

  return (
    <div className="app">
      <nav className={`navbar ${isScrolled ? 'scrolled' : ''}`}>
        <div className="container nav-content">
          <div className="logo">
            <div className="logo-icon">GPS</div>
            <span>Global Prosperity Shift</span>
          </div>
          
          <div className={`nav-links ${isMenuOpen ? 'active' : ''}`}>
            <a href="#about" onClick={() => setIsMenuOpen(false)}>About</a>
            <a href="#pillars" onClick={() => setIsMenuOpen(false)}>Pillars</a>
            <a href="#mission" onClick={() => setIsMenuOpen(false)}>Mission</a>
            <a href="#contact" onClick={() => setIsMenuOpen(false)}>Contact</a>
          </div>

          <div className="mobile-toggle" onClick={() => setIsMenuOpen(!isMenuOpen)}>
            <span style={{ transform: isMenuOpen ? 'rotate(45deg) translate(5px, 6px)' : '' }}></span>
            <span style={{ opacity: isMenuOpen ? 0 : 1 }}></span>
            <span style={{ transform: isMenuOpen ? 'rotate(-45deg) translate(5px, -6px)' : '' }}></span>
          </div>
        </div>
      </nav>

      <header className="hero" style={{ backgroundImage: 'url("https://images.unsplash.com/photo-1523805009345-7448845a9e53?auto=format&fit=crop&q=80&w=2000")' }}>
        <div className="hero-overlay"></div>
        <div className="container">
          <div className="hero-content">
            <div className="reveal">
              <h1>Prosperity Redefined. For Africa, By Africa.</h1>
              <p>
                Driving sustainable economic growth and continental unity through 
                locally-led innovation and strategic investment. We are building 
                the future of African excellence.
              </p>
              <div className="hero-actions">
                <a href="#mission" className="cta-button">Experience the Shift</a>
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
            <div className="card reveal">
              <div className="card-img-wrapper">
                <img src="https://images.unsplash.com/photo-1489749798305-4fea3ae63d43?auto=format&fit=crop&q=80&w=800" alt="Continental Unity" className="card-img" />
              </div>
              <div className="card-icon">🌍</div>
              <h3>Continental Unity</h3>
              <p>Strengthening bonds across borders to create a unified economic powerhouse and a shared vision for growth.</p>
            </div>
            <div className="card reveal" style={{ transitionDelay: '0.2s' }}>
              <div className="card-img-wrapper">
                <img src="https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&q=80&w=800" alt="Sustainable Innovation" className="card-img" />
              </div>
              <div className="card-icon">⚡</div>
              <h3>Sustainable Innovation</h3>
              <p>Harnessing renewable energy and digital transformation to leapfrog traditional development barriers.</p>
            </div>
            <div className="card reveal" style={{ transitionDelay: '0.4s' }}>
              <div className="card-img-wrapper">
                <img src="https://images.unsplash.com/photo-1517048676732-d65bc937f952?auto=format&fit=crop&q=80&w=800" alt="Economic Empowerment" className="card-img" />
              </div>
              <div className="card-icon">🌱</div>
              <h3>Economic Empowerment</h3>
              <p>Providing the tools, capital, and mentorship for local entrepreneurs to lead the global market and build generational wealth.</p>
            </div>
          </div>
        </div>
      </section>

      <section id="mission" className="section mission-section" style={{ backgroundImage: 'url("https://images.unsplash.com/photo-1532105956626-9569c03602f6?auto=format&fit=crop&q=80&w=2000")' }}>
        <div className="mission-overlay"></div>
        <div className="container mission-content">
          <div className="mission-text">
            <h2>Our Mission</h2>
            <p>
              Global Prosperity Shift is dedicated to catalyzing a new era of African 
              excellence. We believe that the most effective solutions for Africa's 
              challenges are those conceived, developed, and implemented by Africans.
              <br /><br />
              We are building an ecosystem where innovation meets tradition, and where 
              the narrative of the continent is defined by its achievements rather 
              than its potential.
            </p>
          </div>
        </div>
      </section>

      <section id="about" className="section">
        <div className="container">
          <div className="reveal" style={{ maxWidth: '900px', margin: '0 auto', textAlign: 'center' }}>
            <h2 style={{ fontSize: 'clamp(2.5rem, 5vw, 4rem)', marginBottom: '2rem' }}>A Movement for the Ages.</h2>
            <p style={{ fontSize: '1.25rem', color: '#4a4a4a', marginBottom: '3rem', lineHeight: '1.8' }}>
              We are a movement of visionaries, entrepreneurs, and policymakers 
              working together to shift the narrative of the continent. From the 
              vibrant tech hubs of Nairobi to the financial centers of Lagos, 
              we are the shift.
            </p>
            <div style={{ display: 'flex', gap: '1.5rem', justifyContent: 'center', flexWrap: 'wrap' }}>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '3rem', fontWeight: '800', color: 'var(--primary)' }}>54</div>
                <div style={{ fontSize: '0.9rem', fontWeight: '600', opacity: 0.6 }}>Nations United</div>
              </div>
              <div style={{ width: '1px', background: '#eee' }}></div>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '3rem', fontWeight: '800', color: 'var(--primary)' }}>1B+</div>
                <div style={{ fontSize: '0.9rem', fontWeight: '600', opacity: 0.6 }}>Lives Impacted</div>
              </div>
              <div style={{ width: '1px', background: '#eee' }}></div>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '3rem', fontWeight: '800', color: 'var(--primary)' }}>2030</div>
                <div style={{ fontSize: '0.9rem', fontWeight: '600', opacity: 0.6 }}>Our Vision Goal</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <footer style={{ background: '#0a0a0a', color: 'white', padding: '6rem 0' }}>
        <div className="container">
          <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: '4rem', marginBottom: '4rem' }}>
            <div style={{ flex: '1', minWidth: '300px' }}>
              <div className="logo" style={{ marginBottom: '1.5rem', color: 'white' }}>
                <div className="logo-icon">GPS</div>
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

export default App
