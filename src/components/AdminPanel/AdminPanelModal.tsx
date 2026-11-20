import React, { useState } from 'react';
import { useStore } from '../../context/StoreContext';
import { Article, CommunityStory } from '../../types';
import {
  X,
  LayoutDashboard,
  Newspaper,
  MessageSquare,
  Megaphone,
  FileSpreadsheet,
  Users,
  Image,
  Share2,
  FileCode,
  Palette,
  MapPin,
  HelpCircle,
  UserCheck,
  Layers,
  Shield,
  ShieldAlert,
  Download,
  Upload,
  Maximize2,
  Minimize2,
  Link2,
  Copy,
  Check,
  PhoneCall,
  AlertTriangle,
  Send,
} from 'lucide-react';

import { AdminDashboard } from './AdminDashboard';
import { AdminEditorial } from './AdminEditorial';
import { AdminStories } from './AdminStories';
import { AdminAds } from './AdminAds';
import { AdminReports } from './AdminReports';
import { AdminUserManager } from './AdminUserManager';
import { AdminHeaderLogo } from './AdminHeaderLogo';
import { AdminFooterSocial } from './AdminFooterSocial';
import { AdminStructureTexts } from './AdminStructureTexts';
import { AdminColorPalette } from './AdminColorPalette';
import { AdminLocations } from './AdminLocations';
import { AdminFAQ } from './AdminFAQ';
import { AdminAboutEditor } from './AdminAboutEditor';
import { AdminDenunciaEditor } from './AdminDenunciaEditor';
import { AdminPublicUtility } from './AdminPublicUtility';
import { AdminOnePageStructure } from './AdminOnePageStructure';
import { AdminSecurity } from './AdminSecurity';
import { AdminContactTransparency } from './AdminContactTransparency';

export type AdminTab =
  | 'dashboard'
  | 'editorial'
  | 'stories'
  | 'ads'
  | 'reports'
  | 'users'
  | 'header_logo'
  | 'footer_social'
  | 'structure_texts'
  | 'palette'
  | 'locations'
  | 'faq'
  | 'about'
  | 'contact_transparency'
  | 'denuncia_manager'
  | 'public_utility'
  | 'onepage_sections'
  | 'security';

interface AdminPanelModalProps {
  isOpen: boolean;
  onClose: () => void;
  onPreviewArticle?: (article: Article) => void;
}

