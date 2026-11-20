import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { HelpCircle, ChevronDown, ChevronUp, Search, MessageSquare } from 'lucide-react';

export const FAQSection: React.FC = () => {
  const { faqs, config } = useStore();
  const [openId, setOpenId] = useState<string | null>(faqs[0]?.id || null);
  const [search, setSearch] = useState('');

  const activeFaqs = faqs.filter((f) => f.isActive);
  const filtered = activeFaqs.filter(
    (f) =>
      f.question.toLowerCase().includes(search.toLowerCase()) ||
      f.answer.toLowerCase().includes(search.toLowerCase())
  );

  const title = config.structureTexts?.faqSectionTitle || 'Dúvidas Frequentes da Comunidade (FAQ)';

  return (
    <section id="faq" className="py-16 bg-white border-b border-slate-200">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-10">
          <span className="text-xs font-bold text-emerald-800 uppercase tracking-widest font-sans flex items-center justify-center gap-1.5 mb-2">
            <HelpCircle className="w-4 h-4 text-emerald-700" />
            <span>{config.structureTexts?.faqEyebrow || 'Transparência & Cidadania'}</span>
          </span>
          <h2 className="font-editorial text-2xl sm:text-4xl font-bold text-slate-900 tracking-tight">
            {config.structureTexts?.faqSectionTitle || 'Dúvidas Frequentes da Comunidade (FAQ)'}
          </h2>
          <p className="mt-2 text-sm text-slate-600 font-sans">
            {config.structureTexts?.faqSectionSubtitle || 'Tire suas dúvidas sobre como enviar denúncias com sigilo, sugerir pautas e apoiar o jornalismo comunitário no Amazonas.'}
          </p>

          {/* Search bar */}
          <div className="relative mt-6 max-w-md mx-auto">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Buscar pergunta ou assunto..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#0f3d59] focus:bg-white"
            />
          </div>
        </div>

        {/* Accordion */}
        <div className="space-y-3">
          {filtered.length > 0 ? (
            filtered.map((faq) => {
              const isOpen = openId === faq.id;

              return (
                <div
                  key={faq.id}
                  className={`border rounded-xl transition-all overflow-hidden ${
                    isOpen ? 'border-[#0f3d59] bg-blue-50/20 shadow-xs' : 'border-slate-200 bg-white hover:border-slate-300'
                  }`}
                >
                  <button
                    onClick={() => setOpenId(isOpen ? null : faq.id)}
                    className="w-full p-4.5 text-left flex items-center justify-between gap-4 cursor-pointer"
                  >
                    <span className="font-semibold text-sm sm:text-base text-slate-900 leading-snug">
                      {faq.question}
                    </span>
                    <span className="text-slate-500 shrink-0">
                      {isOpen ? <ChevronUp className="w-4 h-4 text-[#0f3d59]" /> : <ChevronDown className="w-4 h-4" />}
                    </span>
                  </button>

                  {isOpen && (
                    <div className="px-4.5 pb-4.5 pt-1 text-xs sm:text-sm text-slate-600 leading-relaxed font-sans border-t border-slate-100 animate-in fade-in duration-150">
                      {faq.answer}
                    </div>
                  )}
                </div>
              );
            })
          ) : (
            <div className="p-8 text-center bg-slate-50 rounded-xl border border-dashed border-slate-300 text-slate-500 text-xs">
              Nenhuma pergunta encontrada com o termo pesquisado.
            </div>
          )}
        </div>

        {/* Quick action card */}
        <div className="mt-8 p-4 bg-slate-50 rounded-xl border border-slate-200 text-center flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-600">
          <span>Ainda tem dúvidas? Fale diretamente com a equipe pelo canal do WhatsApp.</span>
          <a
            href={`https://wa.me/5592981440022?text=${encodeURIComponent('Olá Kássio! Tenho uma dúvida sobre o portal Comunidade em Ação.')}`}
            target="_blank"
            rel="noopener noreferrer"
            className="px-4 py-2 bg-[#25D366] hover:bg-[#20ba5a] text-white font-bold rounded-lg transition-colors inline-flex items-center gap-1.5 shrink-0"
          >
            <span>Tirar Dúvida no WhatsApp</span>
          </a>
        </div>
      </div>
    </section>
  );
};
