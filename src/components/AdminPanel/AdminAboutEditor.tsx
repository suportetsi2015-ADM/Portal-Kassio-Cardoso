import React, { useState } from 'react';
import { useStore } from '../../context/StoreContext';
import {
  AboutPillarItem,
  AboutParagraphItem,
  AboutImageItem,
  AboutSectionConfig,
} from '../../types';
import { INITIAL_ABOUT_CONFIG } from '../../data/initialData';
import {
  UserCheck,
  CheckCircle2,
  Upload,
  Image,
  Award,
  BookOpen,
  Plus,
  Trash2,
  RotateCcw,
  ArrowUp,
  ArrowDown,
  Compass,
  HeartHandshake,
  Shield,
  Users,
  MapPin,
  Newspaper,
  CheckCircle,
  Camera,
  FileText,
  AlertCircle,
  Eye,
  Sparkles,
} from 'lucide-react';
import defaultKassioPhoto from '../../assets/images/kassio_cardoso_remaster_1791829104828.jpg';
import avatarKassioPhoto from '../../assets/images/avatar_kassio_cardoso_1791649510274.jpg';
import claquetePhoto from '../../assets/images/claquete_comunidade_em_acao_1791659081150.jpg';
import heroAmazonasPhoto from '../../assets/images/hero_amazonas_ribeirinho_1791649494876.jpg';
import { compressImageFile } from '../../utils/imageCompression';

const availableIcons = [
  { id: 'Compass', label: 'Bússola / Territorialidade', icon: Compass },
  { id: 'HeartHandshake', label: 'Aperto de Mão / Colaboração', icon: HeartHandshake },
  { id: 'Award', label: 'Troféu / Verificação', icon: Award },
  { id: 'Shield', label: 'Escudo / Ética e Segurança', icon: Shield },
  { id: 'Users', label: 'Pessoas / Comunidade', icon: Users },
  { id: 'MapPin', label: 'Localização / Território', icon: MapPin },
  { id: 'Newspaper', label: 'Jornal / Notícia Cidadã', icon: Newspaper },
  { id: 'CheckCircle', label: 'Checagem / Verificado', icon: CheckCircle },
];

