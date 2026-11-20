import React, { useState, useMemo, useRef } from 'react';
import { useStore } from '../context/StoreContext';
import { Article } from '../types';
import {
  Search,
  Calendar,
  MapPin,
  User as UserIcon,
  Newspaper,
  ChevronLeft,
  ChevronRight,
  Share2,
  Check,
} from 'lucide-react';

interface LatestNewsProps {
  onSelectArticle: (article: Article) => void;
  onOpenNewArticle?: () => void;
}

export const LatestNews: React.FC<LatestNewsProps> = ({ onSelectArticle }) => {
  const { articles, categories, config } = useStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [copiedArticleId, setCopiedArticleId] = useState<string | null>(null);

  const categoriesRef = useRef<HTMLDivElement>(null);

  const handleScrollCategories = (direction: 'left' | 'right') => {
    if (categoriesRef.current) {
      const scrollAmount = direction === 'left' ? -260 : 260;
      categoriesRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  // Filter only published articles for public view
  const publishedArticles = useMemo(() => {
    return articles
      .filter((a) => a.status === 'published')
      .sort((a, b) => new Date(b.publishedAt || b.createdAt).getTime() - new Date(a.publishedAt || a.createdAt).getTime());
  }, [articles]);

  const filteredArticles = useMemo(() => {
    return publishedArticles.filter((article) => {
      const matchesSearch =
        article.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        article.subtitle?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        article.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
        article.authorName.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesCat =
        selectedCategory === 'all'
          ? true
          : selectedCategory === 'destaques'
          ? article.isFeatured
          : article.category.toLowerCase() === selectedCategory.toLowerCase();

      return matchesSearch && matchesCat;
    });
  }, [publishedArticles, searchTerm, selectedCategory]);

  const formatDate = (isoString?: string) => {
    if (!isoString) return '';
    try {
      const d = new Date(isoString);
      return new Intl.DateTimeFormat('pt-BR', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
      }).format(d);
    } catch {
      return '';
    }
  };

  const shareConfig = config.socialShare;

  const handleShareArticle = (e: React.MouseEvent, article: Article, platform: 'whatsapp' | 'facebook' | 'copy') => {
    e.stopPropagation();
    const articleUrl = `${window.location.origin}${window.location.pathname}?materia=${article.id}`;

    const formatShare = (tpl: string) => {
      return tpl
        .replace(/{titulo}/g, article.title)
        .replace(/{subtitulo}/g, article.subtitle || '')
        .replace(/{local}/g, article.location)
        .replace(/{autor}/g, article.authorName)
        .replace(/{link}/g, articleUrl)
        .replace(/{hashtags}/g, shareConfig?.defaultHashtags || '#ComunidadeEmAção #Amazonas');
    };

    if (platform === 'whatsapp') {
      const shareText = shareConfig?.whatsappTemplate
        ? formatShare(shareConfig.whatsappTemplate)
        : `*${article.title}*\n${article.subtitle || ''}\n\nLeia completa no COMUNIDADE EM AÇÃO:\n${articleUrl}`;
      const url = `https://api.whatsapp.com/send?text=${encodeURIComponent(shareText)}`;
      window.open(url, '_blank');
    } else if (platform === 'facebook') {
      const quote = shareConfig?.facebookTemplate
        ? formatShare(shareConfig.facebookTemplate)
        : article.title;
      const url = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(articleUrl)}&quote=${encodeURIComponent(quote)}`;
      window.open(url, '_blank', 'width=600,height=500');
    } else {
      navigator.clipboard.writeText(articleUrl);
      setCopiedArticleId(article.id);
      setTimeout(() => setCopiedArticleId(null), 2500);
    }
  };

  return (
    <section id="ultimas-noticias" className="py-16 sm:py-20 bg-slate-50 border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-slate-200">
          <div>
            <div className="text-xs font-semibold text-emerald-800 uppercase tracking-widest font-sans">
              {config.structureTexts?.latestEyebrow || 'Cobertura Local em Tempo Real'}
            </div>
            <h2 className="text-2xl sm:text-4xl font-bold font-editorial text-slate-900 mt-1">
              {config.structureTexts?.latestSectionTitle || config.structureTexts?.heroSectionTitle || 'Últimas Notícias'}
            </h2>
            <p className="text-sm text-slate-600 mt-1">
              {config.structureTexts?.latestSectionSubtitle || 'Acontecimentos, serviços públicos e histórias reais dos municípios e rios do Amazonas.'}
            </p>
          </div>

          {/* Search bar */}
          <div className="flex items-center gap-3 w-full md:w-auto">
            <div className="relative flex-1 md:w-72">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Buscar notícias, municípios..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-4 py-2 text-sm bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#0f3d59] focus:border-[#0f3d59]"
              />
            </div>
          </div>
        </div>

        {/* Categories Bar with Functional Navigation Arrows (Fixes cut off / stuck panel) */}
        <div className="relative flex items-center py-3">
          {/* Left Arrow Button */}
          <button
            onClick={() => handleScrollCategories('left')}
            className="p-1.5 mr-2 rounded-full bg-white border border-slate-300 text-slate-700 hover:bg-slate-100 shadow-xs cursor-pointer shrink-0 z-10 transition-colors"
            title="Rolar categorias para esquerda"
            aria-label="Rolar para esquerda"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>

          {/* Scrollable Categories List */}
          <div
            ref={categoriesRef}
            className="flex items-center gap-2 overflow-x-auto scroll-smooth py-2 scrollbar-none no-scrollbar flex-1 pr-6"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            <button
              onClick={() => setSelectedCategory('all')}
              className={`px-3.5 py-1.5 text-xs font-medium rounded-lg whitespace-nowrap transition-colors cursor-pointer shrink-0 ${
                selectedCategory === 'all'
                  ? 'bg-[#0f3d59] text-white shadow-xs'
                  : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-100'
              }`}
            >
              Todas as Categorias ({publishedArticles.length})
            </button>
            <button
              onClick={() => setSelectedCategory('destaques')}
              className={`px-3.5 py-1.5 text-xs font-medium rounded-lg whitespace-nowrap transition-colors cursor-pointer flex items-center gap-1.5 shrink-0 ${
                selectedCategory === 'destaques'
                  ? 'bg-amber-500 text-slate-950 font-bold shadow-xs'
                  : 'bg-amber-50 text-amber-900 border border-amber-200 hover:bg-amber-100'
              }`}
            >
              <span>★ Destaques</span>
              <span className="text-[10px] bg-black/10 px-1.5 py-0.2 rounded-full font-bold">
                {publishedArticles.filter((a) => a.isFeatured).length}
              </span>
            </button>
            {categories
              .filter((c) => c.isActive)
              .map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.name)}
                  className={`px-3 py-1.5 text-xs font-medium rounded-lg whitespace-nowrap transition-colors cursor-pointer shrink-0 ${
                    selectedCategory === cat.name
                      ? 'bg-[#0f3d59] text-white shadow-xs'
                      : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  {cat.name}
                </button>
              ))}
          </div>

          {/* Right Arrow Button */}
          <button
            onClick={() => handleScrollCategories('right')}
            className="p-1.5 ml-2 rounded-full bg-white border border-slate-300 text-slate-700 hover:bg-slate-100 shadow-xs cursor-pointer shrink-0 z-10 transition-colors"
            title="Rolar categorias para direita"
            aria-label="Rolar para direita"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        {/* Articles List / Grid */}
        {filteredArticles.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-4">
            {filteredArticles.map((article) => (
              <article
                key={article.id}
                onClick={() => onSelectArticle(article)}
                className="group flex flex-col bg-white rounded-xl border border-slate-200 overflow-hidden shadow-xs hover:shadow-md transition-all cursor-pointer"
              >
                {/* Article Image Container */}
                <div className="relative aspect-16/10 bg-slate-100 overflow-hidden">
                  {article.coverImage ? (
                    <img
                      src={article.coverImage}
                      alt={article.title}
                      referrerPolicy="no-referrer"
                      onError={(e) => {
                        (e.currentTarget as HTMLImageElement).src =
                          '/src/assets/images/hero_amazonas_ribeirinho_1791649494876.jpg';
                      }}
                      className="w-full h-full object-cover group-hover:scale-103 transition-transform duration-300"
                    />
                  ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center bg-slate-100 text-slate-400 p-6 text-center">
                      <Newspaper className="w-10 h-10 text-slate-300 mb-2" />
                      <span className="text-xs font-sans">COMUNIDADE EM AÇÃO</span>
                    </div>
                  )}
                  {/* Location badge on image corner */}
                  <div className="absolute top-3 left-3 bg-slate-900/80 backdrop-blur-xs text-white text-[11px] font-sans px-2.5 py-1 rounded-sm flex items-center gap-1">
                    <MapPin className="w-3 h-3 text-emerald-400" />
                    <span>{article.location}</span>
                  </div>
                </div>

                {/* Article Meta & Content */}
                <div className="p-5 flex-1 flex flex-col justify-between">
                  <div>
                    {/* Metadata */}
                    <div className="flex items-center gap-2 text-xs font-sans text-slate-500 mb-2">
                      <span className="font-semibold text-emerald-800">{article.category}</span>
                      <span aria-hidden="true">·</span>
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {formatDate(article.publishedAt || article.createdAt)}
                      </span>
                    </div>

                    {/* Headline */}
                    <h3 className="font-editorial text-lg sm:text-xl font-bold text-slate-900 group-hover:text-[#0f3d59] transition-colors leading-snug line-clamp-2">
                      {article.title}
                    </h3>

                    {/* Subtitle */}
                    {article.subtitle && (
                      <p className="mt-2 text-xs sm:text-sm text-slate-600 font-sans line-clamp-2 leading-relaxed">
                        {article.subtitle}
                      </p>
                    )}
                  </div>

                  {/* Ready-made Social Sharing & Action Bar */}
                  <div className="mt-4 pt-3 border-t border-slate-100 flex flex-col gap-2">
                    <div className="flex items-center justify-between text-xs text-slate-500 font-sans">
                      <div className="flex items-center gap-1.5">
                        <UserIcon className="w-3.5 h-3.5 text-slate-400" />
                        <span className="font-medium text-slate-700">{article.authorName}</span>
                      </div>
                      <span className="text-[#0f3d59] font-semibold group-hover:underline">
                        Ler notícia →
                      </span>
                    </div>

                    {/* Direct Social Media Sharing Buttons (Facebook, WhatsApp, Copy Link) */}
                    <div
                      className="flex items-center justify-between pt-2 border-t border-slate-50 text-[11px]"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <span className="text-slate-400 flex items-center gap-1 font-sans">
                        <Share2 className="w-3 h-3" />
                        <span>Compartilhar:</span>
                      </span>

                      <div className="flex items-center gap-1">
                        <button
                          onClick={(e) => handleShareArticle(e, article, 'whatsapp')}
                          className="px-2 py-0.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 font-semibold rounded text-[11px] transition-colors cursor-pointer"
                          title="Compartilhar no WhatsApp"
                        >
                          WhatsApp
                        </button>
                        <button
                          onClick={(e) => handleShareArticle(e, article, 'facebook')}
                          className="px-2 py-0.5 bg-blue-50 hover:bg-blue-100 text-blue-800 font-semibold rounded text-[11px] transition-colors cursor-pointer"
                          title="Compartilhar no Facebook"
                        >
                          Facebook
                        </button>
                        <button
                          onClick={(e) => handleShareArticle(e, article, 'copy')}
                          className="px-2 py-0.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded text-[11px] transition-colors cursor-pointer flex items-center gap-1"
                          title="Copiar Link da Notícia"
                        >
                          {copiedArticleId === article.id ? (
                            <>
                              <Check className="w-3 h-3 text-emerald-600" />
                              <span>Copiado!</span>
                            </>
                          ) : (
                            <span>Link</span>
                          )}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </article>
            ))}
          </div>
        ) : (
          <div className="mt-8 bg-white rounded-2xl border border-dashed border-slate-300 p-10 sm:p-16 text-center max-w-2xl mx-auto">
            <div className="w-14 h-14 bg-emerald-50 rounded-full flex items-center justify-center mx-auto mb-4 text-emerald-800">
              <Newspaper className="w-7 h-7" />
            </div>
            <h3 className="font-editorial text-xl sm:text-2xl font-bold text-slate-900">
              {searchTerm || selectedCategory !== 'all'
                ? 'Nenhuma matéria encontrada para este filtro'
                : 'O portal está pronto para as primeiras reportagens'}
            </h3>
            <p className="mt-2 text-sm text-slate-600 leading-relaxed font-sans max-w-lg mx-auto">
              {searchTerm || selectedCategory !== 'all'
                ? 'Tente ajustar os termos de pesquisa ou selecionar outra categoria.'
                : 'Nenhuma notícia foi publicada ainda para esta seleção.'}
            </p>
          </div>
        )}
      </div>
    </section>
  );
};