export const AdminPanelModal: React.FC<AdminPanelModalProps> = ({
  isOpen,
  onClose,
  onPreviewArticle,
}) => {
  const { currentUser, articles, communityStories, users, advertisements, config } = useStore();

  const [activeTab, setActiveTab] = useState<AdminTab>('dashboard');
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [prefilledStoryForArticle, setPrefilledStoryForArticle] = useState<{
    title: string;
    text: string;
    location: string;
  } | null>(null);

  const [linkCopied, setLinkCopied] = useState(false);

  if (!isOpen) return null;

  const handleCopyExternalLink = () => {
    const url = `${window.location.origin}${window.location.pathname}?painel=admin`;
    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(url);
      } else {
        const textarea = document.createElement('textarea');
        textarea.value = url;
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand('copy');
        document.body.removeChild(textarea);
      }
    } catch {
      // fallback
    }
    setLinkCopied(true);
    setTimeout(() => setLinkCopied(false), 2500);
  };

  // Pending articles count
  const pendingCount = articles.filter((a) => a.status === 'pending_review').length;
  // Received stories count
  const receivedStoriesCount = communityStories.filter((s) => s.status === 'received').length;

  const handleConvertToArticle = (story: CommunityStory) => {
    setPrefilledStoryForArticle({
      title: story.storyTitle,
      text: story.storyText,
      location: story.location,
    });
    setActiveTab('editorial');
  };

  const navItems: {
    id: AdminTab;
    label: string;
    icon: React.ComponentType<{ className?: string }>;
    badge?: number | string;
    badgeColor?: string;
  }[] = [
    { id: 'dashboard', label: 'Dashboard Geral', icon: LayoutDashboard },
    { id: 'about', label: 'Sobre & Quem Somos', icon: UserCheck, badge: '100% Editável', badgeColor: 'bg-emerald-600 text-white' },
    { id: 'contact_transparency', label: 'Expediente, Políticas e Contato', icon: Shield, badge: '100% Editável', badgeColor: 'bg-emerald-600 text-white' },
    { id: 'denuncia_manager', label: 'Denúncia Comunitária & O que Denunciar', icon: AlertTriangle, badge: 'Autonomia Total', badgeColor: 'bg-amber-600 text-white' },
    { id: 'public_utility', label: 'Utilidade Pública & Emergências', icon: PhoneCall, badge: `${config.publicUtility?.items?.length || 10} Órgãos`, badgeColor: 'bg-red-600 text-white' },
    { id: 'footer_social', label: 'Redes Sociais & Compartilhamento Pronto', icon: Share2, badge: 'Face / Insta', badgeColor: 'bg-blue-600 text-white' },
    { id: 'editorial', label: 'Editor de Matérias', icon: Newspaper, badge: articles.length, badgeColor: 'bg-slate-700 text-white' },
    {
      id: 'stories',
      label: 'Fila de Denúncias Recebidas',
      icon: MessageSquare,
      badge: receivedStoriesCount > 0 ? receivedStoriesCount : undefined,
      badgeColor: 'bg-red-500 text-white',
    },
    { id: 'structure_texts', label: 'Textos da Estrutura (One Page)', icon: FileCode },
    { id: 'onepage_sections', label: 'Estrutura & Seções One Page', icon: Layers },
    { id: 'header_logo', label: 'Logo & Cabeçalho', icon: Image },
    { id: 'palette', label: 'Paleta de Cores (One Page)', icon: Palette },
    { id: 'locations', label: 'Localidades do Amazonas', icon: MapPin },
    { id: 'faq', label: 'FAQ (Dúvidas Frequentes)', icon: HelpCircle },
    { id: 'ads', label: 'Espaço Publicitário & Banners', icon: Megaphone },
    { id: 'users', label: 'Cadastro de Usuários & Senhas', icon: Users, badge: users.length, badgeColor: 'bg-emerald-600 text-white' },
    { id: 'reports', label: 'Relatórios (.XLSX e PDF)', icon: FileSpreadsheet },
    { id: 'security', label: 'Segurança & Senha Master', icon: ShieldAlert },
  ];

  return (
    <div
      className={`fixed inset-0 z-50 flex ${
        isFullscreen ? 'p-0' : 'items-center justify-center p-2 sm:p-4'
      } bg-slate-950/85 backdrop-blur-xs overflow-y-auto animate-in fade-in`}
    >
      <div
        className={`bg-white ${
          isFullscreen
            ? 'w-screen h-screen rounded-none max-w-none'
            : 'rounded-2xl max-w-7xl w-full h-[94vh] my-auto'
        } overflow-hidden border border-slate-200 shadow-2xl flex flex-col font-sans transition-all duration-200`}
      >
        
        {/* Top Header */}
        <div className="bg-[#0a2540] text-white px-6 py-3.5 flex items-center justify-between shrink-0 border-b border-blue-950">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-500/20 text-blue-300 rounded-lg">
              <Shield className="w-5 h-5 text-amber-400" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-editorial text-lg font-bold tracking-tight">
                  Painel do Administrador — Gestão Integral da Plataforma
                </span>
                <span className="text-[10px] bg-amber-400 text-slate-950 px-2 py-0.5 rounded-full font-bold uppercase tracking-wider">
                  Administrador Geral
                </span>
              </div>
              <span className="text-xs text-slate-300 font-sans">
                Administrador: {currentUser?.name || 'Administrador'} · {config.siteName}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleCopyExternalLink}
              className="px-3 py-1.5 bg-amber-400 hover:bg-amber-300 active:bg-amber-500 text-slate-950 font-bold rounded-lg text-xs cursor-pointer transition-colors flex items-center gap-1.5 shadow-xs"
              title="Copiar Link de Acesso do Administrador"
            >
              {linkCopied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-slate-950" />
                  <span>Link Copiado!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5 text-slate-950" />
                  <span>Copiar Link do Admin</span>
                </>
              )}
            </button>

            <button
              onClick={() => setIsFullscreen(!isFullscreen)}
              className="px-2.5 py-1.5 text-white/80 hover:text-white hover:bg-white/10 rounded-lg transition-colors cursor-pointer flex items-center gap-1.5 text-xs font-medium"
              title={isFullscreen ? 'Sair da Tela Cheia' : 'Tornar em Tela Cheia'}
            >
              {isFullscreen ? (
                <>
                  <Minimize2 className="w-4 h-4 text-amber-300" />
                  <span className="hidden sm:inline">Modo Janela</span>
                </>
              ) : (
                <>
                  <Maximize2 className="w-4 h-4 text-amber-300" />
                  <span className="hidden sm:inline">Tela Cheia</span>
                </>
              )}
            </button>

            <button
              onClick={onClose}
              className="p-2 text-white/70 hover:text-white hover:bg-white/10 rounded-lg transition-colors cursor-pointer"
              title="Fechar Painel do Administrador"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Dedicated Full Admin External Link Notification Bar */}
        <div className="bg-amber-500 text-slate-950 px-6 py-2.5 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs shrink-0 border-b border-amber-600 shadow-xs">
          <div className="flex items-center gap-2 text-slate-950">
            <span className="bg-slate-950 text-amber-300 px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider font-mono">
              LINK EXTERNO EXCLUSIVO
            </span>
            <span className="font-semibold text-xs text-slate-950">
              Link Direto de Acesso ao Painel do Administrador:
            </span>
          </div>
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <input
              type="text"
              readOnly
              value={typeof window !== 'undefined' ? `${window.location.origin}${window.location.pathname}?painel=admin` : '?painel=admin'}
              className="px-2.5 py-1 bg-white border border-amber-700 rounded-md text-slate-900 font-mono text-xs w-full sm:w-80 select-all font-semibold shadow-inner"
            />
            <button
              onClick={handleCopyExternalLink}
              className="px-3.5 py-1 bg-slate-950 hover:bg-slate-800 active:bg-black text-amber-300 font-bold rounded-md cursor-pointer whitespace-nowrap transition-colors flex items-center gap-1.5 text-xs shadow-xs shrink-0"
            >
              {linkCopied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Copiado!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5 text-amber-300" />
                  <span>Copiar Link Completo</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Horizontal Navigation Menu (All 15 management sections) */}
        <div className="flex border-b border-slate-200 bg-slate-100 px-4 overflow-x-auto scrollbar-none shrink-0 gap-1 py-1.5">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;

            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`py-2 px-3 text-xs font-semibold rounded-lg transition-all flex items-center gap-1.5 whitespace-nowrap cursor-pointer shrink-0 ${
                  isActive
                    ? 'bg-white text-[#0f3d59] shadow-xs border border-slate-200 font-bold'
                    : 'text-slate-600 hover:bg-slate-200/70 hover:text-slate-900'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{item.label}</span>
                {item.badge !== undefined && (
                  <span
                    className={`ml-1 px-1.5 py-0.2 rounded-full text-[10px] font-bold ${
                      item.badgeColor || 'bg-slate-200 text-slate-700'
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Tab Body (Scrollable Container) */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 bg-slate-50/50">
          {activeTab === 'dashboard' && (
            <AdminDashboard onNavigateTab={(tab) => setActiveTab(tab)} />
          )}

          {activeTab === 'editorial' && (
            <AdminEditorial
              onPreviewArticle={onPreviewArticle}
              prefillFromStory={prefilledStoryForArticle}
            />
          )}

          {activeTab === 'stories' && (
            <AdminStories onConvertToArticle={handleConvertToArticle} />
          )}

          {activeTab === 'ads' && <AdminAds />}

          {activeTab === 'reports' && <AdminReports />}

          {activeTab === 'users' && <AdminUserManager />}

          {activeTab === 'header_logo' && <AdminHeaderLogo />}

          {activeTab === 'footer_social' && <AdminFooterSocial />}

          {activeTab === 'structure_texts' && <AdminStructureTexts />}

          {activeTab === 'palette' && <AdminColorPalette />}

          {activeTab === 'locations' && <AdminLocations />}

          {activeTab === 'faq' && <AdminFAQ />}

          {activeTab === 'about' && <AdminAboutEditor />}

          {activeTab === 'contact_transparency' && <AdminContactTransparency />}

          {activeTab === 'denuncia_manager' && <AdminDenunciaEditor />}

          {activeTab === 'public_utility' && <AdminPublicUtility />}

          {activeTab === 'onepage_sections' && <AdminOnePageStructure />}

          {activeTab === 'security' && <AdminSecurity />}
        </div>
      </div>
    </div>
  );
};
