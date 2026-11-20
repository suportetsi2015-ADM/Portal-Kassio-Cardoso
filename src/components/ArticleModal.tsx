import React, { useEffect, useState } from 'react';
import { useStore } from '../context/StoreContext';
import { Article } from '../types';
import {
  X,
  Calendar,
  MapPin,
  User,
  Share2,
  BookOpen,
  Quote,
  Check,
  Send,
  Copy,
  ExternalLink,
} from 'lucide-react';

interface ArticleModalProps {
  article: Article | null;
  onClose: () => void;
}

export const ArticleModal: React.FC<ArticleModalProps> = ({ article, onClose }) => {
  const { incrementArticleViews, config } = useStore();
  const [copied, setCopied] = useState(false);
  const [instagramModalOpen, setInstagramModalOpen] = useState(false);
  const shareConfig = config.socialShare;

  useEffect(() => {
    if (article) {
      incrementArticleViews(article.id);
    }
  }, [article?.id]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  if (!article) return null;

  const articleUrl = `${window.location.origin}${window.location.pathname}?materia=${article.id}`;

  const formatShare = (template: string) => {
    return template
      .replace(/{titulo}/g, article.title)
      .replace(/{subtitulo}/g, article.subtitle || '')
      .replace(/{local}/g, article.location)
      .replace(/{autor}/g, article.authorName)
      .replace(/{link}/g, articleUrl)
      .replace(/{hashtags}/g, shareConfig?.defaultHashtags || '#ComunidadeEmAção #Amazonas');
  };

  const formatDate = (isoString?: string) => {
    if (!isoString) return '';
    try {
      return new Intl.DateTimeFormat('pt-BR', {
        day: '2-digit',
        month: 'long',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      }).format(new Date(isoString));
    } catch {
      return '';
    }
  };

  // Ready-Made Social Sharing Handlers
  const handleShareWhatsApp = () => {
    const text = shareConfig?.whatsappTemplate
      ? formatShare(shareConfig.whatsappTemplate)
      : `📰 *${article.title}*\n${article.subtitle ? `${article.subtitle}\n\n` : '\n'}📍 ${article.location} · COMUNIDADE EM AÇÃO\n🔗 Acesse a notícia completa: ${articleUrl}`;
    const url = `https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`;
    window.open(url, '_blank');
  };

  const handleShareFacebook = () => {
    const quote = shareConfig?.facebookTemplate
      ? formatShare(shareConfig.facebookTemplate)
      : article.title;
    const url = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(articleUrl)}&quote=${encodeURIComponent(quote)}`;
    window.open(url, '_blank', 'width=600,height=500');
  };

  const handleShareTwitter = () => {
    const text = `📰 ${article.title} — Via COMUNIDADE EM AÇÃO\n${articleUrl} #Amazonas #Notícias`;
    const url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}`;
    window.open(url, '_blank', 'width=600,height=400');
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(articleUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const instagramReadyText = shareConfig?.instagramTemplate
    ? formatShare(shareConfig.instagramTemplate)
    : `📢 NOTÍCIA DO AMAZONAS: ${article.title}\n\n${article.subtitle || ''}\n\n📍 Local: ${article.location}\n✍️ Apuração: ${article.authorName} · COMUNIDADE EM AÇÃO\n\n👉 Acesse o link no perfil para ler na íntegra:\n${articleUrl}\n\n#ComunidadeEmAção #Manaus #Amazonas #JornalismoComunitario #NoticiaVerificada`;

  const handleCopyInstagramText = () => {
    navigator.clipboard.writeText(instagramReadyText);
    alert('Texto pronto para legenda do Instagram ou postagem copiado com sucesso!');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/80 backdrop-blur-xs overflow-y-auto animate-in fade-in">
      <div className="bg-white rounded-2xl max-w-3xl w-full max-h-[92vh] overflow-y-auto border border-slate-200 shadow-2xl relative my-auto">
        
        {/* Sticky Top Bar of Reader */}
        <div className="sticky top-0 z-20 bg-white/95 backdrop-blur-md px-6 py-3.5 border-b border-slate-200 flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs font-sans text-slate-500">
            <span className="font-semibold text-emerald-800 uppercase tracking-wider">{article.category}</span>
            <span aria-hidden="true">·</span>
            <span className="flex items-center gap-1">
              <MapPin className="w-3 h-3 text-slate-400" />
              {article.location}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
              aria-label="Fechar notícia"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Article Body */}
        <div className="p-6 sm:p-10">
          
          {/* Main Title & Subtitle */}
          <h1 className="font-editorial text-2xl sm:text-4xl font-bold text-slate-900 leading-tight">
            {article.title}
          </h1>

          {article.subtitle && (
            <p className="mt-4 text-base sm:text-lg text-slate-600 font-sans leading-relaxed">
              {article.subtitle}
            </p>
          )}

          {/* Author Byline & Date */}
          <div className="mt-6 pt-4 pb-4 border-y border-slate-100 flex flex-wrap items-center justify-between gap-4 text-xs font-sans text-slate-500">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full overflow-hidden bg-slate-200 border border-slate-300">
                <img
                  src={article.authorAvatar || '/src/assets/images/avatar_kassio_cardoso_1791649510274.jpg'}
                  alt={article.authorName}
                  className="w-full h-full object-cover"
                />
              </div>
              <div>
                <span className="font-semibold text-slate-900 block">{article.authorName}</span>
                <span className="text-slate-500 text-[11px]">{article.authorBio || 'Redação Comunidade em Ação'}</span>
              </div>
            </div>

            <div className="flex items-center gap-1 text-slate-500">
              <Calendar className="w-3.5 h-3.5" />
              <span>{formatDate(article.publishedAt || article.createdAt)}</span>
            </div>
          </div>

          {/* READY-MADE SOCIAL SHARING TOOLBAR (DIRECT 1-CLICK SHARING) */}
          <div className="my-5 p-3.5 bg-slate-50 border border-slate-200 rounded-xl">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-center gap-1.5 text-xs font-bold text-slate-800">
                <Share2 className="w-4 h-4 text-[#0f3d59]" />
                <span>Compartilhar nas Redes Sociais:</span>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                {/* WhatsApp */}
                <button
                  onClick={handleShareWhatsApp}
                  className="px-3 py-1.5 bg-[#25D366] hover:bg-[#20ba5a] text-white text-xs font-bold rounded-lg transition-colors cursor-pointer flex items-center gap-1.5 shadow-xs"
                  title="Compartilhar no WhatsApp com mensagem formatada"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>WhatsApp</span>
                </button>

                {/* Facebook */}
                <button
                  onClick={handleShareFacebook}
                  className="px-3 py-1.5 bg-[#1877F2] hover:bg-[#166fe5] text-white text-xs font-bold rounded-lg transition-colors cursor-pointer flex items-center gap-1.5 shadow-xs"
                  title="Compartilhar diretamente no Facebook"
                >
                  <span>Facebook</span>
                </button>

                {/* Instagram Ready Card */}
                <button
                  onClick={() => setInstagramModalOpen(!instagramModalOpen)}
                  className="px-3 py-1.5 bg-gradient-to-r from-[#833ab4] via-[#fd1d1d] to-[#fcb045] hover:opacity-90 text-white text-xs font-bold rounded-lg transition-opacity cursor-pointer flex items-center gap-1.5 shadow-xs"
                  title="Copiar texto pronto para post no Instagram"
                >
                  <span>Instagram</span>
                </button>

                {/* Twitter / X */}
                <button
                  onClick={handleShareTwitter}
                  className="px-2.5 py-1.5 bg-slate-900 hover:bg-black text-white text-xs font-bold rounded-lg transition-colors cursor-pointer"
                  title="Compartilhar no X"
                >
                  <span>X</span>
                </button>

                {/* Copy Link */}
                <button
                  onClick={handleCopyLink}
                  className="px-3 py-1.5 bg-white border border-slate-300 hover:bg-slate-100 text-slate-800 text-xs font-semibold rounded-lg transition-colors cursor-pointer flex items-center gap-1.5"
                  title="Copiar Link da Notícia"
                >
                  {copied ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-600" />
                      <span className="text-emerald-700 font-bold">Copiado!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>Copiar Link</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Instagram Ready Copy Box */}
            {instagramModalOpen && (
              <div className="mt-3 pt-3 border-t border-slate-200 animate-in fade-in">
                <div className="flex items-center justify-between mb-2 text-xs">
                  <span className="font-semibold text-slate-800">
                    Texto montado para Postagem / Story no Instagram:
                  </span>
                  <button
                    onClick={handleCopyInstagramText}
                    className="px-2.5 py-1 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold rounded-md text-[11px] cursor-pointer flex items-center gap-1"
                  >
                    <Copy className="w-3 h-3" />
                    <span>Copiar Texto Pronto</span>
                  </button>
                </div>
                <textarea
                  readOnly
                  rows={4}
                  value={instagramReadyText}
                  className="w-full text-xs font-mono p-2.5 bg-white border border-slate-200 rounded-lg text-slate-700 select-all"
                />
              </div>
            )}
          </div>

          {/* Cover Image & Caption */}
          {article.coverImage && (
            <figure className="my-6">
              <div className="aspect-16/9 rounded-xl overflow-hidden bg-slate-100">
                <img
                  src={article.coverImage}
                  alt={article.title}
                  referrerPolicy="no-referrer"
                  onError={(e) => {
                    (e.currentTarget as HTMLImageElement).src =
                      '/src/assets/images/hero_amazonas_ribeirinho_1791649494876.jpg';
                  }}
                  className="w-full h-full object-cover"
                />
              </div>
              {(article.imageCaption || article.imageCredit) && (
                <figcaption className="mt-2 text-xs font-sans text-slate-500 italic flex items-center justify-between">
                  <span>{article.imageCaption}</span>
                  {article.imageCredit && <span className="not-italic text-slate-400">Crédito: {article.imageCredit}</span>}
                </figcaption>
              )}
            </figure>
          )}

          {/* Editorial Content */}
          <div className="prose max-w-none text-slate-800 font-sans text-base sm:text-lg leading-relaxed space-y-5">
            {article.content.split('\n\n').map((paragraph, idx) => (
              <p
                key={idx}
                className={idx === 0 ? 'first-letter:text-4xl first-letter:font-editorial first-letter:font-bold first-letter:float-left first-letter:mr-2.5 first-letter:text-[#0f3d59]' : ''}
              >
                {paragraph}
              </p>
            ))}
          </div>

          {/* Consulted Sources */}
          {article.sources && (
            <div className="mt-10 p-5 bg-slate-50 rounded-xl border border-slate-200">
              <div className="flex items-center gap-2 text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1 font-sans">
                <BookOpen className="w-4 h-4 text-emerald-800" />
                <span>Fontes e Apuração Jornalística</span>
              </div>
              <p className="text-xs sm:text-sm text-slate-600 font-sans leading-relaxed">
                {article.sources}
              </p>
            </div>
          )}

          {/* Institutional Quote Footer */}
          <div className="mt-8 pt-6 border-t border-slate-200 flex items-center gap-3 text-xs text-slate-500 font-sans">
            <Quote className="w-4 h-4 text-[#0f3d59]" />
            <span>
              Reportagem comunitária verificada. Publicada no <strong>COMUNIDADE EM AÇÃO</strong> sob coordenação de Kássio Cardoso.
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
