import React from 'react';
import { useStore } from '../../context/StoreContext';
import { PortalConfig } from '../../types';
import {
  Layers,
  CheckCircle2,
  Eye,
  EyeOff,
  Flame,
  Clapperboard,
  Newspaper,
  Sparkles,
  BookOpen,
  MapPin,
  Briefcase,
  MessageSquare,
  Megaphone,
  User,
  Shield,
  HelpCircle,
  Video,
  PhoneCall,
} from 'lucide-react';

export const AdminOnePageStructure: React.FC = () => {
  const { config, toggleSectionVisibility } = useStore();

  const sectionsList: {
    key: keyof PortalConfig['sectionsVisible'];
    label: string;
    description: string;
    icon: React.ComponentType<{ className?: string }>;
  }[] = [
    {
      key: 'hero',
      label: 'Claquete / Capa Principal (Hero 4K)',
      description: 'Abertura com claquete de gravação do Amazonas, take interativo e chamada de ação.',
      icon: Clapperboard,
    },
    {
      key: 'latest',
      label: 'Últimas Notícias (Feed Cronológico)',
      description: 'Grade de notícias apuradas com busca textual e filtros de editorias.',
      icon: Newspaper,
    },
    {
      key: 'featured',
      label: 'Destaques Editoriais da Redação',
      description: 'Reportagens prioritárias em destaque visual na página principal.',
      icon: Sparkles,
    },
    {
      key: 'categories',
      label: 'Categorias & Editorias Oficiais',
      description: 'Navegação por editorias: Cidades, Polícia, Política, Esportes, etc.',
      icon: BookOpen,
    },
    {
      key: 'publicUtility',
      label: 'Utilidade Pública & Emergências do Amazonas',
      description: 'Telefones de emergência 24h, PMAM 190, Bombeiros 193, SAMU 192, Defesa Civil e órgãos locais.',
      icon: PhoneCall,
    },
    {
      key: 'locations',
      label: 'Territórios e Cobertura Municipal',
      description: 'Exploração por municípios do Amazonas, bairros de Manaus e comunidades.',
      icon: MapPin,
    },
    {
      key: 'communityParticipates',
      label: 'Canal de Denúncias da Comunidade',
      description: 'Formulário para a população enviar fotos, vídeos e relatos de pautas locais.',
      icon: MessageSquare,
    },
    {
      key: 'faq',
      label: 'Dúvidas Frequentes da Comunidade (FAQ)',
      description: 'Perguntas e respostas sobre checagem de fatos, apuração e denúncias comunitárias.',
      icon: HelpCircle,
    },
    {
      key: 'advertisements',
      label: 'Espaço Publicitário & Banners',
      description: 'Banners comerciais e institucionais com identificação patrocinada estrita.',
      icon: Megaphone,
    },
    {
      key: 'about',
      label: 'Sobre Kássio Cardoso & Missão do Portal',
      description: 'Apresentação do jornalista idealizador, ética e princípios editoriais.',
      icon: User,
    },
    {
      key: 'contactTransparency',
      label: 'Expediente, Contato & LGPD',
      description: 'Abas de transparência institucional, expediente e termos de privacidade.',
      icon: Shield,
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between pb-3 border-b border-slate-200">
        <div>
          <h3 className="font-editorial text-2xl font-bold text-slate-900 flex items-center gap-2">
            <Layers className="w-6 h-6 text-[#0f3d59]" />
            <span>Estrutura & Visibilidade da One Page</span>
          </h3>
          <p className="text-xs text-slate-500 font-sans">
            Ative ou oculte qualquer bloco e seção da página inicial com um único clique. Suas alterações são aplicadas instantaneamente.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {sectionsList.map((sec) => {
          const isVisible = config.sectionsVisible[sec.key];
          const Icon = sec.icon;

          return (
            <div
              key={sec.key}
              className={`p-4 rounded-xl border transition-all flex items-start justify-between gap-4 ${
                isVisible
                  ? 'bg-white border-slate-200 shadow-2xs hover:border-slate-300'
                  : 'bg-slate-50 border-dashed border-slate-300 opacity-60'
              }`}
            >
              <div className="flex items-start gap-3">
                <div
                  className={`p-2.5 rounded-lg shrink-0 ${
                    isVisible ? 'bg-blue-50 text-[#0f3d59]' : 'bg-slate-200 text-slate-500'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-sm text-slate-900">{sec.label}</h4>
                  <p className="text-xs text-slate-500 mt-0.5 leading-relaxed font-sans">
                    {sec.description}
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => toggleSectionVisibility(sec.key)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer shrink-0 flex items-center gap-1.5 ${
                  isVisible
                    ? 'bg-emerald-100 text-emerald-900 hover:bg-emerald-200'
                    : 'bg-slate-200 text-slate-700 hover:bg-slate-300'
                }`}
              >
                {isVisible ? (
                  <>
                    <Eye className="w-3.5 h-3.5 text-emerald-800" />
                    <span>Visível</span>
                  </>
                ) : (
                  <>
                    <EyeOff className="w-3.5 h-3.5 text-slate-500" />
                    <span>Oculto</span>
                  </>
                )}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
};
