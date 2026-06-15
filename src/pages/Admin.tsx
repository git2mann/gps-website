import React, { useState, useEffect, useRef } from 'react';
import { useContent } from '../context/ContentContext';
import type { SiteContent, Pillar } from '../context/ContentContext';
import { Save, RefreshCcw, ArrowLeft, Layout, Palette, Globe, Info, Monitor, Smartphone, Tablet } from 'lucide-react';
import { Link } from 'react-router-dom';

const Admin: React.FC = () => {
  const { content, updateContent } = useContent();
  const [formData, setFormData] = useState<SiteContent>(content);
  const [activeTab, setActiveTab] = useState<'hero' | 'pillars' | 'mission' | 'design' | 'about'>('design');
  const [previewDevice, setPreviewDevice] = useState<'desktop' | 'tablet' | 'mobile'>('desktop');
  const [status, setStatus] = useState<'idle' | 'saving' | 'saved'>('idle');
  const iframeRef = useRef<HTMLIFrameElement>(null);

  // Sync state with iframe preview
  useEffect(() => {
    const broadcastUpdate = () => {
      if (iframeRef.current && iframeRef.current.contentWindow) {
        iframeRef.current.contentWindow.postMessage({
          type: 'UPDATE_CONTENT',
          payload: formData
        }, '*');
      }
    };

    broadcastUpdate();

    const handleMessage = (event: MessageEvent) => {
      if (event.data.type === 'PREVIEW_READY') {
        broadcastUpdate();
      } else if (event.data.type === 'UPDATE_THEME_FROM_PREVIEW') {
        setFormData(prev => ({ ...prev, theme: { ...prev.theme, colorMode: event.data.payload } }));
      }
    };

    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, [formData]);

  const handleSave = () => {
    setStatus('saving');
    setTimeout(() => {
      updateContent(formData);
      setStatus('saved');
      setTimeout(() => setStatus('idle'), 2000);
    }, 800);
  };

  const updateField = (section: keyof SiteContent, field: string, value: string) => {
    setFormData({ 
      ...formData, 
      [section]: { ...(formData[section] as Record<string, unknown>), [field]: value } 
    });
  };

  const updateTheme = (field: keyof SiteContent['theme'], value: string | number) => {
    setFormData({ 
      ...formData, 
      theme: { ...formData.theme, [field]: value } 
    });
  };

  const updatePillar = (id: string, field: keyof Pillar, value: string) => {
    const newPillars = formData.pillars.map(p => 
      p.id === id ? { ...p, [field]: value } : p
    );
    setFormData({ ...formData, pillars: newPillars });
  };

  const getPreviewWidth = () => {
    if (previewDevice === 'mobile') return '375px';
    if (previewDevice === 'tablet') return '768px';
    return '100%';
  };

  const getPreviewHeight = () => {
    if (previewDevice === 'mobile') return '667px';
    if (previewDevice === 'tablet') return '1024px';
    return '100%';
  };

  return (
    <div className="admin-new-layout" style={{ display: 'flex', height: '100vh', background: '#f8f9fa', overflow: 'hidden' }}>
      {/* Sidebar Controls */}
      <div className="admin-sidebar" style={{ width: '450px', background: 'white', borderRight: '1px solid #e9ecef', display: 'flex', flexDirection: 'column' }}>
        <div style={{ padding: '1.5rem', borderBottom: '1px solid #e9ecef', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div style={{ width: '32px', height: '32px', background: formData.theme.primaryColor, borderRadius: '8px', display: 'flex', alignItems: 'center', color: 'white', fontSize: '0.7rem', fontWeight: 'bold', justifyContent: 'center' }}>GPS</div>
            <h2 style={{ fontSize: '1.1rem', fontWeight: '800' }}>CMS Engine</h2>
          </div>
          <button 
            onClick={handleSave}
            disabled={status !== 'idle'}
            style={{ padding: '0.6rem 1.2rem', background: formData.theme.primaryColor, color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: '600', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}
          >
            {status === 'saving' ? <RefreshCcw size={14} className="animate-spin" /> : <Save size={14} />}
            {status === 'saved' ? 'Saved' : 'Publish'}
          </button>
        </div>

        <div style={{ display: 'flex', background: '#f8f9fa', padding: '0.5rem' }}>
          {[
            { id: 'design', icon: <Palette size={16} />, label: 'Design' },
            { id: 'hero', icon: <Layout size={16} />, label: 'Hero' },
            { id: 'pillars', icon: <Globe size={16} />, label: 'Pillars' },
            { id: 'mission', icon: <Info size={16} />, label: 'Mission' },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as 'hero' | 'pillars' | 'mission' | 'design' | 'about')}
              style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.4rem', padding: '0.75rem 0', border: 'none', background: activeTab === tab.id ? 'white' : 'transparent', borderRadius: '8px', cursor: 'pointer', color: activeTab === tab.id ? formData.theme.primaryColor : '#6c757d', boxShadow: activeTab === tab.id ? '0 2px 8px rgba(0,0,0,0.05)' : 'none', transition: '0.2s' }}
            >
              {tab.icon}
              <span style={{ fontSize: '0.7rem', fontWeight: '700' }}>{tab.label}</span>
            </button>
          ))}
        </div>

        <div className="admin-scroll-area" style={{ flex: 1, overflowY: 'auto', padding: '1.5rem' }}>
          {activeTab === 'design' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
              <div>
                <h3 style={{ fontSize: '0.9rem', marginBottom: '1rem', textTransform: 'uppercase', letterSpacing: '0.05em', color: '#adb5bd' }}>Brand Identity</h3>
                <div style={{ marginBottom: '1.5rem' }}>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: '600', marginBottom: '0.8rem' }}>Default Theme Mode</label>
                  <div style={{ display: 'flex', gap: '0.5rem', background: '#f8f9fa', padding: '0.3rem', borderRadius: '10px' }}>
                    <button 
                      onClick={() => updateTheme('colorMode', 'light')}
                      style={{ flex: 1, padding: '0.5rem', border: 'none', background: formData.theme.colorMode === 'light' ? 'white' : 'transparent', borderRadius: '7px', cursor: 'pointer', fontSize: '0.8rem', fontWeight: '700', color: formData.theme.colorMode === 'light' ? formData.theme.primaryColor : '#6c757d', boxShadow: formData.theme.colorMode === 'light' ? '0 2px 5px rgba(0,0,0,0.05)' : 'none' }}
                    >
                      Light Mode
                    </button>
                    <button 
                      onClick={() => updateTheme('colorMode', 'dark')}
                      style={{ flex: 1, padding: '0.5rem', border: 'none', background: formData.theme.colorMode === 'dark' ? 'white' : 'transparent', borderRadius: '7px', cursor: 'pointer', fontSize: '0.8rem', fontWeight: '700', color: formData.theme.colorMode === 'dark' ? formData.theme.primaryColor : '#6c757d', boxShadow: formData.theme.colorMode === 'dark' ? '0 2px 5px rgba(0,0,0,0.05)' : 'none' }}
                    >
                      Dark Mode
                    </button>
                  </div>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                  <div className="form-group">
                    <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: '600', marginBottom: '0.4rem' }}>Primary Color</label>
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                      <input type="color" value={formData.theme.primaryColor} onChange={(e) => updateTheme('primaryColor', e.target.value)} style={{ width: '40px', height: '40px', border: 'none', padding: 0, cursor: 'pointer' }} />
                      <input type="text" value={formData.theme.primaryColor} onChange={(e) => updateTheme('primaryColor', e.target.value)} style={{ flex: 1, padding: '0 0.75rem', borderRadius: '6px', border: '1px solid #dee2e6', fontSize: '0.85rem' }} />
                    </div>
                  </div>
                  <div className="form-group">
                    <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: '600', marginBottom: '0.4rem' }}>Accent Color</label>
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                      <input type="color" value={formData.theme.accentColor} onChange={(e) => updateTheme('accentColor', e.target.value)} style={{ width: '40px', height: '40px', border: 'none', padding: 0, cursor: 'pointer' }} />
                      <input type="text" value={formData.theme.accentColor} onChange={(e) => updateTheme('accentColor', e.target.value)} style={{ flex: 1, padding: '0 0.75rem', borderRadius: '6px', border: '1px solid #dee2e6', fontSize: '0.85rem' }} />
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <h3 style={{ fontSize: '0.9rem', marginBottom: '1rem', textTransform: 'uppercase', letterSpacing: '0.05em', color: '#adb5bd' }}>Typography & Effects</h3>
                <div className="form-group" style={{ marginBottom: '1rem' }}>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: '600', marginBottom: '0.4rem' }}>Font Family</label>
                  <select 
                    value={formData.theme.fontFamily} 
                    onChange={(e) => updateTheme('fontFamily', e.target.value)}
                    style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid #dee2e6' }}
                  >
                    <option value="'Plus Jakarta Sans', sans-serif">Plus Jakarta Sans (Modern)</option>
                    <option value="'Inter', sans-serif">Inter (Clean)</option>
                    <option value="'Playfair Display', serif">Playfair Display (Elegant)</option>
                    <option value="system-ui, sans-serif">System Default</option>
                  </select>
                </div>
                <div className="form-group">
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: '600', marginBottom: '0.4rem' }}>Hero Overlay Opacity ({formData.theme.heroOverlayOpacity})</label>
                  <input type="range" min="0" max="1" step="0.05" value={formData.theme.heroOverlayOpacity} onChange={(e) => updateTheme('heroOverlayOpacity', parseFloat(e.target.value))} style={{ width: '100%' }} />
                </div>
              </div>
            </div>
          )}

          {activeTab === 'hero' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              <div className="form-group">
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: '600', marginBottom: '0.4rem' }}>Hero Title</label>
                <textarea rows={3} value={formData.hero.title} onChange={(e) => updateField('hero', 'title', e.target.value)} style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid #dee2e6', fontSize: '0.85rem' }} />
              </div>
              <div className="form-group">
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: '600', marginBottom: '0.4rem' }}>Hero Description</label>
                <textarea rows={5} value={formData.hero.description} onChange={(e) => updateField('hero', 'description', e.target.value)} style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid #dee2e6', fontSize: '0.85rem' }} />
              </div>
              <div className="form-group">
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: '600', marginBottom: '0.4rem' }}>Hero Image URL</label>
                <input type="text" value={formData.hero.imageUrl} onChange={(e) => updateField('hero', 'imageUrl', e.target.value)} style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid #dee2e6', fontSize: '0.85rem' }} />
              </div>
            </div>
          )}

          {activeTab === 'mission' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              <div className="form-group">
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: '600', marginBottom: '0.4rem' }}>Section Title</label>
                <input type="text" value={formData.mission.title} onChange={(e) => updateField('mission', 'title', e.target.value)} style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid #dee2e6', fontSize: '0.85rem' }} />
              </div>
              <div className="form-group">
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: '600', marginBottom: '0.4rem' }}>Mission Content</label>
                <textarea rows={10} value={formData.mission.description} onChange={(e) => updateField('mission', 'description', e.target.value)} style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid #dee2e6', fontSize: '0.85rem' }} />
              </div>
              <div className="form-group">
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: '600', marginBottom: '0.4rem' }}>Background Image URL</label>
                <input type="text" value={formData.mission.imageUrl} onChange={(e) => updateField('mission', 'imageUrl', e.target.value)} style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid #dee2e6', fontSize: '0.85rem' }} />
              </div>
            </div>
          )}

          {activeTab === 'pillars' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
              {formData.pillars.map((pillar) => (
                <div key={pillar.id} style={{ padding: '1.25rem', border: '1px solid #e9ecef', borderRadius: '16px', background: '#f8f9fa' }}>
                  <input 
                    type="text" 
                    value={pillar.title} 
                    onChange={(e) => updatePillar(pillar.id, 'title', e.target.value)}
                    style={{ width: '100%', padding: '0.5rem', marginBottom: '1rem', fontWeight: 'bold', fontSize: '1rem', border: 'none', background: 'transparent', borderBottom: '1px solid #dee2e6' }}
                  />
                  <div className="form-group" style={{ marginBottom: '1rem' }}>
                    <label style={{ display: 'block', fontSize: '0.7rem', fontWeight: '700', color: '#6c757d', marginBottom: '0.25rem' }}>DESCRIPTION</label>
                    <textarea rows={3} value={pillar.description} onChange={(e) => updatePillar(pillar.id, 'description', e.target.value)} style={{ width: '100%', padding: '0.6rem', borderRadius: '8px', border: '1px solid #dee2e6', fontSize: '0.8rem' }} />
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 3fr', gap: '0.75rem' }}>
                    <div className="form-group">
                      <label style={{ display: 'block', fontSize: '0.7rem', fontWeight: '700', color: '#6c757d', marginBottom: '0.25rem' }}>ICON</label>
                      <input type="text" value={pillar.icon} onChange={(e) => updatePillar(pillar.id, 'icon', e.target.value)} style={{ width: '100%', padding: '0.6rem', borderRadius: '8px', border: '1px solid #dee2e6', textAlign: 'center' }} />
                    </div>
                    <div className="form-group">
                      <label style={{ display: 'block', fontSize: '0.7rem', fontWeight: '700', color: '#6c757d', marginBottom: '0.25rem' }}>IMAGE URL</label>
                      <input type="text" value={pillar.imageUrl} onChange={(e) => updatePillar(pillar.id, 'imageUrl', e.target.value)} style={{ width: '100%', padding: '0.6rem', borderRadius: '8px', border: '1px solid #dee2e6', fontSize: '0.8rem' }} />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div style={{ padding: '1.5rem', borderTop: '1px solid #e9ecef', textAlign: 'center' }}>
          <Link to="/" style={{ fontSize: '0.85rem', color: '#6c757d', textDecoration: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
            <ArrowLeft size={14} /> View Live Website
          </Link>
        </div>
      </div>

      {/* Main Preview Area */}
      <div className="admin-preview" style={{ flex: 1, display: 'flex', flexDirection: 'column', background: '#f1f3f5', position: 'relative' }}>
        <div style={{ padding: '1rem', background: 'white', borderBottom: '1px solid #e9ecef', display: 'flex', justifyContent: 'center', gap: '1rem' }}>
          <button onClick={() => setPreviewDevice('desktop')} style={{ padding: '0.5rem', border: 'none', background: previewDevice === 'desktop' ? '#e9ecef' : 'transparent', borderRadius: '6px', cursor: 'pointer', color: previewDevice === 'desktop' ? formData.theme.primaryColor : '#6c757d' }}><Monitor size={18} /></button>
          <button onClick={() => setPreviewDevice('tablet')} style={{ padding: '0.5rem', border: 'none', background: previewDevice === 'tablet' ? '#e9ecef' : 'transparent', borderRadius: '6px', cursor: 'pointer', color: previewDevice === 'tablet' ? formData.theme.primaryColor : '#6c757d' }}><Tablet size={18} /></button>
          <button onClick={() => setPreviewDevice('mobile')} style={{ padding: '0.5rem', border: 'none', background: previewDevice === 'mobile' ? '#e9ecef' : 'transparent', borderRadius: '6px', cursor: 'pointer', color: previewDevice === 'mobile' ? formData.theme.primaryColor : '#6c757d' }}><Smartphone size={18} /></button>
          <div style={{ borderLeft: '1px solid #dee2e6', height: '24px', margin: '0 0.5rem' }}></div>
          <span style={{ fontSize: '0.8rem', fontWeight: '600', display: 'flex', alignItems: 'center', color: '#6c757d' }}>LIVE PREVIEW</span>
        </div>

        <div style={{ flex: 1, overflowY: 'auto', padding: '2rem', display: 'flex', justifyContent: 'center', alignItems: 'flex-start' }}>
          <div style={{ 
            width: getPreviewWidth(), 
            height: getPreviewHeight(),
            background: 'white', 
            boxShadow: '0 20px 80px rgba(0,0,0,0.15)', 
            borderRadius: previewDevice === 'desktop' ? '0' : '40px',
            overflow: 'hidden',
            transition: 'all 0.5s cubic-bezier(0.16, 1, 0.3, 1)',
            border: previewDevice === 'desktop' ? 'none' : '14px solid #1a1a1a',
            position: 'relative'
          }}>
            <iframe 
              ref={iframeRef}
              src="/preview" 
              style={{ width: '100%', height: '100%', border: 'none' }}
              title="Site Preview"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Admin;
