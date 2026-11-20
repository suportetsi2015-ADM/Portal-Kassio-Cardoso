import React, { useState, useRef } from 'react';
import { useStore } from '../context/StoreContext';
import {
  AlertTriangle,
  Send,
  CheckCircle2,
  ShieldCheck,
  MapPin,
  Upload,
  Image as ImageIcon,
  Video,
  X,
  FileCheck,
  EyeOff,
  User,
  Phone,
  MessageSquare,
} from 'lucide-react';

export const CommunityParticipate: React.FC = () => {
  const { categories, locations, submitCommunityStory, config } = useStore();

  const [isAnonymous, setIsAnonymous] = useState(false);
  const [submitterName, setSubmitterName] = useState('');
  const [submitterContact, setSubmitterContact] = useState('');
  const [location, setLocation] = useState(locations[0] || 'Manaus (Capital)');
  const [neighborhood, setNeighborhood] = useState('');
  const [categorySuggestion, setCategorySuggestion] = useState(categories[0]?.name || 'Comunidade');
  const [urgency, setUrgency] = useState<'normal' | 'alta' | 'urgente'>('normal');
  const [storyTitle, setStoryTitle] = useState('');
  const [storyText, setStoryText] = useState('');
  const [evidenceNote, setEvidenceNote] = useState('');

  // Media attachment states (Image or Video)
  const [mediaFile, setMediaFile] = useState<File | null>(null);
  const [mediaPreview, setMediaPreview] = useState<string | null>(null);
  const [mediaType, setMediaType] = useState<'image' | 'video' | 'none'>('none');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedProtocol, setSubmittedProtocol] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setMediaFile(file);
    if (file.type.startsWith('image/')) {
      setMediaType('image');
      const reader = new FileReader();
      reader.onload = (ev) => {
        setMediaPreview(ev.target?.result as string);
      };
      reader.readAsDataURL(file);
    } else if (file.type.startsWith('video/')) {
      setMediaType('video');
      const reader = new FileReader();
      reader.onload = (ev) => {
        setMediaPreview(ev.target?.result as string);
      };
      reader.readAsDataURL(file);
    } else {
      setMediaType('none');
      setMediaPreview(null);
    }
  };

  const handleRemoveMedia = () => {
    setMediaFile(null);
    setMediaPreview(null);
    setMediaType('none');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!storyTitle.trim() || !storyText.trim()) return;

    setIsSubmitting(true);
    const protocol = `DEN-2026-${Math.floor(1000 + Math.random() * 9000)}`;

    setTimeout(() => {
      submitCommunityStory({
        submitterName: isAnonymous ? 'Cidadão Anônimo' : submitterName || 'Morador Local',
        isAnonymous,
        submitterContact: submitterContact.trim() || 'Não informado',
        location,
        neighborhood: neighborhood.trim() || 'Não especificado',
        categorySuggestion,
        urgency,
        storyTitle,
        storyText,
        mediaType,
        mediaUrl: mediaPreview || undefined,
        mediaFileName: mediaFile?.name || undefined,
        evidenceNote,
        protocolNumber: protocol,
      });

      setIsSubmitting(false);
      setSubmittedProtocol(protocol);

      // Reset form
      setSubmitterName('');
      setSubmitterContact('');
      setNeighborhood('');
      setStoryTitle('');
      setStoryText('');
      setEvidenceNote('');
      handleRemoveMedia();
    }, 450);
  };

  return (
    <section id="comunidade-participa" className="py-16 sm:py-24 bg-white border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Title & Subheading */}
        <div className="max-w-3xl mb-12">
          <div className="flex items-center gap-2 text-xs font-semibold text-amber-800 uppercase tracking-widest font-sans mb-1">
            <AlertTriangle className="w-4 h-4 text-amber-600" />
            <span>{config.denunciaConfig?.eyebrow || config.structureTexts?.denunciaEyebrow || 'Voz e Cidadania'}</span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-bold font-editorial text-slate-900 leading-tight">
            {config.denunciaConfig?.title || config.structureTexts?.denunciaTitle || 'Canal de Denúncias da Comunidade & Sugestão de Pauta'}
          </h2>
          <p className="mt-3 text-sm sm:text-base text-slate-600 font-sans leading-relaxed">
            {config.denunciaConfig?.subtitle || config.structureTexts?.denunciaSubtitle ||
              'Presenciou um problema no seu bairro? Buraco na via, falta de merenda, transporte fluvial precário ou falta de água? Envie seu relato com foto ou vídeo. Nossa redação apura com rigor jornalístico.'}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          
          {/* Left Column: Guidelines, Guarantees and Direct Contact */}
          <div className="lg:col-span-5 space-y-5">
            <div className="p-6 bg-slate-900 text-white rounded-2xl shadow-md border border-slate-800 space-y-4">
              <div className="flex items-center gap-2 text-emerald-400 font-sans text-xs uppercase tracking-wider font-bold">
                <ShieldCheck className="w-4 h-4" />
                <span>Garantia Legal de Sigilo</span>
              </div>
              <h3 className="font-editorial text-xl font-bold">
                {config.denunciaConfig?.legalShieldTitle || 'Sua Identidade Está 100% Protegida'}
              </h3>
              <p className="text-xs sm:text-sm text-slate-300 font-sans leading-relaxed">
                {config.denunciaConfig?.legalShieldText ||
                  'Você pode optar por denunciar de forma totalmente anônima. A Constituição Brasileira (Art. 5º, XIV) e o Código de Ética dos Jornalistas asseguram o sigilo absoluto da fonte.'}
              </p>
              <div className="pt-3 border-t border-slate-800 text-xs text-slate-400 font-sans">
                {config.denunciaConfig?.legalShieldNote ||
                  'A redação do jornalista Kássio Cardoso verifica cada fato antes de qualquer publicação, solicitando esclarecimentos oficiais aos órgãos competentes.'}
              </div>
            </div>

            <div className="p-5 bg-amber-50/70 border border-amber-200 rounded-2xl space-y-3">
              <div className="flex items-center gap-2 text-amber-900 font-bold text-xs uppercase tracking-wider">
                <FileCheck className="w-4 h-4 text-amber-700" />
                <span>{config.denunciaConfig?.whatToReportTitle || 'O que você pode denunciar?'}</span>
              </div>
              <ul className="text-xs text-amber-950 font-sans space-y-1.5 list-disc list-inside leading-relaxed">
                {(Array.isArray(config.denunciaConfig?.whatToReportItems)
                  ? config.denunciaConfig.whatToReportItems
                  : [
                      { id: '1', text: 'Falta de saneamento, água tratada ou luz em comunidades;' },
                      { id: '2', text: 'Estradas e ramais intrafegáveis ou pontes danificadas;' },
                      { id: '3', text: 'Postos de saúde sem médicos ou remédios essenciais;' },
                      { id: '4', text: 'Denúncias de danos ambientais, queimadas e lixões ilegais;' },
                      { id: '5', text: 'Cobranças abusivas e transporte público/fluvial irregular.' },
                    ]
                ).map((item) => (
                  <li key={item.id}>{item.text}</li>
                ))}
              </ul>
            </div>
          </div>

          {/* Right Column: Complete Interactive Denúncia Form */}
          <div className="lg:col-span-7 bg-slate-50 border border-slate-200 rounded-2xl p-6 sm:p-10 shadow-xs">
            {submittedProtocol ? (
              <div className="py-10 text-center space-y-4">
                <div className="w-16 h-16 bg-emerald-100 text-emerald-800 rounded-full flex items-center justify-center mx-auto shadow-sm">
                  <CheckCircle2 className="w-10 h-10" />
                </div>
                <h3 className="font-editorial text-2xl font-bold text-slate-900">
                  Denúncia Registrada com Sucesso!
                </h3>
                <p className="text-sm text-slate-600 font-sans max-w-md mx-auto leading-relaxed">
                  Seu relato foi encaminhado para a fila de apuração da equipe do <strong>COMUNIDADE EM AÇÃO</strong>.
                </p>

                <div className="inline-block p-4 bg-white border border-slate-200 rounded-xl shadow-xs">
                  <span className="text-[10px] font-sans font-bold text-slate-400 uppercase tracking-widest block">
                    Número do Protocolo
                  </span>
                  <span className="text-xl font-mono font-bold text-[#0f3d59]">
                    {submittedProtocol}
                  </span>
                  <p className="text-[11px] text-slate-500 font-sans mt-1">
                    Anote este protocolo para consultas ou acréscimo de informações via WhatsApp.
                  </p>
                </div>

                <div className="pt-4">
                  <button
                    onClick={() => setSubmittedProtocol(null)}
                    className="px-6 py-2.5 text-xs font-semibold text-white bg-[#0f3d59] hover:bg-[#0a2540] rounded-lg transition-colors cursor-pointer"
                  >
                    Fazer Nova Denúncia
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5">
                
                {/* Header of Form & Anonymous Toggle */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-200">
                  <div>
                    <h3 className="font-editorial text-lg font-bold text-slate-900">
                      Formulário de Denúncia Comunitária
                    </h3>
                    <p className="text-xs text-slate-500 font-sans">
                      Campos marcados com * são essenciais para apuração.
                    </p>
                  </div>

                  <label className="flex items-center gap-2 px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-xs font-semibold text-slate-700 cursor-pointer select-none hover:bg-slate-100 transition-colors">
                    <input
                      type="checkbox"
                      checked={isAnonymous}
                      onChange={(e) => setIsAnonymous(e.target.checked)}
                      className="rounded text-emerald-800 focus:ring-emerald-700 w-3.5 h-3.5"
                    />
                    <EyeOff className="w-3.5 h-3.5 text-slate-500" />
                    <span>Denúncia Anônima</span>
                  </label>
                </div>

                {/* Submitter Info (Name + Contact) */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                      {isAnonymous ? 'Identificação (Opcional)' : 'Seu Nome ou Liderança'}
                    </label>
                    <div className="relative">
                      <User className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                      <input
                        type="text"
                        disabled={isAnonymous}
                        placeholder={isAnonymous ? 'Modo Anônimo Ativado' : 'Ex: Maria Pereira da Silva'}
                        value={isAnonymous ? '' : submitterName}
                        onChange={(e) => setSubmitterName(e.target.value)}
                        className="w-full pl-9 pr-3.5 py-2.5 text-sm bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#0f3d59] disabled:bg-slate-100 disabled:text-slate-400"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                      Contato / WhatsApp (Opcional)
                    </label>
                    <div className="relative">
                      <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                      <input
                        type="text"
                        placeholder="Ex: (92) 99999-0000"
                        value={submitterContact}
                        onChange={(e) => setSubmitterContact(e.target.value)}
                        className="w-full pl-9 pr-3.5 py-2.5 text-sm bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#0f3d59]"
                      />
                    </div>
                  </div>
                </div>

                {/* Territorial Context (Location + Neighborhood) */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                      Município / Região *
                    </label>
                    <select
                      value={location}
                      onChange={(e) => setLocation(e.target.value)}
                      className="w-full px-3.5 py-2.5 text-sm bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#0f3d59]"
                    >
                      {locations.map((loc) => (
                        <option key={loc} value={loc}>
                          {loc}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                      Bairro ou Comunidade *
                    </label>
                    <div className="relative">
                      <MapPin className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                      <input
                        type="text"
                        required
                        placeholder="Ex: Compensa, Jorge Teixeira, Ramal do Lago..."
                        value={neighborhood}
                        onChange={(e) => setNeighborhood(e.target.value)}
                        className="w-full pl-9 pr-3.5 py-2.5 text-sm bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#0f3d59]"
                      />
                    </div>
                  </div>
                </div>

                {/* Urgency & Category */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                      Editoria / Assunto
                    </label>
                    <select
                      value={categorySuggestion}
                      onChange={(e) => setCategorySuggestion(e.target.value)}
                      className="w-full px-3.5 py-2.5 text-sm bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#0f3d59]"
                    >
                      {categories.map((c) => (
                        <option key={c.id} value={c.name}>
                          {c.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                      Nível de Urgência
                    </label>
                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={() => setUrgency('normal')}
                        className={`flex-1 py-2 text-xs font-semibold rounded-lg border transition-all cursor-pointer ${
                          urgency === 'normal'
                            ? 'bg-emerald-600 text-white border-emerald-600 shadow-sm ring-2 ring-emerald-500/30 font-bold'
                            : 'bg-emerald-50 text-emerald-800 border-emerald-300 hover:bg-emerald-100 font-medium'
                        }`}
                      >
                        NORMAL
                      </button>
                      <button
                        type="button"
                        onClick={() => setUrgency('alta')}
                        className={`flex-1 py-2 text-xs font-semibold rounded-lg border transition-all cursor-pointer ${
                          urgency === 'alta'
                            ? 'bg-amber-400 text-slate-950 border-amber-400 shadow-sm ring-2 ring-amber-400/50 font-bold'
                            : 'bg-amber-50 text-amber-900 border-amber-300 hover:bg-amber-100 font-medium'
                        }`}
                      >
                        ALTA
                      </button>
                      <button
                        type="button"
                        onClick={() => setUrgency('urgente')}
                        className={`flex-1 py-2 text-xs font-semibold rounded-lg border transition-all cursor-pointer ${
                          urgency === 'urgente'
                            ? 'bg-red-600 text-white border-red-600 shadow-sm ring-2 ring-red-500/50 animate-pulse font-bold'
                            : 'bg-red-50 text-red-800 border-red-300 hover:bg-red-100 font-medium'
                        }`}
                      >
                        URGENTE
                      </button>
                    </div>
                  </div>
                </div>

                {/* Title */}
                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                    Assunto da Denúncia *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Ex: Falta de médico e vacinas na UBS do bairro há mais de 15 dias"
                    value={storyTitle}
                    onChange={(e) => setStoryTitle(e.target.value)}
                    className="w-full px-3.5 py-2.5 text-sm bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#0f3d59]"
                  />
                </div>

                {/* Narrative Description (Breve Relato) */}
                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                    Breve Relato do Ocorrido *
                  </label>
                  <textarea
                    required
                    rows={4}
                    placeholder="Conte o que está acontecendo, desde quando, quais ruas ou moradores foram afetados e se algum órgão já foi notificado..."
                    value={storyText}
                    onChange={(e) => setStoryText(e.target.value)}
                    className="w-full px-3.5 py-2.5 text-sm bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#0f3d59]"
                  />
                </div>

                {/* Anexar Imagem ou Vídeo (PRD / Solicitação do Usuário) */}
                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                    Anexar Foto ou Vídeo da Denúncia
                  </label>

                  <div className="mt-1">
                    {mediaPreview ? (
                      <div className="relative p-3 bg-white border border-slate-200 rounded-xl flex items-center justify-between gap-4">
                        <div className="flex items-center gap-3 overflow-hidden">
                          {mediaType === 'image' ? (
                            <div className="w-16 h-16 rounded-lg overflow-hidden bg-slate-100 shrink-0 border border-slate-200">
                              <img
                                src={mediaPreview}
                                alt="Pré-visualização do anexo"
                                className="w-full h-full object-cover"
                              />
                            </div>
                          ) : (
                            <div className="w-16 h-16 rounded-lg bg-slate-900 text-white flex items-center justify-center shrink-0">
                              <Video className="w-8 h-8 text-amber-400" />
                            </div>
                          )}
                          <div className="truncate">
                            <span className="text-xs font-bold text-slate-900 block truncate">
                              {mediaFile?.name || 'Arquivo Anexado'}
                            </span>
                            <span className="text-[11px] text-emerald-700 font-semibold uppercase">
                              {mediaType === 'image' ? 'Foto Anexada' : 'Vídeo Anexado'}
                            </span>
                          </div>
                        </div>

                        <button
                          type="button"
                          onClick={handleRemoveMedia}
                          className="p-1.5 text-slate-400 hover:text-red-600 rounded-lg hover:bg-slate-100 cursor-pointer"
                          title="Remover anexo"
                        >
                          <X className="w-5 h-5" />
                        </button>
                      </div>
                    ) : (
                      <div
                        onClick={() => fileInputRef.current?.click()}
                        className="border-2 border-dashed border-slate-300 hover:border-[#0f3d59] rounded-xl p-5 text-center cursor-pointer transition-colors bg-white hover:bg-slate-50/50"
                      >
                        <div className="flex items-center justify-center gap-3 text-slate-400 mb-2">
                          <ImageIcon className="w-6 h-6 text-emerald-700" />
                          <Video className="w-6 h-6 text-[#0f3d59]" />
                          <Upload className="w-5 h-5 text-slate-500" />
                        </div>
                        <span className="text-xs font-bold text-slate-800 block">
                          Clique para anexar Foto ou Vídeo do celular/computador
                        </span>
                        <span className="text-[11px] text-slate-500 font-sans block mt-0.5">
                          Aceita imagens (JPG, PNG) e vídeos curtos (MP4, MOV).
                        </span>
                      </div>
                    )}

                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*,video/*"
                      onChange={handleFileChange}
                      className="hidden"
                    />
                  </div>
                </div>

                {/* Additional Links / Notes */}
                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                    Link Adicional de Vídeo / Drive (Opcional)
                  </label>
                  <input
                    type="text"
                    placeholder="Ex: Link do Google Drive, Instagram ou canal no YouTube com o vídeo completo"
                    value={evidenceNote}
                    onChange={(e) => setEvidenceNote(e.target.value)}
                    className="w-full px-3.5 py-2 text-xs bg-white border border-slate-200 rounded-lg focus:outline-none"
                  />
                </div>

                {/* Submit Action */}
                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-3 text-sm font-bold text-white bg-[#0f3d59] hover:bg-[#0a2540] rounded-xl transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                  >
                    <Send className="w-4 h-4" />
                    <span>{isSubmitting ? 'Registrando Denúncia...' : 'Registrar Denúncia para Apuração'}</span>
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};
