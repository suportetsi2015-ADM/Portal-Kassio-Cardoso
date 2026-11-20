import React from 'react';
import { useStore } from '../context/StoreContext';
import {
  Award,
  Compass,
  HeartHandshake,
  Shield,
  Users,
  MapPin,
  Newspaper,
  CheckCircle,
  Camera,
} from 'lucide-react';
import kassioPhoto from '../assets/images/kassio_cardoso_remaster_1791829104828.jpg';
import { INITIAL_ABOUT_CONFIG } from '../data/initialData';

// Map icon names to Lucide components
const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  Compass,
  HeartHandshake,
  Award,
  Shield,
  Users,
  MapPin,
  Newspaper,
  CheckCircle,
};

export const AboutSection: React.FC = () => {
  const { config } = useStore();
  const about = config.aboutConfig || INITIAL_ABOUT_CONFIG;

  const founderPhoto = about.founderPhotoUrl !== undefined ? about.founderPhotoUrl : kassioPhoto;
  const quoteLabel = about.institutionalQuoteLabel || config.structureTexts?.aboutQuoteLabel || 'Assinatura Institucional';
  const quoteText = about.institutionalQuoteText || config.structureTexts?.aboutQuoteText || config.tagline || 'A notícia nasce na comunidade.';
  const eyebrow = about.eyebrow || config.structureTexts?.aboutEyebrow || 'Jornalismo Comunitário';
  const title = about.title || config.structureTexts?.aboutSectionTitle || 'Um Portal Nascido das Águas e das Vozes do Amazonas';
  const paragraphs = Array.isArray(about.paragraphs) ? about.paragraphs : INITIAL_ABOUT_CONFIG.paragraphs;
  const pillars = Array.isArray(about.pillars) ? about.pillars : INITIAL_ABOUT_CONFIG.pillars;
  const additionalImages = Array.isArray(about.additionalImages) ? about.additionalImages : [];

  const [imageError, setImageError] = React.useState(false);

  React.useEffect(() => {
    setImageError(false);
  }, [founderPhoto]);

  return (
    <section id="sobre" className="py-20 bg-white border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          
          {/* Left Column: Portrait & Creator Badge */}
          <div className="lg:col-span-5 flex flex-col items-center sm:items-start">
            <div className="relative w-full max-w-sm aspect-square rounded-2xl overflow-hidden border border-slate-200 shadow-md bg-slate-100 flex items-center justify-center">
              {founderPhoto && !imageError ? (
                <img
                  src={founderPhoto}
                  alt={`${about.founderName || 'Kássio Cardoso'} - ${about.founderBadge || 'Idealizador do Projeto'}`}
                  referrerPolicy="no-referrer"
                  onError={() => {
                    // Se falhar e não for a foto nativa, registra erro sem resetar o estado
                    if (founderPhoto !== kassioPhoto) {
                      setImageError(true);
                    }
                  }}
                  className="w-full h-full object-cover object-top"
                />
              ) : (
                <div className="flex flex-col items-center justify-center text-slate-400 p-6 text-center">
                  <Users className="w-16 h-16 text-slate-300 mb-2" />
                  <span className="text-xs font-sans">
                    {imageError ? 'Imagem não pôde ser carregada' : 'Sem imagem cadastrada'}
                  </span>
                </div>
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent" />
              <div className="absolute bottom-4 left-4 right-4 text-white">
                <span className="text-[11px] font-sans uppercase tracking-widest text-emerald-400 font-semibold">
                  {about.founderBadge || 'Idealizador do Projeto'}
                </span>
                <h3 className="font-editorial text-xl font-bold">
                  {about.founderName || 'Kássio Cardoso'}
                </h3>
                <p className="text-xs text-slate-300 font-sans">
                  {about.founderRole || 'Jornalista Comunitário · Amazonas'}
                </p>
              </div>
            </div>

            {/* Institutional Tagline Box */}
            <div className="mt-4 p-4 bg-slate-50 border border-slate-200 rounded-xl w-full max-w-sm">
              <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block font-sans">
                {quoteLabel}
              </span>
              <p className="font-editorial text-lg font-bold text-[#0f3d59] mt-0.5">
                “{quoteText}”
              </p>
            </div>
          </div>

          {/* Right Column: Mission, Justified Text and Editorial Foundations */}
          <div className="lg:col-span-7">
            {eyebrow && (
              <div className="text-xs font-semibold text-emerald-800 uppercase tracking-widest font-sans mb-2">
                {eyebrow}
              </div>
            )}

            <h2 className="text-2xl sm:text-4xl font-bold font-editorial text-slate-900 leading-tight">
              {title}
            </h2>

            {/* Justified Paragraphs */}
            <div className="mt-4 space-y-3">
              {paragraphs.map((p, idx) => (
                <p
                  key={p.id || `para-${idx}`}
                  className={`${
                    idx === 0 ? 'text-base text-slate-700 font-medium' : 'text-sm text-slate-600'
                  } leading-relaxed font-sans text-justify`}
                  style={{ textAlign: 'justify', textJustify: 'inter-word' }}
                >
                  {p.text}
                </p>
              ))}
            </div>

            {/* Core Values / Editorial Pillars Grid */}
            {pillars.length > 0 && (
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-8 pt-6 border-t border-slate-100">
                {pillars.map((pillar) => {
                  const IconComponent = iconMap[pillar.iconName] || Award;
                  return (
                    <div
                      key={pillar.id}
                      className="p-4 bg-slate-50 rounded-xl border border-slate-100 transition-all hover:border-slate-200 hover:shadow-2xs"
                    >
                      <IconComponent className="w-5 h-5 text-[#0f3d59] mb-2" />
                      <h4 className="font-editorial font-bold text-sm text-slate-900">
                        {pillar.title}
                      </h4>
                      <p className="text-xs text-slate-600 mt-1">
                        {pillar.description}
                      </p>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Additional Images / Gallery / Claquete 4K if present */}
        {additionalImages.length > 0 && (
          <div className="mt-12 pt-8 border-t border-slate-200">
            <div className="flex items-center gap-2 mb-4">
              <Camera className="w-4 h-4 text-emerald-800" />
              <h3 className="font-editorial text-base font-bold text-slate-900">
                Registros Visuais & Acervo Comunitário
              </h3>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {additionalImages.map((img) => (
                <div
                  key={img.id}
                  className="bg-slate-50 border border-slate-200 rounded-xl overflow-hidden shadow-2xs group"
                >
                  <div className="aspect-video w-full overflow-hidden bg-slate-200">
                    <img
                      src={img.url}
                      alt={img.caption || 'Registro visual'}
                      className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-300"
                    />
                  </div>
                  {(img.caption || img.credit) && (
                    <div className="p-3 text-xs">
                      {img.caption && <p className="text-slate-700 font-medium">{img.caption}</p>}
                      {img.credit && <p className="text-slate-400 text-[11px] mt-0.5">Foto: {img.credit}</p>}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

      </div>
    </section>
  );
};
