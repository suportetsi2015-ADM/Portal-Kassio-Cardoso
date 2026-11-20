import React from 'react';
import { useStore } from '../context/StoreContext';
import { Lock, Phone, MessageSquare } from 'lucide-react';

// Authentic Official WhatsApp Logo SVG
const WhatsAppIcon: React.FC<{ className?: string }> = ({ className = 'w-7 h-7' }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
    <path d="M12.031 2c-5.508 0-9.988 4.478-9.99 9.984a9.945 9.945 0 001.523 5.344l-1.564 5.71 5.86-1.536a9.98 9.98 0 004.17.915h.004c5.507 0 9.986-4.479 9.988-9.987A9.97 9.97 0 0019.098 5.2 9.96 9.96 0 0012.031 2zm0 18.29h-.003a8.31 8.31 0 01-4.238-1.161l-.304-.18-3.149.826.84-3.07-.198-.316a8.307 8.307 0 01-1.272-4.405c.002-4.587 3.736-8.32 8.324-8.32a8.27 8.27 0 015.894 2.438 8.27 8.27 0 012.44 5.891c-.002 4.588-3.736 8.322-8.322 8.322zm4.56-6.223c-.25-.125-1.478-.73-1.708-.813-.23-.083-.396-.125-.563.125-.166.25-.645.813-.79 1-.146.188-.292.208-.542.083-.25-.125-1.056-.389-2.012-1.241-.744-.664-1.246-1.484-1.392-1.734-.146-.25-.016-.385.11-.51.112-.112.25-.292.375-.438.125-.146.166-.25.25-.417.083-.166.041-.312-.021-.438-.063-.125-.563-1.354-.771-1.854-.203-.487-.41-.421-.563-.429l-.48-.008c-.166 0-.437.062-.666.312-.23.25-.875.854-.875 2.083 0 1.23.896 2.417 1.02 2.584.125.166 1.764 2.693 4.274 3.777.597.258 1.064.412 1.428.528.6.191 1.146.164 1.577.1.48-.072 1.478-.604 1.687-1.187.209-.583.209-1.083.146-1.187-.063-.105-.229-.167-.479-.292z" />
  </svg>
);

