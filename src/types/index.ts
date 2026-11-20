export type UserRole = 'admin' | 'reporter' | 'user';

export interface User {
  id: string;
  name: string;
  email: string;
  passwordHash: string; // Senha do usuário
  role: UserRole;
  avatar?: string;
  bio?: string;
  city?: string;
  status: 'active' | 'blocked';
  createdAt: string;
}

export type ArticleStatus = 'draft' | 'pending_review' | 'published' | 'rejected' | 'archived';

export interface Article {
  id: string;
  title: string;
  subtitle?: string;
  content: string;
  coverImage?: string;
  imageCaption?: string;
  imageCredit?: string;
  category: string;
  location: string;
  authorId: string;
  authorName: string;
  authorBio?: string;
  authorAvatar?: string;
  sources?: string;
  status: ArticleStatus;
  reviewNotes?: string;
  isFeatured?: boolean;
  viewsCount: number;
  publishedAt?: string;
  scheduledFor?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string;
  color?: string;
  order: number;
  isActive: boolean;
}

export interface FAQItem {
  id: string;
  question: string;
  answer: string;
  order: number;
  isActive: boolean;
}

export interface VideoItem {
  id: string;
  title: string;
  category: string;
  duration: string;
  thumbnailUrl: string;
  videoUrl: string;
  author: string;
  publishedAt: string;
}

export interface CommunityStory {
  id: string;
  submitterName: string;
  isAnonymous?: boolean;
  submitterContact?: string;
  location: string;
  neighborhood?: string;
  categorySuggestion: string;
  storyTitle: string;
  storyText: string;
  mediaType?: 'image' | 'video' | 'document' | 'none';
  mediaUrl?: string;
  mediaFileName?: string;
  evidenceNote?: string;
  urgency?: 'normal' | 'alta' | 'urgente';
  protocolNumber?: string;
  status: 'received' | 'investigating' | 'converted' | 'dismissed';
  createdAt: string;
}

export type AdPosition = 'header' | 'in_feed' | 'sidebar';
export type AdStatus = 'pending' | 'active' | 'paused' | 'expired';

export interface Advertisement {
  id: string;
  title: string;
  advertiserName: string;
  contact: string;
  bannerUrl: string;
  targetUrl: string;
  position: AdPosition;
  status: AdStatus;
  budgetOrValue?: string;
  impressions: number;
  clicks: number;
  startDate: string;
  endDate: string;
  createdAt: string;
}

export type JobType =
  | 'Tempo Integral (CLT)'
  | 'Meio Período'
  | 'Estágio'
  | 'Jovem Aprendiz'
  | 'Temporário'
  | 'Freelancer / Diária';

export interface ClassifiedItem {
  id: string;
  title: string;
  company: string;
  location: string;
  category: string; // 'Polo Industrial', 'Comércio & Vendas', 'Saúde & Cuidados', 'Educação & Estágios', 'Serviços & Manutenção'
  type: JobType;
  salary: string;
  description: string;
  requirements: string[];
  benefits?: string[];
  contactWhatsapp?: string;
  contactEmail?: string;
  contactPhone?: string;
  howToApply?: string;
  publishedAt: string;
  isFeatured?: boolean;
  status: 'active' | 'closed';
}

export interface PortalSectionsConfig {
  breakingNews: boolean;
  hero: boolean;
  cities: boolean;
  politics: boolean;
  police: boolean;
  sports: boolean;
  entertainment: boolean;
  videos: boolean;
  faq: boolean;
  latest: boolean;
  featured: boolean;
  categories: boolean;
  classifieds: boolean;
  publicUtility: boolean;
  locations: boolean;
  communityParticipates: boolean;
  advertisements: boolean;
  about: boolean;
  contactTransparency: boolean;
}

export interface InstitutionalPages {
  masthead: string; // Expediente
  editorialPrinciples: string; // Princípios Editoriais
  privacyPolicy: string; // LGPD e Privacidade
  correctionsPolicy: string; // Política de Correções e Direito de Resposta
  advertisingTerms: string; // Política de Publicidade
}

export interface ColorPaletteConfig {
  primaryColor: string; // ex: #0f3d59 ou #d32f2f
  accentColor: string; // ex: #f59e0b ou #ef4444
  headerBg: string; // ex: #0f172a
  newsTickerBg: string; // ex: #000000
  bodyBg: string; // ex: #f8fafc
}

