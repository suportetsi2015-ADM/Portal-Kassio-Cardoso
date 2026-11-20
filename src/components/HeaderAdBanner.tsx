import React from 'react';
import { useStore } from '../context/StoreContext';
import { ExternalLink } from 'lucide-react';

export const HeaderAdBanner: React.FC = () => {
  const { advertisements, recordAdClick, config } = useStore();

  if (!config.sectionsVisible.advertisements) return null;

  const activeHeaderAd = advertisements.find(
    (a) => a.position === 'header' && a.status === 'active'
  );

  if (!activeHeaderAd) return null;

  const handleClick = () => {
    recordAdClick(activeHeaderAd.id);
    if (activeHeaderAd.targetUrl && activeHeaderAd.targetUrl !== '#') {
      window.open(activeHeaderAd.targetUrl, '_blank', 'noopener,noreferrer');
    }
  };

  return (
    <div className="bg-slate-900 border-b border-slate-800 text-white py-2 px-4">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <span className="text-[10px] font-sans font-bold bg-amber-400 text-slate-950 px-2 py-0.5 rounded uppercase tracking-wider">
            Publicidade
          </span>
          <span className="text-xs text-slate-300 font-medium line-clamp-1">
            {activeHeaderAd.advertiserName}:
          </span>
          <span className="text-xs text-white font-semibold line-clamp-1">
            {activeHeaderAd.title}
          </span>
        </div>

        <button
          onClick={handleClick}
          className="text-xs text-amber-300 hover:text-amber-200 font-semibold flex items-center gap-1.5 cursor-pointer shrink-0 hover:underline"
        >
          <span>Conhecer parceiro</span>
          <ExternalLink className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};
