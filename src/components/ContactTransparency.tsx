import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { Mail, Phone, MapPin, FileText, Shield, AlertCircle, BookCheck, Megaphone } from 'lucide-react';

export const ContactTransparency: React.FC = () => {
  const { config } = useStore();
  const [activeTab, setActiveTab] = useState<'masthead' | 'ethics' | 'privacy' | 'corrections' | 'advertising'>('masthead');

  const institutional = config.institutional || {
    masthead: '',
    editorialPrinciples: '',
    privacyPolicy: '',
    correctionsPolicy: '',
    advertisingTerms: '',
  };

  return (
    <section id="contato" className="py-16 sm:py-20 bg-slate-50 border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="max-w-3xl mb-10">
          <div className="text-xs font-semibold text-emerald-800 uppercase tracking-widest font-sans">
            {config.structureTexts?.contactEyebrow || 'Transparência & Conformidade'}
          </div>
          <h2 className="text-2xl sm:text-4xl font-bold font-editorial text-slate-900 mt-1">
            {config.structureTexts?.contactSectionTitle || 'Expediente, Políticas e Contato'}
          </h2>
          <p className="text-sm text-slate-600 mt-2 font-sans">
            {config.structureTexts?.contactSectionSubtitle || 'Garantias de conformidade com a Lei Geral de Proteção de Dados (LGPD) e transparência da equipe editorial.'}
          </p>
        </div>

        {/* Contacts Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-12">
          <div className="bg-white p-5 rounded-xl border border-slate-200 flex items-center gap-4 shadow-2xs hover:border-slate-300 transition-colors">
            <div className="p-3 bg-blue-50 text-[#0f3d59] rounded-lg">
              <Mail className="w-5 h-5" />
            </div>
            <div>
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block font-sans">
                E-mail da Redação
              </span>
              <a href={`mailto:${config.contactEmail || 'redacao@comunidadeemacao.am'}`} className="text-sm font-semibold text-slate-900 hover:text-[#0f3d59] transition-colors">
                {config.contactEmail || 'redacao@comunidadeemacao.am'}
              </a>
            </div>
          </div>

          <div className="bg-white p-5 rounded-xl border border-slate-200 flex items-center gap-4 shadow-2xs hover:border-slate-300 transition-colors">
            <div className="p-3 bg-emerald-50 text-emerald-800 rounded-lg">
              <Phone className="w-5 h-5" />
            </div>
            <div>
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block font-sans">
                Telefone & WhatsApp
              </span>
              <span className="text-sm font-semibold text-slate-900">
                {config.contactPhone || '(92) 98144-0022'}
              </span>
            </div>
          </div>

          <div className="bg-white p-5 rounded-xl border border-slate-200 flex items-center gap-4 shadow-2xs hover:border-slate-300 transition-colors">
            <div className="p-3 bg-amber-50 text-amber-800 rounded-lg">
              <MapPin className="w-5 h-5" />
            </div>
            <div>
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block font-sans">
                Sede Operacional
              </span>
              <span className="text-sm font-semibold text-slate-900">
                {config.contactAddress || 'Manaus, Amazonas — Brasil'}
              </span>
            </div>
          </div>
        </div>

        {/* Transparency Tabs */}
        <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
          <div className="flex border-b border-slate-200 overflow-x-auto scrollbar-none">
            <button
              onClick={() => setActiveTab('masthead')}
              className={`px-5 py-3.5 text-xs sm:text-sm font-semibold transition-colors flex items-center gap-2 whitespace-nowrap cursor-pointer ${
                activeTab === 'masthead'
                  ? 'border-b-2 border-[#0f3d59] text-[#0f3d59] bg-slate-50/50'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <FileText className="w-4 h-4" />
              <span>Expediente Editorial</span>
            </button>

            <button
              onClick={() => setActiveTab('ethics')}
              className={`px-5 py-3.5 text-xs sm:text-sm font-semibold transition-colors flex items-center gap-2 whitespace-nowrap cursor-pointer ${
                activeTab === 'ethics'
                  ? 'border-b-2 border-[#0f3d59] text-[#0f3d59] bg-slate-50/50'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <BookCheck className="w-4 h-4" />
              <span>Princípios Editoriais</span>
            </button>

            <button
              onClick={() => setActiveTab('privacy')}
              className={`px-5 py-3.5 text-xs sm:text-sm font-semibold transition-colors flex items-center gap-2 whitespace-nowrap cursor-pointer ${
                activeTab === 'privacy'
                  ? 'border-b-2 border-[#0f3d59] text-[#0f3d59] bg-slate-50/50'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Shield className="w-4 h-4" />
              <span>Privacidade & LGPD</span>
            </button>

            <button
              onClick={() => setActiveTab('corrections')}
              className={`px-5 py-3.5 text-xs sm:text-sm font-semibold transition-colors flex items-center gap-2 whitespace-nowrap cursor-pointer ${
                activeTab === 'corrections'
                  ? 'border-b-2 border-[#0f3d59] text-[#0f3d59] bg-slate-50/50'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <AlertCircle className="w-4 h-4" />
              <span>Correções e Direito de Resposta</span>
            </button>

            <button
              onClick={() => setActiveTab('advertising')}
              className={`px-5 py-3.5 text-xs sm:text-sm font-semibold transition-colors flex items-center gap-2 whitespace-nowrap cursor-pointer ${
                activeTab === 'advertising'
                  ? 'border-b-2 border-[#0f3d59] text-[#0f3d59] bg-slate-50/50'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Megaphone className="w-4 h-4" />
              <span>Regras de Publicidade</span>
            </button>
          </div>

          <div className="p-6 sm:p-8 text-sm font-sans text-slate-700 leading-relaxed whitespace-pre-line">
            {activeTab === 'masthead' && (institutional.masthead || 'Nenhum expediente cadastrado.')}
            {activeTab === 'ethics' && (institutional.editorialPrinciples || 'Nenhum princípio cadastrado.')}
            {activeTab === 'privacy' && (institutional.privacyPolicy || 'Nenhuma política de privacidade cadastrada.')}
            {activeTab === 'corrections' && (institutional.correctionsPolicy || 'Nenhuma política de correções cadastrada.')}
            {activeTab === 'advertising' && (institutional.advertisingTerms || 'Nenhuma regra de publicidade cadastrada.')}
          </div>
        </div>
      </div>
    </section>
  );
};
