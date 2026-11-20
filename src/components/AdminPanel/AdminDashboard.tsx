import React from 'react';
import { useStore } from '../../context/StoreContext';
import {
  LayoutDashboard,
  Newspaper,
  MessageSquare,
  Users,
  Megaphone,
  FileSpreadsheet,
  FileText,
  Sparkles,
  ShieldAlert,
  ArrowRight,
  TrendingUp,
  PhoneCall,
  AlertTriangle,
  Share2,
  UserCheck,
} from 'lucide-react';

interface AdminDashboardProps {
  onNavigateTab: (tab: any) => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ onNavigateTab }) => {
  const {
    articles,
    communityStories,
    users,
    advertisements,
    auditLogs,
    config,
  } = useStore();

  const pendingArticles = articles.filter((a) => a.status === 'pending_review');
  const publishedArticles = articles.filter((a) => a.status === 'published');
  const totalViews = articles.reduce((acc, a) => acc + (a.viewsCount || 0), 0);
  const activeAds = advertisements.filter((ad) => ad.status === 'active');
  const totalClicks = advertisements.reduce((acc, ad) => acc + (ad.clicks || 0), 0);

  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-[#0f3d59] to-[#0a2540] text-white p-6 rounded-2xl shadow-md flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <span className="text-[10px] font-sans font-bold uppercase tracking-widest text-amber-300 block mb-1">
            Painel de Controle Central · Amazonas
          </span>
          <h3 className="font-editorial text-2xl sm:text-3xl font-bold">
            Gestão Integral — {config.siteName}
          </h3>
          <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-xl">
            Ambiente exclusivo do Administrador com controle de 100% da estrutura, matérias, denúncias populares, anunciantes e relatórios.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2 self-start md:self-auto">
          <button
            onClick={() => onNavigateTab('reports')}
            className="px-4 py-2 bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-xs rounded-lg transition-colors flex items-center gap-1.5 shadow-xs cursor-pointer"
          >
            <FileSpreadsheet className="w-4 h-4" />
            <span>Emitir Relatórios (.XLSX / PDF)</span>
          </button>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Notícias */}
        <div
          onClick={() => onNavigateTab('editorial')}
          className="bg-white p-4.5 rounded-xl border border-slate-200 shadow-2xs hover:border-[#0f3d59] transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between text-slate-400 group-hover:text-[#0f3d59]">
            <span className="text-xs font-semibold text-slate-600">Matérias</span>
            <Newspaper className="w-5 h-5 text-blue-800" />
          </div>
          <div className="mt-2 text-2xl font-bold font-editorial text-slate-900">
            {publishedArticles.length}
          </div>
          <div className="mt-1 flex items-center justify-between text-[11px] text-slate-500">
            <span>{pendingArticles.length} pendentes</span>
            <span className="text-emerald-700 font-semibold">{totalViews} leituras</span>
          </div>
        </div>

        {/* Denúncias */}
        <div
          onClick={() => onNavigateTab('stories')}
          className="bg-white p-4.5 rounded-xl border border-slate-200 shadow-2xs hover:border-amber-400 transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between text-slate-400 group-hover:text-amber-600">
            <span className="text-xs font-semibold text-slate-600">Denúncias da População</span>
            <MessageSquare className="w-5 h-5 text-amber-600" />
          </div>
          <div className="mt-2 text-2xl font-bold font-editorial text-slate-900">
            {communityStories.length}
          </div>
          <div className="mt-1 flex items-center justify-between text-[11px] text-slate-500">
            <span>{communityStories.filter((s) => s.status === 'received').length} novas</span>
            <span className="text-amber-700 font-semibold">Canal Cidadão</span>
          </div>
        </div>

        {/* Banners */}
        <div
          onClick={() => onNavigateTab('ads')}
          className="bg-white p-4.5 rounded-xl border border-slate-200 shadow-2xs hover:border-emerald-500 transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between text-slate-400 group-hover:text-emerald-700">
            <span className="text-xs font-semibold text-slate-600">Publicidade & Banners</span>
            <Megaphone className="w-5 h-5 text-emerald-700" />
          </div>
          <div className="mt-2 text-2xl font-bold font-editorial text-slate-900">
            {activeAds.length}
          </div>
          <div className="mt-1 flex items-center justify-between text-[11px] text-slate-500">
            <span>{advertisements.length} cadastradas</span>
            <span className="text-emerald-700 font-semibold">{totalClicks} cliques</span>
          </div>
        </div>

        {/* Usuários */}
        <div
          onClick={() => onNavigateTab('users')}
          className="bg-white p-4.5 rounded-xl border border-slate-200 shadow-2xs hover:border-[#0f3d59] transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between text-slate-400 group-hover:text-[#0f3d59]">
            <span className="text-xs font-semibold text-slate-600">Usuários & Repórteres</span>
            <Users className="w-5 h-5 text-slate-700" />
          </div>
          <div className="mt-2 text-2xl font-bold font-editorial text-slate-900">
            {users.length}
          </div>
          <div className="mt-1 flex items-center justify-between text-[11px] text-slate-500">
            <span>{users.filter((u) => u.role === 'admin').length} admins</span>
            <span className="text-blue-800 font-semibold">{users.filter((u) => u.role === 'reporter').length} repórteres</span>
          </div>
        </div>
      </div>

      {/* Quick Shortcuts: 4 Essential Autonomous Areas requested by Admin */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* a) & b) Sobre & Quem Somos */}
        <button
          onClick={() => onNavigateTab('about')}
          className="p-4 bg-white border border-slate-200 rounded-xl text-left hover:border-emerald-600 transition-all cursor-pointer shadow-2xs group flex items-center justify-between"
        >
          <div>
            <div className="flex items-center gap-1.5 mb-1">
              <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-1.5 py-0.2 rounded uppercase">
                100% Autonomia
              </span>
            </div>
            <h4 className="font-bold text-xs text-slate-900 group-hover:text-emerald-800 flex items-center gap-1.5">
              <UserCheck className="w-3.5 h-3.5 text-emerald-700" />
              <span>Sobre & Quem Somos</span>
            </h4>
            <p className="text-[11px] text-slate-500 mt-0.5">
              Inserir, editar, alterar e excluir textos, pilares, fotos e biografia.
            </p>
          </div>
          <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-emerald-800 shrink-0" />
        </button>

        {/* c) & d) Denúncia Comunitária & O que Denunciar */}
        <button
          onClick={() => onNavigateTab('denuncia_manager')}
          className="p-4 bg-white border border-slate-200 rounded-xl text-left hover:border-amber-600 transition-all cursor-pointer shadow-2xs group flex items-center justify-between"
        >
          <div>
            <div className="flex items-center gap-1.5 mb-1">
              <span className="text-[10px] bg-amber-100 text-amber-800 font-bold px-1.5 py-0.2 rounded uppercase">
                Voz da Comunidade
              </span>
            </div>
            <h4 className="font-bold text-xs text-slate-900 group-hover:text-amber-800 flex items-center gap-1.5">
              <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
              <span>Denúncia & O que Denunciar</span>
            </h4>
            <p className="text-[11px] text-slate-500 mt-0.5">
              Formulário, garantias de sigilo e lista de tópicos denunciáveis.
            </p>
          </div>
          <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-amber-800 shrink-0" />
        </button>

        {/* e) Utilidade Pública (Substitui Classificados) */}
        <button
          onClick={() => onNavigateTab('public_utility')}
          className="p-4 bg-white border border-slate-200 rounded-xl text-left hover:border-red-600 transition-all cursor-pointer shadow-2xs group flex items-center justify-between"
        >
          <div>
            <div className="flex items-center gap-1.5 mb-1">
              <span className="text-[10px] bg-red-100 text-red-800 font-bold px-1.5 py-0.2 rounded uppercase">
                Substitui Classificados
              </span>
            </div>
            <h4 className="font-bold text-xs text-slate-900 group-hover:text-red-800 flex items-center gap-1.5">
              <PhoneCall className="w-3.5 h-3.5 text-red-600" />
              <span>Utilidade Pública & SOS</span>
            </h4>
            <p className="text-[11px] text-slate-500 mt-0.5">
              Polícia, Bombeiros, SAMU, Defesa Civil, telefones e WhatsApp.
            </p>
          </div>
          <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-red-800 shrink-0" />
        </button>

        {/* f) Redes Sociais & Compartilhamento Pronto */}
        <button
          onClick={() => onNavigateTab('footer_social')}
          className="p-4 bg-white border border-slate-200 rounded-xl text-left hover:border-blue-600 transition-all cursor-pointer shadow-2xs group flex items-center justify-between"
        >
          <div>
            <div className="flex items-center gap-1.5 mb-1">
              <span className="text-[10px] bg-blue-100 text-blue-800 font-bold px-1.5 py-0.2 rounded uppercase">
                Facebook & Instagram
              </span>
            </div>
            <h4 className="font-bold text-xs text-slate-900 group-hover:text-blue-900 flex items-center gap-1.5">
              <Share2 className="w-3.5 h-3.5 text-blue-600" />
              <span>Redes & Post Pronto</span>
            </h4>
            <p className="text-[11px] text-slate-500 mt-0.5">
              Opção para compartilhamento de notícias já montadas nas redes.
            </p>
          </div>
          <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-blue-900 shrink-0" />
        </button>
      </div>

      {/* Recent Activity / Audit Log Preview */}
      <div className="bg-white p-5 border border-slate-200 rounded-xl space-y-3 shadow-2xs">
        <div className="flex items-center justify-between">
          <h4 className="font-editorial text-base font-bold text-slate-900 flex items-center gap-2">
            <ShieldAlert className="w-4 h-4 text-[#0f3d59]" />
            <span>Últimas Ações Registradas no Portal</span>
          </h4>
          <button
            onClick={() => onNavigateTab('security')}
            className="text-xs text-[#0f3d59] font-semibold hover:underline"
          >
            Ver todos ({auditLogs.length})
          </button>
        </div>

        <div className="space-y-2">
          {auditLogs.slice(0, 5).map((log) => (
            <div
              key={log.id}
              className="p-2.5 bg-slate-50 rounded-lg border border-slate-100 text-xs flex items-center justify-between gap-2"
            >
              <div className="flex items-center gap-2">
                <span className="font-mono text-[10px] font-bold bg-blue-100 text-blue-900 px-1.5 py-0.5 rounded">
                  {log.action}
                </span>
                <span className="text-slate-700">{log.details}</span>
              </div>
              <span className="text-[10px] text-slate-400 font-mono shrink-0">
                {new Date(log.timestamp).toLocaleTimeString('pt-BR')}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
