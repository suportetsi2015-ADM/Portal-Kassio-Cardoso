import React, { useState, useRef } from 'react';
import { useStore } from '../context/StoreContext';
import { ArrowDown, MessageSquareShare, Megaphone, Sparkles, Clapperboard } from 'lucide-react';

interface HeroProps {
  onOpenAdModal?: () => void;
}

export const Hero: React.FC<HeroProps> = () => {
  const { config } = useStore();
  const [isClapping, setIsClapping] = useState(false);
  const [isStickUp, setIsStickUp] = useState(false);
  const [takeCount, setTakeCount] = useState(1);
  const audioContextRef = useRef<AudioContext | null>(null);

  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  // Realistic wooden clapper sound synthesis via Web Audio API
  const playRealisticClapperSound = () => {
    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioCtx) return;

      if (!audioContextRef.current) {
        audioContextRef.current = new AudioCtx();
      }
      const ctx = audioContextRef.current;
      if (ctx.state === 'suspended') {
        ctx.resume();
      }

      const now = ctx.currentTime;

      // 1. Sharp wooden slap transient (filtered noise burst)
      const bufferSize = Math.floor(ctx.sampleRate * 0.04);
      const noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const output = noiseBuffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        output[i] = (Math.random() * 2 - 1) * Math.exp(-i / (ctx.sampleRate * 0.007));
      }

      const whiteNoise = ctx.createBufferSource();
      whiteNoise.buffer = noiseBuffer;

      const bandpass = ctx.createBiquadFilter();
      bandpass.type = 'bandpass';
      bandpass.frequency.setValueAtTime(2400, now);
      bandpass.Q.setValueAtTime(2.0, now);

      const noiseGain = ctx.createGain();
      noiseGain.gain.setValueAtTime(0.9, now);
      noiseGain.gain.exponentialRampToValueAtTime(0.001, now + 0.035);

      whiteNoise.connect(bandpass);
      bandpass.connect(noiseGain);
      noiseGain.connect(ctx.destination);
      whiteNoise.start(now);

      // 2. Resonant wood body slap (decaying triangle wave ~360Hz)
      const osc1 = ctx.createOscillator();
      const gain1 = ctx.createGain();
      osc1.type = 'triangle';
      osc1.frequency.setValueAtTime(380, now);
      osc1.frequency.exponentialRampToValueAtTime(110, now + 0.06);

      gain1.gain.setValueAtTime(0.7, now);
      gain1.gain.exponentialRampToValueAtTime(0.001, now + 0.06);

      osc1.connect(gain1);
      gain1.connect(ctx.destination);
      osc1.start(now);
      osc1.stop(now + 0.07);

      // 3. Hollow wood impact thud (~140Hz decaying fast)
      const osc2 = ctx.createOscillator();
      const gain2 = ctx.createGain();
      osc2.type = 'sine';
      osc2.frequency.setValueAtTime(140, now);
      osc2.frequency.exponentialRampToValueAtTime(45, now + 0.08);

      gain2.gain.setValueAtTime(0.6, now);
      gain2.gain.exponentialRampToValueAtTime(0.001, now + 0.08);

      osc2.connect(gain2);
      gain2.connect(ctx.destination);
      osc2.start(now);
      osc2.stop(now + 0.09);
    } catch {
      // Audio fallback safe
    }
  };

  // Realistic clap action: opens stick, snaps shut violently, plays real wood clap sound
  const handleRealClap = () => {
    if (isClapping) return;

    // Swing arm open
    setIsStickUp(true);

    setTimeout(() => {
      // Slam down & play clap
      setIsStickUp(false);
      setIsClapping(true);
      playRealisticClapperSound();

      const nextTake = takeCount + 1;
      setTakeCount(nextTake);

      // Camera vibration reset
      setTimeout(() => {
        setIsClapping(false);
      }, 350);
    }, 120);
  };

  return (
    <section className="relative bg-slate-950 text-white overflow-hidden border-b border-slate-900">
      
      {/* 
        Signature Yellow/Black Broadcast Caution Strip (Reference: Borda da Claquete / Identidade Local)
      */}
      <div
        className="w-full h-3 opacity-90"
        style={{
          background: 'repeating-linear-gradient(45deg, #facc15, #facc15 14px, #000 14px, #000 28px)',
        }}
        title="Identidade Visual Comunidade em Ação"
      />

      {/* Main Container */}
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-20">
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
          
          {/* Left Column: Editorial Presentation & Identity */}
          <div className="lg:col-span-6 flex flex-col justify-center space-y-6">
            
            {/* Kicker / Manaus & Amazonas Marker */}
            <div className="flex flex-wrap items-center gap-2">
              <span className="bg-amber-400 text-slate-950 font-sans font-extrabold text-[11px] uppercase tracking-wider px-2.5 py-1 rounded-sm flex items-center gap-1.5 shadow-xs">
                <Clapperboard className="w-3.5 h-3.5" />
                <span>{config.structureTexts?.heroBadgeText || 'Manaus · Amazonas'}</span>
              </span>
              <span className="text-xs text-emerald-400 font-sans font-medium flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5" />
                <span>{config.structureTexts?.heroKicker || 'Identidade Oficial de Comunicação'}</span>
              </span>
            </div>

            {/* Main Brand Title & Clapperboard Slate Typography */}
            <div>
              <div className="font-editorial text-3xl sm:text-5xl lg:text-5xl font-bold tracking-tight text-white leading-[1.12]">
                {(config.structureTexts?.heroTitle || config.heroTitle) === 'COMUNIDADE EM AÇÃO' ? (
                  <>
                    COMUNIDADE <span className="text-red-500 font-extrabold underline decoration-amber-400 decoration-4 underline-offset-6">EM AÇÃO</span>
                  </>
                ) : (
                  <span>{config.structureTexts?.heroTitle || config.heroTitle || 'COMUNIDADE EM AÇÃO'}</span>
                )}
              </div>
              <p className="mt-3 text-lg sm:text-xl text-amber-300 font-editorial italic font-medium">
                {config.structureTexts?.heroPresenterLabel || 'Apresentação:'} <span className="text-white font-semibold not-italic">
                  {config.structureTexts?.heroPresenterName || (config.authorCredit ? config.authorCredit.replace('Projeto idealizado por ', '').split('—')[0].trim() : 'Kássio Cardoso')}
                </span>
              </p>
            </div>

            {/* Subtitle / Concept */}
            <p className="text-sm sm:text-base text-slate-300 font-sans leading-relaxed max-w-xl">
              {config.structureTexts?.heroSubtitle || config.heroSubtitle || 'Notícias locais, histórias reais, serviços e iniciativas que movimentam o Amazonas.'}
            </p>

            {/* Public Navigation Action Buttons (Button 'Bater a Claquete' completely removed as requested) */}
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <button
                onClick={() => scrollTo('ultimas-noticias')}
                className="flex items-center gap-2 px-5 py-2.5 text-xs sm:text-sm font-semibold text-white bg-[#0f3d59] hover:bg-[#0a2540] border border-blue-400/30 rounded-lg transition-all shadow-xs cursor-pointer"
              >
                <span>{config.structureTexts?.heroButtonExplore || 'Explorar Notícias'}</span>
                <ArrowDown className="w-4 h-4" />
              </button>

              <button
                onClick={() => scrollTo('comunidade-participa')}
                className="flex items-center gap-2 px-4 py-2.5 text-xs sm:text-sm font-semibold text-slate-200 hover:text-white bg-slate-900 hover:bg-slate-800 border border-slate-700 rounded-lg transition-all cursor-pointer"
              >
                <MessageSquareShare className="w-4 h-4 text-emerald-400" />
                <span>{config.structureTexts?.heroButtonReport || 'Minha Comunidade'}</span>
              </button>

              <button
                onClick={() => scrollTo('anuncios')}
                className="flex items-center gap-2 px-3 py-2.5 text-xs font-medium text-slate-400 hover:text-amber-300 transition-colors cursor-pointer"
              >
                <Megaphone className="w-3.5 h-3.5" />
                <span>{config.structureTexts?.heroButtonAd || 'Espaço Publicitário'}</span>
              </button>
            </div>

            {/* Institutional Tagline */}
            <div className="text-xs text-slate-400 font-sans pt-2 border-t border-slate-800/80 flex items-center justify-between">
              <span className="italic">“{config.tagline}”</span>
              <span className="text-emerald-400 font-medium">Jornalismo Comunitário · Amazonas</span>
            </div>
          </div>

          {/* Right Column: Ultra-Realistic 4K Interactive Claquete with REAL Clapper Arm Snap & Sound */}
          <div className="lg:col-span-6">
            <div
              onClick={handleRealClap}
              title="Clique para bater a claquete de verdade com som real!"
              className={`relative group rounded-2xl overflow-hidden border-2 border-slate-800 shadow-2xl bg-slate-900/90 transition-all duration-300 cursor-pointer select-none hover:border-amber-400/80 ${
                isClapping ? 'ring-4 ring-amber-400/70 scale-[0.99] translate-y-0.5' : ''
              }`}
            >
              
              {/* Top Realistic Hinged Clapper Stick (Animated Wood Chevrons) */}
              <div className="relative w-full h-10 bg-slate-950 overflow-hidden border-b-2 border-amber-400 z-20">
                <div
                  className="w-full h-full transition-transform duration-150 origin-bottom-left"
                  style={{
                    transform: isStickUp ? 'rotate(-16deg)' : 'rotate(0deg)',
                    background: 'repeating-linear-gradient(-45deg, #facc15 0, #facc15 22px, #0f172a 22px, #0f172a 44px)',
                  }}
                />
                {/* Hinge Pin */}
                <div className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 rounded-full bg-slate-800 border-2 border-amber-400 shadow-inner flex items-center justify-center">
                  <div className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                </div>
              </div>

              {/* Cinema Badge & Recording Counter */}
              <div className="absolute top-13 left-3 right-3 z-10 flex items-center justify-between text-xs text-white pointer-events-none">
                <span className="bg-slate-950/85 backdrop-blur-md px-3 py-1 rounded-full text-[11px] font-sans font-bold flex items-center gap-1.5 border border-white/10 shadow-sm">
                  <span className={`w-2 h-2 rounded-full ${isClapping ? 'bg-amber-400 scale-125' : 'bg-red-500 animate-pulse'}`} />
                  <span>{isClapping ? 'CLAP! EM GRAVAÇÃO' : 'PRODUÇÃO · 4K ULTRA-HD'}</span>
                </span>
                <span className="bg-black/80 backdrop-blur-md px-2.5 py-1 rounded-sm text-[10px] uppercase tracking-wider font-mono text-amber-300 border border-amber-400/30">
                  Cena 14B / Take {takeCount}
                </span>
              </div>

              {/* 4K Ultra-Realistic Claquete Image */}
              <div className="relative aspect-16/10 overflow-hidden bg-slate-950">
                <img
                  src={config.heroImageUrl}
                  alt="Claquete oficial 4K ultrarrealista do Comunidade em Ação gravando na comunidade ribeirinha do Amazonas"
                  className={`w-full h-full object-cover transition-transform duration-500 ${
                    isClapping ? 'scale-104 brightness-110' : 'group-hover:scale-102'
                  }`}
                  referrerPolicy="no-referrer"
                />
                
                {/* Subtle contrast gradient at the bottom */}
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/20 to-transparent pointer-events-none" />
                
                {/* Visual Description overlay & Click Cue */}
                <div className="absolute bottom-3 left-4 right-4 z-10 flex flex-col sm:flex-row sm:items-end justify-between gap-2 text-white pointer-events-none">
                  <div>
                    <span className="text-[10px] uppercase tracking-widest font-sans font-bold text-emerald-400 block">
                      Gravação nas Comunidades do Amazonas
                    </span>
                    <h4 className="font-editorial text-base sm:text-lg font-bold text-white">
                      A notícia gravada onde a vida acontece
                    </h4>
                  </div>
                  
                  {/* Visual Cue: Click on claquete to clap */}
                  <div className="bg-amber-400/90 group-hover:bg-amber-400 text-slate-950 px-3 py-1.5 rounded-lg text-xs font-bold transition-all shadow-md flex items-center gap-1.5">
                    <Clapperboard className={`w-3.5 h-3.5 transition-transform ${isStickUp ? '-rotate-20' : ''}`} />
                    <span>Toque para bater a claquete</span>
                  </div>
                </div>
              </div>

              {/* Slate Technical Information Bar */}
              <div className="p-3.5 bg-slate-900 border-t border-slate-800 text-[11px] font-sans text-slate-300 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span><strong>Dir:</strong> Coordenação Editorial</span>
                  <span className="text-slate-600">|</span>
                  <span><strong>Locação:</strong> Manaus & Calhas Fluviais</span>
                </div>
                <div className="text-amber-400 font-semibold font-mono text-[10px]">
                  REC ● 24FPS
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Yellow/Black Caution Strip */}
      <div
        className="w-full h-3 opacity-90"
        style={{
          background: 'repeating-linear-gradient(45deg, #facc15, #facc15 14px, #000 14px, #000 28px)',
        }}
      />
    </section>
  );
};
