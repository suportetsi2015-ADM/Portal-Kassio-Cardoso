import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { Menu, X, CloudSun, Calendar, MessageSquareShare } from 'lucide-react';
import { INITIAL_HEADER_NAV_LINKS } from '../data/initialData';

interface HeaderProps {
  onOpenAuth?: (initialMode?: 'admin' | 'user') => void;
  onOpenPanel?: (panel: 'admin' | 'user') => void;
}

export const Header: React.FC<HeaderProps> = () => {
  const { config } = useStore();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const scrollToSection = (id: string) => {
    setMobileMenuOpen(false);
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const currentDateFormatted = new Intl.DateTimeFormat('pt-BR', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    timeZone: 'America/Manaus',
  }).format(new Date());

  const navLinks = (
    config.header?.navLinks && Array.isArray(config.header.navLinks)
      ? config.header.navLinks
      : INITIAL_HEADER_NAV_LINKS
  )
    .filter((l) => l.isVisible !== false)
    .sort((a, b) => a.order - b.order);

  const getBadgeClass = (color?: string) => {
    switch (color) {
      case 'red':
        return 'bg-red-500 text-white animate-pulse';
      case 'emerald':
        return 'bg-emerald-600 text-white';
      case 'amber':
        return 'bg-amber-400 text-slate-950 font-bold';
      case 'blue':
        return 'bg-blue-600 text-white';
      default:
        return 'bg-slate-700 text-white';
    }
  };

  const topTickerText =
    config.header?.topTickerText ||
    config.header?.topTickerLabel ||
    config.structureTexts?.topTickerLabel ||
    'Plantão Amazonas';

  const ctaButtonText =
    config.header?.ctaButtonText ||
    config.structureTexts?.topCtaButtonText ||
    'Fazer Denúncia';

  const ctaTarget = config.header?.ctaButtonTarget || 'comunidade-participa';
  const ctaColor = config.header?.ctaButtonColor || 'amber';

  const getCtaColorClasses = (color?: string) => {
    switch (color) {
      case 'emerald':
        return 'bg-emerald-600 hover:bg-emerald-700 text-white';
      case 'red':
        return 'bg-red-600 hover:bg-red-700 text-white animate-pulse';
      case 'blue':
        return 'bg-[#0f3d59] hover:bg-[#1b4b68] text-white';
      case 'amber':
      default:
        return 'bg-amber-400 hover:bg-amber-300 text-slate-950';
    }
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200 transition-all">
      {/* Top Utility Ticker Bar (Weather & Amazonas Date) */}
      <div
        className="text-slate-300 text-[11px] py-1 px-4 sm:px-6 lg:px-8 border-b border-slate-800"
        style={{ backgroundColor: config.palette?.newsTickerBg || '#0f172a' }}
      >
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1.5 text-amber-400 font-semibold uppercase tracking-wider text-[10px]">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>{topTickerText}</span>
            </span>
            <span className="hidden sm:inline text-slate-500">|</span>
            <span className="hidden sm:flex items-center gap-1 text-slate-300 capitalize">
              <Calendar className="w-3 h-3 text-slate-400" />
              <span>{currentDateFormatted}</span>
            </span>
          </div>

          <div className="flex items-center gap-4 text-[11px]">
            {config.header?.showWeather && (
              <span className="flex items-center gap-1.5 text-slate-300">
                <CloudSun className="w-3.5 h-3.5 text-amber-400" />
                <span className="font-semibold text-white">{config.header.weatherLocation || 'Manaus - AM'}</span>
                <span className="text-amber-300 font-bold">{config.header.weatherTemp || '29°C'}</span>
                <span className="hidden md:inline text-slate-400 text-[10px]">({config.header.weatherCondition || 'Tempo bom'})</span>
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Main Navigation Bar (Clean Editorial Wordmark + Dynamic Nav Categories) */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between gap-6">
        
        {/* Zone 1: Brand Wordmark / Logo */}
        <div className="flex items-center gap-3 shrink-0">
          <a
            href="#"
            className="flex items-center gap-3 text-left group"
            onClick={(e) => {
              e.preventDefault();
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
          >
            {config.header?.logoType === 'image' && config.header?.logoImageUrl ? (
              <img
                src={config.header.logoImageUrl}
                alt={config.siteName}
                className="h-10 sm:h-12 w-auto object-contain"
              />
            ) : null}
            <div className="flex flex-col">
              <span className="font-editorial text-xl sm:text-2xl font-bold tracking-tight text-slate-900 group-hover:text-[#0f3d59] transition-colors whitespace-nowrap">
                {config.header?.logoText || config.siteName || 'COMUNIDADE EM AÇÃO'}
              </span>
              <span className="text-[11px] font-sans font-medium text-emerald-800 tracking-wider uppercase -mt-0.5 hidden sm:block">
                {config.header?.logoSubtext || config.subtagline || 'AMAZONAS'}
              </span>
            </div>
          </a>
        </div>

        {/* Zone 2: 100% Dynamic Nav Links (Categories including SOBRE) */}
        <nav className="hidden lg:flex items-center gap-5 text-sm font-medium text-slate-700">
          {navLinks.map((link) => {
            const isSpecialSobre = link.targetSection === 'sobre' || link.id === 'nav-about';
            const isUtilidade = link.targetSection === 'utilidade-publica';

            return (
              <button
                key={link.id}
                onClick={() => scrollToSection(link.targetSection)}
                className={`transition-colors whitespace-nowrap cursor-pointer flex items-center gap-1.5 ${
                  isUtilidade
                    ? 'font-semibold text-red-800 bg-red-50/90 px-2.5 py-1 rounded-lg border border-red-200/80 hover:bg-red-100'
                    : isSpecialSobre
                    ? 'font-semibold text-emerald-800 bg-emerald-50/80 px-2.5 py-1 rounded-lg border border-emerald-200/80 hover:bg-emerald-100 hover:text-emerald-950'
                    : 'hover:text-[#0f3d59]'
                }`}
              >
                {link.badge && (
                  <span
                    className={`text-[9px] font-sans font-bold px-1.5 py-0.2 rounded-full uppercase tracking-wider ${getBadgeClass(
                      link.badgeColor
                    )}`}
                  >
                    {link.badge}
                  </span>
                )}
                <span>{link.label}</span>
              </button>
            );
          })}
        </nav>

        {/* Zone 3: Public Community Action (Customizable CTA) */}
        <div className="flex items-center gap-3 shrink-0">
          {config.header?.ctaButtonVisible !== false && (
            <button
              onClick={() => scrollToSection(ctaTarget)}
              className={`flex items-center gap-1.5 px-4 py-2 text-xs sm:text-sm font-bold rounded-lg transition-all whitespace-nowrap shadow-xs hover:shadow-md cursor-pointer ${getCtaColorClasses(
                ctaColor
              )}`}
            >
              <MessageSquareShare className="w-4 h-4" />
              <span>{ctaButtonText}</span>
            </button>
          )}

          {/* Mobile Menu Button */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 text-slate-700 hover:text-slate-900 rounded-md focus:outline-none cursor-pointer"
            aria-label="Abrir menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-slate-200 bg-white px-4 pt-3 pb-5 space-y-2 text-sm font-medium animate-in fade-in">
          {navLinks.map((link) => {
            const isUtilidade = link.targetSection === 'utilidade-publica';
            const isSpecialSobre = link.targetSection === 'sobre' || link.id === 'nav-about';

            return (
              <button
                key={link.id}
                onClick={() => scrollToSection(link.targetSection)}
                className={`w-full text-left py-2 px-3 rounded-lg transition-colors flex items-center justify-between cursor-pointer ${
                  isUtilidade
                    ? 'text-red-800 font-bold bg-red-50 hover:bg-red-100'
                    : isSpecialSobre
                    ? 'text-emerald-900 font-bold bg-emerald-50 hover:bg-emerald-100'
                    : 'text-slate-700 hover:bg-slate-100 hover:text-[#0f3d59]'
                }`}
              >
                <span>{link.label}</span>
                {link.badge && (
                  <span
                    className={`text-[10px] px-2 py-0.5 rounded-full uppercase font-bold tracking-wider ${getBadgeClass(
                      link.badgeColor
                    )}`}
                  >
                    {link.badge}
                  </span>
                )}
              </button>
            );
          })}
          {config.header?.ctaButtonVisible !== false && (
            <button
              onClick={() => scrollToSection(ctaTarget)}
              className="w-full text-left py-2.5 px-3 font-bold text-slate-950 bg-amber-400 hover:bg-amber-300 rounded-lg mt-2 text-center cursor-pointer block"
            >
              🚨 {ctaButtonText}
            </button>
          )}
        </div>
      )}
    </header>
  );
};
