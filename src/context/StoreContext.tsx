import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  User,
  Article,
  Category,
  FAQItem,
  CommunityStory,
  Advertisement,
  PortalConfig,
  AuditLog,
  ArticleStatus,
  UserRole,
  ClassifiedItem,
  AboutSectionConfig,
  PublicUtilityItem,
  DenunciaSectionConfig,
  SocialShareTemplates,
  HeaderNavLink,
} from '../types';
import {
  INITIAL_CATEGORIES,
  INITIAL_USERS,
  INITIAL_PORTAL_CONFIG,
  INITIAL_ADS,
  DEMO_AMAZON_ARTICLES,
  COMPLETE_PORTAL_ARTICLES,
  INITIAL_CLASSIFIEDS,
  AMAZON_LOCATIONS,
  INITIAL_FAQS,
  INITIAL_ABOUT_CONFIG,
  INITIAL_PUBLIC_UTILITY,
  INITIAL_DENUNCIA_CONFIG,
  INITIAL_HEADER_NAV_LINKS,
} from '../data/initialData';

interface StoreState {
  users: User[];
  currentUser: User | null;
  articles: Article[];
  categories: Category[];
  locations: string[];
  faqs: FAQItem[];
  communityStories: CommunityStory[];
  advertisements: Advertisement[];
  classifieds: ClassifiedItem[];
  config: PortalConfig;
  auditLogs: AuditLog[];
}

export interface StoreContextType extends StoreState {
  // Auth
  login: (email: string, password: string) => { success: boolean; message?: string };
  loginAdmin: (password: string, email?: string) => { success: boolean; message?: string };
  loginUser: (password: string, email?: string) => { success: boolean; message?: string };
  register: (data: {
    name: string;
    email: string;
    password: string;
    role?: UserRole;
    bio?: string;
    city?: string;
  }) => { success: boolean; message?: string };
  logout: () => void;
  updateAdminPassword: (newPassword: string) => { success: boolean; message?: string };
  updateCurrentUserProfile: (data: Partial<User>) => void;

  // Direct user management (Admin)
  addUser: (userData: Omit<User, 'id' | 'createdAt'>) => void;
  updateUser: (id: string, userData: Partial<User>) => void;
  deleteUser: (id: string) => void;
  updateUserPassword: (id: string, newPassword: string) => void;
  updateUserRole: (userId: string, role: UserRole) => void;
  toggleUserStatus: (userId: string) => void;

  // Articles
  createArticle: (articleData: Omit<Article, 'id' | 'createdAt' | 'updatedAt' | 'viewsCount'>) => Article;
  updateArticle: (id: string, articleData: Partial<Article>) => void;
  deleteArticle: (id: string) => void;
  reviewArticle: (id: string, status: ArticleStatus, reviewNotes?: string) => void;
  incrementArticleViews: (id: string) => void;

  // Classificados / Empregos
  addClassified: (job: Omit<ClassifiedItem, 'id' | 'publishedAt'>) => void;
  updateClassified: (id: string, jobData: Partial<ClassifiedItem>) => void;
  deleteClassified: (id: string) => void;
  toggleJobStatus: (id: string) => void;

  // Community Stories / Denúncias
  submitCommunityStory: (story: Omit<CommunityStory, 'id' | 'createdAt' | 'status'>) => void;
  updateStoryStatus: (id: string, status: CommunityStory['status']) => void;
  deleteCommunityStory: (id: string) => void;

  // Advertisements / Banners
  createAd: (ad: Omit<Advertisement, 'id' | 'createdAt' | 'impressions' | 'clicks'>) => void;
  updateAd: (id: string, ad: Partial<Advertisement>) => void;
  deleteAd: (id: string) => void;
  recordAdClick: (id: string) => void;

  // Categories
  addCategory: (cat: Omit<Category, 'id'>) => void;
  updateCategory: (id: string, cat: Partial<Category>) => void;
  deleteCategory: (id: string) => void;

  // Localidades
  addLocation: (locationName: string) => void;
  updateLocation: (oldName: string, newName: string) => void;
  deleteLocation: (locationName: string) => void;

  // FAQ
  addFAQ: (faq: Omit<FAQItem, 'id'>) => void;
  updateFAQ: (id: string, faq: Partial<FAQItem>) => void;
  deleteFAQ: (id: string) => void;

  // Configuration / One Page
  updateConfig: (newConfig: Partial<PortalConfig>) => void;
  updatePalette: (palette: Partial<PortalConfig['palette']>) => void;
  updateHeaderConfig: (header: Partial<PortalConfig['header']>) => void;
  updateHeaderNavLinks: (links: HeaderNavLink[]) => void;
  addHeaderNavLink: (link: Omit<HeaderNavLink, 'id' | 'order'>) => void;
  updateHeaderNavLink: (id: string, patch: Partial<HeaderNavLink>) => void;
  deleteHeaderNavLink: (id: string) => void;
  resetHeaderNavLinksToDefault: () => void;
  updateFooterConfig: (footer: Partial<PortalConfig['footer']>) => void;
  updateStructureTexts: (texts: Partial<PortalConfig['structureTexts']>) => void;
  updateSocialLinks: (links: Partial<PortalConfig['socialLinks']>) => void;
  updateSocialShareTemplates: (templates: Partial<SocialShareTemplates>) => void;
  updateInstitutional: (data: Partial<PortalConfig['institutional']>) => void;
  updateContactInfo: (data: { email?: string; phone?: string; address?: string }) => void;
  updateAbout: (about: { authorCredit?: string; bio?: string; avatar?: string; tagline?: string; heroTitle?: string; heroSubtitle?: string; heroImageUrl?: string }) => void;
  updateAboutSection: (updater: Partial<AboutSectionConfig>) => void;
  resetAboutToDefault: () => void;
  updateDenunciaSection: (updater: Partial<DenunciaSectionConfig>) => void;
  resetDenunciaToDefault: () => void;
  updatePublicUtility: (data: Partial<PortalConfig['publicUtility']>) => void;
  addPublicUtilityItem: (item: Omit<PublicUtilityItem, 'id' | 'order'>) => void;
  updatePublicUtilityItem: (id: string, patch: Partial<PublicUtilityItem>) => void;
  deletePublicUtilityItem: (id: string) => void;
  resetPublicUtilityToDefault: () => void;
  toggleSectionVisibility: (sectionKey: keyof PortalConfig['sectionsVisible']) => void;
  reorderSections: (newOrder: (keyof PortalConfig['sectionsVisible'])[]) => void;

  // Maintenance & Data
  loadDemoData: () => void;
  resetToClean: () => void;
  exportDatabaseJSON: () => string;
  importDatabaseJSON: (jsonStr: string) => { success: boolean; error?: string };
  clearAuditLogs: () => void;
}

const STORAGE_KEY = 'comunidade_em_acao_store_v1';

const StoreContext = createContext<StoreContextType | null>(null);

