import React, { useState, useMemo } from 'react';
import { useStore } from '../context/StoreContext';
import { PublicUtilityItem } from '../types';
import {
  PhoneCall,
  Shield,
  Flame,
  HeartPulse,
  Waves,
  Users,
  Search,
  MapPin,
  Clock,
  Phone,
  MessageCircle,
  AlertTriangle,
  Building,
} from 'lucide-react';
import { INITIAL_PUBLIC_UTILITY } from '../data/initialData';

export const PublicUtilitySection: React.FC = () => {
  const { config } = useStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const utilityConfig = config.publicUtility || {
    title: 'Utilidade Pública & Telefones Úteis do Amazonas',
    subtitle: 'Contatos oficiais de emergência, hospitais, bombeiros, polícia e órgãos de assistência ao cidadão.',
    items: INITIAL_PUBLIC_UTILITY,
  };

  const items = Array.isArray(utilityConfig.items) ? utilityConfig.items : INITIAL_PUBLIC_UTILITY;

  const categories = [
    'all',
    'Segurança & Polícia',
    'Emergência & Resgate',
    'Saúde & SOS',
    'Defesa Civil & Rios',
    'Direitos & Proteção',
    'Serviços ao Cidadão',
  ];

  const filteredItems = useMemo(() => {
    return items
      .filter((item) => {
        const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory;
        const matchesSearch =
          item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          item.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
          item.phone.toLowerCase().includes(searchTerm.toLowerCase()) ||
          item.address.toLowerCase().includes(searchTerm.toLowerCase());
        return matchesCategory && matchesSearch;
      })
      .sort((a, b) => {
        // Emergency items first
        if (a.isEmergency && !b.isEmergency) return -1;
        if (!a.isEmergency && b.isEmergency) return 1;
        return a.order - b.order;
      });
  }, [items, selectedCategory, searchTerm]);

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'Segurança & Polícia':
        return Shield;
      case 'Emergência & Resgate':
        return Flame;
      case 'Saúde & SOS':
        return HeartPulse;
      case 'Defesa Civil & Rios':
        return Waves;
      case 'Direitos & Proteção':
        return Users;
      default:
        return Building;
    }
  };

  return (
    <section id="utilidade-publica" className="py-16 sm:py-20 bg-slate-100 border-b border-slate-200 scroll-mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-8 border-b border-slate-200">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold text-red-700 uppercase tracking-widest font-sans">
              <PhoneCall className="w-4 h-4 text-red-600 animate-pulse" />
              <span>{config.structureTexts?.publicUtilityEyebrow || 'Serviço Comunitário e Cidadania'}</span>
            </div>
            <h2 className="text-2xl sm:text-4xl font-bold font-editorial text-slate-900 mt-1">
              {utilityConfig.title || config.structureTexts?.publicUtilitySectionTitle || 'Utilidade Pública & Emergências do Amazonas'}
            </h2>
            <p className="text-sm text-slate-600 mt-1.5 max-w-2xl font-sans">
              {utilityConfig.subtitle || config.structureTexts?.publicUtilitySectionSubtitle ||
                'Telefones úteis, endereços, canais de atendimento e WhatsApp dos órgãos essenciais de apoio à população e à redação de reportagem local.'}
            </p>
          </div>

          {/* Quick Search */}
          <div className="w-full md:w-80">
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Buscar órgão, telefone, hospital..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-4 py-2.5 text-xs bg-white border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#0f3d59] shadow-2xs"
              />
            </div>
          </div>
        </div>

        {/* Category Filter Pills */}
        <div className="flex items-center gap-2 overflow-x-auto py-4 scrollbar-none no-scrollbar">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3.5 py-1.5 text-xs font-semibold rounded-lg whitespace-nowrap transition-colors cursor-pointer shrink-0 ${
                selectedCategory === cat
                  ? 'bg-[#0f3d59] text-white shadow-xs'
                  : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-200'
              }`}
            >
              {cat === 'all' ? `Todos os Órgãos (${items.length})` : cat}
            </button>
          ))}
        </div>

        {/* Emergency Fast Banner */}
        <div className="mb-6 p-4 bg-red-600 text-white rounded-2xl flex flex-wrap items-center justify-between gap-4 shadow-md">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-white/20 rounded-xl shrink-0">
              <AlertTriangle className="w-6 h-6 text-white" />
            </div>
            <div>
              <span className="text-xs uppercase font-bold tracking-wider text-red-200">
                {config.structureTexts?.publicUtilityEmergencyTitle || 'Disque Rápido Nacional e Estadual'}
              </span>
              <h4 className="text-sm sm:text-base font-bold font-editorial">
                {config.structureTexts?.publicUtilityEmergencySub || 'Polícia: 190 · Bombeiros: 193 · SAMU: 192 · Defesa Civil: 199 · Mulher: 180 · Disque Denúncia: 181'}
              </h4>
            </div>
          </div>
          <span className="text-[11px] font-sans bg-black/30 px-3 py-1 rounded-full text-red-100 font-medium">
            Ligações Gratuitas 24 Horas
          </span>
        </div>

        {/* Directory Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredItems.map((item) => {
            const Icon = getCategoryIcon(item.category);
            const cleanPhone = item.phone.replace(/\D/g, '');
            const cleanWhatsapp = item.whatsapp ? item.whatsapp.replace(/\D/g, '') : null;

            return (
              <div
                key={item.id}
                className={`bg-white rounded-2xl border p-5 sm:p-6 transition-all hover:shadow-md flex flex-col justify-between ${
                  item.isEmergency ? 'border-red-200 shadow-2xs ring-1 ring-red-100' : 'border-slate-200'
                }`}
              >
                <div>
                  {/* Category & Badge */}
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <span className="flex items-center gap-1.5 text-xs font-bold text-slate-700">
                      <Icon className={`w-3.5 h-3.5 ${item.isEmergency ? 'text-red-600' : 'text-[#0f3d59]'}`} />
                      <span>{item.category}</span>
                    </span>

                    {item.isEmergency && (
                      <span className="bg-red-100 text-red-800 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">
                        Emergência 24h
                      </span>
                    )}
                  </div>

                  {/* Name */}
                  <h3 className="font-editorial text-lg sm:text-xl font-bold text-slate-900 leading-snug">
                    {item.name}
                  </h3>

                  {/* Description */}
                  <p className="mt-2 text-xs text-slate-600 font-sans leading-relaxed line-clamp-3">
                    {item.description}
                  </p>

                  {/* Hours & Address */}
                  <div className="mt-4 pt-3 border-t border-slate-100 space-y-2 text-xs text-slate-500 font-sans">
                    <div className="flex items-start gap-2">
                      <Clock className="w-3.5 h-3.5 text-slate-400 shrink-0 mt-0.5" />
                      <span className="text-slate-700 font-medium">{item.hours}</span>
                    </div>

                    <div className="flex items-start gap-2">
                      <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0 mt-0.5" />
                      <span className="line-clamp-2">{item.address}</span>
                    </div>
                  </div>
                </div>

                {/* Call & WhatsApp Actions */}
                <div className="mt-5 pt-4 border-t border-slate-100 flex items-center gap-2">
                  <a
                    href={`tel:${cleanPhone}`}
                    className={`flex-1 flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl text-xs font-bold transition-colors shadow-2xs ${
                      item.isEmergency
                        ? 'bg-red-600 hover:bg-red-700 text-white'
                        : 'bg-[#0f3d59] hover:bg-[#0a2540] text-white'
                    }`}
                  >
                    <Phone className="w-3.5 h-3.5" />
                    <span>Ligar ({item.phone})</span>
                  </a>

                  {cleanWhatsapp && (
                    <a
                      href={`https://wa.me/${cleanWhatsapp.startsWith('55') ? cleanWhatsapp : `55${cleanWhatsapp}`}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 bg-[#25D366] hover:bg-[#20ba5a] text-white rounded-xl transition-colors shadow-2xs flex items-center justify-center shrink-0"
                      title="Chamar no WhatsApp"
                      aria-label="Chamar no WhatsApp"
                    >
                      <MessageCircle className="w-4 h-4" />
                    </a>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {filteredItems.length === 0 && (
          <div className="bg-white rounded-2xl border border-dashed border-slate-300 p-12 text-center max-w-md mx-auto my-6">
            <PhoneCall className="w-10 h-10 text-slate-300 mx-auto mb-2" />
            <h4 className="font-editorial text-lg font-bold text-slate-800">
              Nenhum contato encontrado
            </h4>
            <p className="text-xs text-slate-500 mt-1">
              Tente pesquisar por outros termos ou limpe o filtro de categorias.
            </p>
          </div>
        )}
      </div>
    </section>
  );
};
