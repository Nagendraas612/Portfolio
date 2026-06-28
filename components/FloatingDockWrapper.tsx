'use client';

import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import Dock, { DockItemData } from './Dock';

interface FloatingDockWrapperProps {
  settings?: {
    email?: string;
    linkedinUrl?: string;
    githubUrl?: string;
    dockAboutUrl?: string;
    dockWorkUrl?: string;
    dockEmail?: string;
    dockLinkedinUrl?: string;
    dockGithubUrl?: string;
  };
}

export default function FloatingDockWrapper({ settings }: FloatingDockWrapperProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [opacity, setOpacity] = useState(1);
  const [shouldRender, setShouldRender] = useState(false);

  useEffect(() => {
    if (pathname !== '/') {
      setShouldRender(false);
      return;
    }

    const handleScroll = () => {
      // Hide dock during the loading screen
      const loader = document.getElementById('loader');
      if (loader && !loader.classList.contains('hidden') && loader.style.display !== 'none') {
        setOpacity(0);
        setShouldRender(false);
        return;
      }

      const scrollTop = window.scrollY || document.documentElement.scrollTop || 0;
      
      // Gradually fade out over the first 200px of scroll
      const fadeRange = 200;
      const newOpacity = Math.max(0, 1 - scrollTop / fadeRange);
      
      setOpacity(newOpacity);
      setShouldRender(newOpacity > 0);
    };

    // Run on scroll, resize, and custom intervals to check loader state changes
    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', handleScroll, { passive: true });
    
    const interval = setInterval(handleScroll, 50);

    if (document.fonts) {
      document.fonts.ready.then(handleScroll);
    }

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleScroll);
      clearInterval(interval);
    };
  }, [pathname]);

  if (pathname !== '/' || !shouldRender) return null;

  const handleNavClick = (e: React.MouseEvent, pageRoute: string) => {
    e.preventDefault();
    router.push(pageRoute);
  };

  const items: DockItemData[] = [
    {
      label: 'About',
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
          <circle cx="12" cy="7" r="4" />
        </svg>
      ),
      onClick: () => {
        const fakeEvent = { preventDefault: () => {} } as React.MouseEvent;
        handleNavClick(fakeEvent, settings?.dockAboutUrl || '/about');
      }
    },
    {
      label: 'Work',
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect x="2" y="7" width="20" height="14" rx="2" ry="2" />
          <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
        </svg>
      ),
      onClick: () => {
        const fakeEvent = { preventDefault: () => {} } as React.MouseEvent;
        handleNavClick(fakeEvent, settings?.dockWorkUrl || '/work');
      }
    },
    {
      label: 'Email',
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
          <polyline points="22,6 12,13 2,6" />
        </svg>
      ),
      onClick: () => {
        const emailVal = settings?.dockEmail || settings?.email || 'nagias612@gmail.com';
        window.location.href = `mailto:${emailVal}`;
      }
    },
    {
      label: 'LinkedIn',
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
          <rect x="2" y="9" width="4" height="12" />
          <circle cx="4" cy="4" r="2" />
        </svg>
      ),
      onClick: () => {
        const linkedinVal = settings?.dockLinkedinUrl || settings?.linkedinUrl || 'https://linkedin.com/in/nagendraas612';
        window.open(linkedinVal, '_blank', 'noopener,noreferrer');
      }
    },
    {
      label: 'GitHub',
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22" />
        </svg>
      ),
      onClick: () => {
        const githubVal = settings?.dockGithubUrl || settings?.githubUrl || 'https://github.com/Nagendraas612';
        window.open(githubVal, '_blank', 'noopener,noreferrer');
      }
    }
  ];

  return (
    <div style={{
      position: 'fixed',
      bottom: '24px',
      left: '0',
      width: '100%',
      display: shouldRender ? 'flex' : 'none',
      justifyContent: 'center',
      zIndex: 1000,
      pointerEvents: opacity === 0 ? 'none' : 'auto',
      opacity: opacity,
      transition: 'opacity 0.05s ease-out'
    }}>
      <div style={{ pointerEvents: 'auto' }}>
        <Dock 
          items={items}
          panelHeight={64}
          baseItemSize={46}
          magnification={62}
          distance={140}
        />
      </div>
    </div>
  );
}
