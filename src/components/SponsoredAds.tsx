import React from 'react';
import { useStore } from '../context/StoreContext';
import { Megaphone, ExternalLink, ShieldAlert } from 'lucide-react';

interface SponsoredAdsProps {
  onOpenAdProposal?: () => void;
}

export const SponsoredAds: React.FC<SponsoredAdsProps> = ({ onOpenAdProposal }) => {
  const { advertisements, recordAdClick, config } = useStore();

  const activeAds = advertisements.filter((ad) => ad.status === 'active');

  const handleAdClick = (id: string, url: string) => {
    recordAdClick(id);
    if (url && url !== '#') {
      window.open(url, '_blank', 'noopener,noreferrer');
    }
  };

  return (
    <section id="anuncios" className="py-14 bg-slate-100 border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header with Strict Advertising Label */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200 mb-8">
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-sans font-bold tracking-widest uppercase bg-slate-200 text-slate-700 px-2 py-0.5 rounded-xs">
              {config.structureTexts?.adsEyebrow || 'Conteúdo Publicitário'}
            </span>
            <span className="text-xs text-slate-500 font-sans hidden sm:inline">
              · {config.structureTexts?.adsSectionSubtitle || 'Espaços comerciais independentes da cobertura editorial'}
            </span>
          </div>

          <a
            href={`https://wa.me/5592981440022?text=${encodeURIComponent('Olá! Gostaria de informações para veicular um anúncio ou banner publicitário no portal COMUNIDADE EM AÇÃO.')}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs font-semibold text-[#0f3d59] hover:text-emerald-800 flex items-center gap-1.5 transition-colors"
          >
            <Megaphone className="w-3.5 h-3.5 text-amber-600" />
            <span>Anuncie sua marca ou comércio local (via WhatsApp)</span>
          </a>
        </div>

        {activeAds.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {activeAds.map((ad) => (
              <div
                key={ad.id}
                onClick={() => handleAdClick(ad.id, ad.targetUrl)}
                className="group bg-white rounded-xl border border-slate-200 p-5 shadow-2xs hover:shadow-md transition-all cursor-pointer flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between text-[11px] font-sans text-slate-400 mb-2">
                    <span className="font-semibold text-amber-700 uppercase tracking-wider">
                      Patrocinado
                    </span>
                    <span>{ad.advertiserName}</span>
                  </div>

                  {ad.bannerUrl && (
                    <div className="aspect-16/9 rounded-lg overflow-hidden mb-3 bg-slate-100">
                      <img
                        src={ad.bannerUrl}
                        alt={ad.title}
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-300"
                      />
                    </div>
                  )}

                  <h4 className="font-editorial text-base sm:text-lg font-bold text-slate-900 leading-snug group-hover:text-[#0f3d59] transition-colors">
                    {ad.title}
                  </h4>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500 font-sans">
                  <span>Saiba mais no parceiro</span>
                  <ExternalLink className="w-3.5 h-3.5 text-[#0f3d59]" />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-2xl border border-slate-200 p-8 text-center max-w-xl mx-auto">
            <Megaphone className="w-8 h-8 text-amber-500 mx-auto mb-2" />
            <h3 className="font-editorial text-lg font-bold text-slate-900">
              Espaço Comercial Disponível para Apoiadores Locais
            </h3>
            <p className="mt-1 text-xs text-slate-600 font-sans leading-relaxed">
              Divulgue seu comércio, serviços, cooperativas ou eventos no portal de maior proximidade com os bairros e cidades do Amazonas.
            </p>
            <button
              onClick={onOpenAdProposal}
              className="mt-4 px-4 py-2 text-xs font-semibold text-white bg-[#0f3d59] hover:bg-[#0a2540] rounded-lg transition-colors cursor-pointer"
            >
              Consultar Condições Comerciais
            </button>
          </div>
        )}

        {/* Editorial Independence Notice */}
        <div className="mt-6 flex items-center justify-center gap-2 text-[11px] text-slate-500 font-sans text-center">
          <ShieldAlert className="w-3.5 h-3.5 text-slate-400 shrink-0" />
          <span>
            Compromisso de Transparência: A publicidade financia a infraestrutura comunitária, mas jamais define investigações jornalísticas.
          </span>
        </div>
      </div>
    </section>
  );
};
