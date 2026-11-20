import React, { useState } from 'react';
import { StoreProvider, useStore } from './context/StoreContext';
import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { LatestNews } from './components/LatestNews';
import { FeaturedNews } from './components/FeaturedNews';
import { CategorySection } from './components/CategorySection';
import { PublicUtilitySection } from './components/PublicUtilitySection';
import { LocationSection } from './components/LocationSection';
import { CommunityParticipate } from './components/CommunityParticipate';
import { SponsoredAds } from './components/SponsoredAds';
import { FAQSection } from './components/FAQSection';
import { AboutSection } from './components/AboutSection';
import { ContactTransparency } from './components/ContactTransparency';
import { Footer } from './components/Footer';
import { AuthModal } from './components/AuthModal';
import { AdminPanelModal } from './components/AdminPanel/AdminPanelModal';
import { UserPanelModal } from './components/UserPanel/UserPanelModal';
import { ArticleModal } from './components/ArticleModal';
import { HeaderAdBanner } from './components/HeaderAdBanner';
import { WhatsAppWidget } from './components/WhatsAppWidget';
import { Article } from './types';

function MainPortal() {
  const { config, currentUser, logout } = useStore();

  // Modals state
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authInitialTarget, setAuthInitialTarget] = useState<'admin' | 'user' | null>(null);
  const [adminPanelOpen, setAdminPanelOpen] = useState(false);
  const [userPanelOpen, setUserPanelOpen] = useState(false);
  const [readingArticle, setReadingArticle] = useState<Article | null>(null);

  // Acesso pelo microcadeado na ONE PAGE (Exclusivamente para o Painel do Usuário com solicitação obrigatória de senha)
  const handleOpenMicroLock = () => {
    logout();
    setAuthInitialTarget('user');
    setAuthModalOpen(true);
  };

  // Detecção do LINK EXTERNO exclusivo para o Painel do Administrador (?painel=admin, ?admin=true, #admin)
  React.useEffect(() => {
    const checkAdminExternalLink = () => {
      const search = window.location.search.toLowerCase();
      const hash = window.location.hash.toLowerCase();
      const pathname = window.location.pathname.toLowerCase();

      const isAdminRequested =
        search.includes('admin') ||
        search.includes('painel=admin') ||
        hash.includes('admin') ||
        pathname.endsWith('/admin');

      if (isAdminRequested) {
        if (currentUser?.role === 'admin') {
          setAdminPanelOpen(true);
        } else {
          setAuthInitialTarget('admin');
          setAuthModalOpen(true);
        }
      }
    };

    checkAdminExternalLink();
    window.addEventListener('hashchange', checkAdminExternalLink);
    window.addEventListener('popstate', checkAdminExternalLink);
    return () => {
      window.removeEventListener('hashchange', checkAdminExternalLink);
      window.removeEventListener('popstate', checkAdminExternalLink);
    };
  }, [currentUser]);

  const handleSuccessAuth = (role: 'admin' | 'user') => {
    if (role === 'admin') {
      setAdminPanelOpen(true);
    } else {
      setUserPanelOpen(true);
    }
  };

  return (
    <div
      className="min-h-screen flex flex-col text-slate-900 selection:bg-[#0f3d59] selection:text-white"
      style={{ backgroundColor: config.palette?.bodyBg || '#f8fafc' }}
    >
      {/* Header (Public view: clean, NO login/panel buttons) */}
      <Header />

      {/* Top Banner if configured in Admin Panel */}
      <HeaderAdBanner />

      {/* Dynamic One Page Sections based on Admin Config */}
      <main className="flex-1">
        {(() => {
          const sectionComponentMap: Record<string, React.ReactNode> = {
            hero: <Hero key="hero" />,
            latest: <LatestNews key="latest" onSelectArticle={(art) => setReadingArticle(art)} />,
            featured: <FeaturedNews key="featured" onSelectArticle={(art) => setReadingArticle(art)} />,
            categories: <CategorySection key="categories" onSelectArticle={(art) => setReadingArticle(art)} />,
            publicUtility: <PublicUtilitySection key="publicUtility" />,
            locations: <LocationSection key="locations" onSelectArticle={(art) => setReadingArticle(art)} />,
            communityParticipates: <CommunityParticipate key="communityParticipates" />,
            faq: <FAQSection key="faq" />,
            advertisements: <SponsoredAds key="advertisements" />,
            about: <AboutSection key="about" />,
            contactTransparency: <ContactTransparency key="contactTransparency" />,
          };

          const defaultOrder: (keyof typeof config.sectionsVisible)[] = [
            'hero',
            'latest',
            'featured',
            'categories',
            'publicUtility',
            'locations',
            'communityParticipates',
            'faq',
            'advertisements',
            'about',
            'contactTransparency',
          ];

          const activeOrder = config.sectionsOrder && config.sectionsOrder.length > 0
            ? config.sectionsOrder
            : defaultOrder;

          return activeOrder.map((sectionKey) => {
            if (sectionKey === 'classifieds') return null;
            const isVisible = config.sectionsVisible ? config.sectionsVisible[sectionKey] : true;
            if (isVisible === false) return null;
            return sectionComponentMap[sectionKey] || null;
          });
        })()}
      </main>

      {/* Footer with Discreet Micro-Lock on the bottom right corner */}
      <Footer onOpenMicroLock={handleOpenMicroLock} />

      {/* Floating Original WhatsApp Balloon */}
      <WhatsAppWidget />

      {/* Micro-Lock & Authentication Modal (Strictly Distinct Passwords & Screens) */}
      <AuthModal
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
        initialTarget={authInitialTarget}
        onSuccessOpenPanel={handleSuccessAuth}
      />

      {/* Administrator Control Panel (100% Page Configuration) */}
      <AdminPanelModal
        isOpen={adminPanelOpen}
        onClose={() => {
          setAdminPanelOpen(false);
          try {
            if (window.location.search.includes('admin') || window.location.hash.includes('admin')) {
              window.history.pushState(null, '', window.location.pathname);
            }
          } catch {}
        }}
        onPreviewArticle={(art) => setReadingArticle(art)}
      />

      {/* Community User / Operator Panel (Fila Editorial, Banners e Redação) */}
      <UserPanelModal
        isOpen={userPanelOpen}
        onClose={() => {
          logout();
          setUserPanelOpen(false);
        }}
        onPreviewArticle={(art) => setReadingArticle(art)}
      />

      {/* Full Article Reader Modal */}
      <ArticleModal
        article={readingArticle}
        onClose={() => setReadingArticle(null)}
      />
    </div>
  );
}

export default function App() {
  return (
    <StoreProvider>
      <MainPortal />
    </StoreProvider>
  );
}
