import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { X, Send, AlertTriangle, ShieldCheck, ChevronRight } from 'lucide-react';

// Authentic Official WhatsApp Logo SVG
const WhatsAppOfficialIcon: React.FC<{ className?: string }> = ({ className = 'w-7 h-7' }) => (
  <svg
    viewBox="0 0 24 24"
    fill="currentColor"
    className={className}
    aria-hidden="true"
  >
    <path d="M12.031 2c-5.508 0-9.988 4.478-9.99 9.984a9.945 9.945 0 001.523 5.344l-1.564 5.71 5.86-1.536a9.98 9.98 0 004.17.915h.004c5.507 0 9.986-4.479 9.988-9.987A9.97 9.97 0 0019.098 5.2 9.96 9.96 0 0012.031 2zm0 18.29h-.003a8.31 8.31 0 01-4.238-1.161l-.304-.18-3.149.826.84-3.07-.198-.316a8.307 8.307 0 01-1.272-4.405c.002-4.587 3.736-8.32 8.324-8.32a8.27 8.27 0 015.894 2.438 8.27 8.27 0 012.44 5.891c-.002 4.588-3.736 8.322-8.322 8.322zm4.56-6.223c-.25-.125-1.478-.73-1.708-.813-.23-.083-.396-.125-.563.125-.166.25-.645.813-.79 1-.146.188-.292.208-.542.083-.25-.125-1.056-.389-2.012-1.241-.744-.664-1.246-1.484-1.392-1.734-.146-.25-.016-.385.11-.51.112-.112.25-.292.375-.438.125-.146.166-.25.25-.417.083-.166.041-.312-.021-.438-.063-.125-.563-1.354-.771-1.854-.203-.487-.41-.421-.563-.429l-.48-.008c-.166 0-.437.062-.666.312-.23.25-.875.854-.875 2.083 0 1.23.896 2.417 1.02 2.584.125.166 1.764 2.693 4.274 3.777.597.258 1.064.412 1.428.528.6.191 1.146.164 1.577.1.48-.072 1.478-.604 1.687-1.187.209-.583.209-1.083.146-1.187-.063-.105-.229-.167-.479-.292z" />
  </svg>
);