export const AdminAboutEditor: React.FC = () => {
  const { config, updateAboutSection, resetAboutToDefault } = useStore();

  const currentAbout: AboutSectionConfig = config.aboutConfig || INITIAL_ABOUT_CONFIG;

  // Local editable state
  const [eyebrow, setEyebrow] = useState(currentAbout.eyebrow || 'Quem Somos');
  const [title, setTitle] = useState(
    currentAbout.title || 'Um Portal Nascido das Águas e das Vozes do Amazonas'
  );

  // Founder profile fields
  const [founderPhotoUrl, setFounderPhotoUrl] = useState(
    currentAbout.founderPhotoUrl || defaultKassioPhoto
  );
  const [founderBadge, setFounderBadge] = useState(
    currentAbout.founderBadge || 'Idealizador do Projeto'
  );
  const [founderName, setFounderName] = useState(
    currentAbout.founderName || 'Kássio Cardoso'
  );
  const [founderRole, setFounderRole] = useState(
    currentAbout.founderRole || 'Jornalista Comunitário · Amazonas'
  );
  const [institutionalQuoteLabel, setInstitutionalQuoteLabel] = useState(
    currentAbout.institutionalQuoteLabel || 'Assinatura Institucional'
  );
  const [institutionalQuoteText, setInstitutionalQuoteText] = useState(
    currentAbout.institutionalQuoteText || 'A notícia nasce na comunidade.'
  );

  // Dynamic paragraphs (CRUD)
  const [paragraphs, setParagraphs] = useState<AboutParagraphItem[]>(
    Array.isArray(currentAbout.paragraphs)
      ? currentAbout.paragraphs
      : INITIAL_ABOUT_CONFIG.paragraphs
  );

  // Dynamic pillars (CRUD)
  const [pillars, setPillars] = useState<AboutPillarItem[]>(
    Array.isArray(currentAbout.pillars)
      ? currentAbout.pillars
      : INITIAL_ABOUT_CONFIG.pillars
  );

  // Dynamic additional images (CRUD)
  const [additionalImages, setAdditionalImages] = useState<AboutImageItem[]>(
    Array.isArray(currentAbout.additionalImages)
      ? currentAbout.additionalImages
      : INITIAL_ABOUT_CONFIG.additionalImages || []
  );

  const [savedSuccess, setSavedSuccess] = useState(false);
  const [activeSubTab, setActiveSubTab] = useState<'textos' | 'idealizador' | 'pilares' | 'imagens'>('textos');

  // Synchronize when config.aboutConfig changes in store
  React.useEffect(() => {
    if (config.aboutConfig) {
      setEyebrow(config.aboutConfig.eyebrow || 'Quem Somos');
      setTitle(config.aboutConfig.title || 'Um Portal Nascido das Águas e das Vozes do Amazonas');
      setFounderPhotoUrl(config.aboutConfig.founderPhotoUrl !== undefined ? config.aboutConfig.founderPhotoUrl : defaultKassioPhoto);
      setFounderBadge(config.aboutConfig.founderBadge || 'Idealizador do Projeto');
      setFounderName(config.aboutConfig.founderName || 'Kássio Cardoso');
      setFounderRole(config.aboutConfig.founderRole || 'Jornalista Comunitário · Amazonas');
      setInstitutionalQuoteLabel(config.aboutConfig.institutionalQuoteLabel || 'Assinatura Institucional');
      setInstitutionalQuoteText(config.aboutConfig.institutionalQuoteText || 'A notícia nasce na comunidade.');
      if (Array.isArray(config.aboutConfig.paragraphs)) {
        setParagraphs(config.aboutConfig.paragraphs);
      }
      if (Array.isArray(config.aboutConfig.pillars)) {
        setPillars(config.aboutConfig.pillars);
      }
      if (Array.isArray(config.aboutConfig.additionalImages)) {
        setAdditionalImages(config.aboutConfig.additionalImages);
      }
    }
  }, [config.aboutConfig]);

  // Real-time synchronization helper with StoreContext
  const syncToStore = (patch: Partial<AboutSectionConfig>) => {
    const updated: AboutSectionConfig = {
      eyebrow,
      title,
      founderPhotoUrl,
      founderBadge,
      founderName,
      founderRole,
      institutionalQuoteLabel,
      institutionalQuoteText,
      paragraphs,
      pillars,
      additionalImages,
      ...patch,
    };
    updateAboutSection(updated);
  };

  // Handle founder image upload with canvas compression
  const handleFounderPhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      // Comprime a foto para max 800x800 e JPEG 0.85 (~40KB-60KB) evitando exceder quota do navegador
      const compressedDataUrl = await compressImageFile(file, 800, 800, 0.85);
      setFounderPhotoUrl(compressedDataUrl);
      syncToStore({ founderPhotoUrl: compressedDataUrl });
    } catch (err) {
      console.warn('Falha na compressão da imagem:', err);
      // Fallback
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          const photo = event.target.result as string;
          setFounderPhotoUrl(photo);
          syncToStore({ founderPhotoUrl: photo });
        }
      };
      reader.readAsDataURL(file);
    }
  };

  // Restore official Kassio photo
  const handleRestoreOfficialPhoto = () => {
    setFounderPhotoUrl(defaultKassioPhoto);
    syncToStore({ founderPhotoUrl: defaultKassioPhoto });
  };

  // Clear founder photo
  const handleClearFounderPhoto = () => {
    setFounderPhotoUrl('');
    syncToStore({ founderPhotoUrl: '' });
  };

  // PARAGRAPHS CRUD
  const handleAddParagraph = () => {
    const newId = `para-${Date.now()}`;
    const newPara: AboutParagraphItem = {
      id: newId,
      text: 'Novo parágrafo descritivo sobre o jornalismo e compromisso comunitário do portal no Amazonas.',
    };
    const updated = [...paragraphs, newPara];
    setParagraphs(updated);
    syncToStore({ paragraphs: updated });
  };

  const handleUpdateParagraph = (id: string, newText: string) => {
    const updated = paragraphs.map((p) => (p.id === id ? { ...p, text: newText } : p));
    setParagraphs(updated);
    syncToStore({ paragraphs: updated });
  };

  const handleDeleteParagraph = (id: string) => {
    if (paragraphs.length <= 1) {
      alert('A seção Sobre precisa de pelo menos 1 parágrafo.');
      return;
    }
    if (confirm('Deseja realmente excluir este parágrafo da estrutura Sobre?')) {
      const updated = paragraphs.filter((p) => p.id !== id);
      setParagraphs(updated);
      syncToStore({ paragraphs: updated });
    }
  };

  const handleMoveParagraph = (index: number, direction: 'up' | 'down') => {
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= paragraphs.length) return;
    const newArr = [...paragraphs];
    const temp = newArr[index];
    newArr[index] = newArr[targetIndex];
    newArr[targetIndex] = temp;
    setParagraphs(newArr);
    syncToStore({ paragraphs: newArr });
  };

  // PILLARS CRUD
  const handleAddPillar = () => {
    const newId = `pil-${Date.now()}`;
    const newPillar: AboutPillarItem = {
      id: newId,
      title: 'Novo Pilar Editorial',
      description: 'Descrição clara e objetiva do princípio de atuação jornalística cidadã.',
      iconName: 'Shield',
      order: pillars.length + 1,
    };
    const updated = [...pillars, newPillar];
    setPillars(updated);
    syncToStore({ pillars: updated });
  };

  const handleUpdatePillar = (id: string, patch: Partial<AboutPillarItem>) => {
    const updated = pillars.map((pil) => (pil.id === id ? { ...pil, ...patch } : pil));
    setPillars(updated);
    syncToStore({ pillars: updated });
  };

  const handleDeletePillar = (id: string) => {
    if (confirm('Deseja realmente excluir este pilar editorial?')) {
      const updated = pillars.filter((p) => p.id !== id);
      setPillars(updated);
      syncToStore({ pillars: updated });
    }
  };

  const handleMovePillar = (index: number, direction: 'up' | 'down') => {
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= pillars.length) return;
    const newArr = [...pillars];
    const temp = newArr[index];
    newArr[index] = newArr[targetIndex];
    newArr[targetIndex] = temp;
    setPillars(newArr);
    syncToStore({ pillars: newArr });
  };

  // ADDITIONAL IMAGES CRUD
  const handleAddImage = () => {
    const newId = `img-${Date.now()}`;
    const newImg: AboutImageItem = {
      id: newId,
      url: '/src/assets/images/claquete_comunidade_em_acao_1791659081150.jpg',
      caption: 'Registro oficial das gravações comunitárias.',
      credit: 'Equipe de Campo',
      order: additionalImages.length + 1,
    };
    const updated = [...additionalImages, newImg];
    setAdditionalImages(updated);
    syncToStore({ additionalImages: updated });
  };

  const handleUpdateImage = (id: string, patch: Partial<AboutImageItem>) => {
    const updated = additionalImages.map((img) => (img.id === id ? { ...img, ...patch } : img));
    setAdditionalImages(updated);
    syncToStore({ additionalImages: updated });
  };

  const handleImageUploadItem = (id: string, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      if (event.target?.result) {
        handleUpdateImage(id, { url: event.target.result as string });
      }
    };
    reader.readAsDataURL(file);
  };

  const handleDeleteImage = (id: string) => {
    if (confirm('Deseja realmente excluir esta imagem da estrutura Sobre?')) {
      const updated = additionalImages.filter((img) => img.id !== id);
      setAdditionalImages(updated);
      syncToStore({ additionalImages: updated });
    }
  };

  // SAVE ALL (Explicit confirmation with visual success indicator)
  const handleSaveAll = (e: React.FormEvent) => {
    e.preventDefault();

    const updatedConfig: AboutSectionConfig = {
      eyebrow,
      title,
      founderPhotoUrl,
      founderBadge,
      founderName,
      founderRole,
      institutionalQuoteLabel,
      institutionalQuoteText,
      paragraphs,
      pillars,
      additionalImages,
    };

    updateAboutSection(updatedConfig);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 4000);
  };

  // RESTORE DEFAULT
  const handleResetToDefault = () => {
    if (
      confirm(
        'Deseja restaurar a estrutura SOBRE para o padrão oficial original (foto 100% idêntica de Kássio Cardoso e textos originais justificados)?'
      )
    ) {
      resetAboutToDefault();
      setEyebrow(INITIAL_ABOUT_CONFIG.eyebrow);
      setTitle(INITIAL_ABOUT_CONFIG.title);
      setFounderPhotoUrl(INITIAL_ABOUT_CONFIG.founderPhotoUrl);
      setFounderBadge(INITIAL_ABOUT_CONFIG.founderBadge);
      setFounderName(INITIAL_ABOUT_CONFIG.founderName);
      setFounderRole(INITIAL_ABOUT_CONFIG.founderRole);
      setInstitutionalQuoteLabel(INITIAL_ABOUT_CONFIG.institutionalQuoteLabel);
      setInstitutionalQuoteText(INITIAL_ABOUT_CONFIG.institutionalQuoteText);
      setParagraphs(INITIAL_ABOUT_CONFIG.paragraphs);
      setPillars(INITIAL_ABOUT_CONFIG.pillars);
      setAdditionalImages(INITIAL_ABOUT_CONFIG.additionalImages);
      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 4000);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1.5 bg-[#0f3d59]/10 text-[#0f3d59] rounded-lg">
              <UserCheck className="w-5 h-5" />
            </span>
            <h3 className="font-editorial text-2xl font-bold text-slate-900">
              Gestão Integral da Estrutura SOBRE
            </h3>
            <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">
              100% Editável
            </span>
          </div>
          <p className="text-xs text-slate-500 font-sans mt-1">
            Insira, edite, altere ou exclua livremente fotos, textos justificados, parágrafos, biografia do idealizador e pilares editoriais da página inicial.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleResetToDefault}
            className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-lg transition-colors cursor-pointer flex items-center gap-1.5"
            title="Restaurar textos e imagem oficial de Kássio Cardoso"
          >
            <RotateCcw className="w-3.5 h-3.5 text-slate-500" />
            <span>Restaurar Padrão Oficial</span>
          </button>

          <button
            type="button"
            onClick={handleSaveAll}
            className="px-4 py-2 bg-[#0f3d59] hover:bg-[#0a2540] text-white text-xs font-bold rounded-lg transition-colors cursor-pointer shadow-xs flex items-center gap-2"
          >
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>Salvar Alterações</span>
          </button>
        </div>
      </div>

      {/* Success Notification */}
      {savedSuccess && (
        <div className="p-4 bg-emerald-50 border border-emerald-300 rounded-xl text-xs text-emerald-900 font-semibold flex items-center gap-3 shadow-xs animate-in fade-in">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
          <div>
            <p className="font-bold">Estrutura SOBRE atualizada com sucesso!</p>
            <p className="text-[11px] text-emerald-700 font-normal">
              Todas as modificações de imagens, textos justificados e pilares já estão em exibição na One Page.
            </p>
          </div>
        </div>
      )}

      {/* Internal Subtabs Navigation */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-2">
        <button
          type="button"
          onClick={() => setActiveSubTab('textos')}
          className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors cursor-pointer flex items-center gap-1.5 ${
            activeSubTab === 'textos'
              ? 'bg-[#0f3d59] text-white'
              : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
          }`}
        >
          <FileText className="w-3.5 h-3.5" />
          <span>1. Textos & Parágrafos Justificados ({paragraphs.length})</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveSubTab('idealizador')}
          className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors cursor-pointer flex items-center gap-1.5 ${
            activeSubTab === 'idealizador'
              ? 'bg-[#0f3d59] text-white'
              : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
          }`}
        >
          <UserCheck className="w-3.5 h-3.5" />
          <span>2. Foto & Identidade do Idealizador</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveSubTab('pilares')}
          className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors cursor-pointer flex items-center gap-1.5 ${
            activeSubTab === 'pilares'
              ? 'bg-[#0f3d59] text-white'
              : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
          }`}
        >
          <Award className="w-3.5 h-3.5" />
          <span>3. Pilares Editoriais ({pillars.length})</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveSubTab('imagens')}
          className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors cursor-pointer flex items-center gap-1.5 ${
            activeSubTab === 'imagens'
              ? 'bg-[#0f3d59] text-white'
              : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
          }`}
        >
          <Camera className="w-3.5 h-3.5" />
          <span>4. Galeria de Imagens ({additionalImages.length})</span>
        </button>
      </div>

      {/* SUBTAB 1: TEXTOS & PARÁGRAFOS JUSTIFICADOS */}
      {activeSubTab === 'textos' && (
        <div className="space-y-6 animate-in fade-in">
          {/* Section Titles */}
          <div className="bg-white p-5 border border-slate-200 rounded-xl space-y-4 shadow-2xs">
            <h4 className="font-editorial text-base font-bold text-slate-900 flex items-center gap-2">
              <FileText className="w-4 h-4 text-[#0f3d59]" />
              <span>Cabeçalho da Seção Sobre</span>
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Chapéu / Eyebrow (Destaque Superior)
                </label>
                <input
                  type="text"
                  value={eyebrow}
                  onChange={(e) => {
                    const v = e.target.value;
                    setEyebrow(v);
                    syncToStore({ eyebrow: v });
                  }}
                  placeholder="Ex: Quem Somos"
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#0f3d59] focus:bg-white"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Título Principal da Seção
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => {
                    const v = e.target.value;
                    setTitle(v);
                    syncToStore({ title: v });
                  }}
                  placeholder="Ex: Um Portal Nascido das Águas e das Vozes do Amazonas"
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#0f3d59] focus:bg-white font-semibold"
                />
              </div>
            </div>
          </div>

          {/* List of Justified Paragraphs with Full CRUD */}
          <div className="bg-white p-5 border border-slate-200 rounded-xl space-y-4 shadow-2xs">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-editorial text-base font-bold text-slate-900 flex items-center gap-2">
                  <BookOpen className="w-4 h-4 text-emerald-700" />
                  <span>Parágrafos do Manifesto & História Institucional</span>
                </h4>
                <p className="text-[11px] text-slate-500">
                  Cada parágrafo abaixo é renderizado com texto justificado e formatação tipográfica editorial impecável.
                </p>
              </div>

              <button
                type="button"
                onClick={handleAddParagraph}
                className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-lg transition-colors cursor-pointer flex items-center gap-1.5 shadow-2xs"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Inserir Novo Parágrafo</span>
              </button>
            </div>

            <div className="space-y-4 pt-2">
              {paragraphs.map((para, index) => (
                <div
                  key={para.id}
                  className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-2 relative transition-all"
                >
                  <div className="flex items-center justify-between pb-2 border-b border-slate-200">
                    <span className="text-xs font-bold text-[#0f3d59] flex items-center gap-1.5">
                      <span className="w-5 h-5 rounded-full bg-[#0f3d59] text-white flex items-center justify-center text-[10px]">
                        {index + 1}
                      </span>
                      <span>Parágrafo #{index + 1}</span>
                      <span className="text-[10px] text-slate-400 font-normal">
                        ({para.text.length} caracteres)
                      </span>
                    </span>

                    <div className="flex items-center gap-1">
                      <button
                        type="button"
                        onClick={() => handleMoveParagraph(index, 'up')}
                        disabled={index === 0}
                        className="p-1 text-slate-400 hover:text-slate-800 disabled:opacity-30 cursor-pointer"
                        title="Subir posição"
                      >
                        <ArrowUp className="w-4 h-4" />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleMoveParagraph(index, 'down')}
                        disabled={index === paragraphs.length - 1}
                        className="p-1 text-slate-400 hover:text-slate-800 disabled:opacity-30 cursor-pointer"
                        title="Descer posição"
                      >
                        <ArrowDown className="w-4 h-4" />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDeleteParagraph(para.id)}
                        className="p-1 text-red-500 hover:text-red-700 hover:bg-red-50 rounded cursor-pointer ml-1"
                        title="Excluir este parágrafo"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  <textarea
                    rows={4}
                    value={para.text}
                    onChange={(e) => handleUpdateParagraph(para.id, e.target.value)}
                    className="w-full px-3 py-2 text-xs bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#0f3d59] font-sans leading-relaxed text-justify"
                    style={{ textAlign: 'justify' }}
                    placeholder="Digite o texto do parágrafo aqui..."
                  />

                  {/* Justified Live Preview */}
                  <div className="p-3 bg-white/70 border border-slate-100 rounded-lg text-xs text-slate-700">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                      Prévia Justificada ao Vivo:
                    </span>
                    <p
                      className="font-sans leading-relaxed text-slate-800"
                      style={{ textAlign: 'justify', textJustify: 'inter-word' }}
                    >
                      {para.text || <span className="text-slate-400 italic">Parágrafo vazio.</span>}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* SUBTAB 2: FOTO & IDENTIDADE DO IDEALIZADOR */}
      {activeSubTab === 'idealizador' && (
        <div className="space-y-6 animate-in fade-in">
          <div className="bg-white p-5 border border-slate-200 rounded-xl space-y-5 shadow-2xs">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-editorial text-base font-bold text-slate-900 flex items-center gap-2">
                  <UserCheck className="w-4 h-4 text-[#0f3d59]" />
                  <span>Foto e Dados do Idealizador Kássio Cardoso</span>
                </h4>
                <p className="text-[11px] text-slate-500">
                  Gerencie o retrato de apresentação, crachá institucional e assinaturas.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleRestoreOfficialPhoto}
                  className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-semibold rounded-lg transition-colors cursor-pointer flex items-center gap-1.5"
                  title="Restaurar a foto 100% idêntica ao original remasterizado"
                >
                  <RotateCcw className="w-3.5 h-3.5 text-slate-600" />
                  <span>Foto Oficial Original</span>
                </button>

                {founderPhotoUrl && (
                  <button
                    type="button"
                    onClick={handleClearFounderPhoto}
                    className="px-3 py-1.5 bg-red-50 hover:bg-red-100 text-red-700 text-xs font-semibold rounded-lg transition-colors cursor-pointer flex items-center gap-1.5"
                  >
                    <Trash2 className="w-3.5 h-3.5 text-red-600" />
                    <span>Excluir Foto</span>
                  </button>
                )}
              </div>
            </div>

            {/* Photo Preview and Upload */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start pt-2">
              {/* Photo Preview Card */}
              <div className="md:col-span-4 flex flex-col items-center">
                <span className="text-xs font-semibold text-slate-600 mb-2 block">
                  Prévia do Card na One Page
                </span>
                <div className="relative w-56 aspect-square rounded-2xl overflow-hidden border-2 border-slate-200 shadow-md bg-slate-100 group">
                  {founderPhotoUrl ? (
                    <img
                      src={founderPhotoUrl}
                      alt={founderName}
                      className="w-full h-full object-cover object-top"
                    />
                  ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center text-slate-400 bg-slate-100 p-4 text-center">
                      <Image className="w-10 h-10 mb-2" />
                      <span className="text-xs">Nenhuma foto selecionada</span>
                    </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent pointer-events-none" />
                  <div className="absolute bottom-3 left-3 right-3 text-white pointer-events-none">
                    <span className="text-[10px] font-sans uppercase tracking-widest text-emerald-400 font-semibold block">
                      {founderBadge}
                    </span>
                    <h3 className="font-editorial text-base font-bold">{founderName}</h3>
                    <p className="text-[11px] text-slate-300 font-sans">{founderRole}</p>
                  </div>
                </div>
              </div>

              {/* Photo Controls */}
              <div className="md:col-span-8 space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Upload de Nova Foto do Idealizador (Computador / Celular)
                  </label>
                  <div className="flex flex-col sm:flex-row items-center gap-3">
                    <label className="w-full sm:w-auto px-4 py-2.5 bg-[#0f3d59] hover:bg-[#0a2540] text-white text-xs font-bold rounded-lg flex items-center justify-center gap-2 cursor-pointer shrink-0 shadow-xs">
                      <Upload className="w-4 h-4 text-emerald-400" />
                      <span>Carregar Arquivo do Computador</span>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleFounderPhotoUpload}
                        className="hidden"
                      />
                    </label>
                    <span className="text-xs text-emerald-700 font-medium">
                      ✓ Otimizador ativo (redimensionamento inteligente para carregamento instantâneo)
                    </span>
                  </div>
                </div>

                {/* Presets Rápidos de Fotos Oficiais */}
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5 flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                    <span>Fotos Prontas & Acervo Oficial do Portal (1 Clique para Selecionar)</span>
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    <button
                      type="button"
                      onClick={() => {
                        setFounderPhotoUrl(defaultKassioPhoto);
                        syncToStore({ founderPhotoUrl: defaultKassioPhoto });
                      }}
                      className={`p-2 rounded-lg border text-left flex flex-col items-center gap-1.5 transition-all cursor-pointer ${
                        founderPhotoUrl === defaultKassioPhoto
                          ? 'border-[#0f3d59] bg-blue-50 ring-2 ring-[#0f3d59]'
                          : 'border-slate-200 bg-white hover:border-slate-300'
                      }`}
                    >
                      <img
                        src={defaultKassioPhoto}
                        alt="Retrato Oficial"
                        className="w-12 h-12 rounded-lg object-cover object-top border border-slate-200"
                      />
                      <span className="text-[10px] font-bold text-slate-800 text-center leading-tight">
                        Retrato Remaster
                      </span>
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        setFounderPhotoUrl(avatarKassioPhoto);
                        syncToStore({ founderPhotoUrl: avatarKassioPhoto });
                      }}
                      className={`p-2 rounded-lg border text-left flex flex-col items-center gap-1.5 transition-all cursor-pointer ${
                        founderPhotoUrl === avatarKassioPhoto
                          ? 'border-[#0f3d59] bg-blue-50 ring-2 ring-[#0f3d59]'
                          : 'border-slate-200 bg-white hover:border-slate-300'
                      }`}
                    >
                      <img
                        src={avatarKassioPhoto}
                        alt="Repórter em Campo"
                        className="w-12 h-12 rounded-lg object-cover object-top border border-slate-200"
                      />
                      <span className="text-[10px] font-bold text-slate-800 text-center leading-tight">
                        Repórter em Campo
                      </span>
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        setFounderPhotoUrl(claquetePhoto);
                        syncToStore({ founderPhotoUrl: claquetePhoto });
                      }}
                      className={`p-2 rounded-lg border text-left flex flex-col items-center gap-1.5 transition-all cursor-pointer ${
                        founderPhotoUrl === claquetePhoto
                          ? 'border-[#0f3d59] bg-blue-50 ring-2 ring-[#0f3d59]'
                          : 'border-slate-200 bg-white hover:border-slate-300'
                      }`}
                    >
                      <img
                        src={claquetePhoto}
                        alt="Claquete 4K"
                        className="w-12 h-12 rounded-lg object-cover object-top border border-slate-200"
                      />
                      <span className="text-[10px] font-bold text-slate-800 text-center leading-tight">
                        Claquete 4K
                      </span>
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        setFounderPhotoUrl(heroAmazonasPhoto);
                        syncToStore({ founderPhotoUrl: heroAmazonasPhoto });
                      }}
                      className={`p-2 rounded-lg border text-left flex flex-col items-center gap-1.5 transition-all cursor-pointer ${
                        founderPhotoUrl === heroAmazonasPhoto
                          ? 'border-[#0f3d59] bg-blue-50 ring-2 ring-[#0f3d59]'
                          : 'border-slate-200 bg-white hover:border-slate-300'
                      }`}
                    >
                      <img
                        src={heroAmazonasPhoto}
                        alt="Rio Amazonas"
                        className="w-12 h-12 rounded-lg object-cover object-top border border-slate-200"
                      />
                      <span className="text-[10px] font-bold text-slate-800 text-center leading-tight">
                        Ação Ribeirinha
                      </span>
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Caminho ou URL Direta da Foto
                  </label>
                  <input
                    type="text"
                    value={founderPhotoUrl}
                    onChange={(e) => {
                      const v = e.target.value;
                      setFounderPhotoUrl(v);
                      syncToStore({ founderPhotoUrl: v });
                    }}
                    placeholder="/src/assets/images/kassio_cardoso_remaster_1791829104828.jpg"
                    className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#0f3d59] font-mono"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Crachá / Selo Superior
                    </label>
                    <input
                      type="text"
                      value={founderBadge}
                      onChange={(e) => {
                        const v = e.target.value;
                        setFounderBadge(v);
                        syncToStore({ founderBadge: v });
                      }}
                      placeholder="Idealizador do Projeto"
                      className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#0f3d59]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Nome do Idealizador
                    </label>
                    <input
                      type="text"
                      value={founderName}
                      onChange={(e) => {
                        const v = e.target.value;
                        setFounderName(v);
                        syncToStore({ founderName: v });
                      }}
                      placeholder="Kássio Cardoso"
                      className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#0f3d59] font-bold"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Cargo / Especialidade
                    </label>
                    <input
                      type="text"
                      value={founderRole}
                      onChange={(e) => {
                        const v = e.target.value;
                        setFounderRole(v);
                        syncToStore({ founderRole: v });
                      }}
                      placeholder="Jornalista Comunitário · Amazonas"
                      className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#0f3d59]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 border-t border-slate-100">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Rótulo da Frase Institucional
                    </label>
                    <input
                      type="text"
                      value={institutionalQuoteLabel}
                      onChange={(e) => {
                        const v = e.target.value;
                        setInstitutionalQuoteLabel(v);
                        syncToStore({ institutionalQuoteLabel: v });
                      }}
                      placeholder="Assinatura Institucional"
                      className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#0f3d59]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Frase de Efeito / Citação
                    </label>
                    <input
                      type="text"
                      value={institutionalQuoteText}
                      onChange={(e) => {
                        const v = e.target.value;
                        setInstitutionalQuoteText(v);
                        syncToStore({ institutionalQuoteText: v });
                      }}
                      placeholder="“A notícia nasce na comunidade.”"
                      className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#0f3d59] font-serif font-bold text-[#0f3d59]"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* SUBTAB 3: PILARES EDITORIAIS */}
      {activeSubTab === 'pilares' && (
        <div className="space-y-6 animate-in fade-in">
          <div className="bg-white p-5 border border-slate-200 rounded-xl space-y-4 shadow-2xs">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-editorial text-base font-bold text-slate-900 flex items-center gap-2">
                  <Award className="w-4 h-4 text-amber-600" />
                  <span>Pilares Editoriais e Princípios de Atuação</span>
                </h4>
                <p className="text-[11px] text-slate-500">
                  Adicione, altere ou exclua os cartões de valores da comunidade exibidos na seção Sobre.
                </p>
              </div>

              <button
                type="button"
                onClick={handleAddPillar}
                className="px-3.5 py-1.5 bg-[#0f3d59] hover:bg-[#0a2540] text-white text-xs font-bold rounded-lg transition-colors cursor-pointer flex items-center gap-1.5 shadow-2xs"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Inserir Novo Pilar</span>
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 pt-2">
              {pillars.map((pillar, index) => {
                const currentIconObj = availableIcons.find((ic) => ic.id === pillar.iconName) || availableIcons[0];
                const IconComponent = currentIconObj.icon;

                return (
                  <div
                    key={pillar.id}
                    className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-3 relative group"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="p-1.5 bg-[#0f3d59]/10 text-[#0f3d59] rounded-lg">
                          <IconComponent className="w-4 h-4" />
                        </span>
                        <span className="text-xs font-bold text-slate-800">
                          Pilar #{index + 1}
                        </span>
                      </div>

                      <div className="flex items-center gap-1">
                        <button
                          type="button"
                          onClick={() => handleMovePillar(index, 'up')}
                          disabled={index === 0}
                          className="p-1 text-slate-400 hover:text-slate-800 disabled:opacity-30 cursor-pointer"
                          title="Mover para esquerda/cima"
                        >
                          <ArrowUp className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleMovePillar(index, 'down')}
                          disabled={index === pillars.length - 1}
                          className="p-1 text-slate-400 hover:text-slate-800 disabled:opacity-30 cursor-pointer"
                          title="Mover para direita/baixo"
                        >
                          <ArrowDown className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDeletePillar(pillar.id)}
                          className="p-1 text-red-500 hover:text-red-700 hover:bg-red-50 rounded cursor-pointer ml-1"
                          title="Excluir este pilar"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>

                    <div>
                      <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                        Ícone Representativo
                      </label>
                      <select
                        value={pillar.iconName}
                        onChange={(e) =>
                          handleUpdatePillar(pillar.id, {
                            iconName: e.target.value as any,
                          })
                        }
                        className="w-full px-2.5 py-1.5 text-xs bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#0f3d59]"
                      >
                        {availableIcons.map((ic) => (
                          <option key={ic.id} value={ic.id}>
                            {ic.label}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                        Título do Pilar
                      </label>
                      <input
                        type="text"
                        value={pillar.title}
                        onChange={(e) => handleUpdatePillar(pillar.id, { title: e.target.value })}
                        className="w-full px-2.5 py-1.5 text-xs bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#0f3d59] font-semibold text-slate-900"
                        placeholder="Ex: Territorialidade"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                        Descrição do Pilar
                      </label>
                      <textarea
                        rows={3}
                        value={pillar.description}
                        onChange={(e) =>
                          handleUpdatePillar(pillar.id, { description: e.target.value })
                        }
                        className="w-full px-2.5 py-1.5 text-xs bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#0f3d59] text-slate-600 leading-relaxed"
                        placeholder="Explique o princípio editorial..."
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* SUBTAB 4: GALERIA DE IMAGENS ADICIONAIS */}
      {activeSubTab === 'imagens' && (
        <div className="space-y-6 animate-in fade-in">
          <div className="bg-white p-5 border border-slate-200 rounded-xl space-y-4 shadow-2xs">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-editorial text-base font-bold text-slate-900 flex items-center gap-2">
                  <Camera className="w-4 h-4 text-emerald-800" />
                  <span>Galeria e Imagens Complementares da Seção Sobre</span>
                </h4>
                <p className="text-[11px] text-slate-500">
                  Adicione fotos de bastidores, equipe comunitária, claquete oficial 4K ou eventos que ilustrem a atuação do portal.
                </p>
              </div>

              <button
                type="button"
                onClick={handleAddImage}
                className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-lg transition-colors cursor-pointer flex items-center gap-1.5 shadow-2xs"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Inserir Nova Imagem</span>
              </button>
            </div>

            {additionalImages.length === 0 ? (
              <div className="p-8 text-center bg-slate-50 rounded-xl border border-dashed border-slate-200">
                <Camera className="w-10 h-10 text-slate-400 mx-auto mb-2" />
                <p className="text-xs font-semibold text-slate-700">
                  Nenhuma imagem complementar cadastrada no momento.
                </p>
                <p className="text-[11px] text-slate-500 mt-0.5">
                  Clique no botão acima para adicionar fotos de campo, claquete 4K ou registros comunitários.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 pt-2">
                {additionalImages.map((img, index) => (
                  <div
                    key={img.id}
                    className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-3"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-slate-800">
                        Registro #{index + 1}
                      </span>
                      <button
                        type="button"
                        onClick={() => handleDeleteImage(img.id)}
                        className="p-1 text-red-500 hover:text-red-700 hover:bg-red-50 rounded cursor-pointer"
                        title="Excluir imagem"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>

                    {/* Image Preview */}
                    <div className="aspect-video w-full rounded-lg overflow-hidden bg-slate-200 border border-slate-200">
                      {img.url ? (
                        <img
                          src={img.url}
                          alt={img.caption || 'Registro visual'}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-slate-400 text-xs">
                          Sem imagem
                        </div>
                      )}
                    </div>

                    <div>
                      <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                        Upload de Foto ou URL
                      </label>
                      <div className="flex items-center gap-2">
                        <input
                          type="text"
                          value={img.url}
                          onChange={(e) => handleUpdateImage(img.id, { url: e.target.value })}
                          className="flex-1 px-2.5 py-1.5 text-xs bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#0f3d59] font-mono"
                          placeholder="URL da imagem"
                        />
                        <label className="p-2 bg-slate-200 hover:bg-slate-300 text-slate-700 rounded-lg cursor-pointer shrink-0" title="Upload do computador">
                          <Upload className="w-3.5 h-3.5" />
                          <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => handleImageUploadItem(img.id, e)}
                            className="hidden"
                          />
                        </label>
                      </div>
                    </div>

                    <div>
                      <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                        Legenda Explicativa
                      </label>
                      <input
                        type="text"
                        value={img.caption}
                        onChange={(e) =>
                          handleUpdateImage(img.id, { caption: e.target.value })
                        }
                        className="w-full px-2.5 py-1.5 text-xs bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#0f3d59]"
                        placeholder="Ex: Claquete 4K oficial em gravação comunitária"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                        Crédito da Fotografia
                      </label>
                      <input
                        type="text"
                        value={img.credit || ''}
                        onChange={(e) =>
                          handleUpdateImage(img.id, { credit: e.target.value })
                        }
                        className="w-full px-2.5 py-1.5 text-xs bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#0f3d59]"
                        placeholder="Ex: Acervo Kássio Cardoso"
                      />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Floating or Bottom Save Bar */}
      <div className="p-4 bg-slate-100 border border-slate-200 rounded-xl flex items-center justify-between">
        <span className="text-xs text-slate-600 font-sans">
          Lembre-se de salvar para aplicar as alterações na página pública (One Page).
        </span>
        <button
          type="button"
          onClick={handleSaveAll}
          className="px-5 py-2.5 bg-[#0f3d59] hover:bg-[#0a2540] text-white text-xs font-bold rounded-lg transition-colors cursor-pointer shadow-xs flex items-center gap-2"
        >
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>Salvar Todas as Informações</span>
        </button>
      </div>
    </div>
  );
};
