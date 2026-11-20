import React, { useState } from 'react';
import { useStore } from '../../context/StoreContext';
import {
  Share2,
  CheckCircle2,
  Globe,
  ExternalLink,
  MessageCircle,
  Video,
  FileText,
  Send,
  Copy,
  Check,
  Sparkles,
  Layers,
  Trash2,
  Plus,
} from 'lucide-react';
import { INITIAL_PORTAL_CONFIG } from '../../data/initialData';

export const AdminFooterSocial: React.FC = () => {
  const {
    config,
    articles,
    updateFooterConfig,
    updateSocialLinks,
    updateSocialShareTemplates,
    updateConfig,
  } = useStore();

  const [aboutText, setAboutText] = useState(
    config.footer?.aboutText ||
      'Jornalismo comunitário independente dando voz às comunidades ribeirinhas, urbanas e do interior do Amazonas.'
  );
  const [copyrightText, setCopyrightText] = useState(
    config.footer?.copyrightText ||
      'COMUNIDADE EM AÇÃO. Todos os direitos reservados. Projeto idealizado por Kássio Cardoso.'
  );
  const [showSocials, setShowSocials] = useState(config.footer?.showSocials ?? true);

  // Social Links
  const [whatsapp, setWhatsapp] = useState(config.socialLinks?.whatsapp || 'https://wa.me/5592981440022');
  const [instagram, setInstagram] = useState(config.socialLinks?.instagram || 'https://instagram.com/comunidadeemacao_am');
  const [facebook, setFacebook] = useState(config.socialLinks?.facebook || 'https://facebook.com/comunidadeemacao.am');
  const [youtube, setYoutube] = useState(config.socialLinks?.youtube || 'https://youtube.com/@comunidadeemacao');
  const [twitter, setTwitter] = useState(config.socialLinks?.twitter || 'https://x.com/comunidadeemacao');
  const [tiktok, setTiktok] = useState(config.socialLinks?.tiktok || 'https://tiktok.com/@comunidadeemacao');

  // Contact Info
  const [contactEmail, setContactEmail] = useState(config.contactEmail || 'redacao@comunidadeemacao.am');
  const [contactPhone, setContactPhone] = useState(config.contactPhone || '(92) 98144-0022');
  const [contactAddress, setContactAddress] = useState(config.contactAddress || 'Manaus, Amazonas — Brasil');

  // Ready-Made Social Sharing Templates (Facebook, Instagram, WhatsApp)
  const defaultShare = INITIAL_PORTAL_CONFIG.socialShare || {
    facebookTemplate: '📰 {titulo}\n{subtitulo}\n\n📍 Local: {local}\n🔗 Leia a reportagem completa no portal COMUNIDADE EM AÇÃO:\n{link}',
    instagramTemplate: '📢 NOTÍCIA DO AMAZONAS: {titulo}\n\n{subtitulo}\n\n📍 Local: {local}\n✍️ Apuração: {autor} · COMUNIDADE EM AÇÃO\n\n👉 Acesse o link no perfil para ler na íntegra:\n{link}\n\n#ComunidadeEmAção #Manaus #Amazonas #JornalismoComunitario #NoticiaVerificada',
    whatsappTemplate: '📰 *{titulo}*\n{subtitulo}\n\n📍 {local} · COMUNIDADE EM AÇÃO\n🔗 Acesse a notícia completa: {link}',
    defaultHashtags: '#ComunidadeEmAção #Amazonas #Manaus #JornalismoComunitario',
    enableDirectShareBar: true,
  };

  const [facebookTemplate, setFacebookTemplate] = useState(
    config.socialShare?.facebookTemplate || defaultShare.facebookTemplate
  );
  const [instagramTemplate, setInstagramTemplate] = useState(
    config.socialShare?.instagramTemplate || defaultShare.instagramTemplate
  );
  const [whatsappTemplate, setWhatsappTemplate] = useState(
    config.socialShare?.whatsappTemplate || defaultShare.whatsappTemplate
  );
  const [defaultHashtags, setDefaultHashtags] = useState(
    config.socialShare?.defaultHashtags || defaultShare.defaultHashtags
  );
  const [enableDirectShareBar, setEnableDirectShareBar] = useState(
    config.socialShare?.enableDirectShareBar ?? defaultShare.enableDirectShareBar
  );

  const [savedSuccess, setSavedSuccess] = useState(false);
  const [copiedPreview, setCopiedPreview] = useState<'facebook' | 'instagram' | null>(null);

  // Sample article for testing live sharing templates
  const sampleArticle = articles[0] || {
    id: 'art-demo-1',
    title: 'Festival Folclórico de Parintins 2026: Ensaios dos bumbás movimentam a economia local',
    subtitle: 'Galpões de Caprichoso e Garantido geram mais de 4 mil empregos diretos e indiretos no baixo Amazonas.',
    location: 'Parintins - AM',
    authorName: 'Kássio Cardoso',
  };

  const sampleUrl = typeof window !== 'undefined'
    ? `${window.location.origin}${window.location.pathname}?materia=${sampleArticle.id}`
    : `https://comunidadeemacao.am?materia=${sampleArticle.id}`;

  const formatTemplate = (template: string) => {
    return template
      .replace(/{titulo}/g, sampleArticle.title)
      .replace(/{subtitulo}/g, sampleArticle.subtitle || '')
      .replace(/{local}/g, sampleArticle.location)
      .replace(/{autor}/g, sampleArticle.authorName)
      .replace(/{link}/g, sampleUrl)
      .replace(/{hashtags}/g, defaultHashtags);
  };

  const handleTestFacebookShare = () => {
    const shareText = formatTemplate(facebookTemplate);
    const url = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(sampleUrl)}&quote=${encodeURIComponent(shareText)}`;
    window.open(url, '_blank', 'width=600,height=500');
  };

  const handleCopyInstagramPreview = () => {
    const text = formatTemplate(instagramTemplate);
    navigator.clipboard.writeText(text);
    setCopiedPreview('instagram');
    setTimeout(() => setCopiedPreview(null), 3000);
  };

  const handleCopyFacebookPreview = () => {
    const text = formatTemplate(facebookTemplate);
    navigator.clipboard.writeText(text);
    setCopiedPreview('facebook');
    setTimeout(() => setCopiedPreview(null), 3000);
  };

  // Synchronize when store config updates
  React.useEffect(() => {
    if (config.footer) {
      if (config.footer.aboutText !== undefined) setAboutText(config.footer.aboutText);
      if (config.footer.copyrightText !== undefined) setCopyrightText(config.footer.copyrightText);
      if (config.footer.showSocials !== undefined) setShowSocials(config.footer.showSocials);
    }
    if (config.socialLinks) {
      if (config.socialLinks.whatsapp) setWhatsapp(config.socialLinks.whatsapp);
      if (config.socialLinks.instagram) setInstagram(config.socialLinks.instagram);
      if (config.socialLinks.facebook) setFacebook(config.socialLinks.facebook);
      if (config.socialLinks.youtube) setYoutube(config.socialLinks.youtube);
      if (config.socialLinks.twitter) setTwitter(config.socialLinks.twitter);
      if (config.socialLinks.tiktok) setTiktok(config.socialLinks.tiktok);
    }
    if (config.socialShare) {
      if (config.socialShare.facebookTemplate) setFacebookTemplate(config.socialShare.facebookTemplate);
      if (config.socialShare.instagramTemplate) setInstagramTemplate(config.socialShare.instagramTemplate);
      if (config.socialShare.whatsappTemplate) setWhatsappTemplate(config.socialShare.whatsappTemplate);
      if (config.socialShare.defaultHashtags) setDefaultHashtags(config.socialShare.defaultHashtags);
      if (config.socialShare.enableDirectShareBar !== undefined) setEnableDirectShareBar(config.socialShare.enableDirectShareBar);
    }
    if (config.contactEmail) setContactEmail(config.contactEmail);
    if (config.contactPhone) setContactPhone(config.contactPhone);
    if (config.contactAddress) setContactAddress(config.contactAddress);
  }, [config.footer, config.socialLinks, config.socialShare, config.contactEmail, config.contactPhone, config.contactAddress]);

  // Real-time synchronization helper
  const syncAll = (patch?: {
    social?: Partial<typeof config.socialLinks>;
    share?: Partial<typeof defaultShare>;
    footer?: Partial<typeof config.footer>;
    contact?: { email?: string; phone?: string; address?: string };
  }) => {
    if (patch?.social) {
      updateSocialLinks(patch.social);
    }
    if (patch?.share) {
      updateSocialShareTemplates(patch.share);
    }
    if (patch?.footer) {
      updateFooterConfig(patch.footer);
    }
    if (patch?.contact) {
      updateConfig({
        contactEmail: patch.contact.email,
        contactPhone: patch.contact.phone,
        contactAddress: patch.contact.address,
      });
    }
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();

    updateFooterConfig({
      aboutText,
      copyrightText,
      showSocials,
    });

    updateSocialLinks({
      whatsapp,
      instagram,
      facebook,
      youtube,
      twitter,
      tiktok,
    });

    updateSocialShareTemplates({
      facebookTemplate,
      instagramTemplate,
      whatsappTemplate,
      defaultHashtags,
      enableDirectShareBar,
    });

    updateConfig({
      contactEmail,
      contactPhone,
      contactAddress,
    });

    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3500);
  };

  return (
    <form onSubmit={handleSave} className="space-y-6">
      <div className="flex items-center justify-between pb-3 border-b border-slate-200">
        <div>
          <h3 className="font-editorial text-2xl font-bold text-slate-900 flex items-center gap-2">
            <Share2 className="w-6 h-6 text-[#0f3d59]" />
            <span>Redes Sociais & Compartilhamento Pronto de Notícias</span>
          </h3>
          <p className="text-xs text-slate-500 font-sans">
            Configure os links oficiais e a opção de compartilhamento com template montado e pronto para disparar diretamente no Facebook, Instagram e WhatsApp.
          </p>
        </div>

        <button
          type="submit"
          className="px-5 py-2.5 bg-[#0f3d59] hover:bg-[#0a2540] text-white text-xs font-bold rounded-lg transition-colors cursor-pointer shadow-xs flex items-center gap-2"
        >
          <CheckCircle2 className="w-4 h-4" />
          <span>Salvar Alterações</span>
        </button>
      </div>

      {savedSuccess && (
        <div className="p-3.5 bg-emerald-50 border border-emerald-300 rounded-xl text-xs text-emerald-800 font-semibold flex items-center gap-2 animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0" />
          <span>Configurações das redes sociais e opções de compartilhamento salvas e ativas na One Page!</span>
        </div>
      )}

      {/* DEDICATED MODULE: READY-MADE SOCIAL SHARING FOR FACEBOOK AND INSTAGRAM */}
      <div className="bg-gradient-to-br from-blue-50/70 via-indigo-50/40 to-pink-50/60 p-5 sm:p-6 border-2 border-indigo-200 rounded-2xl space-y-5 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-indigo-100">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-indigo-600 text-white rounded-lg shadow-xs">
              <Share2 className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-editorial text-base sm:text-lg font-bold text-slate-900">
                Compartilhamento Pronto (Montado) para Facebook & Instagram
              </h4>
              <p className="text-xs text-slate-600 font-sans">
                A redação e os leitores disparam notícias formatadas com chamadas prontas, links automáticos e hashtags.
              </p>
            </div>
          </div>

          <label className="flex items-center gap-2 text-xs font-bold text-indigo-900 cursor-pointer bg-white px-3 py-1.5 rounded-lg border border-indigo-200 shadow-2xs">
            <input
              type="checkbox"
              checked={enableDirectShareBar}
              onChange={(e) => {
                const checked = e.target.checked;
                setEnableDirectShareBar(checked);
                syncAll({ share: { enableDirectShareBar: checked } });
              }}
              className="rounded text-indigo-600 focus:ring-indigo-500"
            />
            <span>Ativar barra de compartilhamento 1-clique nas notícias</span>
          </label>
        </div>

        {/* Facebook & Instagram Ready Template Editors */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          
          {/* Facebook Template */}
          <div className="bg-white p-4.5 rounded-xl border border-blue-200 space-y-3 shadow-2xs">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-[#1877F2] uppercase tracking-wider flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-[#1877F2]" />
                Template Montado: Facebook
              </span>
              <button
                type="button"
                onClick={handleTestFacebookShare}
                className="px-2.5 py-1 bg-[#1877F2] hover:bg-[#166fe5] text-white text-[11px] font-bold rounded-md flex items-center gap-1 cursor-pointer transition-colors shadow-2xs"
                title="Testar disparo direto no Facebook"
              >
                <ExternalLink className="w-3 h-3" />
                <span>Testar no Facebook</span>
              </button>
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                Estrutura da Mensagem para o Facebook (Tags: <code className="text-blue-700">{'{titulo}'}</code>, <code className="text-blue-700">{'{subtitulo}'}</code>, <code className="text-blue-700">{'{local}'}</code>, <code className="text-blue-700">{'{link}'}</code>):
              </label>
              <textarea
                rows={4}
                value={facebookTemplate}
                onChange={(e) => {
                  const val = e.target.value;
                  setFacebookTemplate(val);
                  syncAll({ share: { facebookTemplate: val } });
                }}
                className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500 font-mono"
              />
            </div>

            {/* Live Preview Box */}
            <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg space-y-1.5">
              <div className="flex items-center justify-between text-[10px] font-bold text-slate-500 uppercase">
                <span>Prévia ao vivo da mensagem montada:</span>
                <button
                  type="button"
                  onClick={handleCopyFacebookPreview}
                  className="text-blue-600 hover:text-blue-800 flex items-center gap-1 cursor-pointer"
                >
                  {copiedPreview === 'facebook' ? (
                    <>
                      <Check className="w-3 h-3 text-emerald-600" />
                      <span className="text-emerald-700">Copiado!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3 h-3" />
                      <span>Copiar Texto</span>
                    </>
                  )}
                </button>
              </div>
              <p className="text-xs text-slate-700 font-sans whitespace-pre-line bg-white p-2.5 rounded border border-slate-100">
                {formatTemplate(facebookTemplate)}
              </p>
            </div>
          </div>

          {/* Instagram Template */}
          <div className="bg-white p-4.5 rounded-xl border border-pink-200 space-y-3 shadow-2xs">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-[#E1306C] uppercase tracking-wider flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-gradient-to-r from-[#833ab4] to-[#fcb045]" />
                Template Montado: Instagram (Legenda Pronta)
              </span>
              <button
                type="button"
                onClick={handleCopyInstagramPreview}
                className="px-2.5 py-1 bg-gradient-to-r from-[#833ab4] via-[#fd1d1d] to-[#fcb045] text-white text-[11px] font-bold rounded-md flex items-center gap-1 cursor-pointer transition-opacity hover:opacity-95 shadow-2xs"
                title="Copiar legenda montada para postar no Instagram"
              >
                {copiedPreview === 'instagram' ? (
                  <>
                    <Check className="w-3 h-3" />
                    <span>Legenda Copiada!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3 h-3" />
                    <span>Copiar Legenda</span>
                  </>
                )}
              </button>
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                Estrutura da Legenda Completa para o Instagram (com emojis, chamada na bio e hashtags):
              </label>
              <textarea
                rows={4}
                value={instagramTemplate}
                onChange={(e) => {
                  const val = e.target.value;
                  setInstagramTemplate(val);
                  syncAll({ share: { instagramTemplate: val } });
                }}
                className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-pink-500 font-mono"
              />
            </div>

            {/* Live Preview Box */}
            <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg space-y-1.5">
              <div className="flex items-center justify-between text-[10px] font-bold text-slate-500 uppercase">
                <span>Prévia ao vivo da legenda para post no feed / stories:</span>
                <span className="text-slate-400 text-[10px]">Pronto para colar</span>
              </div>
              <p className="text-xs text-slate-700 font-sans whitespace-pre-line bg-white p-2.5 rounded border border-slate-100 max-h-36 overflow-y-auto">
                {formatTemplate(instagramTemplate)}
              </p>
            </div>
          </div>
        </div>

        {/* Hashtags and WhatsApp Quick Template */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Hashtags Padrão das Matérias
            </label>
            <input
              type="text"
              value={defaultHashtags}
              onChange={(e) => {
                const val = e.target.value;
                setDefaultHashtags(val);
                syncAll({ share: { defaultHashtags: val } });
              }}
              placeholder="#ComunidadeEmAção #Amazonas #Manaus #JornalismoComunitario"
              className="w-full px-3 py-2 text-xs bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-indigo-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Template do WhatsApp (Mensagem Formatada com Negrito)
            </label>
            <input
              type="text"
              value={whatsappTemplate}
              onChange={(e) => {
                const val = e.target.value;
                setWhatsappTemplate(val);
                syncAll({ share: { whatsappTemplate: val } });
              }}
              placeholder="📰 *{titulo}* - {link}"
              className="w-full px-3 py-2 text-xs bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-indigo-500 font-mono"
            />
          </div>
        </div>
      </div>

      {/* Social Links Form (CRUD / URL edit of channels) */}
      <div className="bg-white p-5 border border-slate-200 rounded-xl space-y-4 shadow-2xs">
        <div className="flex items-center justify-between">
          <h4 className="font-editorial text-base font-bold text-slate-900 flex items-center gap-2">
            <Globe className="w-4 h-4 text-emerald-700" />
            <span>Canais Oficiais do Portal (URLs de Perfil e Redes)</span>
          </h4>
          <label className="flex items-center gap-2 text-xs font-medium cursor-pointer">
            <input
              type="checkbox"
              checked={showSocials}
              onChange={(e) => {
                const checked = e.target.checked;
                setShowSocials(checked);
                syncAll({ footer: { showSocials: checked } });
              }}
              className="rounded text-[#0f3d59] focus:ring-[#0f3d59]"
            />
            <span>Exibir ícones sociais no rodapé</span>
          </label>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              WhatsApp Oficial da Redação
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                value={whatsapp}
                onChange={(e) => {
                  const val = e.target.value;
                  setWhatsapp(val);
                  syncAll({ social: { whatsapp: val } });
                }}
                placeholder="https://wa.me/5592981440022"
                className="flex-1 px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#0f3d59] focus:bg-white"
              />
              {whatsapp && (
                <a
                  href={whatsapp}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 text-slate-400 hover:text-emerald-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors"
                  title="Testar Link"
                >
                  <ExternalLink className="w-4 h-4" />
                </a>
              )}
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Instagram Oficial (@comunidadeemacao_am)
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                value={instagram}
                onChange={(e) => {
                  const val = e.target.value;
                  setInstagram(val);
                  syncAll({ social: { instagram: val } });
                }}
                placeholder="https://instagram.com/comunidadeemacao_am"
                className="flex-1 px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#0f3d59] focus:bg-white"
              />
              {instagram && (
                <a
                  href={instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 text-slate-400 hover:text-pink-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors"
                  title="Testar Link"
                >
                  <ExternalLink className="w-4 h-4" />
                </a>
              )}
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Facebook Oficial (Página do Portal)
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                value={facebook}
                onChange={(e) => {
                  const val = e.target.value;
                  setFacebook(val);
                  syncAll({ social: { facebook: val } });
                }}
                placeholder="https://facebook.com/comunidadeemacao.am"
                className="flex-1 px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#0f3d59] focus:bg-white"
              />
              {facebook && (
                <a
                  href={facebook}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 text-slate-400 hover:text-blue-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors"
                  title="Testar Link"
                >
                  <ExternalLink className="w-4 h-4" />
                </a>
              )}
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              YouTube (Canal Oficial)
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                value={youtube}
                onChange={(e) => {
                  const val = e.target.value;
                  setYoutube(val);
                  syncAll({ social: { youtube: val } });
                }}
                placeholder="https://youtube.com/@comunidadeemacao"
                className="flex-1 px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#0f3d59] focus:bg-white"
              />
              {youtube && (
                <a
                  href={youtube}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 text-slate-400 hover:text-red-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors"
                  title="Testar Link"
                >
                  <ExternalLink className="w-4 h-4" />
                </a>
              )}
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              TikTok (@comunidadeemacao)
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                value={tiktok}
                onChange={(e) => {
                  const val = e.target.value;
                  setTiktok(val);
                  syncAll({ social: { tiktok: val } });
                }}
                placeholder="https://tiktok.com/@comunidadeemacao"
                className="flex-1 px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#0f3d59] focus:bg-white"
              />
              {tiktok && (
                <a
                  href={tiktok}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 text-slate-400 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors"
                  title="Testar Link"
                >
                  <ExternalLink className="w-4 h-4" />
                </a>
              )}
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              X / Twitter Oficial
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                value={twitter}
                onChange={(e) => {
                  const val = e.target.value;
                  setTwitter(val);
                  syncAll({ social: { twitter: val } });
                }}
                placeholder="https://x.com/comunidadeemacao"
                className="flex-1 px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#0f3d59] focus:bg-white"
              />
              {twitter && (
                <a
                  href={twitter}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 text-slate-400 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors"
                  title="Testar Link"
                >
                  <ExternalLink className="w-4 h-4" />
                </a>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Footer Texts & Copyright */}
      <div className="bg-white p-5 border border-slate-200 rounded-xl space-y-4 shadow-2xs">
        <h4 className="font-editorial text-base font-bold text-slate-900 flex items-center gap-2">
          <FileText className="w-4 h-4 text-[#0f3d59]" />
          <span>Textos do Rodapé & Copyright</span>
        </h4>

        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">
            Texto Institucional Sobre o Portal (Rodapé)
          </label>
          <textarea
            rows={3}
            value={aboutText}
            onChange={(e) => {
              const val = e.target.value;
              setAboutText(val);
              syncAll({ footer: { aboutText: val } });
            }}
            className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#0f3d59] focus:bg-white"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">
            Linha de Copyright
          </label>
          <input
            type="text"
            value={copyrightText}
            onChange={(e) => {
              const val = e.target.value;
              setCopyrightText(val);
              syncAll({ footer: { copyrightText: val } });
            }}
            className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#0f3d59] focus:bg-white"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">E-mail de Contato</label>
            <input
              type="email"
              value={contactEmail}
              onChange={(e) => {
                const val = e.target.value;
                setContactEmail(val);
                syncAll({ contact: { email: val } });
              }}
              className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#0f3d59]"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Telefone da Redação</label>
            <input
              type="text"
              value={contactPhone}
              onChange={(e) => {
                const val = e.target.value;
                setContactPhone(val);
                syncAll({ contact: { phone: val } });
              }}
              className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#0f3d59]"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Endereço / Sede</label>
            <input
              type="text"
              value={contactAddress}
              onChange={(e) => {
                const val = e.target.value;
                setContactAddress(val);
                syncAll({ contact: { address: val } });
              }}
              className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#0f3d59]"
            />
          </div>
        </div>
      </div>
    </form>
  );
};