export interface HeaderNavLink {
  id: string;
  label: string; // Ex: 'Sobre', 'Últimas Notícias', 'Destaques', 'Categorias', 'Utilidade Pública', 'Localidades', 'FAQ'
  targetSection: string; // Ex: 'sobre', 'ultimas-noticias', 'destaques', 'categorias', 'utilidade-publica', 'localidades', 'faq', 'comunidade-participa'
  badge?: string; // Ex: 'SOS', 'Novo', '100% AM'
  badgeColor?: 'red' | 'emerald' | 'amber' | 'blue' | 'slate';
  order: number;
  isVisible: boolean;
}

export interface HeaderConfig {
  showWeather: boolean;
  weatherLocation: string; // 'Manaus - AM'
  weatherTemp: string; // '29°C'
  weatherMinMax: string; // 'Min 24° · Max 33°'
  weatherCondition: string; // 'Tempo bom hoje'
  showSearch: boolean;
  showBreakingNews: boolean;
  breakingNewsTitle: string; // 'BREAKING NEWS'
  topTickerLabel?: string; // 'Plantão Amazonas'
  topTickerText?: string; // Notícia específica ou chamada no topo
  ctaButtonText?: string; // 'Fazer Denúncia'
  ctaButtonTarget?: string; // 'comunidade-participa'
  ctaButtonColor?: 'amber' | 'emerald' | 'red' | 'blue' | string;
  ctaButtonVisible?: boolean;
  logoType: 'text' | 'image';
  logoText: string; // 'COMUNIDADE EM AÇÃO'
  logoSubtext: string;
  logoImageUrl?: string;
  navLinks?: HeaderNavLink[];
}

export interface FooterConfig {
  aboutText: string;
  copyrightText: string;
  showSocials: boolean;
  discreetLockLabel: string;
}

export interface PublicUtilityItem {
  id: string;
  name: string;
  category: 'Segurança & Polícia' | 'Emergência & Resgate' | 'Saúde & SOS' | 'Defesa Civil & Rios' | 'Direitos & Proteção' | 'Serviços ao Cidadão';
  phone: string;
  whatsapp?: string;
  address: string;
  hours: string;
  description: string;
  isEmergency: boolean;
  order: number;
}

export interface DenunciaWhatToReportItem {
  id: string;
  text: string;
}

export interface DenunciaSectionConfig {
  eyebrow: string;
  title: string;
  subtitle: string;
  legalShieldTitle: string;
  legalShieldText: string;
  legalShieldNote: string;
  whatToReportTitle: string;
  whatToReportItems: DenunciaWhatToReportItem[];
}

export interface StructureTextsConfig {
  // Topo & Cabeçalho
  topTickerLabel?: string;
  topCtaButtonText?: string;

  // Capa Principal / Claquete 4K (Hero)
  heroKicker?: string;
  heroBadge?: string;
  heroBadgeText?: string;
  heroTitle?: string;
  heroSubtitle?: string;
  heroPresenterLabel?: string;
  heroPresenterName?: string;
  heroExploreBtn?: string;
  heroCommunityBtn?: string;
  heroAdBtn?: string;
  heroButtonExplore?: string;
  heroButtonReport?: string;
  heroButtonAd?: string;
  heroRecordingTitle?: string;
  heroRecordingSubtitle?: string;

  // Últimas Notícias
  latestEyebrow?: string;
  latestSectionTitle?: string;
  latestSectionSubtitle?: string;

  // Destaques Editoriais
  featuredEyebrow?: string;
  featuredSectionTitle?: string;
  featuredSectionSubtitle?: string;
  featuredCuratorshipBadge?: string;

  // Categorias & Editorias
  categoriesEyebrow?: string;
  categoriesSectionTitle?: string;
  categoriesSectionSubtitle?: string;

  // Utilidade Pública & Emergências
  publicUtilityEyebrow?: string;
  publicUtilitySectionTitle?: string;
  publicUtilitySectionSubtitle?: string;
  publicUtilityEmergencyBarTitle?: string;
  publicUtilityEmergencyBarSub?: string;
  publicUtilityEmergencyTitle?: string;
  publicUtilityEmergencySub?: string;

