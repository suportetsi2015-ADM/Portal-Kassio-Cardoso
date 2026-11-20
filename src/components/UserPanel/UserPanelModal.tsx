import React, { useState } from 'react';
import { useStore } from '../../context/StoreContext';
import { Article, ArticleStatus } from '../../types';
import {
  X,
  FilePlus,
  Files,
  User,
  Megaphone,
  Bell,
  Save,
  Send,
  AlertCircle,
  CheckCircle2,
  Calendar,
  MapPin,
  Clock,
  RotateCcw,
  MessageSquare,
  Upload,
  Maximize2,
  Minimize2,
  Newspaper,
  LogOut,
} from 'lucide-react';
import { AdminEditorial } from '../AdminPanel/AdminEditorial';
import { AdminAds } from '../AdminPanel/AdminAds';

interface UserPanelModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialTab?: 'editorial' | 'ads' | 'editor' | 'my_articles' | 'my_stories' | 'notifications';
  onPreviewArticle?: (article: Article) => void;
}

export const UserPanelModal: React.FC<UserPanelModalProps> = ({
  isOpen,
  onClose,
  initialTab = 'editorial',
  onPreviewArticle,
}) => {
  const {
    currentUser,
    categories,
    locations,
    articles,
    communityStories,
    createArticle,
    updateArticle,
    createAd,
    logout,
  } = useStore();

  const [activeTab, setActiveTab] = useState(initialTab);
  const [isFullscreen, setIsFullscreen] = useState(false);

  // Pending count for editorial queue badge
  const pendingCount = articles.filter((a) => a.status === 'pending_review').length;

  // Editor states
  const [editingArticleId, setEditingArticleId] = useState<string | null>(null);
  const [title, setTitle] = useState('');
  const [subtitle, setSubtitle] = useState('');
  const [category, setCategory] = useState(categories[0]?.name || 'Comunidade');
  const [location, setLocation] = useState(locations[0] || 'Manaus (Capital)');
  const [content, setContent] = useState('');
  const [coverImage, setCoverImage] = useState('');
  const [imageCaption, setImageCaption] = useState('');
  const [imageCredit, setImageCredit] = useState('');
  const [sources, setSources] = useState('');
  const [editorMessage, setEditorMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Ad request states
  const [adTitle, setAdTitle] = useState('');
  const [adAdvertiser, setAdAdvertiser] = useState('');
  const [adContact, setAdContact] = useState('');
  const [adBannerUrl, setAdBannerUrl] = useState('');
  const [adTargetUrl, setAdTargetUrl] = useState('');
  const [adPosition, setAdPosition] = useState<'header' | 'in_feed' | 'sidebar'>('in_feed');
  const [adBudget, setAdBudget] = useState('R$ 500,00');
  const [adSuccess, setAdSuccess] = useState(false);

  // Filter user articles
  const myArticles = articles.filter(
    (a) => a.authorId === currentUser?.id || a.authorName === currentUser?.name
  );
  const [articlesSubFilter, setArticlesSubFilter] = useState<'all' | ArticleStatus>('all');

  const filteredMyArticles = myArticles.filter((a) =>
    articlesSubFilter === 'all' ? true : a.status === articlesSubFilter
  );

  // Filter stories submitted by this user (or all if simulated)
  const myStories = communityStories.filter(
    (s) =>
      s.submitterName.toLowerCase() === currentUser?.name.toLowerCase() ||
      s.submitterContact?.toLowerCase() === currentUser?.email.toLowerCase()
  );

  // User notifications (articles with reviewNotes or status updates)
  const notifications = myArticles.filter(
    (a) => a.reviewNotes || a.status === 'published' || a.status === 'rejected'
  );

  if (!isOpen || !currentUser) return null;

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      setCoverImage(event.target?.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleSaveArticle = (targetStatus: 'draft' | 'pending_review') => {
    setEditorMessage(null);
    if (!title.trim() || !content.trim()) {
      setEditorMessage({ type: 'error', text: 'Título e conteúdo da notícia são obrigatórios.' });
      return;
    }

    if (editingArticleId) {
      updateArticle(editingArticleId, {
        title,
        subtitle,
        category,
        location,
        content,
        coverImage,
        imageCaption,
        imageCredit,
        sources,
        status: targetStatus,
      });
      setEditorMessage({
        type: 'success',
        text: targetStatus === 'pending_review' ? 'Matéria atualizada e enviada para revisão da redação!' : 'Rascunho atualizado.',
      });
    } else {
      createArticle({
        title,
        subtitle,
        category,
        location,
        content,
        coverImage,
        imageCaption,
        imageCredit,
        sources,
        status: targetStatus,
        authorId: currentUser.id,
        authorName: currentUser.name,
        authorBio: currentUser.bio,
        authorAvatar: currentUser.avatar,
      });
      setEditorMessage({
        type: 'success',
        text: targetStatus === 'pending_review' ? 'Matéria submetida com sucesso! A redação irá avaliar.' : 'Rascunho salvo com sucesso.',
      });
      // Clear form
      setTitle('');
      setSubtitle('');
      setContent('');
      setCoverImage('');
      setSources('');
      setImageCaption('');
      setImageCredit('');
    }
  };

  const handleEditExisting = (art: Article) => {
    setEditingArticleId(art.id);
    setTitle(art.title);
    setSubtitle(art.subtitle || '');
    setCategory(art.category);
    setLocation(art.location);
    setContent(art.content);
    setCoverImage(art.coverImage || '');
    setImageCaption(art.imageCaption || '');
    setImageCredit(art.imageCredit || '');
    setSources(art.sources || '');
    setActiveTab('editor');
  };

  const handleNewArticleReset = () => {
    setEditingArticleId(null);
    setTitle('');
    setSubtitle('');
    setContent('');
    setCoverImage('');
    setSources('');
    setEditorMessage(null);
  };

  return (
    <div
      className={`fixed inset-0 z-50 flex ${
        isFullscreen ? 'p-0' : 'items-center justify-center p-2 sm:p-4'
      } bg-slate-950/80 backdrop-blur-xs overflow-y-auto animate-in fade-in`}
    >
      <div
        className={`bg-white ${
          isFullscreen
            ? 'w-screen h-screen rounded-none max-w-none'
            : 'rounded-2xl max-w-5xl w-full h-[90vh] my-auto'
        } overflow-hidden border border-slate-200 shadow-2xl flex flex-col font-sans transition-all duration-200`}
      >
        
        {/* Top Header */}
        <div className="bg-[#0f3d59] text-white px-6 py-4 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center font-bold text-sm">
              {currentUser.name.charAt(0)}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-base sm:text-lg">{currentUser.name}</span>
                <span className="text-[10px] bg-emerald-700/80 uppercase tracking-widest px-2 py-0.5 rounded-full font-semibold">
                  Operador / Redação Comunitária
                </span>
              </div>
              <span className="text-xs text-slate-300 font-sans block">
                Operador: {currentUser.name} · {currentUser.city || 'Amazonas'}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Opção SAIR da tela para segurança - força nova solicitação de senha */}
            <button
              onClick={() => {
                logout();
                onClose();
              }}
              className="px-3.5 py-1.5 bg-red-600 hover:bg-red-700 active:bg-red-800 text-white rounded-lg transition-colors cursor-pointer flex items-center gap-1.5 text-xs font-bold shadow-md hover:shadow-lg"
              title="Sair do Painel e Bloquear com Senha para Segurança"
            >
              <LogOut className="w-4 h-4" />
              <span>SAIR DA TELA (Segurança)</span>
            </button>

            <button
              onClick={() => setIsFullscreen(!isFullscreen)}
              className="px-2.5 py-1.5 text-white/80 hover:text-white hover:bg-white/10 rounded-lg transition-colors cursor-pointer flex items-center gap-1.5 text-xs font-medium"
              title={isFullscreen ? 'Sair da Tela Cheia' : 'Tornar em Tela Cheia'}
            >
              {isFullscreen ? (
                <>
                  <Minimize2 className="w-4 h-4 text-emerald-300" />
                  <span className="hidden sm:inline">Modo Janela</span>
                </>
              ) : (
                <>
                  <Maximize2 className="w-4 h-4 text-emerald-300" />
                  <span className="hidden sm:inline">Tela Cheia</span>
                </>
              )}
            </button>

            <button
              onClick={() => {
                logout();
                onClose();
              }}
              className="p-2 text-white/70 hover:text-white hover:bg-white/10 rounded-lg transition-colors cursor-pointer"
              title="Fechar Janela e Bloquear Sessão"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Tab Navigation (Fila Editorial, Banners, Redigir Notícias, Matérias, Pautas) */}
        <div className="flex border-b border-slate-200 bg-slate-50 px-6 overflow-x-auto scrollbar-none shrink-0 gap-1 py-1">
          <button
            onClick={() => setActiveTab('editorial')}
            className={`py-2.5 px-3.5 text-xs sm:text-sm font-semibold transition-colors flex items-center gap-2 whitespace-nowrap cursor-pointer rounded-lg ${
              activeTab === 'editorial'
                ? 'bg-white text-[#0f3d59] shadow-xs border border-slate-200 font-bold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Newspaper className="w-4 h-4 text-[#0f3d59]" />
            <span>Fila Editorial & Notícias</span>
            {pendingCount > 0 && (
              <span className="px-1.5 py-0.2 rounded-full text-[10px] font-bold bg-amber-400 text-slate-950">
                {pendingCount}
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveTab('ads')}
            className={`py-2.5 px-3.5 text-xs sm:text-sm font-semibold transition-colors flex items-center gap-2 whitespace-nowrap cursor-pointer rounded-lg ${
              activeTab === 'ads'
                ? 'bg-white text-[#0f3d59] shadow-xs border border-slate-200 font-bold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Megaphone className="w-4 h-4 text-emerald-800" />
            <span>Banners Publicitários</span>
          </button>

          <button
            onClick={() => setActiveTab('editor')}
            className={`py-2.5 px-3.5 text-xs sm:text-sm font-semibold transition-colors flex items-center gap-2 whitespace-nowrap cursor-pointer rounded-lg ${
              activeTab === 'editor'
                ? 'bg-white text-[#0f3d59] shadow-xs border border-slate-200 font-bold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <FilePlus className="w-4 h-4" />
            <span>{editingArticleId ? 'Editando Notícia' : 'Redigir Nova Notícia'}</span>
          </button>

          <button
            onClick={() => setActiveTab('my_articles')}
            className={`py-2.5 px-3.5 text-xs sm:text-sm font-semibold transition-colors flex items-center gap-2 whitespace-nowrap cursor-pointer rounded-lg ${
              activeTab === 'my_articles'
                ? 'bg-white text-[#0f3d59] shadow-xs border border-slate-200 font-bold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Files className="w-4 h-4" />
            <span>Minhas Matérias ({myArticles.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('my_stories')}
            className={`py-2.5 px-3.5 text-xs sm:text-sm font-semibold transition-colors flex items-center gap-2 whitespace-nowrap cursor-pointer rounded-lg ${
              activeTab === 'my_stories'
                ? 'bg-white text-[#0f3d59] shadow-xs border border-slate-200 font-bold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <MessageSquare className="w-4 h-4" />
            <span>Denúncias Recebidas (Pautas)</span>
          </button>

          <button
            onClick={() => setActiveTab('notifications')}
            className={`py-2.5 px-3.5 text-xs sm:text-sm font-semibold transition-colors flex items-center gap-2 whitespace-nowrap cursor-pointer rounded-lg ${
              activeTab === 'notifications'
                ? 'bg-white text-[#0f3d59] shadow-xs border border-slate-200 font-bold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Bell className="w-4 h-4" />
            <span>Notificações & Pareceres ({notifications.length})</span>
          </button>

          {/* Botão SAIR destacado na barra de navegação do painel */}
          <div className="ml-auto flex items-center pl-4 pr-1">
            <button
              onClick={() => {
                logout();
                onClose();
              }}
              className="px-3.5 py-1.5 bg-red-600 hover:bg-red-700 active:bg-red-800 text-white rounded-lg transition-colors cursor-pointer flex items-center gap-1.5 text-xs font-bold shrink-0 shadow-xs"
              title="Sair do Painel e Bloquear com Senha para Segurança"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Sair da Tela</span>
            </button>
          </div>
        </div>

        {/* Content Area */}
        <div className="p-6 sm:p-8 overflow-y-auto flex-1 bg-slate-50/50">
          
          {/* TAB: Fila Editorial & Notícias (Transferida para o Painel do Usuário/Operador) */}
          {activeTab === 'editorial' && (
            <AdminEditorial onPreviewArticle={onPreviewArticle} />
          )}

          {/* TAB: Banners Publicitários (Transferida para o Painel do Usuário/Operador) */}
          {activeTab === 'ads' && <AdminAds />}

          {/* TAB 1: Editor de Notícias */}
          {activeTab === 'editor' && (
            <div className="max-w-3xl mx-auto space-y-5 bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs">
              <div className="flex items-center justify-between pb-3 border-b border-slate-200">
                <div>
                  <h3 className="font-editorial text-xl font-bold text-slate-900">
                    {editingArticleId ? 'Edição de Matéria' : 'Redigir Nova Notícia Comunitária'}
                  </h3>
                  <p className="text-xs text-slate-500 font-sans">
                    Preencha as informações apuradas. Você pode salvar como rascunho ou submeter diretamente para a redação.
                  </p>
                </div>
                {editingArticleId && (
                  <button
                    onClick={handleNewArticleReset}
                    className="flex items-center gap-1 text-xs text-slate-500 hover:text-slate-800"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>Iniciar Nova</span>
                  </button>
                )}
              </div>

              {editorMessage && (
                <div
                  className={`p-3 rounded-lg text-xs flex items-center gap-2 ${
                    editorMessage.type === 'success'
                      ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                      : 'bg-red-50 text-red-800 border border-red-200'
                  }`}
                >
                  {editorMessage.type === 'success' ? (
                    <CheckCircle2 className="w-4 h-4 shrink-0" />
                  ) : (
                    <AlertCircle className="w-4 h-4 shrink-0" />
                  )}
                  <span>{editorMessage.text}</span>
                </div>
              )}

              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Título da Notícia *
                  </label>
                  <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Ex: Associação de Moradores do Ramal do Pau-Rosa recebe novo poço artesiano"
                    className="w-full px-3.5 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#0f3d59] focus:bg-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Subtítulo / Linha Fina (Opcional)
                  </label>
                  <input
                    type="text"
                    value={subtitle}
                    onChange={(e) => setSubtitle(e.target.value)}
                    placeholder="Breve resumo da notícia para os leitores"
                    className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#0f3d59] focus:bg-white"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Editoria / Categoria *
                    </label>
                    <select
                      value={category}
                      onChange={(e) => setCategory(e.target.value)}
                      className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#0f3d59] focus:bg-white"
                    >
                      {categories.map((c) => (
                        <option key={c.id} value={c.name}>
                          {c.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Município ou Bairro no Amazonas *
                    </label>
                    <select
                      value={location}
                      onChange={(e) => setLocation(e.target.value)}
                      className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#0f3d59] focus:bg-white"
                    >
                      {locations.map((loc) => (
                        <option key={loc} value={loc}>
                          {loc}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Cover image upload */}
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Foto de Capa da Notícia
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={coverImage}
                      onChange={(e) => setCoverImage(e.target.value)}
                      placeholder="URL da imagem ou faça upload..."
                      className="flex-1 px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#0f3d59]"
                    />
                    <label className="px-3 py-2 bg-slate-200 hover:bg-slate-300 text-slate-800 text-xs font-semibold rounded-lg flex items-center gap-1 cursor-pointer shrink-0">
                      <Upload className="w-3.5 h-3.5" />
                      <span>Upload</span>
                      <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
                    </label>
                  </div>
                  {coverImage && (
                    <div className="mt-2 max-w-xs rounded overflow-hidden border border-slate-200">
                      <img src={coverImage} alt="Preview" className="w-full h-24 object-cover" />
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Texto Completo da Notícia *
                  </label>
                  <textarea
                    rows={8}
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    placeholder="Escreva sua reportagem comunitária com clareza, fatos e detalhes apurados..."
                    className="w-full p-3.5 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#0f3d59] focus:bg-white font-sans leading-relaxed"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Fontes Consultadas & Depoimentos (Opcional)
                  </label>
                  <input
                    type="text"
                    value={sources}
                    onChange={(e) => setSources(e.target.value)}
                    placeholder="Ex: Entrevista com líder comunitário José e nota da secretaria municipal"
                    className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#0f3d59] focus:bg-white"
                  />
                </div>

                <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-200">
                  <button
                    type="button"
                    onClick={() => handleSaveArticle('draft')}
                    className="px-4 py-2.5 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg flex items-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <Save className="w-3.5 h-3.5" />
                    <span>Salvar Rascunho</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleSaveArticle('pending_review')}
                    className="px-5 py-2.5 text-xs font-bold text-white bg-[#0f3d59] hover:bg-[#0a2540] rounded-lg flex items-center gap-1.5 transition-colors cursor-pointer shadow-xs"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>Enviar para Revisão Editorial</span>
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: Minhas Matérias */}
          {activeTab === 'my_articles' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-200">
                <h3 className="font-editorial text-xl font-bold text-slate-900">
                  Minhas Matérias ({myArticles.length})
                </h3>
              </div>

              {filteredMyArticles.length > 0 ? (
                <div className="space-y-3">
                  {filteredMyArticles.map((art) => (
                    <div
                      key={art.id}
                      className="p-4 bg-white rounded-xl border border-slate-200 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                    >
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span
                            className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                              art.status === 'published'
                                ? 'bg-emerald-100 text-emerald-800'
                                : art.status === 'pending_review'
                                ? 'bg-amber-100 text-amber-800'
                                : art.status === 'rejected'
                                ? 'bg-red-100 text-red-800'
                                : 'bg-slate-100 text-slate-700'
                            }`}
                          >
                            {art.status === 'published'
                              ? 'Publicada'
                              : art.status === 'pending_review'
                              ? 'Em Revisão'
                              : art.status === 'rejected'
                              ? 'Devolvida'
                              : 'Rascunho'}
                          </span>
                          <span className="text-xs text-slate-400">· {art.category}</span>
                        </div>
                        <h4 className="font-bold text-sm text-slate-900">{art.title}</h4>
                        {art.reviewNotes && (
                          <p className="text-xs text-amber-900 bg-amber-50 p-2 rounded border border-amber-200 mt-1">
                            <strong>Parecer da Redação:</strong> {art.reviewNotes}
                          </p>
                        )}
                      </div>

                      <button
                        onClick={() => handleEditExisting(art)}
                        className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 font-semibold text-xs rounded-lg shrink-0"
                      >
                        Editar
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-10 text-center bg-white rounded-xl border border-dashed border-slate-300 text-slate-500 text-xs">
                  Você ainda não cadastrou nenhuma matéria. Clique em "Redigir Notícia" para começar!
                </div>
              )}
            </div>
          )}

          {/* TAB 3: Minhas Denúncias Enviadas */}
          {activeTab === 'my_stories' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-200">
                <h3 className="font-editorial text-xl font-bold text-slate-900">
                  Denúncias e Relatos Enviados por Você
                </h3>
              </div>

              {myStories.length > 0 ? (
                <div className="space-y-3">
                  {myStories.map((story) => (
                    <div
                      key={story.id}
                      className="p-4 bg-white rounded-xl border border-slate-200 shadow-2xs space-y-2"
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-mono text-xs bg-slate-100 text-slate-800 px-2 py-0.5 rounded font-bold">
                          Protocolo: {story.protocolNumber || story.id.slice(0, 10)}
                        </span>
                        <span className="text-xs text-emerald-800 font-bold uppercase">
                          Status: {story.status}
                        </span>
                      </div>
                      <h4 className="font-bold text-sm text-slate-900">{story.storyTitle}</h4>
                      <p className="text-xs text-slate-600 line-clamp-2">{story.storyText}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-10 text-center bg-white rounded-xl border border-dashed border-slate-300 text-slate-500 text-xs">
                  Nenhuma denúncia associada aos seus dados. Você pode realizar denúncias no formulário público "Canal de Denúncias".
                </div>
              )}
            </div>
          )}

          {/* TAB 4: Notificações */}
          {activeTab === 'notifications' && (
            <div className="space-y-4">
              <h3 className="font-editorial text-xl font-bold text-slate-900 pb-3 border-b border-slate-200">
                Notificações da Redação ({notifications.length})
              </h3>
              {notifications.length > 0 ? (
                notifications.map((n) => (
                  <div key={n.id} className="p-4 bg-white rounded-xl border border-slate-200 space-y-1">
                    <span className="text-xs font-bold text-slate-800 block">{n.title}</span>
                    <p className="text-xs text-slate-600">
                      Status atual: <strong className="capitalize">{n.status}</strong>
                    </p>
                    {n.reviewNotes && (
                      <p className="text-xs bg-slate-50 p-2 rounded text-slate-700 mt-2">
                        {n.reviewNotes}
                      </p>
                    )}
                  </div>
                ))
              ) : (
                <div className="p-10 text-center bg-white rounded-xl border border-dashed border-slate-300 text-slate-500 text-xs">
                  Nenhuma notificação recente.
                </div>
              )}
            </div>
          )}
        </div>

        {/* Barra de Status e Segurança de Sessão */}
        <div className="bg-slate-100 border-t border-slate-200 px-6 py-2.5 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-slate-600 shrink-0">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            <span>
              Sessão Ativa: <strong>{currentUser.name}</strong> · Bloqueada por segurança ao sair.
            </span>
          </div>
          <button
            onClick={() => {
              logout();
              onClose();
            }}
            className="px-3 py-1.5 bg-red-600 hover:bg-red-700 active:bg-red-800 text-white rounded-lg font-bold text-xs flex items-center gap-1.5 cursor-pointer transition-colors shadow-xs"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Encerrar Sessão & Bloquear ONE PAGE</span>
          </button>
        </div>
      </div>
    </div>
  );
};
