import React, { useState } from 'react';
import { useStore } from '../../context/StoreContext';
import { HeaderNavLink } from '../../types';
import {
  Image,
  Type,
  CloudSun,
  Flame,
  CheckCircle2,
  Upload,
  Eye,
  EyeOff,
  Sliders,
  Sparkles,
  Plus,
  Trash2,
  ArrowUp,
  ArrowDown,
  RotateCcw,
  Link2,
  Tag,
  Compass,
  Megaphone,
  Radio,
  Menu,
} from 'lucide-react';
import { compressImageFile } from '../../utils/imageCompression';

export const AdminHeaderLogo: React.FC = () => {
  const {
    config,
    updateHeaderConfig,
    updateConfig,
    updateHeaderNavLinks,
    addHeaderNavLink,
    updateHeaderNavLink,
    deleteHeaderNavLink,
    resetHeaderNavLinksToDefault,
  } = useStore();

  const [activeTab, setActiveTab] = useState<'categories' | 'topbar' | 'logo'>('categories');

  // Logo config
  const [logoType, setLogoType] = useState<'text' | 'image'>(config.header?.logoType || 'text');
  const [logoText, setLogoText] = useState(config.header?.logoText || config.siteName || 'COMUNIDADE EM AÇÃO');
  const [logoSubtext, setLogoSubtext] = useState(config.header?.logoSubtext || config.subtagline || 'AMAZONAS');
  const [logoImageUrl, setLogoImageUrl] = useState(config.header?.logoImageUrl || '');

  // Weather config
  const [showWeather, setShowWeather] = useState(config.header?.showWeather ?? true);
  const [weatherLocation, setWeatherLocation] = useState(config.header?.weatherLocation || 'Manaus - AM');
  const [weatherTemp, setWeatherTemp] = useState(config.header?.weatherTemp || '29°C');
  const [weatherCondition, setWeatherCondition] = useState(config.header?.weatherCondition || 'Tempo bom hoje');

  // Breaking news & ticker
  const [showBreakingNews, setShowBreakingNews] = useState(config.header?.showBreakingNews ?? true);
  const [breakingNewsTitle, setBreakingNewsTitle] = useState(config.header?.breakingNewsTitle || 'URGENTE');
  const [topTickerText, setTopTickerText] = useState(config.header?.topTickerText || '');

  // Helper to normalize color
  const normalizeCtaColor = (c?: string): 'amber' | 'emerald' | 'red' | 'blue' => {
    if (c === 'emerald' || c === 'red' || c === 'blue') return c;
    return 'amber';
  };

  // Header CTA Button
  const [ctaButtonVisible, setCtaButtonVisible] = useState(config.header?.ctaButtonVisible ?? true);
  const [ctaButtonText, setCtaButtonText] = useState(config.header?.ctaButtonText || '🚨 Enviar Denúncia');
  const [ctaButtonTarget, setCtaButtonTarget] = useState(config.header?.ctaButtonTarget || 'comunidade-participa');
  const [ctaButtonColor, setCtaButtonColor] = useState<'amber' | 'emerald' | 'red' | 'blue'>(
    normalizeCtaColor(config.header?.ctaButtonColor)
  );

  // Site name sync
  const [siteName, setSiteName] = useState(config.siteName || 'COMUNIDADE EM AÇÃO');
  const [subtagline, setSubtagline] = useState(config.subtagline || 'Portal de Notícias Locais do Amazonas');

  // New Category Link Form
  const [newLabel, setNewLabel] = useState('');
  const [newTarget, setNewTarget] = useState('ultimas-noticias');
  const [newBadge, setNewBadge] = useState('');
  const [newBadgeColor, setNewBadgeColor] = useState<'red' | 'emerald' | 'amber' | 'blue'>('blue');
  const [showAddForm, setShowAddForm] = useState(false);

  const [savedSuccess, setSavedSuccess] = useState(false);

  // Navigation links from config
  const navLinks = (config.header?.navLinks || []).sort((a, b) => a.order - b.order);

  // Locate the special "SOBRE" category link if present
  const sobreLink = navLinks.find(
    (l) => l.targetSection === 'sobre' || l.label.toLowerCase().includes('sobre')
  );

  // Synchronize when store config updates
  React.useEffect(() => {
    if (config.header) {
      setLogoType(config.header.logoType || 'text');
      setLogoText(config.header.logoText || config.siteName || 'COMUNIDADE EM AÇÃO');
      setLogoSubtext(config.header.logoSubtext || config.subtagline || 'AMAZONAS');
      setLogoImageUrl(config.header.logoImageUrl || '');
      setShowWeather(config.header.showWeather ?? true);
      setWeatherLocation(config.header.weatherLocation || 'Manaus - AM');
      setWeatherTemp(config.header.weatherTemp || '29°C');
      setWeatherCondition(config.header.weatherCondition || 'Tempo bom hoje');
      setShowBreakingNews(config.header.showBreakingNews ?? true);
      setBreakingNewsTitle(config.header.breakingNewsTitle || 'URGENTE');
      setTopTickerText(config.header.topTickerText || '');
      setCtaButtonVisible(config.header.ctaButtonVisible ?? true);
      setCtaButtonText(config.header.ctaButtonText || '🚨 Enviar Denúncia');
      setCtaButtonTarget(config.header.ctaButtonTarget || 'comunidade-participa');
      setCtaButtonColor(normalizeCtaColor(config.header.ctaButtonColor));
    }
    if (config.siteName) setSiteName(config.siteName);
    if (config.subtagline) setSubtagline(config.subtagline);
  }, [config.header, config.siteName, config.subtagline]);

  const syncHeader = (
    headerPatch: Partial<typeof config.header>,
    configPatch?: { siteName?: string; subtagline?: string }
  ) => {
    updateHeaderConfig({
      logoType,
      logoText,
      logoSubtext,
      logoImageUrl,
      showWeather,
      weatherLocation,
      weatherTemp,
      weatherCondition,
      showBreakingNews,
      breakingNewsTitle,
      topTickerText,
      ctaButtonVisible,
      ctaButtonText,
      ctaButtonTarget,
      ctaButtonColor,
      navLinks: config.header?.navLinks,
      ...headerPatch,
    });
    if (configPatch) {
      updateConfig(configPatch);
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const result = await compressImageFile(file, 600, 300, 0.85);
      setLogoImageUrl(result);
      setLogoType('image');
      syncHeader({ logoImageUrl: result, logoType: 'image' });
    } catch {
      const reader = new FileReader();
      reader.onload = (event) => {
        const result = event.target?.result as string;
        setLogoImageUrl(result);
        setLogoType('image');
        syncHeader({ logoImageUrl: result, logoType: 'image' });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();

    syncHeader(
      {
        logoType,
        logoText,
        logoSubtext,
        logoImageUrl,
        showWeather,
        weatherLocation,
        weatherTemp,
        weatherCondition,
        showBreakingNews,
        breakingNewsTitle,
        topTickerText,
        ctaButtonVisible,
        ctaButtonText,
        ctaButtonTarget,
        ctaButtonColor,
      },
      {
        siteName,
        subtagline,
      }
    );

    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3500);
  };

  // Reordering helpers
  const handleMoveUp = (index: number) => {
    if (index === 0) return;
    const items = [...navLinks];
    const prev = items[index - 1];
    const curr = items[index];
    items[index - 1] = { ...curr, order: index - 1 };
    items[index] = { ...prev, order: index };
    updateHeaderNavLinks(items);
  };

  const handleMoveDown = (index: number) => {
    if (index === navLinks.length - 1) return;
    const items = [...navLinks];
    const next = items[index + 1];
    const curr = items[index];
    items[index + 1] = { ...curr, order: index + 1 };
    items[index] = { ...next, order: index };
    updateHeaderNavLinks(items);
  };

  const handleAddLink = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newLabel.trim()) return;

    addHeaderNavLink({
      label: newLabel.trim(),
      targetSection: newTarget.replace(/^#/, ''),
      badge: newBadge.trim() || undefined,
      badgeColor: newBadge.trim() ? newBadgeColor : undefined,
      isVisible: true,
    });

    setNewLabel('');
    setNewBadge('');
    setShowAddForm(false);
  };

  const targetSectionsList = [
    { id: 'ultimas-noticias', label: 'Últimas Notícias (#ultimas-noticias)' },
    { id: 'destaques', label: 'Destaques (#destaques)' },
    { id: 'categorias', label: 'Categorias & Editorias (#categorias)' },
    { id: 'utilidade-publica', label: 'Utilidade Pública & SOS (#utilidade-publica)' },
    { id: 'localidades', label: 'Localidades & Rios (#localidades)' },
    { id: 'comunidade-participa', label: 'Canal de Denúncias (#comunidade-participa)' },
    { id: 'anuncios', label: 'Espaço Publicitário (#anuncios)' },
    { id: 'faq', label: 'Perguntas Frequentes FAQ (#faq)' },
    { id: 'sobre', label: 'Sobre Kássio Cardoso (#sobre)' },
    { id: 'contato', label: 'Contato, Expediente e LGPD (#contato)' },
  ];

  return (
    <form onSubmit={handleSave} className="space-y-6">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-200 gap-3">
        <div>
          <h3 className="font-editorial text-2xl font-bold text-slate-900 flex items-center gap-2">
            <Sliders className="w-6 h-6 text-[#0f3d59]" />
            <span>Estrutura do Topo da Página & Categorias</span>
          </h3>
          <p className="text-xs text-slate-500 font-sans mt-0.5">
            Autonomia total (100%) para editar o cabeçalho: links do menu (destaque para "SOBRE"), plantão urgente, botão CTA e identidade visual.
          </p>
        </div>

        <button
          type="submit"
          className="px-5 py-2.5 bg-[#0f3d59] hover:bg-[#0a2540] text-white text-xs font-bold rounded-lg transition-colors cursor-pointer shadow-xs flex items-center gap-2 shrink-0"
        >
          <CheckCircle2 className="w-4 h-4" />
          <span>Salvar Estrutura do Topo</span>
        </button>
      </div>

      {savedSuccess && (
        <div className="p-3.5 bg-emerald-50 border border-emerald-300 rounded-xl text-xs text-emerald-800 font-semibold flex items-center gap-2 animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0" />
          <span>Alterações no Topo da Página atualizadas e sincronizadas em tempo real!</span>
        </div>
      )}

      {/* Tabs Selector */}
      <div className="flex flex-wrap gap-2 border-b border-slate-200 pb-2">
        <button
          type="button"
          onClick={() => setActiveTab('categories')}
          className={`px-4 py-2 text-xs font-bold rounded-lg flex items-center gap-2 transition-all cursor-pointer ${
            activeTab === 'categories'
              ? 'bg-[#0f3d59] text-white shadow-xs'
              : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
          }`}
        >
          <Menu className="w-4 h-4" />
          <span>Categorias do Topo (100% Autonomia)</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('topbar')}
          className={`px-4 py-2 text-xs font-bold rounded-lg flex items-center gap-2 transition-all cursor-pointer ${
            activeTab === 'topbar'
              ? 'bg-[#0f3d59] text-white shadow-xs'
              : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
          }`}
        >
          <Radio className="w-4 h-4" />
          <span>Barra Superior, Plantão & Botão CTA</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('logo')}
          className={`px-4 py-2 text-xs font-bold rounded-lg flex items-center gap-2 transition-all cursor-pointer ${
            activeTab === 'logo'
              ? 'bg-[#0f3d59] text-white shadow-xs'
              : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
          }`}
        >
          <Image className="w-4 h-4" />
          <span>Logotipo & Wordmark</span>
        </button>
      </div>

      {/* TAB 1: CATEGORIAS DO MENU DE NAVEGAÇÃO DO TOPO */}
      {activeTab === 'categories' && (
        <div className="space-y-6">
          
          {/* SPECIAL SPOTLIGHT CARD: EDITAR CATEGORIA "SOBRE" (Requisito Principal do Usuário) */}
          {sobreLink && (
            <div className="p-5 bg-gradient-to-r from-emerald-50 via-teal-50 to-blue-50 border-2 border-emerald-500 rounded-2xl shadow-sm space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <span className="p-2 bg-emerald-600 text-white rounded-lg shadow-xs">
                    <Compass className="w-4 h-4" />
                  </span>
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-800 font-sans">
                      Destaque Solicitado
                    </span>
                    <h4 className="font-editorial text-lg font-bold text-slate-900 leading-tight">
                      Edição Prioritária da Categoria "SOBRE"
                    </h4>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span className={`px-2 py-0.5 text-[10px] font-bold rounded-full ${
                    sobreLink.isVisible ? 'bg-emerald-200 text-emerald-900' : 'bg-slate-200 text-slate-700'
                  }`}>
                    {sobreLink.isVisible ? 'Visível no Topo' : 'Oculto'}
                  </span>
                  <button
                    type="button"
                    onClick={() => updateHeaderNavLink(sobreLink.id, { isVisible: !sobreLink.isVisible })}
                    className="p-1.5 bg-white border border-slate-300 rounded-lg hover:bg-slate-100 text-slate-700 transition cursor-pointer"
                    title={sobreLink.isVisible ? 'Ocultar do Topo' : 'Exibir no Topo'}
                  >
                    {sobreLink.isVisible ? <Eye className="w-4 h-4 text-emerald-700" /> : <EyeOff className="w-4 h-4 text-slate-400" />}
                  </button>
                </div>
              </div>

              <p className="text-xs text-slate-600 font-sans">
                Edite livremente o nome de exibição no menu do topo, a seção de destino, selos especiais e status de visibilidade para a categoria <strong>"Sobre"</strong>.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 bg-white/80 p-3.5 rounded-xl border border-emerald-200">
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">
                    Nome / Rótulo no Menu
                  </label>
                  <input
                    type="text"
                    value={sobreLink.label}
                    onChange={(e) => updateHeaderNavLink(sobreLink.id, { label: e.target.value })}
                    placeholder="Ex: Sobre Kássio Cardoso, Quem Somos..."
                    className="w-full px-3 py-2 text-xs bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-emerald-600 font-medium"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">
                    Seção de Destino
                  </label>
                  <select
                    value={sobreLink.targetSection}
                    onChange={(e) => updateHeaderNavLink(sobreLink.id, { targetSection: e.target.value })}
                    className="w-full px-3 py-2 text-xs bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-emerald-600"
                  >
                    {targetSectionsList.map((sec) => (
                      <option key={sec.id} value={sec.id}>
                        {sec.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">
                    Badge / Selo Opcional
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={sobreLink.badge || ''}
                      onChange={(e) => updateHeaderNavLink(sobreLink.id, { badge: e.target.value })}
                      placeholder="Ex: Perfil, Bio, Novo"
                      className="flex-1 px-3 py-2 text-xs bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-emerald-600"
                    />
                    <select
                      value={sobreLink.badgeColor || 'emerald'}
                      onChange={(e) =>
                        updateHeaderNavLink(sobreLink.id, {
                          badgeColor: e.target.value as 'red' | 'emerald' | 'amber' | 'blue',
                        })
                      }
                      className="w-24 px-2 py-2 text-xs bg-white border border-slate-300 rounded-lg"
                    >
                      <option value="emerald">Verde</option>
                      <option value="amber">Amarelo</option>
                      <option value="blue">Azul</option>
                      <option value="red">Vermelho</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* LIST & MANAGER OF ALL HEADER CATEGORIES */}
          <div className="bg-white p-5 border border-slate-200 rounded-xl space-y-4 shadow-2xs">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h4 className="font-editorial text-base font-bold text-slate-900 flex items-center gap-2">
                  <Menu className="w-4 h-4 text-[#0f3d59]" />
                  <span>Todas as Categorias do Topo ({navLinks.length})</span>
                </h4>
                <p className="text-xs text-slate-500 font-sans">
                  Altere a ordem, modifique textos, vincule a qualquer seção, ative/desative ou exclua itens do menu.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddForm(!showAddForm)}
                  className="px-3 py-1.5 text-xs font-bold bg-[#0f3d59] text-white rounded-lg hover:bg-[#1b4b68] transition flex items-center gap-1.5 cursor-pointer shadow-xs"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Adicionar Categoria</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    if (window.confirm('Deseja restaurar as categorias padrão do menu do topo?')) {
                      resetHeaderNavLinksToDefault();
                    }
                  }}
                  className="px-3 py-1.5 text-xs font-medium bg-slate-100 text-slate-700 rounded-lg hover:bg-slate-200 transition flex items-center gap-1 cursor-pointer"
                  title="Restaurar padrão inicial"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Restaurar Padrão</span>
                </button>
              </div>
            </div>

            {/* Form to Add New Category Link */}
            {showAddForm && (
              <div className="p-4 bg-slate-50 border-2 border-dashed border-[#0f3d59] rounded-xl space-y-3 animate-in fade-in">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-[#0f3d59] uppercase tracking-wider flex items-center gap-1.5">
                    <Plus className="w-3.5 h-3.5" />
                    <span>Nova Categoria no Menu do Topo</span>
                  </span>
                  <button
                    type="button"
                    onClick={() => setShowAddForm(false)}
                    className="text-xs text-slate-500 hover:text-slate-800 cursor-pointer"
                  >
                    Cancelar
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                  <div className="sm:col-span-2">
                    <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                      Nome da Categoria *
                    </label>
                    <input
                      type="text"
                      required
                      value={newLabel}
                      onChange={(e) => setNewLabel(e.target.value)}
                      placeholder="Ex: Política, Ribeirinhos, Vídeos..."
                      className="w-full px-3 py-2 text-xs bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#0f3d59]"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                      Seção de Destino
                    </label>
                    <select
                      value={newTarget}
                      onChange={(e) => setNewTarget(e.target.value)}
                      className="w-full px-3 py-2 text-xs bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#0f3d59]"
                    >
                      {targetSectionsList.map((sec) => (
                        <option key={sec.id} value={sec.id}>
                          {sec.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                      Badge / Selo (Opcional)
                    </label>
                    <input
                      type="text"
                      value={newBadge}
                      onChange={(e) => setNewBadge(e.target.value)}
                      placeholder="Ex: NOVO, SOS"
                      className="w-full px-3 py-2 text-xs bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#0f3d59]"
                    />
                  </div>
                </div>

                <div className="flex justify-end pt-2">
                  <button
                    type="button"
                    onClick={handleAddLink}
                    className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-lg transition cursor-pointer shadow-xs"
                  >
                    Inserir Categoria no Topo
                  </button>
                </div>
              </div>
            )}

            {/* List of Category Links */}
            <div className="space-y-2.5">
              {navLinks.map((link, index) => {
                const isSobre = link.targetSection === 'sobre' || link.label.toLowerCase().includes('sobre');

                return (
                  <div
                    key={link.id}
                    className={`p-3.5 rounded-xl border transition-all flex flex-col md:flex-row md:items-center justify-between gap-3 ${
                      isSobre
                        ? 'bg-emerald-50/40 border-emerald-300'
                        : link.isVisible
                        ? 'bg-slate-50/70 border-slate-200 hover:border-slate-300'
                        : 'bg-slate-100/70 border-slate-200 opacity-60'
                    }`}
                  >
                    {/* Left: Reorder buttons & Category label input */}
                    <div className="flex items-center gap-2 flex-1">
                      <div className="flex flex-col gap-0.5">
                        <button
                          type="button"
                          onClick={() => handleMoveUp(index)}
                          disabled={index === 0}
                          className="p-1 text-slate-400 hover:text-slate-800 disabled:opacity-20 cursor-pointer disabled:cursor-not-allowed"
                          title="Mover para cima"
                        >
                          <ArrowUp className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleMoveDown(index)}
                          disabled={index === navLinks.length - 1}
                          className="p-1 text-slate-400 hover:text-slate-800 disabled:opacity-20 cursor-pointer disabled:cursor-not-allowed"
                          title="Mover para baixo"
                        >
                          <ArrowDown className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      <div className="flex-1 max-w-xs">
                        <div className="flex items-center gap-1.5 mb-1">
                          <span className="text-[10px] font-bold text-slate-500 uppercase">
                            #{index + 1}
                          </span>
                          {isSobre && (
                            <span className="text-[9px] font-extrabold uppercase bg-emerald-600 text-white px-1.5 py-0.2 rounded">
                              SOBRE
                            </span>
                          )}
                        </div>
                        <input
                          type="text"
                          value={link.label}
                          onChange={(e) => updateHeaderNavLink(link.id, { label: e.target.value })}
                          className="w-full px-2.5 py-1.5 text-xs font-semibold bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#0f3d59]"
                        />
                      </div>
                    </div>

                    {/* Middle: Target Section Selector & Badge */}
                    <div className="flex flex-wrap items-center gap-2">
                      <div className="w-48">
                        <select
                          value={link.targetSection}
                          onChange={(e) => updateHeaderNavLink(link.id, { targetSection: e.target.value })}
                          className="w-full px-2.5 py-1.5 text-xs bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#0f3d59]"
                        >
                          {targetSectionsList.map((sec) => (
                            <option key={sec.id} value={sec.id}>
                              {sec.label}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div className="flex items-center gap-1">
                        <input
                          type="text"
                          value={link.badge || ''}
                          onChange={(e) => updateHeaderNavLink(link.id, { badge: e.target.value })}
                          placeholder="Selo"
                          className="w-16 px-2 py-1.5 text-xs bg-white border border-slate-300 rounded-lg text-center"
                        />
                        {link.badge && (
                          <select
                            value={link.badgeColor || 'blue'}
                            onChange={(e) =>
                              updateHeaderNavLink(link.id, {
                                badgeColor: e.target.value as 'red' | 'emerald' | 'amber' | 'blue',
                              })
                            }
                            className="w-20 px-1 py-1.5 text-[11px] bg-white border border-slate-300 rounded-lg"
                          >
                            <option value="emerald">Verde</option>
                            <option value="amber">Amarelo</option>
                            <option value="blue">Azul</option>
                            <option value="red">Vermelho</option>
                          </select>
                        )}
                      </div>
                    </div>

                    {/* Right: Visibility & Delete */}
                    <div className="flex items-center gap-1.5 justify-end">
                      <button
                        type="button"
                        onClick={() => updateHeaderNavLink(link.id, { isVisible: !link.isVisible })}
                        className={`p-1.5 rounded-lg border transition cursor-pointer ${
                          link.isVisible
                            ? 'bg-emerald-50 border-emerald-300 text-emerald-800 hover:bg-emerald-100'
                            : 'bg-slate-200 border-slate-300 text-slate-500 hover:bg-slate-300'
                        }`}
                        title={link.isVisible ? 'Visível (clique para ocultar)' : 'Oculto (clique para exibir)'}
                      >
                        {link.isVisible ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          if (window.confirm(`Excluir categoria "${link.label}" do topo?`)) {
                            deleteHeaderNavLink(link.id);
                          }
                        }}
                        className="p-1.5 bg-red-50 border border-red-200 text-red-600 hover:bg-red-100 rounded-lg transition cursor-pointer"
                        title="Excluir Categoria"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: BARRA SUPERIOR, PLANTÃO & BOTÃO CTA */}
      {activeTab === 'topbar' && (
        <div className="space-y-6">
          
          {/* BOTÃO DE AÇÃO CTA NO TOPO */}
          <div className="bg-white p-5 border border-slate-200 rounded-xl space-y-4 shadow-2xs">
            <div className="flex items-center justify-between">
              <h4 className="font-editorial text-base font-bold text-slate-900 flex items-center gap-2">
                <Megaphone className="w-4 h-4 text-amber-500" />
                <span>Botão de Destaque / CTA no Topo</span>
              </h4>
              <label className="flex items-center gap-2 text-xs font-semibold cursor-pointer">
                <input
                  type="checkbox"
                  checked={ctaButtonVisible}
                  onChange={(e) => {
                    const c = e.target.checked;
                    setCtaButtonVisible(c);
                    syncHeader({ ctaButtonVisible: c });
                  }}
                  className="rounded text-[#0f3d59] focus:ring-[#0f3d59]"
                />
                <span>Exibir Botão no Topo</span>
              </label>
            </div>

            {ctaButtonVisible && (
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-3 bg-slate-50 border border-slate-200 rounded-xl">
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">
                    Texto do Botão
                  </label>
                  <input
                    type="text"
                    value={ctaButtonText}
                    onChange={(e) => {
                      const v = e.target.value;
                      setCtaButtonText(v);
                      syncHeader({ ctaButtonText: v });
                    }}
                    placeholder="Ex: 🚨 Enviar Denúncia"
                    className="w-full px-3 py-2 text-xs bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#0f3d59]"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">
                    Seção de Destino
                  </label>
                  <select
                    value={ctaButtonTarget}
                    onChange={(e) => {
                      const v = e.target.value;
                      setCtaButtonTarget(v);
                      syncHeader({ ctaButtonTarget: v });
                    }}
                    className="w-full px-3 py-2 text-xs bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#0f3d59]"
                  >
                    {targetSectionsList.map((sec) => (
                      <option key={sec.id} value={sec.id}>
                        {sec.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">
                    Cor do Botão
                  </label>
                  <select
                    value={ctaButtonColor}
                    onChange={(e) => {
                      const v = e.target.value as 'amber' | 'emerald' | 'red' | 'blue';
                      setCtaButtonColor(v);
                      syncHeader({ ctaButtonColor: v });
                    }}
                    className="w-full px-3 py-2 text-xs bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#0f3d59]"
                  >
                    <option value="amber">Amarelo (Dourado de Alerta)</option>
                    <option value="emerald">Verde (Institucional)</option>
                    <option value="red">Vermelho (Urgência SOS)</option>
                    <option value="blue">Azul (Petróleo)</option>
                  </select>
                </div>
              </div>
            )}
          </div>

          {/* PLANTÃO DE NOTÍCIAS & TICKER */}
          <div className="bg-white p-5 border border-slate-200 rounded-xl space-y-4 shadow-2xs">
            <div className="flex items-center justify-between">
              <h4 className="font-editorial text-base font-bold text-slate-900 flex items-center gap-2">
                <Flame className="w-4 h-4 text-red-600" />
                <span>Barra Superior de Notícias Urgentes (Breaking Ticker)</span>
              </h4>
              <label className="flex items-center gap-2 text-xs font-semibold cursor-pointer">
                <input
                  type="checkbox"
                  checked={showBreakingNews}
                  onChange={(e) => {
                    const c = e.target.checked;
                    setShowBreakingNews(c);
                    syncHeader({ showBreakingNews: c });
                  }}
                  className="rounded text-[#0f3d59] focus:ring-[#0f3d59]"
                />
                <span>Ativar Barra de Plantão</span>
              </label>
            </div>

            {showBreakingNews && (
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Etiqueta do Plantão
                  </label>
                  <input
                    type="text"
                    value={breakingNewsTitle}
                    onChange={(e) => {
                      const v = e.target.value;
                      setBreakingNewsTitle(v);
                      syncHeader({ breakingNewsTitle: v });
                    }}
                    placeholder="URGENTE ou PLANTÃO AMAZONAS"
                    className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#0f3d59]"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Texto Personalizado da Notícia em Destaque no Topo (Opcional)
                  </label>
                  <input
                    type="text"
                    value={topTickerText}
                    onChange={(e) => {
                      const v = e.target.value;
                      setTopTickerText(v);
                      syncHeader({ topTickerText: v });
                    }}
                    placeholder="Deixe em branco para usar a última matéria publicada automaticamente"
                    className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#0f3d59]"
                  />
                </div>
              </div>
            )}
          </div>

          {/* CLIMA & TEMPO NO TOPO */}
          <div className="bg-white p-5 border border-slate-200 rounded-xl space-y-4 shadow-2xs">
            <div className="flex items-center justify-between">
              <h4 className="font-editorial text-base font-bold text-slate-900 flex items-center gap-2">
                <CloudSun className="w-4 h-4 text-amber-500" />
                <span>Barra de Clima & Previsão do Tempo</span>
              </h4>
              <label className="flex items-center gap-2 text-xs font-semibold cursor-pointer">
                <input
                  type="checkbox"
                  checked={showWeather}
                  onChange={(e) => {
                    const c = e.target.checked;
                    setShowWeather(c);
                    syncHeader({ showWeather: c });
                  }}
                  className="rounded text-[#0f3d59] focus:ring-[#0f3d59]"
                />
                <span>Exibir na barra superior</span>
              </label>
            </div>

            {showWeather && (
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Localidade</label>
                  <input
                    type="text"
                    value={weatherLocation}
                    onChange={(e) => {
                      const v = e.target.value;
                      setWeatherLocation(v);
                      syncHeader({ weatherLocation: v });
                    }}
                    placeholder="Manaus - AM"
                    className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#0f3d59]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Temperatura</label>
                  <input
                    type="text"
                    value={weatherTemp}
                    onChange={(e) => {
                      const v = e.target.value;
                      setWeatherTemp(v);
                      syncHeader({ weatherTemp: v });
                    }}
                    placeholder="29°C"
                    className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#0f3d59]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Condição Climática</label>
                  <input
                    type="text"
                    value={weatherCondition}
                    onChange={(e) => {
                      const v = e.target.value;
                      setWeatherCondition(v);
                      syncHeader({ weatherCondition: v });
                    }}
                    placeholder="Tempo bom hoje"
                    className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#0f3d59]"
                  />
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* TAB 3: LOGOTIPO & IDENTIDADE */}
      {activeTab === 'logo' && (
        <div className="space-y-6">
          <div className="bg-white p-5 border border-slate-200 rounded-xl space-y-4 shadow-2xs">
            <h4 className="font-editorial text-base font-bold text-slate-900 flex items-center gap-2">
              <Sliders className="w-4 h-4 text-[#0f3d59]" />
              <span>Configuração da Marca Gráfica / Logotipo</span>
            </h4>

            {/* Logo Format Toggle */}
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => {
                  setLogoType('text');
                  syncHeader({ logoType: 'text' });
                }}
                className={`px-4 py-2 text-xs font-semibold rounded-lg flex items-center gap-2 cursor-pointer transition-colors ${
                  logoType === 'text'
                    ? 'bg-[#0f3d59] text-white shadow-xs'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                <Type className="w-4 h-4" />
                <span>Logotipo em Texto Editorial (Padrão)</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  setLogoType('image');
                  syncHeader({ logoType: 'image' });
                }}
                className={`px-4 py-2 text-xs font-semibold rounded-lg flex items-center gap-2 cursor-pointer transition-colors ${
                  logoType === 'image'
                    ? 'bg-[#0f3d59] text-white shadow-xs'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                <Image className="w-4 h-4" />
                <span>Logotipo em Imagem / Marca Gráfica</span>
              </button>
            </div>

            {logoType === 'image' && (
              <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-3">
                <label className="block text-xs font-semibold text-slate-700">
                  Arquivo do Logotipo (Upload ou URL Direta)
                </label>
                <div className="flex flex-col sm:flex-row items-center gap-3">
                  <input
                    type="text"
                    value={logoImageUrl}
                    onChange={(e) => {
                      const v = e.target.value;
                      setLogoImageUrl(v);
                      syncHeader({ logoImageUrl: v });
                    }}
                    placeholder="https://exemplo.com/logo-comunidade.png"
                    className="flex-1 w-full px-3 py-2 text-xs bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#0f3d59]"
                  />
                  <label className="w-full sm:w-auto px-4 py-2 bg-slate-200 hover:bg-slate-300 text-slate-800 text-xs font-semibold rounded-lg flex items-center justify-center gap-2 cursor-pointer shrink-0">
                    <Upload className="w-4 h-4" />
                    <span>Subir Imagem</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleFileUpload}
                      className="hidden"
                    />
                  </label>
                </div>
                {logoImageUrl && (
                  <div className="mt-2 p-2 bg-white rounded border border-slate-200 inline-block">
                    <img src={logoImageUrl} alt="Preview" className="h-12 w-auto object-contain" />
                  </div>
                )}
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Nome Principal do Portal (Wordmark)
                </label>
                <input
                  type="text"
                  value={logoText}
                  onChange={(e) => {
                    const v = e.target.value;
                    setLogoText(v);
                    setSiteName(v);
                    syncHeader({ logoText: v }, { siteName: v });
                  }}
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#0f3d59] focus:bg-white"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Subtexto / Identificador Territorial
                </label>
                <input
                  type="text"
                  value={logoSubtext}
                  onChange={(e) => {
                    const v = e.target.value;
                    setLogoSubtext(v);
                    syncHeader({ logoSubtext: v });
                  }}
                  placeholder="AMAZONAS ou MANAUS"
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#0f3d59] focus:bg-white"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Slogan / Linha de Apoio do Portal
              </label>
              <input
                type="text"
                value={subtagline}
                onChange={(e) => {
                  const v = e.target.value;
                  setSubtagline(v);
                  syncHeader({}, { subtagline: v });
                }}
                className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#0f3d59] focus:bg-white"
              />
            </div>
          </div>
        </div>
      )}
    </form>
  );
};