export const WhatsAppWidget: React.FC = () => {
  const { config } = useStore();
  const [isOpen, setIsOpen] = useState(false);
  const [customMessage, setCustomMessage] = useState('');

  // Clean phone number for WhatsApp wa.me link
  const rawPhone = config.contactPhone || config.socialLinks?.whatsapp || '(92) 98144-0022';
  const cleanPhone = rawPhone.replace(/\D/g, '') || '5592981440022';
  const formattedNumber = cleanPhone.startsWith('55') ? cleanPhone : `55${cleanPhone}`;

  const openWhatsAppWithMessage = (msg: string) => {
    const encoded = encodeURIComponent(msg);
    const url = `https://wa.me/${formattedNumber}?text=${encoded}`;
    const link = document.createElement('a');
    link.href = url;
    link.target = '_blank';
    link.rel = 'noopener noreferrer';
    link.click();
    setIsOpen(false);
  };

  const handleSendCustom = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customMessage.trim()) return;
    openWhatsAppWithMessage(customMessage);
    setCustomMessage('');
  };

  return (
    <>
      {/* Floating WhatsApp Balloon Trigger Button (Original WhatsApp Green #25D366) on the RIGHT side */}
      <div className="fixed bottom-6 right-6 z-40 flex items-center gap-3 flex-row-reverse">
        <button
          onClick={() => setIsOpen(!isOpen)}
          aria-label="Abrir canal do WhatsApp da redação"
          className="group relative flex items-center justify-center w-14 h-14 bg-[#25D366] hover:bg-[#20ba5a] text-white rounded-full shadow-2xl transition-all duration-300 hover:scale-105 active:scale-95 focus:outline-none focus:ring-4 focus:ring-[#25D366]/40 cursor-pointer"
        >
          {isOpen ? (
            <X className="w-6 h-6 text-white" />
          ) : (
            <>
              {/* Pulsing beacon aura */}
              <span className="absolute -inset-1 rounded-full bg-[#25D366] opacity-40 animate-ping pointer-events-none" />
              <WhatsAppOfficialIcon className="w-8 h-8 text-white drop-shadow-sm" />
            </>
          )}
        </button>

        {/* Small badge / notification tooltip when closed */}
        {!isOpen && (
          <div
            onClick={() => setIsOpen(true)}
            className="hidden sm:flex items-center gap-2 px-3.5 py-2 bg-slate-900/90 text-white rounded-full text-xs font-sans shadow-xl border border-slate-700/60 backdrop-blur-xs cursor-pointer hover:bg-slate-900 transition-colors"
          >
            <span className="w-2.5 h-2.5 rounded-full bg-[#25D366] animate-pulse" />
            <span className="font-semibold text-white">Plantão WhatsApp</span>
            <span className="text-slate-400">· Redação</span>
          </div>
        )}
      </div>

      {/* WhatsApp Chat Balloon Card (Popup on the RIGHT side) */}
      {isOpen && (
        <div className="fixed bottom-24 right-6 z-40 w-88 max-w-[calc(100vw-3rem)] bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden animate-in slide-in-from-bottom-4 duration-200 font-sans">
          
          {/* WhatsApp Header (#075E54) */}
          <div className="bg-[#075E54] text-white p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="relative w-11 h-11 rounded-full bg-[#25D366] flex items-center justify-center text-white shadow-md">
                  <WhatsAppOfficialIcon className="w-7 h-7" />
                  <span className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-400 border-2 border-[#075E54] rounded-full" />
                </div>
                <div>
                  <h4 className="font-bold text-sm leading-tight">Redação Comunidade em Ação</h4>
                  <span className="text-[11px] text-emerald-200 block">Plantão de Notícias & Denúncias</span>
                </div>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="text-white/80 hover:text-white p-1 rounded hover:bg-white/10"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <p className="mt-2 text-[11px] text-white/90 leading-tight">
              Envie relatos, fotos e vídeos direto pelo WhatsApp para apuração de Kássio Cardoso e equipe.
            </p>
          </div>

          {/* Quick Shortcuts */}
          <div className="p-3 bg-slate-50 border-b border-slate-100 space-y-2">
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block px-1">
              Atalhos Rápidos:
            </span>

            <button
              onClick={() =>
                openWhatsAppWithMessage(
                  '🚨 Olá, equipe do Comunidade em Ação! Gostaria de enviar uma denúncia sobre a minha comunidade/bairro com fotos e vídeos.'
                )
              }
              className="w-full p-2.5 bg-white border border-slate-200 hover:border-[#25D366] hover:bg-emerald-50/40 rounded-xl text-left text-xs text-slate-800 font-medium flex items-center justify-between transition-all group cursor-pointer"
            >
              <div className="flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
                <span>Enviar Denúncia com Fotos/Vídeos</span>
              </div>
              <ChevronRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-[#25D366]" />
            </button>

            <button
              onClick={() =>
                openWhatsAppWithMessage(
                  '📢 Olá, redação! Tenho uma sugestão de pauta sobre um evento ou iniciativa comunitária na minha região.'
                )
              }
              className="w-full p-2.5 bg-white border border-slate-200 hover:border-[#25D366] hover:bg-emerald-50/40 rounded-xl text-left text-xs text-slate-800 font-medium flex items-center justify-between transition-all group cursor-pointer"
            >
              <div className="flex items-center gap-2">
                <WhatsAppOfficialIcon className="w-4 h-4 text-[#25D366] shrink-0" />
                <span>Sugerir Pauta / História da Comunidade</span>
              </div>
              <ChevronRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-[#25D366]" />
            </button>

            <button
              onClick={() =>
                openWhatsAppWithMessage(
                  '🎙️ Olá Kássio Cardoso! Gostaria de falar com o jornalista sobre uma demanda urgente do nosso município.'
                )
              }
              className="w-full p-2.5 bg-white border border-slate-200 hover:border-[#25D366] hover:bg-emerald-50/40 rounded-xl text-left text-xs text-slate-800 font-medium flex items-center justify-between transition-all group cursor-pointer"
            >
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-blue-600 shrink-0" />
                <span>Falar com o Jornalista Kássio Cardoso</span>
              </div>
              <ChevronRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-[#25D366]" />
            </button>
          </div>

          {/* Direct WhatsApp Message Form */}
          <div className="p-3 bg-white">
            <form onSubmit={handleSendCustom} className="flex gap-2">
              <input
                type="text"
                placeholder="Escreva sua mensagem rápida..."
                value={customMessage}
                onChange={(e) => setCustomMessage(e.target.value)}
                className="flex-1 px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#25D366] focus:bg-white"
              />
              <button
                type="submit"
                className="p-2 bg-[#25D366] hover:bg-[#20ba5a] text-white rounded-lg transition-colors cursor-pointer"
                title="Abrir no WhatsApp"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>

            <div className="mt-2 text-center text-[10px] text-slate-400">
              Número da Redação: <strong className="text-slate-600">{config.contactPhone}</strong>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