export const StoreProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Initialize state with clean empty articles per user decision in Phase 1
  const [users, setUsers] = useState<User[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY}_users`);
    return saved ? JSON.parse(saved) : INITIAL_USERS;
  });

  const [currentUser, setCurrentUser] = useState<User | null>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY}_currentUser`);
    return saved ? JSON.parse(saved) : null;
  });

  const [articles, setArticles] = useState<Article[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY}_articles`);
    if (saved) {
      try {
        const parsed: Article[] = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          return parsed;
        }
      } catch {
        // fallback
      }
    }
    return COMPLETE_PORTAL_ARTICLES;
  });

  const [classifieds, setClassifieds] = useState<ClassifiedItem[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY}_classifieds`);
    if (saved) {
      try {
        const parsed: ClassifiedItem[] = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      } catch {
        // fallback
      }
    }
    return INITIAL_CLASSIFIEDS;
  });

  const [categories, setCategories] = useState<Category[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY}_categories`);
    if (saved) {
      try {
        const parsed: Category[] = JSON.parse(saved);
        if (!parsed.some((c) => c.slug === 'noticias-evangelicas' || c.name.toLowerCase().includes('evang'))) {
          parsed.push({
            id: 'cat-evangelicas',
            name: 'Notícias Evangélicas',
            slug: 'noticias-evangelicas',
            description: 'Eventos cristãos, mensagens de fé, igrejas locais, ações solidárias e louvor no Amazonas.',
            color: '#7c3aed',
            order: 9,
            isActive: true,
          });
        }
        if (!parsed.some((c) => c.slug === 'meio-ambiente' || c.name.toLowerCase().includes('meio ambiente'))) {
          parsed.push({
            id: 'cat-meio-ambiente',
            name: 'Meio Ambiente',
            slug: 'meio-ambiente',
            description: 'Queimadas, estiagem, qualidade do ar, fauna e preservação das florestas.',
            color: '#15803d',
            order: 10,
            isActive: true,
          });
        }
        return parsed;
      } catch {
        return INITIAL_CATEGORIES;
      }
    }
    return INITIAL_CATEGORIES;
  });

  const [locations, setLocations] = useState<string[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY}_locations`);
    return saved ? JSON.parse(saved) : AMAZON_LOCATIONS;
  });

  const [faqs, setFaqs] = useState<FAQItem[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY}_faqs`);
    return saved ? JSON.parse(saved) : INITIAL_FAQS;
  });

  const [communityStories, setCommunityStories] = useState<CommunityStory[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY}_stories`);
    return saved ? JSON.parse(saved) : [];
  });

  const [advertisements, setAdvertisements] = useState<Advertisement[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY}_ads`);
    return saved ? JSON.parse(saved) : INITIAL_ADS;
  });

  const [config, setConfig] = useState<PortalConfig>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY}_config`);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (!parsed.heroImageUrl || parsed.heroImageUrl.includes('hero_amazonas_ribeirinho')) {
          parsed.heroImageUrl = '/src/assets/images/claquete_comunidade_em_acao_1791659081150.jpg';
        }
        return {
          ...INITIAL_PORTAL_CONFIG,
          ...parsed,
          header: {
            ...INITIAL_PORTAL_CONFIG.header,
            ...(parsed.header || {}),
            navLinks: (() => {
              if (Array.isArray(parsed.header?.navLinks) && parsed.header.navLinks.length > 0) {
                const links = [...parsed.header.navLinks];
                if (!links.some((l: HeaderNavLink) => l.targetSection === 'contato' || l.id === 'nav-contact')) {
                  links.push({ id: 'nav-contact', label: 'Expediente & Contato', targetSection: 'contato', order: links.length + 1, isVisible: true });
                }
                return links;
              }
              return INITIAL_HEADER_NAV_LINKS;
            })(),
          },
          footer: { ...INITIAL_PORTAL_CONFIG.footer, ...(parsed.footer || {}) },
          palette: { ...INITIAL_PORTAL_CONFIG.palette, ...(parsed.palette || {}) },
          structureTexts: { ...INITIAL_PORTAL_CONFIG.structureTexts, ...(parsed.structureTexts || {}) },
          socialLinks: { ...INITIAL_PORTAL_CONFIG.socialLinks, ...(parsed.socialLinks || {}) },
          socialShare: { ...INITIAL_PORTAL_CONFIG.socialShare, ...(parsed.socialShare || {}) },
          sectionsVisible: {
            ...INITIAL_PORTAL_CONFIG.sectionsVisible,
            ...(parsed.sectionsVisible || {}),
            publicUtility: parsed.sectionsVisible?.publicUtility !== undefined ? parsed.sectionsVisible.publicUtility : true,
            classifieds: false, // Substituído por Utilidade Pública conforme solicitação
          },
          aboutConfig: parsed.aboutConfig ? {
            ...INITIAL_PORTAL_CONFIG.aboutConfig,
            ...parsed.aboutConfig,
            paragraphs: Array.isArray(parsed.aboutConfig.paragraphs)
              ? parsed.aboutConfig.paragraphs
              : INITIAL_PORTAL_CONFIG.aboutConfig.paragraphs,
            pillars: Array.isArray(parsed.aboutConfig.pillars)
              ? parsed.aboutConfig.pillars
              : INITIAL_PORTAL_CONFIG.aboutConfig.pillars,
            additionalImages: Array.isArray(parsed.aboutConfig.additionalImages)
              ? parsed.aboutConfig.additionalImages
              : INITIAL_PORTAL_CONFIG.aboutConfig.additionalImages,
          } : INITIAL_PORTAL_CONFIG.aboutConfig,
          denunciaConfig: parsed.denunciaConfig ? {
            ...INITIAL_PORTAL_CONFIG.denunciaConfig,
            ...parsed.denunciaConfig,
            whatToReportItems: Array.isArray(parsed.denunciaConfig.whatToReportItems)
              ? parsed.denunciaConfig.whatToReportItems
              : INITIAL_PORTAL_CONFIG.denunciaConfig.whatToReportItems,
          } : INITIAL_PORTAL_CONFIG.denunciaConfig,
          publicUtility: parsed.publicUtility ? {
            ...INITIAL_PORTAL_CONFIG.publicUtility,
            ...parsed.publicUtility,
            items: Array.isArray(parsed.publicUtility.items)
              ? parsed.publicUtility.items
              : INITIAL_PORTAL_CONFIG.publicUtility.items,
          } : INITIAL_PORTAL_CONFIG.publicUtility,
        };
      } catch {
        return INITIAL_PORTAL_CONFIG;
      }
    }
    return INITIAL_PORTAL_CONFIG;
  });

  const [auditLogs, setAuditLogs] = useState<AuditLog[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY}_audit`);
    return saved ? JSON.parse(saved) : [
      {
        id: 'audit-init',
        userId: 'system',
        userName: 'Sistema Portal',
        action: 'INICIALIZACAO',
        targetEntity: 'Configurações',
        details: 'Portal COMUNIDADE EM AÇÃO inicializado com sucesso.',
        timestamp: new Date().toISOString(),
      },
    ];
  });

  // Helper seguro para gravação no localStorage sem travar a renderização ou exceder cota
  const safeSetItem = (key: string, value: string) => {
    try {
      localStorage.setItem(key, value);
    } catch (err) {
      console.warn(`[StoreContext] Alerta de armazenamento local para "${key}":`, err);
    }
  };

  // Sync to localStorage
  useEffect(() => {
    safeSetItem(`${STORAGE_KEY}_users`, JSON.stringify(users));
  }, [users]);

  useEffect(() => {
    if (currentUser) {
      safeSetItem(`${STORAGE_KEY}_currentUser`, JSON.stringify(currentUser));
    } else {
      try {
        localStorage.removeItem(`${STORAGE_KEY}_currentUser`);
      } catch {}
    }
  }, [currentUser]);

  useEffect(() => {
    safeSetItem(`${STORAGE_KEY}_articles`, JSON.stringify(articles));
  }, [articles]);

  useEffect(() => {
    safeSetItem(`${STORAGE_KEY}_categories`, JSON.stringify(categories));
  }, [categories]);

  useEffect(() => {
    safeSetItem(`${STORAGE_KEY}_locations`, JSON.stringify(locations));
  }, [locations]);

  useEffect(() => {
    safeSetItem(`${STORAGE_KEY}_faqs`, JSON.stringify(faqs));
  }, [faqs]);

  useEffect(() => {
    safeSetItem(`${STORAGE_KEY}_stories`, JSON.stringify(communityStories));
  }, [communityStories]);

  useEffect(() => {
    safeSetItem(`${STORAGE_KEY}_ads`, JSON.stringify(advertisements));
  }, [advertisements]);

  useEffect(() => {
    safeSetItem(`${STORAGE_KEY}_classifieds`, JSON.stringify(classifieds));
  }, [classifieds]);

  useEffect(() => {
    safeSetItem(`${STORAGE_KEY}_config`, JSON.stringify(config));
  }, [config]);

  useEffect(() => {
    safeSetItem(`${STORAGE_KEY}_audit`, JSON.stringify(auditLogs));
  }, [auditLogs]);

  // Sincronização em tempo real entre abas e janelas do navegador
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (!e.key) return;
      if (e.key === `${STORAGE_KEY}_config` && e.newValue) {
        try {
          setConfig(JSON.parse(e.newValue));
        } catch {}
      } else if (e.key === `${STORAGE_KEY}_articles` && e.newValue) {
        try {
          setArticles(JSON.parse(e.newValue));
        } catch {}
      } else if (e.key === `${STORAGE_KEY}_categories` && e.newValue) {
        try {
          setCategories(JSON.parse(e.newValue));
        } catch {}
      } else if (e.key === `${STORAGE_KEY}_locations` && e.newValue) {
        try {
          setLocations(JSON.parse(e.newValue));
        } catch {}
      } else if (e.key === `${STORAGE_KEY}_faqs` && e.newValue) {
        try {
          setFaqs(JSON.parse(e.newValue));
        } catch {}
      } else if (e.key === `${STORAGE_KEY}_stories` && e.newValue) {
        try {
          setCommunityStories(JSON.parse(e.newValue));
        } catch {}
      } else if (e.key === `${STORAGE_KEY}_ads` && e.newValue) {
        try {
          setAdvertisements(JSON.parse(e.newValue));
        } catch {}
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  const recordAudit = (action: string, targetEntity: string, details: string) => {
    const newLog: AuditLog = {
      id: `log-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      userId: currentUser?.id || 'anonimo',
      userName: currentUser?.name || 'Visitante/Anônimo',
      action,
      targetEntity,
      details,
      timestamp: new Date().toISOString(),
    };
    setAuditLogs((prev) => [newLog, ...prev.slice(0, 199)]);
  };

  // Auth functions
  const login = (email: string, password: string) => {
    const user = users.find((u) => u.email.toLowerCase() === email.toLowerCase());
    if (!user) {
      return { success: false, message: 'Usuário não encontrado. Verifique o e-mail ou realize o cadastro.' };
    }
    if (user.passwordHash !== password) {
      return { success: false, message: 'Senha incorreta para este usuário.' };
    }
    if (user.status === 'blocked') {
      return { success: false, message: 'Conta temporariamente bloqueada pela administração.' };
    }

    setCurrentUser(user);
    recordAudit('LOGIN', 'Autenticação', `Login efetuado com sucesso por ${user.name} (${user.role}).`);
    return { success: true };
  };

  // Distinct Admin Login (using distinct Admin Master Password or Admin Account password)
  const loginAdmin = (password: string, email?: string) => {
    const adminUser = users.find(
      (u) => u.role === 'admin' || (email && u.email.toLowerCase() === email.toLowerCase())
    );
    const isMasterMatch = password === config.adminPasswordMaster;
    const isUserMatch = adminUser && adminUser.passwordHash === password;

    if (isMasterMatch || isUserMatch) {
      const activeAdmin = adminUser || {
        id: 'usr-admin-kassio',
        name: 'Kássio Cardoso (Administrador)',
        email: 'admin@comunidadeemacao.am',
        passwordHash: password,
        role: 'admin' as UserRole,
        avatar: '/src/assets/images/avatar_kassio_cardoso_1791649510274.jpg',
        bio: 'Jornalista Comunitário no Amazonas. Gestor Geral da Plataforma.',
        city: 'Manaus - AM',
        status: 'active' as const,
        createdAt: new Date().toISOString(),
      };
      setCurrentUser(activeAdmin);
      recordAudit('LOGIN_ADMIN', 'Segurança', `Acesso autenticado com sucesso ao Painel do Administrador.`);
      return { success: true };
    }

    recordAudit('FALHA_LOGIN_ADMIN', 'Segurança', `Tentativa de login com senha incorreta no Painel do Administrador.`);
    return { success: false, message: 'Senha do Administrador incorreta.' };
  };

  // Distinct User Login (Acesso por senha de usuário)
  const loginUser = (password: string, email?: string) => {
    let user = email ? users.find((u) => u.email.toLowerCase() === email.toLowerCase()) : null;
    if (!user) {
      // Find user whose password matches (prioritizing non-admins)
      user = users.find((u) => u.passwordHash === password && u.role !== 'admin');
    }
    if (!user && (password === 'user123' || password === 'reporter123')) {
      user = users.find((u) => u.role === 'reporter') || users[1] || users[0];
    }
    if (!user && users.some((u) => u.passwordHash === password)) {
      user = users.find((u) => u.passwordHash === password) || null;
    }

    if (!user || user.passwordHash !== password) {
      recordAudit('FALHA_LOGIN_USUARIO', 'Autenticação', 'Tentativa de login com senha de usuário incorreta.');
      return { success: false, message: 'Senha do Usuário incorreta.' };
    }
    if (user.status === 'blocked') {
      return { success: false, message: 'Esta conta de usuário está temporariamente desativada.' };
    }

    setCurrentUser(user);
    recordAudit('LOGIN_USUARIO', 'Autenticação', `Acesso do colaborador ${user.name} (${user.role}).`);
    return { success: true };
  };

  const updateAdminPassword = (newPassword: string) => {
    if (!newPassword || newPassword.length < 4) {
      return { success: false, message: 'A senha do Administrador deve possuir no mínimo 4 caracteres.' };
    }
    setConfig((prev) => ({ ...prev, adminPasswordMaster: newPassword }));
    setUsers((prev) =>
      prev.map((u) => (u.role === 'admin' ? { ...u, passwordHash: newPassword } : u))
    );
    if (currentUser && currentUser.role === 'admin') {
      setCurrentUser((prev) => (prev ? { ...prev, passwordHash: newPassword } : null));
    }
    recordAudit('ALTERACAO_SENHA_ADMIN', 'Segurança', 'Senha Master do Administrador alterada com sucesso.');
    return { success: true, message: 'Senha do Administrador atualizada com sucesso!' };
  };

  const register = (data: {
    name: string;
    email: string;
    password: string;
    role?: UserRole;
    bio?: string;
    city?: string;
  }) => {
    const existing = users.find((u) => u.email.toLowerCase() === data.email.toLowerCase());
    if (existing) {
      return { success: false, message: 'Já existe uma conta cadastrada com este e-mail.' };
    }

    const newUser: User = {
      id: `usr-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      name: data.name,
      email: data.email,
      passwordHash: data.password,
      role: data.role || 'reporter',
      bio: data.bio || 'Colaborador comunitário.',
      city: data.city || 'Amazonas - AM',
      avatar: '/src/assets/images/avatar_kassio_cardoso_1791649510274.jpg',
      status: 'active',
      createdAt: new Date().toISOString(),
    };

    setUsers((prev) => [...prev, newUser]);
    setCurrentUser(newUser);
    recordAudit('CADASTRO', 'Usuários', `Novo usuário cadastrado: ${newUser.name} (${newUser.role}).`);
    return { success: true };
  };

  const logout = () => {
    if (currentUser) {
      recordAudit('LOGOUT', 'Autenticação', `Usuário ${currentUser.name} encerrou a sessão.`);
    }
    setCurrentUser(null);
  };

  const updateCurrentUserProfile = (data: Partial<User>) => {
    if (!currentUser) return;
    const updated = { ...currentUser, ...data };
    setCurrentUser(updated);
    setUsers((prev) => prev.map((u) => (u.id === currentUser.id ? updated : u)));
    recordAudit('PERFIL', 'Usuários', `Perfil de ${currentUser.name} atualizado.`);
  };

  // Direct User Management for Admin Panel
  const addUser = (userData: Omit<User, 'id' | 'createdAt'>) => {
    const newUser: User = {
      ...userData,
      id: `usr-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      createdAt: new Date().toISOString(),
    };
    setUsers((prev) => [...prev, newUser]);
    recordAudit('CRIAR_USUARIO', 'Usuários', `Novo usuário cadastrado pela administração: ${newUser.name} (${newUser.role})`);
  };

  const updateUser = (id: string, userData: Partial<User>) => {
    setUsers((prev) => prev.map((u) => (u.id === id ? { ...u, ...userData } : u)));
    if (currentUser?.id === id) {
      setCurrentUser((prev) => (prev ? { ...prev, ...userData } : null));
    }
    recordAudit('ATUALIZAR_USUARIO', 'Usuários', `Usuário ID ${id} atualizado pela administração.`);
  };

  const deleteUser = (id: string) => {
    setUsers((prev) => prev.filter((u) => u.id !== id));
    recordAudit('EXCLUIR_USUARIO', 'Usuários', `Usuário ID ${id} removido do sistema.`);
  };

  const updateUserPassword = (id: string, newPassword: string) => {
    setUsers((prev) => prev.map((u) => (u.id === id ? { ...u, passwordHash: newPassword } : u)));
    recordAudit('ALTERAR_SENHA_USUARIO', 'Usuários', `Senha do usuário ID ${id} redefinida pela administração.`);
  };

  const updateUserRole = (userId: string, role: UserRole) => {
    setUsers((prev) =>
      prev.map((u) => (u.id === userId ? { ...u, role } : u))
    );
    recordAudit('PAPEL_USUARIO', 'Permissões', `Função do usuário ${userId} alterada para ${role}.`);
  };

  const toggleUserStatus = (userId: string) => {
    setUsers((prev) =>
      prev.map((u) => {
        if (u.id === userId) {
          const nextStatus = u.status === 'active' ? 'blocked' : 'active';
          recordAudit('STATUS_USUARIO', 'Usuários', `Status do usuário ${u.name} alterado para ${nextStatus}.`);
          return { ...u, status: nextStatus };
        }
        return u;
      })
    );
  };

  // Articles
  const createArticle = (articleData: Omit<Article, 'id' | 'createdAt' | 'updatedAt' | 'viewsCount'>) => {
    const newArticle: Article = {
      ...articleData,
      id: `art-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      viewsCount: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      publishedAt: articleData.status === 'published' ? new Date().toISOString() : undefined,
    };

    setArticles((prev) => [newArticle, ...prev]);
    recordAudit('CRIAR_MATERIA', 'Editorial', `Matéria "${newArticle.title}" criada com status "${newArticle.status}".`);
    return newArticle;
  };

  const updateArticle = (id: string, articleData: Partial<Article>) => {
    setArticles((prev) =>
      prev.map((art) => {
        if (art.id === id) {
          const updated = {
            ...art,
            ...articleData,
            updatedAt: new Date().toISOString(),
            publishedAt:
              articleData.status === 'published' && !art.publishedAt
                ? new Date().toISOString()
                : art.publishedAt,
          };
          return updated;
        }
        return art;
      })
    );
    recordAudit('ATUALIZAR_MATERIA', 'Editorial', `Matéria ID ${id} atualizada.`);
  };

  const deleteArticle = (id: string) => {
    const target = articles.find((a) => a.id === id);
    setArticles((prev) => prev.filter((art) => art.id !== id));
    recordAudit('EXCLUIR_MATERIA', 'Editorial', `Matéria "${target?.title || id}" excluída.`);
  };

  const reviewArticle = (id: string, status: ArticleStatus, reviewNotes?: string) => {
    setArticles((prev) =>
      prev.map((art) => {
        if (art.id === id) {
          return {
            ...art,
            status,
            reviewNotes: reviewNotes !== undefined ? reviewNotes : art.reviewNotes,
            publishedAt: status === 'published' ? new Date().toISOString() : art.publishedAt,
            updatedAt: new Date().toISOString(),
          };
        }
        return art;
      })
    );
    recordAudit('REVISAO_EDITORIAL', 'Editorial', `Matéria ${id} teve status alterado para "${status}". Parecer: ${reviewNotes || 'Sem parecer'}`);
  };

  const incrementArticleViews = (id: string) => {
    setArticles((prev) =>
      prev.map((art) => (art.id === id ? { ...art, viewsCount: art.viewsCount + 1 } : art))
    );
  };

  // Community Stories / Denúncias
  const submitCommunityStory = (story: Omit<CommunityStory, 'id' | 'createdAt' | 'status'>) => {
    const newStory: CommunityStory = {
      ...story,
      id: `sty-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      status: 'received',
      createdAt: new Date().toISOString(),
    };
    setCommunityStories((prev) => [newStory, ...prev]);
    recordAudit('DENUNCIA_RECEBIDA', 'Comunidade Participa', `Denúncia/Pauta recebida: "${newStory.storyTitle}" de ${newStory.submitterName}. Protocolo: ${newStory.protocolNumber || newStory.id}`);
  };

  const updateStoryStatus = (id: string, status: CommunityStory['status']) => {
    setCommunityStories((prev) =>
      prev.map((s) => (s.id === id ? { ...s, status } : s))
    );
    recordAudit('STATUS_DENUNCIA', 'Comunidade Participa', `Denúncia ${id} atualizada para "${status}".`);
  };

  const deleteCommunityStory = (id: string) => {
    setCommunityStories((prev) => prev.filter((s) => s.id !== id));
    recordAudit('EXCLUIR_DENUNCIA', 'Comunidade Participa', `Denúncia ${id} removida.`);
  };

  // Advertisements / Banners
  const createAd = (ad: Omit<Advertisement, 'id' | 'createdAt' | 'impressions' | 'clicks'>) => {
    const newAd: Advertisement = {
      ...ad,
      id: `ad-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      impressions: 0,
      clicks: 0,
      createdAt: new Date().toISOString(),
    };
    setAdvertisements((prev) => [...prev, newAd]);
    recordAudit('CRIAR_ANUNCIO', 'Publicidade', `Anúncio "${newAd.title}" (${newAd.advertiserName}) cadastrado.`);
  };

  const updateAd = (id: string, ad: Partial<Advertisement>) => {
    setAdvertisements((prev) =>
      prev.map((item) => (item.id === id ? { ...item, ...ad } : item))
    );
    recordAudit('ATUALIZAR_ANUNCIO', 'Publicidade', `Anúncio ID ${id} atualizado.`);
  };

  const deleteAd = (id: string) => {
    setAdvertisements((prev) => prev.filter((item) => item.id !== id));
    recordAudit('EXCLUIR_ANUNCIO', 'Publicidade', `Anúncio ID ${id} excluído.`);
  };

  const recordAdClick = (id: string) => {
    setAdvertisements((prev) =>
      prev.map((item) => (item.id === id ? { ...item, clicks: item.clicks + 1 } : item))
    );
  };

  // Classificados / Vagas de Emprego
  const addClassified = (job: Omit<ClassifiedItem, 'id' | 'publishedAt'>) => {
    const newJob: ClassifiedItem = {
      ...job,
      id: `job-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      publishedAt: new Date().toISOString(),
    };
    setClassifieds((prev) => [newJob, ...prev]);
    recordAudit('PUBLICAR_VAGA', 'Classificados & Empregos', `Vaga "${newJob.title}" (${newJob.company}) cadastrada.`);
  };

  const updateClassified = (id: string, jobData: Partial<ClassifiedItem>) => {
    setClassifieds((prev) =>
      prev.map((item) => (item.id === id ? { ...item, ...jobData } : item))
    );
    recordAudit('ATUALIZAR_VAGA', 'Classificados & Empregos', `Vaga ID ${id} atualizada.`);
  };

  const deleteClassified = (id: string) => {
    setClassifieds((prev) => prev.filter((item) => item.id !== id));
    recordAudit('EXCLUIR_VAGA', 'Classificados & Empregos', `Vaga ID ${id} removida.`);
  };

  const toggleJobStatus = (id: string) => {
    setClassifieds((prev) =>
      prev.map((item) =>
        item.id === id
          ? { ...item, status: item.status === 'active' ? 'closed' : 'active' }
          : item
      )
    );
    recordAudit('STATUS_VAGA', 'Classificados & Empregos', `Status da vaga ID ${id} alternado.`);
  };

  // Categories
  const addCategory = (cat: Omit<Category, 'id'>) => {
    const newCat: Category = {
      ...cat,
      id: `cat-${Date.now()}`,
    };
    setCategories((prev) => [...prev, newCat]);
    recordAudit('CRIAR_CATEGORIA', 'Editorias', `Editoria "${cat.name}" criada.`);
  };

  const updateCategory = (id: string, cat: Partial<Category>) => {
    setCategories((prev) =>
      prev.map((item) => (item.id === id ? { ...item, ...cat } : item))
    );
    recordAudit('ATUALIZAR_CATEGORIA', 'Editorias', `Editoria ID ${id} atualizada.`);
  };

  const deleteCategory = (id: string) => {
    setCategories((prev) => prev.filter((item) => item.id !== id));
    recordAudit('EXCLUIR_CATEGORIA', 'Editorias', `Editoria ID ${id} excluída.`);
  };

  // Localidades
  const addLocation = (locationName: string) => {
    const trimmed = locationName.trim();
    if (!trimmed || locations.includes(trimmed)) return;
    setLocations((prev) => [...prev, trimmed]);
    recordAudit('CRIAR_LOCALIDADE', 'Localidades', `Localidade adicionada: ${trimmed}`);
  };

  const updateLocation = (oldName: string, newName: string) => {
    const trimmed = newName.trim();
    if (!trimmed) return;
    setLocations((prev) => prev.map((loc) => (loc === oldName ? trimmed : loc)));
    recordAudit('ATUALIZAR_LOCALIDADE', 'Localidades', `Localidade alterada de "${oldName}" para "${trimmed}"`);
  };

  const deleteLocation = (locationName: string) => {
    setLocations((prev) => prev.filter((loc) => loc !== locationName));
    recordAudit('EXCLUIR_LOCALIDADE', 'Localidades', `Localidade excluída: ${locationName}`);
  };

  // FAQ
  const addFAQ = (faq: Omit<FAQItem, 'id'>) => {
    const newFaq: FAQItem = {
      ...faq,
      id: `faq-${Date.now()}`,
    };
    setFaqs((prev) => [...prev, newFaq]);
    recordAudit('CRIAR_FAQ', 'FAQ', `Pergunta adicionada: "${faq.question}"`);
  };

  const updateFAQ = (id: string, faqData: Partial<FAQItem>) => {
    setFaqs((prev) => prev.map((f) => (f.id === id ? { ...f, ...faqData } : f)));
    recordAudit('ATUALIZAR_FAQ', 'FAQ', `Pergunta atualizada ID ${id}`);
  };

  const deleteFAQ = (id: string) => {
    setFaqs((prev) => prev.filter((f) => f.id !== id));
    recordAudit('EXCLUIR_FAQ', 'FAQ', `Pergunta removida ID ${id}`);
  };

  // One Page Configuration & Customization
  const updateConfig = (newConfig: Partial<PortalConfig>) => {
    setConfig((prev) => {
      const siteName = newConfig.siteName !== undefined ? newConfig.siteName : prev.siteName;
      const subtagline = newConfig.subtagline !== undefined ? newConfig.subtagline : prev.subtagline;
      return {
        ...prev,
        ...newConfig,
        siteName,
        subtagline,
        header: {
          ...prev.header,
          ...(newConfig.header || {}),
          logoText: newConfig.siteName !== undefined ? newConfig.siteName : (newConfig.header?.logoText || prev.header.logoText),
          logoSubtext: newConfig.subtagline !== undefined ? newConfig.subtagline : (newConfig.header?.logoSubtext || prev.header.logoSubtext),
        },
        palette: {
          ...prev.palette,
          ...(newConfig.palette || {}),
        },
        structureTexts: {
          ...prev.structureTexts,
          ...(newConfig.structureTexts || {}),
        },
      };
    });
    recordAudit('CONFIGURACOES', 'Configurações', 'Configurações gerais do portal atualizadas.');
  };

  const updatePalette = (palette: Partial<PortalConfig['palette']>) => {
    setConfig((prev) => ({
      ...prev,
      palette: { ...prev.palette, ...palette },
    }));
    recordAudit('PALETA_CORES', 'Identidade Visual', 'Paleta de cores da One Page atualizada.');
  };

  const updateHeaderConfig = (header: Partial<PortalConfig['header']>) => {
    setConfig((prev) => ({
      ...prev,
      header: { ...prev.header, ...header },
      siteName: header.logoText !== undefined ? header.logoText : prev.siteName,
      subtagline: header.logoSubtext !== undefined ? header.logoSubtext : prev.subtagline,
      structureTexts: {
        ...prev.structureTexts,
        ...(header.topTickerLabel !== undefined ? { topTickerLabel: header.topTickerLabel } : {}),
        ...(header.topTickerText !== undefined ? { topTickerLabel: header.topTickerText } : {}),
        ...(header.ctaButtonText !== undefined ? { topCtaButtonText: header.ctaButtonText } : {}),
      },
    }));
    recordAudit('CABECALHO_LOGO', 'Cabeçalho & Logo', 'Configuração do cabeçalho e logo atualizada.');
  };

  const updateHeaderNavLinks = (links: HeaderNavLink[]) => {
    setConfig((prev) => ({
      ...prev,
      header: {
        ...prev.header,
        navLinks: links,
      },
    }));
    recordAudit('LINKS_MENU_TOPO', 'Menu do Topo', 'Categorias e links da barra de navegação do topo atualizados.');
  };

  const addHeaderNavLink = (link: Omit<HeaderNavLink, 'id' | 'order'>) => {
    setConfig((prev) => {
      const currentLinks = prev.header?.navLinks || INITIAL_HEADER_NAV_LINKS;
      const newLink: HeaderNavLink = {
        ...link,
        id: `nav-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
        order: currentLinks.length + 1,
      };
      return {
        ...prev,
        header: {
          ...prev.header,
          navLinks: [...currentLinks, newLink],
        },
      };
    });
    recordAudit('CRIAR_LINK_MENU', 'Menu do Topo', `Novo link do menu criado: ${link.label}`);
  };

  const updateHeaderNavLink = (id: string, patch: Partial<HeaderNavLink>) => {
    setConfig((prev) => {
      const currentLinks = prev.header?.navLinks || INITIAL_HEADER_NAV_LINKS;
      return {
        ...prev,
        header: {
          ...prev.header,
          navLinks: currentLinks.map((l) => (l.id === id ? { ...l, ...patch } : l)),
        },
      };
    });
    recordAudit('ATUALIZAR_LINK_MENU', 'Menu do Topo', `Link ID ${id} atualizado.`);
  };

  const deleteHeaderNavLink = (id: string) => {
    setConfig((prev) => {
      const currentLinks = prev.header?.navLinks || INITIAL_HEADER_NAV_LINKS;
      return {
        ...prev,
        header: {
          ...prev.header,
          navLinks: currentLinks.filter((l) => l.id !== id),
        },
      };
    });
    recordAudit('EXCLUIR_LINK_MENU', 'Menu do Topo', `Link ID ${id} removido do menu do topo.`);
  };

  const resetHeaderNavLinksToDefault = () => {
    setConfig((prev) => ({
      ...prev,
      header: {
        ...prev.header,
        navLinks: INITIAL_HEADER_NAV_LINKS,
      },
    }));
    recordAudit('RESTAURAR_MENU_TOPO', 'Menu do Topo', 'Menu do topo restaurado para as categorias padrão.');
  };

  const updateFooterConfig = (footer: Partial<PortalConfig['footer']>) => {
    setConfig((prev) => ({
      ...prev,
      footer: { ...prev.footer, ...footer },
    }));
    recordAudit('RODAPE', 'Rodapé', 'Configurações do rodapé atualizadas.');
  };

  const updateStructureTexts = (texts: Partial<PortalConfig['structureTexts']>) => {
    setConfig((prev) => {
      const newStructure = { ...prev.structureTexts, ...texts };
      const currentAbout = prev.aboutConfig || INITIAL_ABOUT_CONFIG;
      const newAbout = { ...currentAbout };
      if (texts.aboutSectionTitle !== undefined) newAbout.title = texts.aboutSectionTitle;
      if (texts.aboutEyebrow !== undefined) newAbout.eyebrow = texts.aboutEyebrow;
      if (texts.aboutQuoteLabel !== undefined) newAbout.institutionalQuoteLabel = texts.aboutQuoteLabel;
      if (texts.aboutQuoteText !== undefined) newAbout.institutionalQuoteText = texts.aboutQuoteText;

      const currentDenuncia = prev.denunciaConfig || INITIAL_DENUNCIA_CONFIG;
      const newDenuncia = { ...currentDenuncia };
      if (texts.denunciaTitle !== undefined) newDenuncia.title = texts.denunciaTitle;
      if (texts.denunciaSubtitle !== undefined) newDenuncia.subtitle = texts.denunciaSubtitle;
      if (texts.denunciaEyebrow !== undefined) newDenuncia.eyebrow = texts.denunciaEyebrow;

      const currentUtility = prev.publicUtility || INITIAL_PORTAL_CONFIG.publicUtility;
      const newUtility = { ...currentUtility };
      if (texts.publicUtilitySectionTitle !== undefined) newUtility.title = texts.publicUtilitySectionTitle;
      if (texts.publicUtilitySectionSubtitle !== undefined) newUtility.subtitle = texts.publicUtilitySectionSubtitle;

      return {
        ...prev,
        structureTexts: newStructure,
        aboutConfig: newAbout as AboutSectionConfig,
        denunciaConfig: newDenuncia as DenunciaSectionConfig,
        publicUtility: newUtility as PortalConfig['publicUtility'],
        heroTitle: texts.heroTitle || prev.heroTitle,
        heroSubtitle: texts.heroSubtitle || prev.heroSubtitle,
      };
    });
    recordAudit('TEXTOS_ESTRUTURA', 'Estrutura da Página', 'Títulos e textos das seções atualizados.');
  };

  const updateSocialLinks = (links: Partial<PortalConfig['socialLinks']>) => {
    setConfig((prev) => ({
      ...prev,
      socialLinks: { ...prev.socialLinks, ...links },
    }));
    recordAudit('REDES_SOCIAIS', 'Redes Sociais', 'Links das redes sociais atualizados.');
  };

  const updateSocialShareTemplates = (templates: Partial<SocialShareTemplates>) => {
    setConfig((prev) => ({
      ...prev,
      socialShare: {
        ...(prev.socialShare || INITIAL_PORTAL_CONFIG.socialShare!),
        ...templates,
      },
    }));
    recordAudit('COMPARTILHAMENTO_SOCIAL', 'Redes Sociais', 'Templates prontos de compartilhamento para Facebook e Instagram atualizados.');
  };

  const updateInstitutional = (data: Partial<PortalConfig['institutional']>) => {
    setConfig((prev) => ({
      ...prev,
      institutional: {
        ...(prev.institutional || INITIAL_PORTAL_CONFIG.institutional),
        ...data,
      },
    }));
    recordAudit('EXPEDIENTE_POLITICAS', 'Transparência & Conformidade', 'Expediente editorial e políticas institucionais atualizadas.');
  };

  const updateContactInfo = (data: { email?: string; phone?: string; address?: string }) => {
    setConfig((prev) => ({
      ...prev,
      contactEmail: data.email !== undefined ? data.email : prev.contactEmail,
      contactPhone: data.phone !== undefined ? data.phone : prev.contactPhone,
      contactAddress: data.address !== undefined ? data.address : prev.contactAddress,
    }));
    recordAudit('CONTATO_DIRETO', 'Canais de Contato', 'Dados de contato oficial da redação atualizados.');
  };

  const updateAbout = (about: {
    authorCredit?: string;
    bio?: string;
    avatar?: string;
    tagline?: string;
    heroTitle?: string;
    heroSubtitle?: string;
    heroImageUrl?: string;
  }) => {
    setConfig((prev) => ({
      ...prev,
      ...(about.authorCredit ? { authorCredit: about.authorCredit } : {}),
      ...(about.tagline ? { tagline: about.tagline } : {}),
      ...(about.heroTitle ? { heroTitle: about.heroTitle } : {}),
      ...(about.heroSubtitle ? { heroSubtitle: about.heroSubtitle } : {}),
      ...(about.heroImageUrl ? { heroImageUrl: about.heroImageUrl } : {}),
    }));
    recordAudit('SOBRE_AUTOR', 'Sobre o Portal', 'Informações de Kássio Cardoso e da apresentação atualizadas.');
  };

  const updateAboutSection = (updater: Partial<AboutSectionConfig>) => {
    setConfig((prev) => {
      const currentAbout = prev.aboutConfig || INITIAL_ABOUT_CONFIG;
      const updatedAbout: AboutSectionConfig = {
        ...currentAbout,
        ...updater,
      };
      const structurePatch: Partial<PortalConfig['structureTexts']> = {};
      if (updater.title !== undefined) structurePatch.aboutSectionTitle = updater.title;
      if (updater.eyebrow !== undefined) structurePatch.aboutEyebrow = updater.eyebrow;
      if (updater.institutionalQuoteLabel !== undefined) structurePatch.aboutQuoteLabel = updater.institutionalQuoteLabel;
      if (updater.institutionalQuoteText !== undefined) structurePatch.aboutQuoteText = updater.institutionalQuoteText;

      return {
        ...prev,
        aboutConfig: updatedAbout,
        structureTexts: {
          ...prev.structureTexts,
          ...structurePatch,
        },
      };
    });
    recordAudit('GESTAO_ESTRUTURA_SOBRE', 'Estrutura Sobre', 'Informações, textos, imagens e pilares da seção Sobre foram atualizados com sucesso.');
  };

  const resetAboutToDefault = () => {
    setConfig((prev) => ({
      ...prev,
      aboutConfig: INITIAL_ABOUT_CONFIG,
      structureTexts: {
        ...prev.structureTexts,
        aboutSectionTitle: INITIAL_ABOUT_CONFIG.title,
        aboutEyebrow: INITIAL_ABOUT_CONFIG.eyebrow,
        aboutQuoteLabel: INITIAL_ABOUT_CONFIG.institutionalQuoteLabel,
        aboutQuoteText: INITIAL_ABOUT_CONFIG.institutionalQuoteText,
      },
    }));
    recordAudit('RESTAURAR_SOBRE', 'Estrutura Sobre', 'Seção Sobre restaurada para os padrões oficiais originais.');
  };

  const updateDenunciaSection = (updater: Partial<DenunciaSectionConfig>) => {
    setConfig((prev) => {
      const updatedDenuncia = {
        ...(prev.denunciaConfig || INITIAL_DENUNCIA_CONFIG),
        ...updater,
      };
      const structurePatch: Partial<PortalConfig['structureTexts']> = {};
      if (updater.title !== undefined) structurePatch.denunciaTitle = updater.title;
      if (updater.subtitle !== undefined) structurePatch.denunciaSubtitle = updater.subtitle;
      if (updater.eyebrow !== undefined) structurePatch.denunciaEyebrow = updater.eyebrow;

      return {
        ...prev,
        denunciaConfig: updatedDenuncia,
        structureTexts: {
          ...prev.structureTexts,
          ...structurePatch,
        },
      };
    });
    recordAudit('GESTAO_DENUNCIA', 'Canal de Denúncias', 'Informações e tópicos de denúncia atualizados.');
  };

  const resetDenunciaToDefault = () => {
    setConfig((prev) => ({
      ...prev,
      denunciaConfig: INITIAL_DENUNCIA_CONFIG,
      structureTexts: {
        ...prev.structureTexts,
        denunciaTitle: INITIAL_DENUNCIA_CONFIG.title,
        denunciaSubtitle: INITIAL_DENUNCIA_CONFIG.subtitle,
        denunciaEyebrow: INITIAL_DENUNCIA_CONFIG.eyebrow,
      },
    }));
    recordAudit('RESTAURAR_DENUNCIA', 'Canal de Denúncias', 'Canal de Denúncias restaurado para o padrão oficial.');
  };

  const updatePublicUtility = (data: Partial<PortalConfig['publicUtility']>) => {
    setConfig((prev) => {
      const updatedUtility = {
        ...(prev.publicUtility || INITIAL_PORTAL_CONFIG.publicUtility),
        ...data,
      };
      const structurePatch: Partial<PortalConfig['structureTexts']> = {};
      if (data.title !== undefined) structurePatch.publicUtilitySectionTitle = data.title;
      if (data.subtitle !== undefined) structurePatch.publicUtilitySectionSubtitle = data.subtitle;

      return {
        ...prev,
        publicUtility: updatedUtility,
        structureTexts: {
          ...prev.structureTexts,
          ...structurePatch,
        },
      };
    });
    recordAudit('ATUALIZAR_UTILIDADE', 'Utilidade Pública', 'Informações gerais de Utilidade Pública atualizadas.');
  };

  const addPublicUtilityItem = (item: Omit<PublicUtilityItem, 'id' | 'order'>) => {
    setConfig((prev) => {
      const currentItems = prev.publicUtility?.items || INITIAL_PUBLIC_UTILITY;
      const newItem: PublicUtilityItem = {
        ...item,
        id: `util-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
        order: currentItems.length + 1,
      };
      return {
        ...prev,
        publicUtility: {
          ...(prev.publicUtility || INITIAL_PORTAL_CONFIG.publicUtility),
          items: [...currentItems, newItem],
        },
      };
    });
    recordAudit('CRIAR_UTILIDADE', 'Utilidade Pública', `Novo contato de utilidade pública: ${item.name}`);
  };

  const updatePublicUtilityItem = (id: string, patch: Partial<PublicUtilityItem>) => {
    setConfig((prev) => {
      const currentItems = prev.publicUtility?.items || INITIAL_PUBLIC_UTILITY;
      return {
        ...prev,
        publicUtility: {
          ...(prev.publicUtility || INITIAL_PORTAL_CONFIG.publicUtility),
          items: currentItems.map((it) => (it.id === id ? { ...it, ...patch } : it)),
        },
      };
    });
    recordAudit('ATUALIZAR_ITEM_UTILIDADE', 'Utilidade Pública', `Item ID ${id} atualizado.`);
  };

  const deletePublicUtilityItem = (id: string) => {
    setConfig((prev) => {
      const currentItems = prev.publicUtility?.items || INITIAL_PUBLIC_UTILITY;
      return {
        ...prev,
        publicUtility: {
          ...(prev.publicUtility || INITIAL_PORTAL_CONFIG.publicUtility),
          items: currentItems.filter((it) => it.id !== id),
        },
      };
    });
    recordAudit('EXCLUIR_ITEM_UTILIDADE', 'Utilidade Pública', `Item ID ${id} removido.`);
  };

  const resetPublicUtilityToDefault = () => {
    setConfig((prev) => ({
      ...prev,
      publicUtility: {
        title: INITIAL_PORTAL_CONFIG.publicUtility.title,
        subtitle: INITIAL_PORTAL_CONFIG.publicUtility.subtitle,
        items: INITIAL_PUBLIC_UTILITY,
      },
    }));
    recordAudit('RESTAURAR_UTILIDADE', 'Utilidade Pública', 'Utilidade Pública restaurada aos contatos oficiais do AM.');
  };

  const toggleSectionVisibility = (sectionKey: keyof PortalConfig['sectionsVisible']) => {
    setConfig((prev) => ({
      ...prev,
      sectionsVisible: {
        ...prev.sectionsVisible,
        [sectionKey]: !prev.sectionsVisible[sectionKey],
      },
    }));
    recordAudit('LAYOUT_SECOES', 'Editor One Page', `Visibilidade da seção "${sectionKey}" alterada.`);
  };

  const reorderSections = (newOrder: (keyof PortalConfig['sectionsVisible'])[]) => {
    setConfig((prev) => ({
      ...prev,
      sectionsOrder: newOrder,
    }));
    recordAudit('ORDEM_SECOES', 'Editor One Page', 'Ordem dos blocos da One Page redefinida.');
  };

  // Maintenance
  const loadDemoData = () => {
    setArticles(COMPLETE_PORTAL_ARTICLES);
    setClassifieds(INITIAL_CLASSIFIEDS);
    recordAudit('CARGA_DEMO', 'Banco de Dados', 'Artigos completos e vagas de classificados do Amazonas carregados na base.');
  };

  const resetToClean = () => {
    setArticles([]);
    setClassifieds([]);
    setCommunityStories([]);
    recordAudit('LIMPAR_BASE', 'Banco de Dados', 'Base de matérias, classificados e pautas redefinida para estado inicial limpo.');
  };

  const exportDatabaseJSON = () => {
    const payload = {
      version: '2.0',
      exportedAt: new Date().toISOString(),
      articles,
      classifieds,
      categories,
      locations,
      faqs,
      users,
      communityStories,
      advertisements,
      config,
      auditLogs,
    };
    return JSON.stringify(payload, null, 2);
  };

  const importDatabaseJSON = (jsonStr: string) => {
    try {
      const data = JSON.parse(jsonStr);
      if (Array.isArray(data.articles)) setArticles(data.articles);
      if (Array.isArray(data.classifieds)) setClassifieds(data.classifieds);
      if (Array.isArray(data.categories)) setCategories(data.categories);
      if (Array.isArray(data.locations)) setLocations(data.locations);
      if (Array.isArray(data.faqs)) setFaqs(data.faqs);
      if (Array.isArray(data.users)) setUsers(data.users);
      if (Array.isArray(data.communityStories)) setCommunityStories(data.communityStories);
      if (Array.isArray(data.advertisements)) setAdvertisements(data.advertisements);
      if (data.config) setConfig(data.config);
      recordAudit('IMPORTACAO_BACKUP', 'Banco de Dados', 'Restauração de banco de dados concluída.');
      return { success: true };
    } catch {
      return { success: false, error: 'Arquivo JSON inválido ou corrompido.' };
    }
  };

  const clearAuditLogs = () => {
    setAuditLogs([]);
  };

  return (
    <StoreContext.Provider
      value={{
        users,
        currentUser,
        articles,
        categories,
        locations,
        faqs,
        communityStories,
        advertisements,
        classifieds,
        config,
        auditLogs,
        login,
        loginAdmin,
        loginUser,
        register,
        logout,
        updateAdminPassword,
        updateCurrentUserProfile,
        addUser,
        updateUser,
        deleteUser,
        updateUserPassword,
        updateUserRole,
        toggleUserStatus,
        createArticle,
        updateArticle,
        deleteArticle,
        reviewArticle,
        incrementArticleViews,
        addClassified,
        updateClassified,
        deleteClassified,
        toggleJobStatus,
        submitCommunityStory,
        updateStoryStatus,
        deleteCommunityStory,
        createAd,
        updateAd,
        deleteAd,
        recordAdClick,
        addCategory,
        updateCategory,
        deleteCategory,
        addLocation,
        updateLocation,
        deleteLocation,
        addFAQ,
        updateFAQ,
        deleteFAQ,
        updateConfig,
        updatePalette,
        updateHeaderConfig,
        updateHeaderNavLinks,
        addHeaderNavLink,
        updateHeaderNavLink,
        deleteHeaderNavLink,
        resetHeaderNavLinksToDefault,
        updateFooterConfig,
        updateStructureTexts,
        updateSocialLinks,
        updateSocialShareTemplates,
        updateInstitutional,
        updateContactInfo,
        updateAbout,
        updateAboutSection,
        resetAboutToDefault,
        updateDenunciaSection,
        resetDenunciaToDefault,
        updatePublicUtility,
        addPublicUtilityItem,
        updatePublicUtilityItem,
        deletePublicUtilityItem,
        resetPublicUtilityToDefault,
        toggleSectionVisibility,
        reorderSections,
        loadDemoData,
        resetToClean,
        exportDatabaseJSON,
        importDatabaseJSON,
        clearAuditLogs,
      }}
    >
      {children}
    </StoreContext.Provider>
  );
};

export const useStore = () => {
  const context = useContext(StoreContext);
  if (!context) {
    throw new Error('useStore must be used within a StoreProvider');
  }
  return context;
};
