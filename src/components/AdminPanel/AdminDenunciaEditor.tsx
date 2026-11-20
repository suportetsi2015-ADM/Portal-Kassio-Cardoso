import React, { useState } from 'react';
import { useStore } from '../../context/StoreContext';
import { DenunciaSectionConfig, DenunciaWhatToReportItem } from '../../types';
import { INITIAL_DENUNCIA_CONFIG } from '../../data/initialData';
import {
  MessageSquareShare,
  CheckCircle2,
  Plus,
  Trash2,
  ArrowUp,
  ArrowDown,
  RotateCcw,
  ShieldCheck,
  FileCheck,
  AlertTriangle,
} from 'lucide-react';

export const AdminDenunciaEditor: React.FC = () => {
  const { config, updateDenunciaSection, resetDenunciaToDefault } = useStore();

  const currentConfig: DenunciaSectionConfig = config.denunciaConfig || INITIAL_DENUNCIA_CONFIG;

  const [eyebrow, setEyebrow] = useState(currentConfig.eyebrow || 'Voz e Cidadania');
  const [title, setTitle] = useState(
    currentConfig.title || 'Canal de Denúncias da Comunidade & Sugestão de Pauta'
  );
  const [subtitle, setSubtitle] = useState(
    currentConfig.subtitle ||
      'Presenciou um problema no seu bairro ou comunidade? Buraco na via, falta de merenda, transporte fluvial precário ou desabastecimento de água? Envie seu relato com foto ou vídeo. Nossa redação apura com rigor jornalístico.'
  );

  const [legalShieldTitle, setLegalShieldTitle] = useState(
    currentConfig.legalShieldTitle || 'Sua Identidade Está 100% Protegida'
  );
  const [legalShieldText, setLegalShieldText] = useState(
    currentConfig.legalShieldText ||
      'Você pode optar por denunciar de forma totalmente anônima. A Constituição Brasileira (Art. 5º, XIV) e o Código de Ética dos Jornalistas asseguram o sigilo absoluto da fonte.'
  );
  const [legalShieldNote, setLegalShieldNote] = useState(
    currentConfig.legalShieldNote ||
      'A redação do jornalista comunitário Kássio Cardoso verifica cada fato antes de qualquer publicação, solicitando esclarecimentos oficiais aos órgãos competentes.'
  );

  const [whatToReportTitle, setWhatToReportTitle] = useState(
    currentConfig.whatToReportTitle || 'O que você pode denunciar?'
  );

  const [items, setItems] = useState<DenunciaWhatToReportItem[]>(
    Array.isArray(currentConfig.whatToReportItems)
      ? currentConfig.whatToReportItems
      : INITIAL_DENUNCIA_CONFIG.whatToReportItems
  );

  const [savedSuccess, setSavedSuccess] = useState(false);

  // Synchronize when config.denunciaConfig changes in store
  React.useEffect(() => {
    if (config.denunciaConfig) {
      setEyebrow(config.denunciaConfig.eyebrow || 'Voz e Cidadania');
      setTitle(config.denunciaConfig.title || 'Canal de Denúncias da Comunidade & Sugestão de Pauta');
      setSubtitle(config.denunciaConfig.subtitle || '');
      setLegalShieldTitle(config.denunciaConfig.legalShieldTitle || 'Sua Identidade Está 100% Protegida');
      setLegalShieldText(config.denunciaConfig.legalShieldText || '');
      setLegalShieldNote(config.denunciaConfig.legalShieldNote || '');
      setWhatToReportTitle(config.denunciaConfig.whatToReportTitle || 'O que você pode denunciar?');
      if (Array.isArray(config.denunciaConfig.whatToReportItems)) {
        setItems(config.denunciaConfig.whatToReportItems);
      }
    }
  }, [config.denunciaConfig]);

  // Sync to store in real time
  const syncToStore = (patch: Partial<DenunciaSectionConfig>) => {
    updateDenunciaSection({
      eyebrow,
      title,
      subtitle,
      legalShieldTitle,
      legalShieldText,
      legalShieldNote,
      whatToReportTitle,
      whatToReportItems: items,
      ...patch,
    });
  };

  const handleAddItem = () => {
    const newItem: DenunciaWhatToReportItem = {
      id: `item-${Date.now()}`,
      text: 'Novo tópico de denúncia aceito pela redação (ex: falta de água, merenda, segurança);',
    };
    const updated = [...items, newItem];
    setItems(updated);
    syncToStore({ whatToReportItems: updated });
  };

  const handleUpdateItem = (id: string, text: string) => {
    const updated = items.map((it) => (it.id === id ? { ...it, text } : it));
    setItems(updated);
    syncToStore({ whatToReportItems: updated });
  };

  const handleDeleteItem = (id: string) => {
    if (items.length <= 1) {
      alert('A lista precisa de pelo menos 1 tópico.');
      return;
    }
    const updated = items.filter((it) => it.id !== id);
    setItems(updated);
    syncToStore({ whatToReportItems: updated });
  };

  const handleMoveItem = (index: number, direction: 'up' | 'down') => {
    const target = direction === 'up' ? index - 1 : index + 1;
    if (target < 0 || target >= items.length) return;
    const reordered = [...items];
    const temp = reordered[index];
    reordered[index] = reordered[target];
    reordered[target] = temp;
    setItems(reordered);
    syncToStore({ whatToReportItems: reordered });
  };

  const handleSaveAll = (e: React.FormEvent) => {
    e.preventDefault();
    syncToStore({});
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3500);
  };

  const handleReset = () => {
    if (confirm('Deseja restaurar as configurações do Canal de Denúncias e os tópicos para o padrão oficial?')) {
      resetDenunciaToDefault();
      setEyebrow(INITIAL_DENUNCIA_CONFIG.eyebrow);
      setTitle(INITIAL_DENUNCIA_CONFIG.title);
      setSubtitle(INITIAL_DENUNCIA_CONFIG.subtitle);
      setLegalShieldTitle(INITIAL_DENUNCIA_CONFIG.legalShieldTitle);
      setLegalShieldText(INITIAL_DENUNCIA_CONFIG.legalShieldText);
      setLegalShieldNote(INITIAL_DENUNCIA_CONFIG.legalShieldNote);
      setWhatToReportTitle(INITIAL_DENUNCIA_CONFIG.whatToReportTitle);
      setItems(INITIAL_DENUNCIA_CONFIG.whatToReportItems);
      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 3500);
    }
  };

  return (
    <form onSubmit={handleSaveAll} className="space-y-8">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <h3 className="font-editorial text-2xl font-bold text-slate-900 flex items-center gap-2">
            <MessageSquareShare className="w-6 h-6 text-amber-600" />
            <span>Gestão do Formulário de Denúncia Comunitária</span>
          </h3>
          <p className="text-xs text-slate-500 font-sans mt-0.5">
            Insira, edite, altere e exclua 100% dos textos do formulário de denúncia, termos legais de sigilo constitucional e a lista completa do que o leitor pode denunciar.
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            type="button"
            onClick={handleReset}
            className="px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-lg transition-colors cursor-pointer flex items-center gap-1.5"
            title="Restaurar padrão oficial"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Restaurar Padrão</span>
          </button>

          <button
            type="submit"
            className="px-5 py-2 bg-[#0f3d59] hover:bg-[#0a2540] text-white text-xs font-bold rounded-lg transition-colors cursor-pointer flex items-center gap-1.5 shadow-xs"
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>Salvar Alterações</span>
          </button>
        </div>
      </div>

      {savedSuccess && (
        <div className="p-3.5 bg-emerald-50 border border-emerald-300 rounded-xl text-xs text-emerald-800 font-semibold flex items-center gap-2 animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0" />
          <span>Configurações do Canal de Denúncias salvas e sincronizadas em tempo real na One Page!</span>
        </div>
      )}

      {/* Main Header Card */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs space-y-4">
        <h4 className="font-editorial text-base font-bold text-slate-900 flex items-center gap-2">
          <AlertTriangle className="w-4 h-4 text-amber-600" />
          <span>Chamada Principal da Seção (Cabeçalho)</span>
        </h4>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Chapéu / Tag Superior (Eyebrow)
            </label>
            <input
              type="text"
              value={eyebrow}
              onChange={(e) => {
                setEyebrow(e.target.value);
                syncToStore({ eyebrow: e.target.value });
              }}
              className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#0f3d59] focus:bg-white"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Título da Seção de Denúncia
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => {
                setTitle(e.target.value);
                syncToStore({ title: e.target.value });
              }}
              className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#0f3d59] focus:bg-white"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">
            Texto Descritivo / Chamamento à Comunidade
          </label>
          <textarea
            rows={3}
            value={subtitle}
            onChange={(e) => {
              setSubtitle(e.target.value);
              syncToStore({ subtitle: e.target.value });
            }}
            className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#0f3d59] focus:bg-white"
          />
        </div>
      </div>

      {/* Card: Legal Guarantees & Privacy */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs space-y-4">
        <h4 className="font-editorial text-base font-bold text-slate-900 flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-emerald-600" />
          <span>Garantias Legais e Sigilo da Fonte</span>
        </h4>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Título do Card de Sigilo
            </label>
            <input
              type="text"
              value={legalShieldTitle}
              onChange={(e) => {
                setLegalShieldTitle(e.target.value);
                syncToStore({ legalShieldTitle: e.target.value });
              }}
              className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#0f3d59] focus:bg-white"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Nota sobre Apuração & Kássio Cardoso
            </label>
            <input
              type="text"
              value={legalShieldNote}
              onChange={(e) => {
                setLegalShieldNote(e.target.value);
                syncToStore({ legalShieldNote: e.target.value });
              }}
              className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#0f3d59] focus:bg-white"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">
            Texto do Sigilo Constitucional (Art. 5º, XIV da CF/88)
          </label>
          <textarea
            rows={2}
            value={legalShieldText}
            onChange={(e) => {
              setLegalShieldText(e.target.value);
              syncToStore({ legalShieldText: e.target.value });
            }}
            className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#0f3d59] focus:bg-white"
          />
        </div>
      </div>

      {/* Card: CRUD "O QUE VOCÊ PODE DENUNCIAR?" */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
          <div>
            <h4 className="font-editorial text-base font-bold text-slate-900 flex items-center gap-2">
              <FileCheck className="w-4 h-4 text-amber-600" />
              <span>Tópicos: "O Que Você Pode Denunciar?" (CRUD Completo)</span>
            </h4>
            <p className="text-xs text-slate-500 font-sans mt-0.5">
              Adicione novos temas, altere os textos das orientações e exclua tópicos a qualquer momento.
            </p>
          </div>

          <button
            type="button"
            onClick={handleAddItem}
            className="px-3 py-1.5 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold rounded-lg text-xs cursor-pointer flex items-center gap-1.5 shadow-2xs shrink-0"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>+ Adicionar Tópico</span>
          </button>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">
            Título do Bloco de Exemplos
          </label>
          <input
            type="text"
            value={whatToReportTitle}
            onChange={(e) => {
              setWhatToReportTitle(e.target.value);
              syncToStore({ whatToReportTitle: e.target.value });
            }}
            className="w-full max-w-md px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#0f3d59] focus:bg-white mb-4"
          />
        </div>

        {/* Dynamic Items List */}
        <div className="space-y-3">
          {items.map((item, index) => (
            <div
              key={item.id}
              className="p-3 bg-slate-50 border border-slate-200 rounded-xl flex items-center gap-3"
            >
              <span className="w-6 h-6 rounded-full bg-amber-100 text-amber-900 text-xs font-bold flex items-center justify-center shrink-0">
                {index + 1}
              </span>

              <input
                type="text"
                value={item.text}
                onChange={(e) => handleUpdateItem(item.id, e.target.value)}
                className="flex-1 px-3 py-1.5 text-xs bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#0f3d59]"
                placeholder="Ex: Falta de medicamentos e médicos nos postos de saúde;"
              />

              <div className="flex items-center gap-1 shrink-0">
                <button
                  type="button"
                  onClick={() => handleMoveItem(index, 'up')}
                  disabled={index === 0}
                  className="p-1.5 text-slate-500 hover:text-slate-800 disabled:opacity-30 rounded cursor-pointer"
                  title="Subir posição"
                >
                  <ArrowUp className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => handleMoveItem(index, 'down')}
                  disabled={index === items.length - 1}
                  className="p-1.5 text-slate-500 hover:text-slate-800 disabled:opacity-30 rounded cursor-pointer"
                  title="Descer posição"
                >
                  <ArrowDown className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => handleDeleteItem(item.id)}
                  className="p-1.5 text-red-500 hover:text-red-700 hover:bg-red-50 rounded cursor-pointer ml-1"
                  title="Excluir este tópico"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Save Button Bar */}
      <div className="flex justify-end pt-4 border-t border-slate-200">
        <button
          type="submit"
          className="px-6 py-2.5 bg-[#0f3d59] hover:bg-[#0a2540] text-white text-xs font-bold rounded-xl transition-colors cursor-pointer flex items-center gap-2 shadow-xs"
        >
          <CheckCircle2 className="w-4 h-4" />
          <span>Salvar Todas as Configurações de Denúncia</span>
        </button>
      </div>
    </form>
  );
};
