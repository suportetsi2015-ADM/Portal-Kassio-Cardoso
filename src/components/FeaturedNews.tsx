import React from 'react';
import { useStore } from '../context/StoreContext';
import { Article } from '../types';
import { Calendar, MapPin, User, Sparkles, MessageSquareShare, Newspaper } from 'lucide-react';

interface FeaturedNewsProps {
  onSelectArticle: (article: Article) => void;
}

export const FeaturedNews: React.FC<FeaturedNewsProps> = ({ onSelectArticle }) => {
  const { articles, config } = useStore();

  const featured = articles
    .filter((a) => a.status === 'published' && a.isFeatured)
    .slice(0, 3);

  // If none explicitly marked as featured, take the first 2 published if available
  const displayItems =
    featured.length > 0
      ? featured
      : articles.filter((a) => a.status === 'published').slice(0, 2);

  const formatDate = (isoString?: string) => {
    if (!isoString) return '';
    try {
      return new Intl.DateTimeFormat('pt-BR', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
      }).format(new Date(isoString));
    } catch {
      return '';
    }
  };

  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section id="destaques" className="py-16 bg-white border-b border-slate-200 scroll-mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Title */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div className="flex items-center gap-2">
            <span className="p-1.5 bg-amber-100 text-amber-700 rounded-lg">
              <Sparkles className="w-4 h-4" />
            </span>
            <div>
              <div className="text-[11px] font-bold text-amber-700 uppercase tracking-widest font-sans">
                {config.structureTexts?.featuredEyebrow || 'Jornalismo de Impacto'}
              </div>
              <h2 className="text-xl sm:text-2xl font-bold font-editorial text-slate-900">
                {config.structureTexts?.featuredSectionTitle || config.structureTexts?.politicsSectionTitle || 'Destaques da Redação Comunitária'}
              </h2>
              <p className="text-xs text-slate-500 font-sans">
                {config.structureTexts?.featuredSectionSubtitle || 'Grandes reportagens, investigações locais e acontecimentos de impacto no Amazonas'}
              </p>
            </div>
          </div>

          <span className="text-xs font-semibold text-emerald-800 bg-emerald-50 border border-emerald-200 px-3 py-1 rounded-full w-fit">
            Curadoria: Kássio Cardoso
          </span>
        </div>

        {displayItems.length > 0 ? (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
            
            {/* Lead Story: 7 cols */}
            {displayItems[0] && (
              <div
                onClick={() => onSelectArticle(displayItems[0])}
                className="lg:col-span-7 group flex flex-col justify-between bg-slate-50 border border-slate-200 rounded-2xl overflow-hidden cursor-pointer hover:shadow-lg transition-all"
              >
                <div className="relative aspect-16/9 overflow-hidden bg-slate-900">
                  <img
                    src={displayItems[0].coverImage || '/src/assets/images/hero_amazonas_ribeirinho_1791649494876.jpg'}
                    alt={displayItems[0].title}
                    referrerPolicy="no-referrer"
                    onError={(e) => {
                      (e.currentTarget as HTMLImageElement).src =
                        '/src/assets/images/hero_amazonas_ribeirinho_1791649494876.jpg';
                    }}
                    className="w-full h-full object-cover group-hover:scale-103 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent" />
                  <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between text-xs text-white">
                    <span className="flex items-center gap-1 bg-black/50 backdrop-blur-xs px-2.5 py-1 rounded-sm">
                      <MapPin className="w-3 h-3 text-emerald-400" />
                      {displayItems[0].location}
                    </span>
                    <span className="bg-amber-500 text-slate-950 font-bold px-2 py-0.5 rounded-xs text-[10px] uppercase tracking-wider">
                      Destaque Principal
                    </span>
                  </div>
                </div>

                <div className="p-6 sm:p-8 flex-1 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center gap-2 text-xs font-sans text-slate-500 mb-3">
                      <span className="font-semibold text-emerald-800">{displayItems[0].category}</span>
                      <span aria-hidden="true">·</span>
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {formatDate(displayItems[0].publishedAt)}
                      </span>
                    </div>

                    <h3 className="font-editorial text-2xl sm:text-3xl font-bold text-slate-900 group-hover:text-[#0f3d59] transition-colors leading-tight">
                      {displayItems[0].title}
                    </h3>

                    {displayItems[0].subtitle && (
                      <p className="mt-3 text-sm sm:text-base text-slate-600 font-sans leading-relaxed">
                        {displayItems[0].subtitle}
                      </p>
                    )}
                  </div>

                  <div className="mt-6 pt-4 border-t border-slate-200 flex items-center justify-between text-xs text-slate-500">
                    <span className="flex items-center gap-1.5 font-medium text-slate-700">
                      <User className="w-3.5 h-3.5" />
                      {displayItems[0].authorName}
                    </span>
                    <span className="font-semibold text-[#0f3d59]">Acessar reportagem completa →</span>
                  </div>
                </div>
              </div>
            )}

            {/* Secondary Stories: 5 cols */}
            <div className="lg:col-span-5 flex flex-col gap-6">
              {displayItems.slice(1).map((story) => (
                <div
                  key={story.id}
                  onClick={() => onSelectArticle(story)}
                  className="group flex-1 bg-slate-50 border border-slate-200 rounded-2xl p-6 cursor-pointer hover:shadow-md transition-all flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center gap-2 text-xs font-sans text-slate-500 mb-2">
                      <span className="font-semibold text-emerald-800">{story.category}</span>
                      <span aria-hidden="true">·</span>
                      <span className="flex items-center gap-1">
                        <MapPin className="w-3 h-3" />
                        {story.location}
                      </span>
                    </div>

                    <h4 className="font-editorial text-lg sm:text-xl font-bold text-slate-900 group-hover:text-[#0f3d59] transition-colors leading-snug">
                      {story.title}
                    </h4>

                    {story.subtitle && (
                      <p className="mt-2 text-xs sm:text-sm text-slate-600 line-clamp-2 leading-relaxed">
                        {story.subtitle}
                      </p>
                    )}
                  </div>

                  <div className="mt-4 pt-3 border-t border-slate-200 flex items-center justify-between text-xs text-slate-500">
                    <span>{story.authorName}</span>
                    <span className="text-[#0f3d59] font-medium group-hover:underline">Ler notícia →</span>
                  </div>
                </div>
              ))}

              {/* Editorial Commitment Box */}
              <div className="p-6 bg-emerald-950 text-emerald-100 rounded-2xl border border-emerald-900 flex flex-col justify-between">
                <div>
                  <span className="text-[11px] font-sans uppercase tracking-widest text-emerald-300 font-semibold">
                    Compromisso da Redação
                  </span>
                  <h4 className="font-editorial text-lg font-bold text-white mt-1">
                    “A notícia nasce na comunidade.”
                  </h4>
                  <p className="text-xs text-emerald-200 mt-2 leading-relaxed">
                    Todas as matérias são produzidas em parceria com quem vive a realidade do Amazonas. Sem sensacionalismo, com foco em cidadania e soluções comunitárias.
                  </p>
                </div>
                <div className="mt-4 pt-3 border-t border-emerald-900 text-[11px] text-emerald-300">
                  Coordenação Editorial: Kássio Cardoso
                </div>
              </div>
            </div>
          </div>
        ) : (
          /* High-Fidelity Standby State when clean: ensures #destaques always exists and operates flawlessly */
          <div className="bg-slate-50 border border-slate-200 rounded-2xl p-8 sm:p-12 text-center max-w-3xl mx-auto shadow-2xs">
            <div className="w-14 h-14 bg-amber-100 text-amber-700 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Newspaper className="w-7 h-7" />
            </div>
            <h3 className="font-editorial text-2xl font-bold text-slate-900">
              Plantão Editorial de Destaques
            </h3>
            <p className="mt-2 text-sm text-slate-600 leading-relaxed max-w-xl mx-auto">
              Nossa equipe de repórteres e correspondentes nos municípios do Amazonas está apurando reportagens especiais e checando informações comunitárias em tempo real.
            </p>
            <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
              <button
                onClick={() => scrollTo('comunidade-participa')}
                className="flex items-center gap-2 px-5 py-2.5 text-xs sm:text-sm font-bold text-slate-950 bg-amber-400 hover:bg-amber-300 rounded-lg transition-all shadow-xs cursor-pointer"
              >
                <MessageSquareShare className="w-4 h-4" />
                <span>Enviar Sugestão de Pauta / Denúncia</span>
              </button>
              <button
                onClick={() => scrollTo('ultimas-noticias')}
                className="flex items-center gap-2 px-4 py-2.5 text-xs sm:text-sm font-semibold text-slate-700 bg-white hover:bg-slate-100 border border-slate-200 rounded-lg transition-colors cursor-pointer"
              >
                <span>Ver Últimas Notícias</span>
              </button>
            </div>
            <div className="mt-8 pt-4 border-t border-slate-200/80 text-[11px] text-slate-400 flex items-center justify-center gap-4">
              <span>Apresentação & Direção: <strong>Kássio Cardoso</strong></span>
              <span>·</span>
              <span>Manaus & Calhas Fluviais do Amazonas</span>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};
