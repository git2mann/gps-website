/* eslint-disable react-refresh/only-export-components */
import React, { createContext, useContext, useState } from 'react';

export interface Pillar {
  id: string;
  title: string;
  description: string;
  icon: string;
  imageUrl: string;
}

export interface SiteContent {
  theme: {
    colorMode: 'light' | 'dark';
    primaryColor: string;
    accentColor: string;
    fontFamily: string;
    heroOverlayOpacity: number;
  };
  hero: {
    title: string;
    description: string;
    imageUrl: string;
  };
  mission: {
    title: string;
    description: string;
    imageUrl: string;
  };
  pillars: Pillar[];
  about: {
    title: string;
    description: string;
    stats: { label: string; value: string }[];
  };
}

const defaultContent: SiteContent = {
  theme: {
    colorMode: 'light',
    primaryColor: "#1b5e20",
    accentColor: "#ffb300",
    fontFamily: "'Plus Jakarta Sans', sans-serif",
    heroOverlayOpacity: 0.85
  },
  hero: {
    title: "Prosperity Redefined. For Africa, By Africa.",
    description: "Driving sustainable economic growth and continental unity through locally-led innovation and strategic investment. We are building the future of African excellence.",
    imageUrl: "https://images.unsplash.com/photo-1523805009345-7448845a9e53?auto=format&fit=crop&q=80&w=2000"
  },
  mission: {
    title: "Our Mission",
    description: "Global Prosperity Shift is dedicated to catalyzing a new era of African excellence. We believe that the most effective solutions for Africa's challenges are those conceived, developed, and implemented by Africans.\n\nWe are building an ecosystem where innovation meets tradition, and where the narrative of the continent is defined by its achievements rather than its potential.",
    imageUrl: "https://images.unsplash.com/photo-1532105956626-9569c03602f6?auto=format&fit=crop&q=80&w=2000"
  },
  pillars: [
    {
      id: '1',
      title: "Continental Unity",
      description: "Strengthening bonds across borders to create a unified economic powerhouse and a shared vision for growth.",
      icon: "🌍",
      imageUrl: "https://images.unsplash.com/photo-1489749798305-4fea3ae63d43?auto=format&fit=crop&q=80&w=800"
    },
    {
      id: '2',
      title: "Sustainable Innovation",
      description: "Harnessing renewable energy and digital transformation to leapfrog traditional development barriers.",
      icon: "⚡",
      imageUrl: "https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&q=80&w=800"
    },
    {
      id: '3',
      title: "Economic Empowerment",
      description: "Providing the tools, capital, and mentorship for local entrepreneurs to lead the global market and build generational wealth.",
      icon: "🌱",
      imageUrl: "https://images.unsplash.com/photo-1517048676732-d65bc937f952?auto=format&fit=crop&q=80&w=800"
    }
  ],
  about: {
    title: "A Movement for the Ages.",
    description: "We are a movement of visionaries, entrepreneurs, and policymakers working together to shift the narrative of the continent. From the vibrant tech hubs of Nairobi to the financial centers of Lagos, we are the shift.",
    stats: [
      { label: "Nations United", value: "54" },
      { label: "Lives Impacted", value: "1B+" },
      { label: "Our Vision Goal", value: "2030" }
    ]
  }
};

interface ContentContextType {
  content: SiteContent;
  updateContent: (newContent: SiteContent) => void;
}

const ContentContext = createContext<ContentContextType | undefined>(undefined);

export const ContentProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [content, setContent] = useState<SiteContent>(() => {
    const saved = localStorage.getItem('gps_site_content');
    if (!saved) return defaultContent;
    
    try {
      const parsed = JSON.parse(saved);
      // Merge saved data with default content to ensure new fields (like theme) exist
      return {
        ...defaultContent,
        ...parsed,
        theme: { ...defaultContent.theme, ...(parsed.theme || {}) },
        hero: { ...defaultContent.hero, ...(parsed.hero || {}) },
        mission: { ...defaultContent.mission, ...(parsed.mission || {}) },
        about: { ...defaultContent.about, ...(parsed.about || {}) },
      };
    } catch (e) {
      console.error("Error parsing saved content", e);
      return defaultContent;
    }
  });

  const updateContent = (newContent: SiteContent) => {
    setContent(newContent);
    localStorage.setItem('gps_site_content', JSON.stringify(newContent));
  };

  return (
    <ContentContext.Provider value={{ content, updateContent }}>
      {children}
    </ContentContext.Provider>
  );
};

export const useContent = () => {
  const context = useContext(ContentContext);
  if (!context) throw new Error('useContent must be used within a ContentProvider');
  return context;
};