  // Localidades & Territórios
  locationsEyebrow?: string;
  locationsSectionTitle?: string;
  locationsSectionSubtitle?: string;

  // Canal de Denúncias
  denunciaEyebrow?: string;
  denunciaTitle?: string;
  denunciaSubtitle?: string;
  denunciaSectionTitle?: string;
  denunciaSectionSubtitle?: string;

  // FAQ
  faqEyebrow?: string;
  faqSectionTitle?: string;
  faqSectionSubtitle?: string;

  // Espaço Publicitário
  adsEyebrow?: string;
  adsSectionTitle?: string;
  adsSectionSubtitle?: string;

  // Sobre Kássio Cardoso & Portal
  aboutEyebrow?: string;
  aboutSectionTitle?: string;
  aboutQuoteLabel?: string;
  aboutQuoteText?: string;
  aboutGalleryTitle?: string;

  // Expediente & Conformidade
  contactEyebrow?: string;
  contactSectionTitle?: string;
  contactSectionSubtitle?: string;

  // Rodapé
  footerNavTitle?: string;
  footerInstTitle?: string;
  footerDirectChannelTitle?: string;

  // Compatibilidade com chaves anteriores
  heroSectionTitle?: string;
  citiesSectionTitle?: string;
  politicsSectionTitle?: string;
  policeSectionTitle?: string;
  sportsSectionTitle?: string;
  entertainmentSectionTitle?: string;
  videosSectionTitle?: string;
}

export interface AboutPillarItem {
  id: string;
  title: string;
  description: string;
  iconName: 'Compass' | 'HeartHandshake' | 'Award' | 'Shield' | 'Users' | 'MapPin' | 'Newspaper' | 'CheckCircle';
  order: number;
}

export interface AboutParagraphItem {
  id: string;
  text: string;
}

export interface AboutImageItem {
  id: string;
  url: string;
  caption: string;
  credit?: string;
  order: number;
}

export interface AboutSectionConfig {
  eyebrow: string; // Ex: "Quem Somos"
  title: string; // Ex: "Um Portal Nascido das Águas e das Vozes do Amazonas"
  founderPhotoUrl: string; // Foto de Kássio Cardoso
  founderBadge: string; // Ex: "Idealizador do Projeto"
  founderName: string; // Ex: "Kássio Cardoso"
  founderRole: string; // Ex: "Jornalista Comunitário · Amazonas"
  institutionalQuoteLabel: string; // Ex: "Assinatura Institucional"
  institutionalQuoteText: string; // Ex: "“A notícia nasce na comunidade.”"
  paragraphs: AboutParagraphItem[];
  pillars: AboutPillarItem[];
  additionalImages: AboutImageItem[];
}

export interface SocialShareTemplates {
  facebookTemplate: string;
  instagramTemplate: string;
  whatsappTemplate: string;
  defaultHashtags: string;
  enableDirectShareBar: boolean;
}

export interface PortalConfig {
  socialShare?: SocialShareTemplates;
  siteName: string;
  tagline: string;
  subtagline: string;
  authorCredit: string;
  heroTitle: string;
  heroSubtitle: string;
  heroImageUrl: string;
  contactEmail: string;
  contactPhone: string;
  contactAddress: string;
  adminPasswordMaster: string; // Senha master do painel do administrador
  socialLinks: {
    instagram: string;
    facebook: string;
    whatsapp: string;
    youtube: string;
    twitter: string;
    tiktok?: string;
  };
  palette: ColorPaletteConfig;
  header: HeaderConfig;
  footer: FooterConfig;
  structureTexts: StructureTextsConfig;
  sectionsOrder: (keyof PortalSectionsConfig)[];
  sectionsVisible: PortalSectionsConfig;
  institutional: InstitutionalPages;
  aboutConfig: AboutSectionConfig;
  denunciaConfig: DenunciaSectionConfig;
  publicUtility: {
    title: string;
    subtitle: string;
    items: PublicUtilityItem[];
  };
}

export interface AuditLog {
  id: string;
  userId: string;
  userName: string;
  action: string;
  targetEntity: string;
  details: string;
  timestamp: string;
}
