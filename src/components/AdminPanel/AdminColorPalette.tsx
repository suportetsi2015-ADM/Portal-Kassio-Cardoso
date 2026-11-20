import React, { useState } from 'react';
import { useStore } from '../../context/StoreContext';
import {
  Palette,
  CheckCircle2,
  Sparkles,
  RotateCcw,
  Eye,
  Sliders,
} from 'lucide-react';

export const AdminColorPalette: React.FC = () => {
  const { config, updatePalette } = useStore();

  const [primaryColor, setPrimaryColor] = useState(config.palette?.primaryColor || '#0f3d59');
  const [accentColor, setAccentColor] = useState(config.palette?.accentColor || '#d97706');
  const [headerBg, setHeaderBg] = useState(config.palette?.headerBg || '#0f172a');
  const [newsTickerBg, setNewsTickerBg] = useState(config.palette?.newsTickerBg || '#090d16');
  const [bodyBg, setBodyBg] = useState(config.palette?.bodyBg || '#f8fafc');

  const [savedSuccess, setSavedSuccess] = useState(false);

  const presets = [
    {
      name: 'Clássico Rio & Floresta (Padrão)',
      primary: '#0f3d59',
      accent: '#d97706',
      header: '#0f172a',
      newsTicker: '#090d16',
      body: '#f8fafc',
    },
    {
      name: 'Verde Amazônia Profunda',
      primary: '#064e3b',
      accent: '#f59e0b',
      header: '#022c22',
      newsTicker: '#011914',
      body: '#f0fdf4',
    },
    {
      name: 'Encontro das Águas (Rio Negro & Solimões)',
      primary: '#1e293b',
      accent: '#ca8a04',
      header: '#0f172a',
      newsTicker: '#020617',
      body: '#f8fafc',
    },
    {
      name: 'Editorial Terra Firme & Ouro',
      primary: '#78350f',
      accent: '#eab308',
      header: '#451a03',
      newsTicker: '#291002',
      body: '#fefce8',
    },
  ];

  // Synchronize with store
  React.useEffect(() => {
    if (config.palette) {
      setPrimaryColor(config.palette.primaryColor || '#0f3d59');
      setAccentColor(config.palette.accentColor || '#d97706');
      setHeaderBg(config.palette.headerBg || '#0f172a');
      setNewsTickerBg(config.palette.newsTickerBg || '#090d16');
      setBodyBg(config.palette.bodyBg || '#f8fafc');
    }
  }, [config.palette]);

  const applyPreset = (preset: typeof presets[0]) => {
    setPrimaryColor(preset.primary);
    setAccentColor(preset.accent);
    setHeaderBg(preset.header);
    setNewsTickerBg(preset.newsTicker);
    setBodyBg(preset.body);
    updatePalette({
      primaryColor: preset.primary,
      accentColor: preset.accent,
      headerBg: preset.header,
      newsTickerBg: preset.newsTicker,
      bodyBg: preset.body,
    });
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();

    updatePalette({
      primaryColor,
      accentColor,
      headerBg,
      newsTickerBg,
      bodyBg,
    });

    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3500);
  };

  return (
    <form onSubmit={handleSave} className="space-y-6">
      <div className="flex items-center justify-between pb-3 border-b border-slate-200">
        <div>
          <h3 className="font-editorial text-2xl font-bold text-slate-900 flex items-center gap-2">
            <Palette className="w-6 h-6 text-[#0f3d59]" />
            <span>Paleta de Cores da Página (One Page)</span>
          </h3>
          <p className="text-xs text-slate-500 font-sans">
            Personalize a identidade cromática completa do portal: tons do Rio, verde da floresta, ouro solar e fundos com prévia visual instantânea.
          </p>
        </div>

        <button
          type="submit"
          className="px-5 py-2.5 bg-[#0f3d59] hover:bg-[#0a2540] text-white text-xs font-bold rounded-lg transition-colors cursor-pointer shadow-xs flex items-center gap-2"
        >
          <CheckCircle2 className="w-4 h-4" />
          <span>Salvar Paleta</span>
        </button>
      </div>

      {savedSuccess && (
        <div className="p-3.5 bg-emerald-50 border border-emerald-300 rounded-xl text-xs text-emerald-800 font-semibold flex items-center gap-2 animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0" />
          <span>Paleta de cores atualizada e aplicada com sucesso!</span>
        </div>
      )}

      {/* Live Visual Card Preview */}
      <div className="p-5 rounded-2xl border border-slate-200 shadow-sm space-y-4" style={{ backgroundColor: bodyBg }}>
        <div className="flex items-center justify-between text-xs font-bold text-slate-700">
          <span className="flex items-center gap-1.5 uppercase tracking-wider">
            <Eye className="w-4 h-4 text-slate-500" />
            <span>Simulador da Identidade Visual da One Page</span>
          </span>
          <span className="text-[11px] font-mono font-normal text-slate-500">
            Fundo: {bodyBg}
          </span>
        </div>

        {/* Mock Header */}
        <div className="rounded-xl overflow-hidden shadow-md border border-slate-700/20">
          <div className="p-2 text-white text-[10px] flex items-center justify-between px-4" style={{ backgroundColor: newsTickerBg }}>
            <span>URGENTE: Notícias do Amazonas em Tempo Real</span>
            <span style={{ color: accentColor }}>Manaus · 29°C</span>
          </div>
          <div className="p-4 flex items-center justify-between text-white" style={{ backgroundColor: headerBg }}>
            <div>
              <span className="font-editorial text-lg font-bold block" style={{ color: '#ffffff' }}>
                COMUNIDADE EM AÇÃO
              </span>
              <span className="text-[10px] tracking-widest font-sans uppercase" style={{ color: accentColor }}>
                Portal de Notícias Locais do Amazonas
              </span>
            </div>
            <button
              type="button"
              className="px-3 py-1.5 rounded-lg text-xs font-bold text-slate-950 shadow-xs"
              style={{ backgroundColor: accentColor }}
            >
              🚨 Fazer Denúncia
            </button>
          </div>
        </div>

        {/* Mock Content Card */}
        <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider block" style={{ color: primaryColor }}>
              Editoria em Destaque
            </span>
            <h5 className="font-editorial font-bold text-base text-slate-900">
              Reportagem com o Padrão Editorial Selecionado
            </h5>
          </div>
          <button
            type="button"
            className="px-4 py-2 text-white text-xs font-bold rounded-lg shadow-xs"
            style={{ backgroundColor: primaryColor }}
          >
            Ler Matéria
          </button>
        </div>
      </div>

      {/* Presets Grid */}
      <div className="bg-white p-5 border border-slate-200 rounded-xl space-y-3 shadow-2xs">
        <h4 className="font-editorial text-base font-bold text-slate-900 flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-amber-500" />
          <span>Paletas Prontas (Presets Temáticos Amazônicos)</span>
        </h4>
        <p className="text-xs text-slate-500">
          Selecione uma combinação profissional com um clique:
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
          {presets.map((p, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => applyPreset(p)}
              className="p-3.5 border border-slate-200 hover:border-[#0f3d59] rounded-xl text-left bg-slate-50 hover:bg-white transition-all cursor-pointer flex items-center justify-between group"
            >
              <div>
                <span className="font-bold text-xs text-slate-900 block group-hover:text-[#0f3d59]">
                  {p.name}
                </span>
                <span className="text-[10px] text-slate-500">
                  Primária: {p.primary} · Destaque: {p.accent}
                </span>
              </div>
              <div className="flex items-center gap-1">
                <span className="w-5 h-5 rounded-full border border-white shadow-xs" style={{ backgroundColor: p.primary }} />
                <span className="w-5 h-5 rounded-full border border-white shadow-xs" style={{ backgroundColor: p.accent }} />
                <span className="w-5 h-5 rounded-full border border-white shadow-xs" style={{ backgroundColor: p.header }} />
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Detailed Color Pickers */}
      <div className="bg-white p-5 border border-slate-200 rounded-xl space-y-4 shadow-2xs">
        <h4 className="font-editorial text-base font-bold text-slate-900 flex items-center gap-2">
          <Sliders className="w-4 h-4 text-[#0f3d59]" />
          <span>Seleção Precisa de Cores Hexadecimais</span>
        </h4>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          
          {/* Primary */}
          <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl space-y-2">
            <label className="block text-xs font-semibold text-slate-700">
              Cor Primária (Tons do Rio / Botões)
            </label>
            <div className="flex items-center gap-3">
              <input
                type="color"
                value={primaryColor}
                onChange={(e) => {
                  setPrimaryColor(e.target.value);
                  updatePalette({ primaryColor: e.target.value });
                }}
                className="w-10 h-10 rounded border border-slate-300 cursor-pointer p-0.5"
              />
              <input
                type="text"
                value={primaryColor}
                onChange={(e) => {
                  setPrimaryColor(e.target.value);
                  updatePalette({ primaryColor: e.target.value });
                }}
                className="flex-1 px-3 py-2 text-xs bg-white border border-slate-200 rounded-lg font-mono focus:outline-none focus:ring-1 focus:ring-[#0f3d59]"
              />
            </div>
          </div>

          {/* Accent */}
          <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl space-y-2">
            <label className="block text-xs font-semibold text-slate-700">
              Cor de Destaque (Ouro / Alertas / CTA)
            </label>
            <div className="flex items-center gap-3">
              <input
                type="color"
                value={accentColor}
                onChange={(e) => {
                  setAccentColor(e.target.value);
                  updatePalette({ accentColor: e.target.value });
                }}
                className="w-10 h-10 rounded border border-slate-300 cursor-pointer p-0.5"
              />
              <input
                type="text"
                value={accentColor}
                onChange={(e) => {
                  setAccentColor(e.target.value);
                  updatePalette({ accentColor: e.target.value });
                }}
                className="flex-1 px-3 py-2 text-xs bg-white border border-slate-200 rounded-lg font-mono focus:outline-none focus:ring-1 focus:ring-[#0f3d59]"
              />
            </div>
          </div>

          {/* Header Bg */}
          <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl space-y-2">
            <label className="block text-xs font-semibold text-slate-700">
              Fundo do Cabeçalho Superior
            </label>
            <div className="flex items-center gap-3">
              <input
                type="color"
                value={headerBg}
                onChange={(e) => {
                  setHeaderBg(e.target.value);
                  updatePalette({ headerBg: e.target.value });
                }}
                className="w-10 h-10 rounded border border-slate-300 cursor-pointer p-0.5"
              />
              <input
                type="text"
                value={headerBg}
                onChange={(e) => {
                  setHeaderBg(e.target.value);
                  updatePalette({ headerBg: e.target.value });
                }}
                className="flex-1 px-3 py-2 text-xs bg-white border border-slate-200 rounded-lg font-mono focus:outline-none focus:ring-1 focus:ring-[#0f3d59]"
              />
            </div>
          </div>

          {/* News Ticker Bg */}
          <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl space-y-2">
            <label className="block text-xs font-semibold text-slate-700">
              Fundo da Barra de Plantão / Clima
            </label>
            <div className="flex items-center gap-3">
              <input
                type="color"
                value={newsTickerBg}
                onChange={(e) => {
                  setNewsTickerBg(e.target.value);
                  updatePalette({ newsTickerBg: e.target.value });
                }}
                className="w-10 h-10 rounded border border-slate-300 cursor-pointer p-0.5"
              />
              <input
                type="text"
                value={newsTickerBg}
                onChange={(e) => {
                  setNewsTickerBg(e.target.value);
                  updatePalette({ newsTickerBg: e.target.value });
                }}
                className="flex-1 px-3 py-2 text-xs bg-white border border-slate-200 rounded-lg font-mono focus:outline-none focus:ring-1 focus:ring-[#0f3d59]"
              />
            </div>
          </div>

          {/* Body Bg */}
          <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl space-y-2">
            <label className="block text-xs font-semibold text-slate-700">
              Fundo Geral da Página (Body)
            </label>
            <div className="flex items-center gap-3">
              <input
                type="color"
                value={bodyBg}
                onChange={(e) => {
                  setBodyBg(e.target.value);
                  updatePalette({ bodyBg: e.target.value });
                }}
                className="w-10 h-10 rounded border border-slate-300 cursor-pointer p-0.5"
              />
              <input
                type="text"
                value={bodyBg}
                onChange={(e) => {
                  setBodyBg(e.target.value);
                  updatePalette({ bodyBg: e.target.value });
                }}
                className="flex-1 px-3 py-2 text-xs bg-white border border-slate-200 rounded-lg font-mono focus:outline-none focus:ring-1 focus:ring-[#0f3d59]"
              />
            </div>
          </div>
        </div>
      </div>
    </form>
  );
};
