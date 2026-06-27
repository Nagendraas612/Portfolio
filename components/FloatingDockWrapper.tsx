'use client';

import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import Dock, { DockItemData } from './Dock';

export default function FloatingDockWrapper() {
  const pathname = usePathname();
  const router = useRouter();
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      // Hide dock during the loading screen
      const loader = document.getElementById('loader');
      if (loader && !loader.classList.contains('hidden') && loader.style.display !== 'none') {
        setIsVisible(false);
        return;
      }

      if (pathname !== '/') {
        setIsVisible(true);
        return;
      }

      const hero = document.getElementById('hero');
      if (!hero) {
        setIsVisible(false);
        return;
      }
      const scrollTop = window.scrollY || document.documentElement.scrollTop || 0;
      const heroHeight = hero.offsetHeight;
      
      // The timeline appears at scrollTop > heroHeight - window.innerHeight * 0.95.
      // So the dock should disappear at the exact same scroll position!
      const isPastHero = scrollTop > heroHeight - window.innerHeight * 0.95;
      
      setIsVisible(!isPastHero);
    };

    // Run on scroll, resize, and custom intervals to check loader state changes
    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', handleScroll, { passive: true });
    
    const interval = setInterval(handleScroll, 100);

    if (document.fonts) {
      document.fonts.ready.then(handleScroll);
    }

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleScroll);
      clearInterval(interval);
    };
  }, [pathname]);

  if (!isVisible) return null;

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
        handleNavClick(fakeEvent, '/about');
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
        handleNavClick(fakeEvent, '/work');
      }
    },
    {
      label: 'Contact',
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
        </svg>
      ),
      onClick: () => {
        const fakeEvent = { preventDefault: () => {} } as React.MouseEvent;
        handleNavClick(fakeEvent, '/contact');
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
        window.location.href = 'mailto:nagendraas612@gmail.com';
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
        window.open('https://linkedin.com/in/nagendraas612', '_blank', 'noopener,noreferrer');
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
        window.open('https://github.com/Nagendraas612', '_blank', 'noopener,noreferrer');
      }
    }
  ];

  return (
    <div style={{ position: 'fixed', bottom: '24px', left: '0', width: '100%', display: 'flex', justifyContent: 'center', zIndex: 1000, pointerEvents: 'none' }}>
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
