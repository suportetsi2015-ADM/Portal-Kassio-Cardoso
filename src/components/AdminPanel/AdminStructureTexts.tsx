import React, { useState } from 'react';
import { useStore } from '../../context/StoreContext';
import { StructureTextsConfig } from '../../types';
import {
  FileCode,
  CheckCircle2,
  Sparkles,
  Layers,
  Heading,
  PhoneCall,
  MapPin,
  HelpCircle,
  Megaphone,
  AlertTriangle,
  User,
  Shield,
  Sliders,
  Search,
} from 'lucide-react';

export const AdminStructureTexts: React.FC = () => {
  const { config, updateStructureTexts } = useStore();

  const [activeTab, setActiveTab] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [savedSuccess, setSavedSuccess] = useState(false);

  // Local state initialized from config.structureTexts
  const [texts, setTexts] = useState<StructureTextsConfig>(config.structureTexts || {});

  // Synchronize when config.structureTexts updates
  React.useEffect(() => {
    if (config.structureTexts) {
      setTexts(config.structureTexts);
    }
  }, [config.structureTexts]);

  // Real-time synchronization with StoreContext
  const updateField = (key: keyof StructureTextsConfig, value: string) => {
    setTexts((prev) => {
      const updated = { ...prev, [key]: value };
      updateStructureTexts(updated);
      return updated;
    });
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateStructureTexts(texts);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3500);
  };

  const sectionsList = [
    { id: 'all', label: 'Todas as Seções' },
    { id: 'hero', label: '1. Hero & Topo' },
    { id: 'latest', label: '2. Últimas Notícias' },
    { id: 'featured', label: '3. Destaques' },
    { id: 'categories', label: '4. Categorias' },
    { id: 'publicUtility', label: '5. Utilidade Pública & SOS' },
    { id: 'locations', label: '6. Localidades & Rios' },
    { id: 'denuncia', label: '7. Canal de Denúncias' },
    { id: 'faq', label: '8. Dúvidas FAQ' },
    { id: 'ads', label: '9. Anúncios' },
    { id: 'about', label: '10. Sobre Kássio Cardoso' },
    { id: 'contact', label: '11. Contato & LGPD' },
    { id: 'footer', label: '12. Rodapé' },
  ];

  const matchesSearch = (textGroup: string[]) => {
    if (!searchTerm.trim()) return true;
    const s = searchTerm.toLowerCase();
    return textGroup.some((t) => (t || '').toLowerCase().includes(s));
  };

  return (
    <form onSubmit={handleSave} className="space-y-6">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-200 gap-3">
        <div>
          <h3 className="font-editorial text-2xl font-bold text-slate-900 flex items-center gap-2">
            <FileCode className="w-6 h-6 text-[#0f3d59]" />
            <span>Edição 100% de Títulos & Subtítulos da One Page</span>
          </h3>
          <p className="text-xs text-slate-500 font-sans mt-0.5">
            Personalize todos os títulos, subtítulos, chapéus (eyebrows) e botões de cada seção da página com atualização instantânea em tempo real.
          </p>
        </div>

        <button
          type="submit"
          className="px-5 py-2.5 bg-[#0f3d59] hover:bg-[#0a2540] text-white text-xs font-bold rounded-lg transition-colors cursor-pointer shadow-xs flex items-center gap-2 shrink-0"
        >
          <CheckCircle2 className="w-4 h-4" />
          <span>Salvar Todos os Títulos</span>
        </button>
      </div>

      {savedSuccess && (
        <div className="p-3.5 bg-emerald-50 border border-emerald-300 rounded-xl text-xs text-emerald-800 font-semibold flex items-center gap-2 animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0" />
          <span>Todos os títulos e subtítulos atualizados e sincronizados em tempo real na página!</span>
        </div>
      )}

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        {/* Section Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none no-scrollbar flex-1">
          {sectionsList.map((sec) => (
            <button
              key={sec.id}
              type="button"
              onClick={() => setActiveTab(sec.id)}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg whitespace-nowrap transition cursor-pointer shrink-0 ${
                activeTab === sec.id
                  ? 'bg-[#0f3d59] text-white shadow-xs'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              {sec.label}
            </button>
          ))}
        </div>

        {/* Quick Search Input */}
        <div className="relative w-full sm:w-64 shrink-0">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Filtrar campos ou palavras..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 text-xs bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#0f3d59]"
          />
        </div>
      </div>

      <div className="space-y-6">

        {/* 1. HERO SECTION */}
        {(activeTab === 'all' || activeTab === 'hero') &&
          matchesSearch([
            'hero',
            texts.heroBadgeText || '',
            texts.heroKicker || '',
            texts.heroPresenterLabel || '',
            texts.heroButtonExplore || '',
            texts.heroButtonReport || '',
            texts.heroButtonAd || '',
          ]) && (
            <div className="bg-white p-5 border border-slate-200 rounded-xl space-y-4 shadow-2xs">
              <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
                <span className="p-1.5 bg-amber-100 text-amber-800 rounded-lg">
                  <Sparkles className="w-4 h-4" />
                </span>
                <div>
                  <h4 className="font-editorial text-base font-bold text-slate-900">
                    1. Hero & Topo da Página
                  </h4>
                  <span className="text-xs text-slate-500 font-sans">
                    Selo territorial, apresentador e botões de ação do topo
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Selo Territorial (Badge)
                  </label>
                  <input
                    type="text"
                    value={texts.heroBadgeText || ''}
                    onChange={(e) => updateField('heroBadgeText', e.target.value)}
                    placeholder="Manaus · Amazonas"
                    className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#0f3d59]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Chapéu do Hero (Kicker)
                  </label>
                  <input
                    type="text"
                    value={texts.heroKicker || ''}
                    onChange={(e) => updateField('heroKicker', e.target.value)}
                    placeholder="Identidade Oficial de Comunicação"
                    className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#0f3d59]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Rótulo de Apresentação
                  </label>
                  <input
                    type="text"
                    value={texts.heroPresenterLabel || ''}
                    onChange={(e) => updateField('heroPresenterLabel', e.target.value)}
                    placeholder="Apresentação:"
                    className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#0f3d59]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2 border-t border-slate-100">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Botão 1 (Explorar)
                  </label>
                  <input
                    type="text"
                    value={texts.heroButtonExplore || ''}
                    onChange={(e) => updateField('heroButtonExplore', e.target.value)}
                    placeholder="Explorar Notícias"
                    className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#0f3d59]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Botão 2 (Comunidade)
                  </label>
                  <input
                    type="text"
                    value={texts.heroButtonReport || ''}
                    onChange={(e) => updateField('heroButtonReport', e.target.value)}
                    placeholder="Minha Comunidade"
                    className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#0f3d59]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Botão 3 (Publicidade)
                  </label>
                  <input
                    type="text"
                    value={texts.heroButtonAd || ''}
                    onChange={(e) => updateField('heroButtonAd', e.target.value)}
                    placeholder="Espaço Publicitário"
                    className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#0f3d59]"
                  />
                </div>
              </div>
            </div>
          )}

        {/* 2. ÚLTIMAS NOTÍCIAS */}
        {(activeTab === 'all' || activeTab === 'latest') &&
          matchesSearch([
            'ultimas noticias',
            texts.latestEyebrow || '',
            texts.latestSectionTitle || '',
            texts.latestSectionSubtitle || '',
          ]) && (
            <div className="bg-white p-5 border border-slate-200 rounded-xl space-y-4 shadow-2xs">
              <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
                <span className="p-1.5 bg-emerald-100 text-emerald-800 rounded-lg">
                  <Heading className="w-4 h-4" />
                </span>
                <div>
                  <h4 className="font-editorial text-base font-bold text-slate-900">
                    2. Seção Últimas Notícias
                  </h4>
                  <span className="text-xs text-slate-500 font-sans">
                    Título principal, chapéu e subtítulo explicativo
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Chapéu / Sobretítulo (Eyebrow)
                  </label>
                  <input
                    type="text"
                    value={texts.latestEyebrow || ''}
                    onChange={(e) => updateField('latestEyebrow', e.target.value)}
                    placeholder="Cobertura Local em Tempo Real"
                    className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#0f3d59]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Título Principal da Seção
                  </label>
                  <input
                    type="text"
                    value={texts.latestSectionTitle || ''}
                    onChange={(e) => {
                      updateField('latestSectionTitle', e.target.value);
                      updateField('heroSectionTitle', e.target.value);
                    }}
                    placeholder="Últimas Notícias"
                    className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#0f3d59] font-semibold"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Subtítulo / Descrição da Seção
                </label>
                <textarea
                  rows={2}
                  value={texts.latestSectionSubtitle || ''}
                  onChange={(e) => updateField('latestSectionSubtitle', e.target.value)}
                  placeholder="Acontecimentos, serviços públicos e histórias reais dos municípios e rios do Amazonas."
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#0f3d59]"
                />
              </div>
            </div>
          )}

        {/* 3. DESTAQUES EDITORIAIS */}
        {(activeTab === 'all' || activeTab === 'featured') &&
          matchesSearch([
            'destaques',
            texts.featuredEyebrow || '',
            texts.featuredSectionTitle || '',
            texts.featuredSectionSubtitle || '',
          ]) && (
            <div className="bg-white p-5 border border-slate-200 rounded-xl space-y-4 shadow-2xs">
              <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
                <span className="p-1.5 bg-amber-100 text-amber-800 rounded-lg">
                  <Sparkles className="w-4 h-4" />
                </span>
                <div>
                  <h4 className="font-editorial text-base font-bold text-slate-900">
                    3. Seção Destaques Editoriais
                  </h4>
                  <span className="text-xs text-slate-500 font-sans">
                    Grandes reportagens e investigações de impacto
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Chapéu (Eyebrow)
                  </label>
                  <input
                    type="text"
                    value={texts.featuredEyebrow || ''}
                    onChange={(e) => updateField('featuredEyebrow', e.target.value)}
                    placeholder="Jornalismo de Impacto"
                    className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#0f3d59]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Título Principal dos Destaques
                  </label>
                  <input
                    type="text"
                    value={texts.featuredSectionTitle || ''}
                    onChange={(e) => {
                      updateField('featuredSectionTitle', e.target.value);
                      updateField('politicsSectionTitle', e.target.value);
                    }}
                    placeholder="Destaques da Redação Comunitária"
                    className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#0f3d59] font-semibold"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Subtítulo dos Destaques
                </label>
                <input
                  type="text"
                  value={texts.featuredSectionSubtitle || ''}
                  onChange={(e) => updateField('featuredSectionSubtitle', e.target.value)}
                  placeholder="Grandes reportagens, investigações locais e acontecimentos de impacto no Amazonas"
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#0f3d59]"
                />
              </div>
            </div>
          )}

        {/* 4. CATEGORIAS & TEMÁTICAS */}
        {(activeTab === 'all' || activeTab === 'categories') &&
          matchesSearch([
            'categorias',
            texts.categoriesEyebrow || '',
            texts.categoriesSectionTitle || '',
            texts.categoriesSectionSubtitle || '',
          ]) && (
            <div className="bg-white p-5 border border-slate-200 rounded-xl space-y-4 shadow-2xs">
              <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
                <span className="p-1.5 bg-blue-100 text-blue-800 rounded-lg">
                  <Layers className="w-4 h-4" />
                </span>
                <div>
                  <h4 className="font-editorial text-base font-bold text-slate-900">
                    4. Seção Categorias & Temáticas
                  </h4>
                  <span className="text-xs text-slate-500 font-sans">
                    Navegação por editorias temáticas do Amazonas
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Chapéu (Eyebrow)
                  </label>
                  <input
                    type="text"
                    value={texts.categoriesEyebrow || ''}
                    onChange={(e) => updateField('categoriesEyebrow', e.target.value)}
                    placeholder="Editorias do Portal"
                    className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#0f3d59]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Título da Seção de Categorias
                  </label>
                  <input
                    type="text"
                    value={texts.categoriesSectionTitle || ''}
                    onChange={(e) => {
                      updateField('categoriesSectionTitle', e.target.value);
                      updateField('citiesSectionTitle', e.target.value);
                    }}
                    placeholder="Categorias e Temáticas"
                    className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#0f3d59] font-semibold"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Subtítulo de Categorias
                </label>
                <textarea
                  rows={2}
                  value={texts.categoriesSectionSubtitle || ''}
                  onChange={(e) => updateField('categoriesSectionSubtitle', e.target.value)}
                  placeholder="Navegue pelas editorias oficiais do COMUNIDADE EM AÇÃO, organizadas para dar visibilidade integral ao estado do Amazonas."
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#0f3d59]"
                />
              </div>
            </div>
          )}

        {/* 5. UTILIDADE PÚBLICA & SOS */}
        {(activeTab === 'all' || activeTab === 'publicUtility') &&
          matchesSearch([
            'utilidade publica',
            texts.publicUtilityEyebrow || '',
            texts.publicUtilitySectionTitle || '',
            texts.publicUtilitySectionSubtitle || '',
            texts.publicUtilityEmergencyTitle || '',
            texts.publicUtilityEmergencySub || '',
          ]) && (
            <div className="bg-white p-5 border border-slate-200 rounded-xl space-y-4 shadow-2xs">
              <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
                <span className="p-1.5 bg-red-100 text-red-800 rounded-lg">
                  <PhoneCall className="w-4 h-4" />
                </span>
                <div>
                  <h4 className="font-editorial text-base font-bold text-slate-900">
                    5. Seção Utilidade Pública & SOS
                  </h4>
                  <span className="text-xs text-slate-500 font-sans">
                    Contatos de emergência, hospitais e órgãos de assistência
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Chapéu (Eyebrow)
                  </label>
                  <input
                    type="text"
                    value={texts.publicUtilityEyebrow || ''}
                    onChange={(e) => updateField('publicUtilityEyebrow', e.target.value)}
                    placeholder="Serviço Comunitário e Cidadania"
                    className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#0f3d59]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Título Principal
                  </label>
                  <input
                    type="text"
                    value={texts.publicUtilitySectionTitle || ''}
                    onChange={(e) => updateField('publicUtilitySectionTitle', e.target.value)}
                    placeholder="Utilidade Pública & Emergências do Amazonas"
                    className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#0f3d59] font-semibold"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Subtítulo de Utilidade Pública
                </label>
                <textarea
                  rows={2}
                  value={texts.publicUtilitySectionSubtitle || ''}
                  onChange={(e) => updateField('publicUtilitySectionSubtitle', e.target.value)}
                  placeholder="Telefones úteis, endereços, canais de atendimento e WhatsApp dos órgãos essenciais de apoio à população e à redação de reportagem local."
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#0f3d59]"
                />
              </div>

              {/* Emergency Bar Titles */}
              <div className="p-3.5 bg-red-50 border border-red-200 rounded-xl space-y-3">
                <span className="text-[11px] font-bold text-red-900 uppercase tracking-wider block">
                  Faixa de Emergência Vermelha (SOS Rápido)
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                      Título da Faixa
                    </label>
                    <input
                      type="text"
                      value={texts.publicUtilityEmergencyTitle || ''}
                      onChange={(e) => updateField('publicUtilityEmergencyTitle', e.target.value)}
                      placeholder="Disque Rápido Nacional e Estadual"
                      className="w-full px-3 py-2 text-xs bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-red-600"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                      Texto dos Telefones / Números
                    </label>
                    <input
                      type="text"
                      value={texts.publicUtilityEmergencySub || ''}
                      onChange={(e) => updateField('publicUtilityEmergencySub', e.target.value)}
                      placeholder="Polícia: 190 · Bombeiros: 193 · SAMU: 192..."
                      className="w-full px-3 py-2 text-xs bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-red-600"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

        {/* 6. LOCALIDADES & RIOS */}
        {(activeTab === 'all' || activeTab === 'locations') &&
          matchesSearch([
            'localidades',
            texts.locationsEyebrow || '',
            texts.locationsSectionTitle || '',
            texts.locationsSectionSubtitle || '',
          ]) && (
            <div className="bg-white p-5 border border-slate-200 rounded-xl space-y-4 shadow-2xs">
              <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
                <span className="p-1.5 bg-emerald-100 text-emerald-800 rounded-lg">
                  <MapPin className="w-4 h-4" />
                </span>
                <div>
                  <h4 className="font-editorial text-base font-bold text-slate-900">
                    6. Seção Notícias por Localidade & Rios
                  </h4>
                  <span className="text-xs text-slate-500 font-sans">
                    Navegação territorial por municípios e calhas fluviais
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Chapéu (Eyebrow)
                  </label>
                  <input
                    type="text"
                    value={texts.locationsEyebrow || ''}
                    onChange={(e) => updateField('locationsEyebrow', e.target.value)}
                    placeholder="Território Amazônico"
                    className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#0f3d59]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Título Principal
                  </label>
                  <input
                    type="text"
                    value={texts.locationsSectionTitle || ''}
                    onChange={(e) => updateField('locationsSectionTitle', e.target.value)}
                    placeholder="Notícias por Localidade"
                    className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#0f3d59] font-semibold"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Subtítulo de Localidades
                </label>
                <input
                  type="text"
                  value={texts.locationsSectionSubtitle || ''}
                  onChange={(e) => updateField('locationsSectionSubtitle', e.target.value)}
                  placeholder="Do centro de Manaus às comunidades mais distantes nos leitos dos rios Solimões e Negro."
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#0f3d59]"
                />
              </div>
            </div>
          )}

        {/* 7. CANAL DE DENÚNCIAS */}
        {(activeTab === 'all' || activeTab === 'denuncia') &&
          matchesSearch([
            'denuncia',
            texts.denunciaEyebrow || '',
            texts.denunciaTitle || '',
            texts.denunciaSubtitle || '',
          ]) && (
            <div className="bg-white p-5 border border-slate-200 rounded-xl space-y-4 shadow-2xs">
              <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
                <span className="p-1.5 bg-amber-100 text-amber-800 rounded-lg">
                  <AlertTriangle className="w-4 h-4" />
                </span>
                <div>
                  <h4 className="font-editorial text-base font-bold text-slate-900">
                    7. Seção Canal de Denúncias da Comunidade
                  </h4>
                  <span className="text-xs text-slate-500 font-sans">
                    Formulário de denúncias cidadãs com sigilo de fonte
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Chapéu (Eyebrow)
                  </label>
                  <input
                    type="text"
                    value={texts.denunciaEyebrow || ''}
                    onChange={(e) => updateField('denunciaEyebrow', e.target.value)}
                    placeholder="Voz e Cidadania"
                    className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#0f3d59]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Título Principal do Canal
                  </label>
                  <input
                    type="text"
                    value={texts.denunciaTitle || ''}
                    onChange={(e) => {
                      updateField('denunciaTitle', e.target.value);
                      updateField('denunciaSectionTitle', e.target.value);
                    }}
                    placeholder="Canal de Denúncias da Comunidade & Sugestão de Pauta"
                    className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#0f3d59] font-semibold"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Subtítulo do Canal de Denúncias
                </label>
                <textarea
                  rows={2}
                  value={texts.denunciaSubtitle || ''}
                  onChange={(e) => updateField('denunciaSubtitle', e.target.value)}
                  placeholder="Presenciou um problema no seu bairro? Envie seu relato com foto ou vídeo. Nossa redação apura com rigor jornalístico."
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#0f3d59]"
                />
              </div>
            </div>
          )}

        {/* 8. DÚVIDAS FREQUENTES (FAQ) */}
        {(activeTab === 'all' || activeTab === 'faq') &&
          matchesSearch([
            'faq',
            texts.faqEyebrow || '',
            texts.faqSectionTitle || '',
            texts.faqSectionSubtitle || '',
          ]) && (
            <div className="bg-white p-5 border border-slate-200 rounded-xl space-y-4 shadow-2xs">
              <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
                <span className="p-1.5 bg-blue-100 text-blue-800 rounded-lg">
                  <HelpCircle className="w-4 h-4" />
                </span>
                <div>
                  <h4 className="font-editorial text-base font-bold text-slate-900">
                    8. Seção Dúvidas Frequentes (FAQ)
                  </h4>
                  <span className="text-xs text-slate-500 font-sans">
                    Perguntas e respostas sobre o funcionamento do portal
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Chapéu (Eyebrow)
                  </label>
                  <input
                    type="text"
                    value={texts.faqEyebrow || ''}
                    onChange={(e) => updateField('faqEyebrow', e.target.value)}
                    placeholder="Transparência & Cidadania"
                    className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#0f3d59]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Título Principal do FAQ
                  </label>
                  <input
                    type="text"
                    value={texts.faqSectionTitle || ''}
                    onChange={(e) => updateField('faqSectionTitle', e.target.value)}
                    placeholder="Dúvidas Frequentes da Comunidade (FAQ)"
                    className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#0f3d59] font-semibold"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Subtítulo do FAQ
                </label>
                <textarea
                  rows={2}
                  value={texts.faqSectionSubtitle || ''}
                  onChange={(e) => updateField('faqSectionSubtitle', e.target.value)}
                  placeholder="Tire suas dúvidas sobre como enviar denúncias com sigilo, sugerir pautas e apoiar o jornalismo comunitário no Amazonas."
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#0f3d59]"
                />
              </div>
            </div>
          )}

        {/* 9. ESPAÇO PUBLICITÁRIO & ANÚNCIOS */}
        {(activeTab === 'all' || activeTab === 'ads') &&
          matchesSearch([
            'anuncios',
            texts.adsEyebrow || '',
            texts.adsSectionTitle || '',
            texts.adsSectionSubtitle || '',
          ]) && (
            <div className="bg-white p-5 border border-slate-200 rounded-xl space-y-4 shadow-2xs">
              <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
                <span className="p-1.5 bg-amber-100 text-amber-800 rounded-lg">
                  <Megaphone className="w-4 h-4" />
                </span>
                <div>
                  <h4 className="font-editorial text-base font-bold text-slate-900">
                    9. Seção Espaço Publicitário & Banners
                  </h4>
                  <span className="text-xs text-slate-500 font-sans">
                    Rótulos de transparência comercial
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Chapéu / Rótulo Comercial
                  </label>
                  <input
                    type="text"
                    value={texts.adsEyebrow || ''}
                    onChange={(e) => updateField('adsEyebrow', e.target.value)}
                    placeholder="Conteúdo Publicitário"
                    className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#0f3d59]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Subtítulo / Linha de Apoio
                  </label>
                  <input
                    type="text"
                    value={texts.adsSectionSubtitle || ''}
                    onChange={(e) => updateField('adsSectionSubtitle', e.target.value)}
                    placeholder="Espaços comerciais independentes da cobertura editorial"
                    className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#0f3d59]"
                  />
                </div>
              </div>
            </div>
          )}

        {/* 10. SOBRE KÁSSIO CARDOSO */}
        {(activeTab === 'all' || activeTab === 'about') &&
          matchesSearch([
            'sobre',
            texts.aboutEyebrow || '',
            texts.aboutSectionTitle || '',
            texts.aboutQuoteLabel || '',
            texts.aboutQuoteText || '',
          ]) && (
            <div className="bg-white p-5 border-2 border-emerald-400 rounded-xl space-y-4 shadow-sm bg-emerald-50/20">
              <div className="flex items-center gap-2 pb-2 border-b border-emerald-100">
                <span className="p-1.5 bg-emerald-600 text-white rounded-lg">
                  <User className="w-4 h-4" />
                </span>
                <div>
                  <h4 className="font-editorial text-base font-bold text-slate-900">
                    10. Seção Sobre Kássio Cardoso (Institucional)
                  </h4>
                  <span className="text-xs text-slate-500 font-sans">
                    Título principal da seção institucional e frase de assinatura
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Chapéu (Eyebrow)
                  </label>
                  <input
                    type="text"
                    value={texts.aboutEyebrow || ''}
                    onChange={(e) => updateField('aboutEyebrow', e.target.value)}
                    placeholder="Jornalismo Comunitário"
                    className="w-full px-3 py-2 text-xs bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-emerald-600"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Título Principal da Seção Sobre
                  </label>
                  <input
                    type="text"
                    value={texts.aboutSectionTitle || ''}
                    onChange={(e) => updateField('aboutSectionTitle', e.target.value)}
                    placeholder="Um Portal Nascido das Águas e das Vozes do Amazonas"
                    className="w-full px-3 py-2 text-xs bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-emerald-600 font-semibold"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Rótulo da Frase de Assinatura
                  </label>
                  <input
                    type="text"
                    value={texts.aboutQuoteLabel || ''}
                    onChange={(e) => updateField('aboutQuoteLabel', e.target.value)}
                    placeholder="Assinatura Institucional"
                    className="w-full px-3 py-2 text-xs bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-emerald-600"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Texto da Frase de Assinatura
                  </label>
                  <input
                    type="text"
                    value={texts.aboutQuoteText || ''}
                    onChange={(e) => updateField('aboutQuoteText', e.target.value)}
                    placeholder="A notícia nasce na comunidade."
                    className="w-full px-3 py-2 text-xs bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-emerald-600 font-medium"
                  />
                </div>
              </div>
            </div>
          )}

        {/* 11. CONTATO, TRANSPARÊNCIA & LGPD */}
        {(activeTab === 'all' || activeTab === 'contact') &&
          matchesSearch([
            'contato',
            texts.contactEyebrow || '',
            texts.contactSectionTitle || '',
            texts.contactSectionSubtitle || '',
          ]) && (
            <div className="bg-white p-5 border border-slate-200 rounded-xl space-y-4 shadow-2xs">
              <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
                <span className="p-1.5 bg-slate-100 text-slate-800 rounded-lg">
                  <Shield className="w-4 h-4" />
                </span>
                <div>
                  <h4 className="font-editorial text-base font-bold text-slate-900">
                    11. Seção Contato, Expediente & LGPD
                  </h4>
                  <span className="text-xs text-slate-500 font-sans">
                    Transparência editorial e garantias de privacidade
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Chapéu (Eyebrow)
                  </label>
                  <input
                    type="text"
                    value={texts.contactEyebrow || ''}
                    onChange={(e) => updateField('contactEyebrow', e.target.value)}
                    placeholder="Transparência & Conformidade"
                    className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#0f3d59]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Título Principal
                  </label>
                  <input
                    type="text"
                    value={texts.contactSectionTitle || ''}
                    onChange={(e) => updateField('contactSectionTitle', e.target.value)}
                    placeholder="Expediente, Políticas e Contato"
                    className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#0f3d59] font-semibold"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Subtítulo de Contato & LGPD
                </label>
                <textarea
                  rows={2}
                  value={texts.contactSectionSubtitle || ''}
                  onChange={(e) => updateField('contactSectionSubtitle', e.target.value)}
                  placeholder="Garantias de conformidade com a Lei Geral de Proteção de Dados (LGPD) e transparência da equipe editorial."
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#0f3d59]"
                />
              </div>
            </div>
          )}

        {/* 12. RODAPÉ (FOOTER) */}
        {(activeTab === 'all' || activeTab === 'footer') &&
          matchesSearch([
            'footer',
            'rodape',
            texts.footerNavTitle || '',
            texts.footerInstTitle || '',
            texts.footerDirectChannelTitle || '',
          ]) && (
            <div className="bg-white p-5 border border-slate-200 rounded-xl space-y-4 shadow-2xs">
              <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
                <span className="p-1.5 bg-slate-900 text-white rounded-lg">
                  <Sliders className="w-4 h-4" />
                </span>
                <div>
                  <h4 className="font-editorial text-base font-bold text-slate-900">
                    12. Títulos das Colunas do Rodapé
                  </h4>
                  <span className="text-xs text-slate-500 font-sans">
                    Navegação, institucional e canal direto WhatsApp
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Coluna 2: Navegação
                  </label>
                  <input
                    type="text"
                    value={texts.footerNavTitle || ''}
                    onChange={(e) => updateField('footerNavTitle', e.target.value)}
                    placeholder="Navegação"
                    className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#0f3d59]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Coluna 3: Institucional & LGPD
                  </label>
                  <input
                    type="text"
                    value={texts.footerInstTitle || ''}
                    onChange={(e) => updateField('footerInstTitle', e.target.value)}
                    placeholder="Institucional & LGPD"
                    className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#0f3d59]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Coluna 4: Canal WhatsApp
                  </label>
                  <input
                    type="text"
                    value={texts.footerDirectChannelTitle || ''}
                    onChange={(e) => updateField('footerDirectChannelTitle', e.target.value)}
                    placeholder="Canal Direto de Notícias"
                    className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#0f3d59]"
                  />
                </div>
              </div>
            </div>
          )}

      </div>
    </form>
  );
};
