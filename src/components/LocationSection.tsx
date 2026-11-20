import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { Article } from '../types';
import { MapPin, Waves, Building2, Trees, ArrowRight } from 'lucide-react';

interface LocationSectionProps {
  onSelectArticle: (article: Article) => void;
}

export const LocationSection: React.FC<LocationSectionProps> = ({ onSelectArticle }) => {
  const { locations, articles, config } = useStore();
  const [selectedLoc, setSelectedLoc] = useState<string>(locations[0] || 'Manaus (Capital)');

  const locArticles = articles.filter(
    (a) => a.status === 'published' && a.location.toLowerCase().includes(selectedLoc.toLowerCase().split(' ')[0])
  );

  return (
    <section id="localidades" className="py-16 sm:py-20 bg-slate-50 border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="max-w-3xl mb-10">
          <div className="flex items-center gap-2 text-xs font-semibold text-emerald-800 uppercase tracking-widest font-sans">
            <MapPin className="w-4 h-4 text-emerald-700" />
            <span>{config.structureTexts?.locationsEyebrow || 'Território Amazônico'}</span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-bold font-editorial text-slate-900 mt-1">
            {config.structureTexts?.locationsSectionTitle || 'Notícias por Localidade'}
          </h2>
          <p className="text-sm sm:text-base text-slate-600 mt-2 font-sans">
            {config.structureTexts?.locationsSectionSubtitle || 'Do centro de Manaus às comunidades mais distantes nos leitos dos rios Solimões e Negro.'}
          </p>
        </div>

        {/* Territory Badges / Filter Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2 mb-8">
          {locations.slice(0, 12).map((loc) => {
            const isSelected = selectedLoc === loc;
            const count = articles.filter(
              (a) => a.status === 'published' && a.location.toLowerCase().includes(loc.toLowerCase().split(' ')[0])
            ).length;

            return (
              <button
                key={loc}
                onClick={() => setSelectedLoc(loc)}
                className={`p-3 text-left rounded-xl border transition-all cursor-pointer flex flex-col justify-between ${
                  isSelected
                    ? 'bg-[#0f3d59] border-[#0f3d59] text-white shadow-xs'
                    : 'bg-white border-slate-200 text-slate-800 hover:border-slate-300 hover:bg-slate-100'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  {loc.includes('Rio') || loc.includes('Ribeirinh') ? (
                    <Waves className={`w-3.5 h-3.5 ${isSelected ? 'text-amber-300' : 'text-blue-600'}`} />
                  ) : loc.includes('Manaus') ? (
                    <Building2 className={`w-3.5 h-3.5 ${isSelected ? 'text-amber-300' : 'text-slate-600'}`} />
                  ) : (
                    <Trees className={`w-3.5 h-3.5 ${isSelected ? 'text-amber-300' : 'text-emerald-600'}`} />
                  )}
                  <span
                    className={`text-[10px] font-sans px-1.5 py-0.2 rounded-full ${
                      isSelected ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-500'
                    }`}
                  >
                    {count}
                  </span>
                </div>
                <span className="text-xs font-semibold font-sans line-clamp-1">{loc}</span>
              </button>
            );
          })}
        </div>

        {/* Active Location Articles */}
        <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8">
          <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-100">
            <div>
              <span className="text-xs font-semibold text-emerald-800 uppercase tracking-wider font-sans">
                Cobertura Ativa
              </span>
              <h3 className="text-xl font-bold font-editorial text-slate-900">
                {selectedLoc}
              </h3>
            </div>
            <span className="text-xs text-slate-500 font-sans">
              {locArticles.length} {locArticles.length === 1 ? 'matéria publicada' : 'matérias publicadas'}
            </span>
          </div>

          {locArticles.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {locArticles.map((art) => (
                <div
                  key={art.id}
                  onClick={() => onSelectArticle(art)}
                  className="p-5 border border-slate-200 rounded-xl hover:border-slate-300 hover:shadow-xs transition-all cursor-pointer flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center gap-1.5 text-xs text-slate-500 mb-2">
                      <span className="font-semibold text-emerald-800">{art.category}</span>
                      <span>·</span>
                      <span>{art.authorName}</span>
                    </div>
                    <h4 className="font-editorial text-base font-bold text-slate-900 line-clamp-2 hover:text-[#0f3d59]">
                      {art.title}
                    </h4>
                  </div>
                  <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-[#0f3d59] font-medium">
                    <span>Acessar notícia</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-10 max-w-md mx-auto">
              <MapPin className="w-8 h-8 text-slate-300 mx-auto mb-2" />
              <p className="text-sm text-slate-600 font-sans">
                Ainda não há reportagens publicadas para <strong className="text-slate-800">{selectedLoc}</strong>.
              </p>
              <p className="text-xs text-slate-500 mt-1">
                Você mora ou trabalha nesta localidade? Envie uma sugestão de pauta para a redação apurar!
              </p>
              <a
                href="#comunidade-participa"
                className="mt-4 inline-block px-4 py-2 text-xs font-semibold text-white bg-[#0f3d59] rounded-lg hover:bg-[#0a2540] transition-colors"
              >
                Enviar relato desta localidade
              </a>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};