interface FooterProps {
  onOpenMicroLock: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onOpenMicroLock }) => {
  const { config } = useStore();

  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  const rawPhone = config.contactPhone || config.socialLinks?.whatsapp || '(92) 98144-0022';
  const cleanPhone = rawPhone.replace(/\D/g, '') || '5592981440022';
  const formattedPhone = cleanPhone.startsWith('55') ? cleanPhone : `55${cleanPhone}`;

  const openWhatsApp = () => {
    const msg = encodeURIComponent(`Olá Redação do COMUNIDADE EM AÇÃO! Gostaria de falar com o jornalista Kássio Cardoso e equipe.`);
    window.open(`https://wa.me/${formattedPhone}?text=${msg}`, '_blank');
  };

  return (
    <footer className="relative bg-slate-950 text-slate-400 font-sans border-t border-slate-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        
        {/* 4-Column Grid: Brand, Navigation, Institutional, and Dedicated WhatsApp Position */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 pb-12 border-b border-slate-800 items-start">
          
          {/* Column 1: Brand Info */}
          <div>
            <span className="font-editorial text-2xl font-bold text-white block">
              {config.siteName}
            </span>
            <span className="text-xs text-emerald-400 font-medium uppercase tracking-wider block mt-0.5">
              {config.subtagline}
            </span>
            <p className="mt-3 text-sm text-slate-400 leading-relaxed">
              {config.footer?.aboutText ||
                'Jornalismo comunitário independente dando voz e vez às comunidades ribeirinhas, urbanas e do interior do Amazonas.'}
            </p>
            <p className="mt-3 text-xs text-slate-500">
              {config.authorCredit}
            </p>
          </div>

          {/* Column 2: Navigation Links */}
          <div>
            <h4 className="text-xs font-semibold text-slate-200 uppercase tracking-wider mb-3">
              {config.structureTexts?.footerNavTitle || 'Navegação'}
            </h4>
            <ul className="space-y-2 text-sm">
              <li>
                <button
                  onClick={() => scrollTo('ultimas-noticias')}
                  className="hover:text-white transition-colors cursor-pointer text-left"
                >
                  Últimas Notícias
                </button>
              </li>
              <li>
                <button
                  onClick={() => scrollTo('destaques')}
                  className="hover:text-white transition-colors cursor-pointer text-left"
                >
                  Destaques Editoriais
                </button>
              </li>
              <li>
                <button
                  onClick={() => scrollTo('categorias')}
                  className="hover:text-white transition-colors cursor-pointer text-left"
                >
                  Categorias do Amazonas
                </button>
              </li>
              <li>
                <button
                  onClick={() => scrollTo('utilidade-publica')}
                  className="hover:text-white transition-colors cursor-pointer text-left font-semibold text-red-400"
                >
                  Utilidade Pública & SOS
                </button>
              </li>
              <li>
                <button
                  onClick={() => scrollTo('localidades')}
                  className="hover:text-white transition-colors cursor-pointer text-left"
                >
                  Territórios e Municípios
                </button>
              </li>
              <li>
                <button
                  onClick={() => scrollTo('comunidade-participa')}
                  className="hover:text-white transition-colors cursor-pointer text-left text-amber-300 font-semibold"
                >
                  Comunidade Participa
                </button>
              </li>
            </ul>
          </div>

          {/* Column 3: Institutional Links */}
          <div>
            <h4 className="text-xs font-semibold text-slate-200 uppercase tracking-wider mb-3">
              {config.structureTexts?.footerInstTitle || 'Institucional & LGPD'}
            </h4>
            <ul className="space-y-2 text-sm">
              <li>
                <button
                  onClick={() => scrollTo('sobre')}
                  className="hover:text-white transition-colors cursor-pointer text-left"
                >
                  Sobre Kássio Cardoso
                </button>
              </li>
              <li>
                <button
                  onClick={() => scrollTo('contato')}
                  className="hover:text-white transition-colors cursor-pointer text-left"
                >
                  Expediente & Redação
                </button>
              </li>
              <li>
                <button
                  onClick={() => scrollTo('contato')}
                  className="hover:text-white transition-colors cursor-pointer text-left"
                >
                  Política de Privacidade
                </button>
              </li>
              <li>
                <button
                  onClick={() => scrollTo('anuncios')}
                  className="hover:text-white transition-colors cursor-pointer text-left"
                >
                  Regras de Publicidade
                </button>
              </li>
            </ul>
          </div>

          {/* Column 4: NOVA POSIÇÃO EXCLUSIVA DO BALÃO DO WHATSAPP & PLANTÃO REDAÇÃO (TELA de Correção 2) */}
          <div className="flex flex-col items-center sm:items-start lg:items-center justify-center p-6 bg-slate-900/90 rounded-2xl border border-slate-800 text-center space-y-3.5">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-widest font-sans">
              {config.structureTexts?.footerDirectChannelTitle || 'Canal Direto de Notícias'}
            </span>

            {/* Balão do WhatsApp (Official Green #25D366) */}
            <button
              onClick={openWhatsApp}
              aria-label="Abrir Balão do WhatsApp Oficial"
              title="Clique para falar no WhatsApp da Redação"
              className="group relative flex items-center justify-center w-16 h-16 bg-[#25D366] hover:bg-[#20ba5a] text-white rounded-full shadow-2xl transition-all duration-300 hover:scale-105 active:scale-95 focus:outline-none focus:ring-4 focus:ring-[#25D366]/40 cursor-pointer"
            >
              <span className="absolute -inset-1 rounded-full bg-[#25D366] opacity-35 animate-ping pointer-events-none" />
              <WhatsAppIcon className="w-9 h-9 text-white drop-shadow-sm" />
            </button>

            {/* Posicionado bem abaixo do botão Balão do WhatsApp conforme solicitado */}
            <button
              onClick={openWhatsApp}
              className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-slate-950 hover:bg-slate-800 border border-emerald-500/50 rounded-full text-xs font-semibold text-emerald-300 shadow-sm transition-all cursor-pointer"
              title="Plantão WhatsApp da Redação"
            >
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse shrink-0" />
              <span>Plantão WhatsApp · Redação</span>
            </button>

            <span className="text-[11px] text-slate-500 font-mono">
              {config.contactPhone || '(92) 98144-0022'}
            </span>
          </div>
        </div>

        {/* Bottom Bar with Discreet Micro-Lock on the far right corner */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <div className="flex items-center gap-1">
            <span>
              {config.footer?.copyrightText ||
                `© ${new Date().getFullYear()} ${config.siteName}. Todos os direitos reservados.`}
            </span>
          </div>

          <div className="flex items-center gap-6">
            <span className="italic flex items-center gap-1">
              <span>“{config.tagline || 'A notícia nasce na comunidade.'}”</span>
            </span>

            {/* Microcadeado discreto de acesso no rodapé */}
            <button
              onClick={onOpenMicroLock}
              aria-label="Acesso ao Painel do Usuário (Área do Colaborador)"
              title="Acesso ao Painel do Usuário"
              className="p-2 text-slate-700 hover:text-slate-400 focus:text-slate-300 focus:outline-none focus:ring-1 focus:ring-slate-500 rounded-md transition-colors cursor-pointer mr-6 sm:mr-10"
            >
              <Lock className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};
