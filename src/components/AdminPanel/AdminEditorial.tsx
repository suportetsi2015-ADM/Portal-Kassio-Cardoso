import React, { useState } from 'react';
import { useStore } from '../../context/StoreContext';
import { Article, ArticleStatus, Category } from '../../types';
import {
  FileCheck2,
  PlusCircle,
  Edit,
  Trash2,
  CheckCircle2,
  XCircle,
  Eye,
  Sparkles,
  Calendar,
  MapPin,
  X,
  Upload,
  BookOpen,
  Newspaper,
} from 'lucide-react';
import { compressImageFile } from '../../utils/imageCompression';

interface AdminEditorialProps {
  onPreviewArticle?: (article: Article) => void;
  prefillFromStory?: { title: string; text: string; location: string } | null;
}

export const AdminEditorial: React.FC<AdminEditorialProps> = ({
  onPreviewArticle,
  prefillFromStory,
}) => {
  const {
    articles,
    categories,
    locations,
    currentUser,
    createArticle,
    updateArticle,
    deleteArticle,
    reviewArticle,
    addCategory,
    deleteCategory,
  } = useStore();

  const [activeSubTab, setActiveSubTab] = useState<'articles' | 'new_article' | 'categories'>('articles');
  const [selectedArticleForReview, setSelectedArticleForReview] = useState<Article | null>(null);
  const [reviewNotes, setReviewNotes] = useState('');
  const [editingArticle, setEditingArticle] = useState<Article | null>(null);

  // New Article Form
  const [title, setTitle] = useState(prefillFromStory?.title || '');
  const [subtitle, setSubtitle] = useState('');
  const [category, setCategory] = useState(categories[0]?.name || 'Comunidade');
  const [location, setLocation] = useState(prefillFromStory?.location || locations[0] || 'Manaus (Capital)');
  const [content, setContent] = useState(prefillFromStory?.text || '');
  const [coverImage, setCoverImage] = useState('');
  const [imageCaption, setImageCaption] = useState('');
  const [imageCredit, setImageCredit] = useState('');
  const [isFeatured, setIsFeatured] = useState(false);

  // New Category Form
  const [newCatName, setNewCatName] = useState('');
  const [newCatDesc, setNewCatDesc] = useState('');

  const [feedbackMsg, setFeedbackMsg] = useState<string | null>(null);

  const notify = (msg: string) => {
    setFeedbackMsg(msg);
    setTimeout(() => setFeedbackMsg(null), 3000);
  };

  const pendingArticles = articles.filter((a) => a.status === 'pending_review');

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>, isEdit = false) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const compressed = await compressImageFile(file, 1000, 750, 0.82);
      if (isEdit && editingArticle) {
        setEditingArticle({ ...editingArticle, coverImage: compressed });
      } else {
        setCoverImage(compressed);
      }
    } catch {
      const reader = new FileReader();
      reader.onload = (event) => {
        const result = event.target?.result as string;
        if (isEdit && editingArticle) {
          setEditingArticle({ ...editingArticle, coverImage: result });
        } else {
          setCoverImage(result);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCreateArticleSubmit = (e: React.FormEvent, status: ArticleStatus = 'published') => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) {
      alert('Título e conteúdo são obrigatórios.');
      return;
    }

    createArticle({
      title: title.trim(),
      subtitle: subtitle.trim() || undefined,
      content: content.trim(),
      category,
      location,
      coverImage: coverImage.trim() || undefined,
      imageCaption: imageCaption.trim() || undefined,
      imageCredit: imageCredit.trim() || undefined,
      isFeatured,
      status,
      authorId: currentUser?.id || 'admin',
      authorName: currentUser?.name || 'Redação Comunidade em Ação',
      authorBio: currentUser?.bio || 'Coordenação Geral de Redação',
      authorAvatar: currentUser?.avatar,
    });

    notify(`Matéria "${title}" ${status === 'published' ? 'publicada' : 'salva como rascunho'} com sucesso!`);
    setTitle('');
    setSubtitle('');
    setContent('');
    setCoverImage('');
    setIsFeatured(false);
    setActiveSubTab('articles');
  };

  const handleSaveEditArticle = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingArticle) return;

    updateArticle(editingArticle.id, {
      title: editingArticle.title,
      subtitle: editingArticle.subtitle,
      content: editingArticle.content,
      category: editingArticle.category,
      location: editingArticle.location,
      coverImage: editingArticle.coverImage,
      imageCaption: editingArticle.imageCaption,
      imageCredit: editingArticle.imageCredit,
      isFeatured: editingArticle.isFeatured,
      status: editingArticle.status,
    });

    notify('Matéria atualizada com sucesso!');
    setEditingArticle(null);
  };

  const handleApprove = (art: Article) => {
    reviewArticle(art.id, 'published', reviewNotes.trim() || 'Matéria revisada e aprovada pela coordenação editorial.');
    notify(`Matéria "${art.title}" aprovada e publicada no portal!`);
    setSelectedArticleForReview(null);
    setReviewNotes('');
  };

  const handleReject = (art: Article) => {
    if (!reviewNotes.trim()) {
      alert('Informe a justificativa editorial para devolver esta matéria ao autor.');
      return;
    }
    reviewArticle(art.id, 'rejected', reviewNotes.trim());
    notify(`Matéria devolvida ao colaborador com as observações.`);
    setSelectedArticleForReview(null);
    setReviewNotes('');
  };

  const handleDelete = (id: string, artTitle: string) => {
    if (confirm(`Deseja excluir permanentemente a matéria "${artTitle}"?`)) {
      deleteArticle(id);
      notify('Matéria excluída.');
    }
  };

  const handleAddCategory = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCatName.trim()) return;

    addCategory({
      name: newCatName.trim(),
      slug: newCatName.toLowerCase().replace(/\s+/g, '-'),
      description: newCatDesc.trim() || 'Editoria temática local.',
      order: categories.length + 1,
      isActive: true,
      color: '#0f3d59',
    });

    notify(`Editoria "${newCatName}" criada com sucesso!`);
    setNewCatName('');
    setNewCatDesc('');
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-3 border-b border-slate-200">
        <div>
          <h3 className="font-editorial text-2xl font-bold text-slate-900 flex items-center gap-2">
            <Newspaper className="w-6 h-6 text-[#0f3d59]" />
            <span>Fila Editorial, Redação & Categorias</span>
          </h3>
          <p className="text-xs text-slate-500 font-sans">
            Aprove reportagens enviadas por repórteres, publique novas matérias institucionais e organize as editorias.
          </p>
        </div>

        {/* Subtab navigation */}
        <div className="flex items-center gap-1.5 self-start sm:self-auto">
          <button
            onClick={() => setActiveSubTab('articles')}
            className={`px-3 py-1.5 text-xs font-bold rounded-lg cursor-pointer ${
              activeSubTab === 'articles' ? 'bg-[#0f3d59] text-white' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            Todas ({articles.length})
          </button>
          <button
            onClick={() => setActiveSubTab('new_article')}
            className={`px-3 py-1.5 text-xs font-bold rounded-lg flex items-center gap-1 cursor-pointer ${
              activeSubTab === 'new_article' ? 'bg-[#0f3d59] text-white' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            <PlusCircle className="w-3.5 h-3.5" />
            <span>Redigir Matéria</span>
          </button>
          <button
            onClick={() => setActiveSubTab('categories')}
            className={`px-3 py-1.5 text-xs font-bold rounded-lg cursor-pointer ${
              activeSubTab === 'categories' ? 'bg-[#0f3d59] text-white' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            Editorias ({categories.length})
          </button>
        </div>
      </div>

      {feedbackMsg && (
        <div className="p-3 bg-emerald-50 border border-emerald-300 rounded-xl text-xs text-emerald-800 font-semibold flex items-center gap-2 animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0" />
          <span>{feedbackMsg}</span>
        </div>
      )}

      {/* Review Banner if an article is pending review */}
      {selectedArticleForReview && (
        <div className="p-5 bg-amber-50 border-2 border-amber-300 rounded-xl space-y-3 animate-in fade-in">
          <div className="flex items-center justify-between">
            <h4 className="font-editorial text-base font-bold text-amber-950">
              Parecer Editorial: “{selectedArticleForReview.title}”
            </h4>
            <button
              onClick={() => setSelectedArticleForReview(null)}
              className="text-xs text-slate-500 hover:text-slate-800"
            >
              Cancelar
            </button>
          </div>

          <div>
            <label className="block text-xs font-semibold text-amber-900 mb-1">
              Justificativa ou Observações da Redação:
            </label>
            <textarea
              rows={2}
              value={reviewNotes}
              onChange={(e) => setReviewNotes(e.target.value)}
              placeholder="Ex: Matéria verificada e aprovada com destaque. Ou: Solicitar foto em melhor resolução da comunidade."
              className="w-full p-2.5 text-xs bg-white border border-amber-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-amber-500"
            />
          </div>

          <div className="flex gap-2">
            <button
              onClick={() => handleApprove(selectedArticleForReview)}
              className="px-4 py-2 text-xs font-bold text-white bg-emerald-800 hover:bg-emerald-900 rounded-lg flex items-center gap-1.5 cursor-pointer shadow-xs"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>Aprovar & Publicar no Portal</span>
            </button>
            <button
              onClick={() => handleReject(selectedArticleForReview)}
              className="px-4 py-2 text-xs font-bold text-red-800 bg-red-100 hover:bg-red-200 rounded-lg flex items-center gap-1.5 cursor-pointer"
            >
              <XCircle className="w-4 h-4" />
              <span>Devolver com Justificativa</span>
            </button>
          </div>
        </div>
      )}

      {/* SUBTAB 1: Articles Table */}
      {activeSubTab === 'articles' && (
        <div className="space-y-4">
          {pendingArticles.length > 0 && (
            <div className="p-3 bg-amber-100/70 border border-amber-300 rounded-xl flex items-center justify-between text-xs text-amber-900 font-semibold">
              <span>⚠️ Existem {pendingArticles.length} matérias aguardando revisão editorial!</span>
            </div>
          )}

          <div className="border border-slate-200 rounded-xl overflow-hidden bg-white shadow-2xs">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 border-b border-slate-200 text-slate-700 font-semibold">
                  <tr>
                    <th className="p-3">Notícia</th>
                    <th className="p-3">Editoria</th>
                    <th className="p-3">Local</th>
                    <th className="p-3">Autor</th>
                    <th className="p-3">Status</th>
                    <th className="p-3">Destaque</th>
                    <th className="p-3 text-right">Ações</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {articles.length > 0 ? (
                    articles.map((art) => (
                      <tr key={art.id} className="hover:bg-slate-50/80 transition-colors">
                        <td className="p-3 font-semibold text-slate-900 max-w-xs truncate">
                          {art.title}
                        </td>
                        <td className="p-3 text-slate-600">{art.category}</td>
                        <td className="p-3 text-slate-600">{art.location}</td>
                        <td className="p-3 text-slate-600">{art.authorName}</td>
                        <td className="p-3">
                          <span
                            className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                              art.status === 'published'
                                ? 'bg-emerald-100 text-emerald-900'
                                : art.status === 'pending_review'
                                ? 'bg-amber-100 text-amber-900'
                                : art.status === 'rejected'
                                ? 'bg-red-100 text-red-900'
                                : 'bg-slate-100 text-slate-800'
                            }`}
                          >
                            {art.status === 'published'
                              ? 'Publicada'
                              : art.status === 'pending_review'
                              ? 'Pendente'
                              : art.status === 'rejected'
                              ? 'Rejeitada'
                              : 'Rascunho'}
                          </span>
                        </td>
                        <td className="p-3">
                          <button
                            onClick={() =>
                              updateArticle(art.id, { isFeatured: !art.isFeatured })
                            }
                            className={`p-1 rounded cursor-pointer ${
                              art.isFeatured ? 'text-amber-500 hover:text-amber-600' : 'text-slate-300 hover:text-slate-400'
                            }`}
                            title="Alternar Destaque"
                          >
                            <Sparkles className="w-4 h-4 fill-current" />
                          </button>
                        </td>
                        <td className="p-3 text-right">
                          <div className="flex items-center justify-end gap-1">
                            {art.status === 'pending_review' && (
                              <button
                                onClick={() => setSelectedArticleForReview(art)}
                                title="Aprovar/Devolver"
                                className="px-2 py-1 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold rounded text-[10px] cursor-pointer"
                              >
                                Avaliar
                              </button>
                            )}
                            {onPreviewArticle && (
                              <button
                                onClick={() => onPreviewArticle(art)}
                                title="Visualizar"
                                className="p-1.5 text-slate-500 hover:text-[#0f3d59] rounded"
                              >
                                <Eye className="w-4 h-4" />
                              </button>
                            )}
                            <button
                              onClick={() => setEditingArticle(art)}
                              title="Editar"
                              className="p-1.5 text-slate-500 hover:text-[#0f3d59] rounded"
                            >
                              <Edit className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleDelete(art.id, art.title)}
                              title="Excluir"
                              className="p-1.5 text-slate-500 hover:text-red-700 rounded"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={7} className="p-8 text-center text-slate-500">
                        Nenhuma matéria cadastrada. Clique em "Redigir Matéria" para começar!
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* SUBTAB 2: Create Article as Admin */}
      {activeSubTab === 'new_article' && (
        <form onSubmit={(e) => handleCreateArticleSubmit(e, 'published')} className="bg-white p-6 border border-slate-200 rounded-xl space-y-4 shadow-2xs">
          <h4 className="font-editorial text-lg font-bold text-slate-900">
            Nova Matéria Jornalística (Publicação Direta da Redação)
          </h4>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Título da Notícia *</label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Ex: Ribeirinhos realizam mutirão comunitário para limpeza de igarapé em Tefé"
              className="w-full px-3.5 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#0f3d59] focus:bg-white font-medium"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Subtítulo / Linha Fina (Opcional)</label>
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
              <label className="block text-xs font-semibold text-slate-700 mb-1">Editoria / Categoria</label>
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
              <label className="block text-xs font-semibold text-slate-700 mb-1">Território / Localidade</label>
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

          {/* Cover image */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Imagem de Capa (Upload ou URL)
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                value={coverImage}
                onChange={(e) => setCoverImage(e.target.value)}
                placeholder="https://exemplo.com/foto-materia.jpg"
                className="flex-1 px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#0f3d59]"
              />
              <label className="px-3 py-2 bg-slate-200 hover:bg-slate-300 text-slate-800 text-xs font-semibold rounded-lg flex items-center gap-1 cursor-pointer shrink-0">
                <Upload className="w-3.5 h-3.5" />
                <span>Upload</span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleImageUpload(e, false)}
                  className="hidden"
                />
              </label>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Corpo da Notícia / Texto Completo *
            </label>
            <textarea
              rows={8}
              required
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Escreva a apuração completa da reportagem..."
              className="w-full px-3.5 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#0f3d59] focus:bg-white font-sans leading-relaxed"
            />
          </div>

          <div className="flex items-center gap-2 pt-2">
            <label className="flex items-center gap-2 text-xs font-semibold text-slate-800 cursor-pointer">
              <input
                type="checkbox"
                checked={isFeatured}
                onChange={(e) => setIsFeatured(e.target.checked)}
                className="rounded text-amber-500 focus:ring-amber-500"
              />
              <span>Destacar esta reportagem no topo do portal</span>
            </label>
          </div>

          <div className="flex justify-end gap-3 pt-3 border-t border-slate-100">
            <button
              type="button"
              onClick={(e) => handleCreateArticleSubmit(e, 'draft')}
              className="px-4 py-2 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg cursor-pointer"
            >
              Salvar como Rascunho
            </button>
            <button
              type="submit"
              className="px-5 py-2 text-xs font-bold text-white bg-[#0f3d59] hover:bg-[#0a2540] rounded-lg cursor-pointer shadow-xs"
            >
              Publicar Imediatamente
            </button>
          </div>
        </form>
      )}

      {/* SUBTAB 3: Categories Management */}
      {activeSubTab === 'categories' && (
        <div className="space-y-5">
          <form onSubmit={handleAddCategory} className="bg-white p-4 border border-slate-200 rounded-xl shadow-2xs flex flex-col sm:flex-row gap-3">
            <input
              type="text"
              required
              value={newCatName}
              onChange={(e) => setNewCatName(e.target.value)}
              placeholder="Nome da nova editoria (Ex: Meio Ambiente, Saúde)..."
              className="flex-1 px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#0f3d59]"
            />
            <input
              type="text"
              value={newCatDesc}
              onChange={(e) => setNewCatDesc(e.target.value)}
              placeholder="Breve descrição da editoria..."
              className="flex-1 px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#0f3d59]"
            />
            <button
              type="submit"
              className="px-4 py-2 bg-[#0f3d59] hover:bg-[#0a2540] text-white text-xs font-bold rounded-lg cursor-pointer shrink-0"
            >
              Adicionar Editoria
            </button>
          </form>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {categories.map((c) => (
              <div
                key={c.id}
                className="bg-white p-4 border border-slate-200 rounded-xl shadow-2xs flex items-center justify-between"
              >
                <div>
                  <h5 className="font-bold text-sm text-slate-900">{c.name}</h5>
                  <p className="text-[11px] text-slate-500">{c.description}</p>
                </div>
                <button
                  onClick={() => deleteCategory(c.id)}
                  className="p-1.5 text-slate-400 hover:text-red-700 hover:bg-red-50 rounded"
                  title="Excluir Categoria"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Modal: Editar Matéria */}
      {editingArticle && (
        <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-2xs animate-in fade-in">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[92vh] overflow-y-auto p-6 border border-slate-200 shadow-2xl relative">
            <button
              onClick={() => setEditingArticle(null)}
              className="absolute top-4 right-4 p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100"
            >
              <X className="w-5 h-5" />
            </button>

            <h4 className="font-editorial text-xl font-bold text-slate-900 mb-1 flex items-center gap-2">
              <Edit className="w-5 h-5 text-[#0f3d59]" />
              <span>Editar Matéria</span>
            </h4>

            <form onSubmit={handleSaveEditArticle} className="space-y-3 mt-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Título</label>
                <input
                  type="text"
                  required
                  value={editingArticle.title}
                  onChange={(e) => setEditingArticle({ ...editingArticle, title: e.target.value })}
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#0f3d59]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Subtítulo</label>
                <input
                  type="text"
                  value={editingArticle.subtitle || ''}
                  onChange={(e) => setEditingArticle({ ...editingArticle, subtitle: e.target.value })}
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#0f3d59]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Editoria</label>
                  <select
                    value={editingArticle.category}
                    onChange={(e) => setEditingArticle({ ...editingArticle, category: e.target.value })}
                    className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg"
                  >
                    {categories.map((c) => (
                      <option key={c.id} value={c.name}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Status</label>
                  <select
                    value={editingArticle.status}
                    onChange={(e) => setEditingArticle({ ...editingArticle, status: e.target.value as ArticleStatus })}
                    className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg"
                  >
                    <option value="published">Publicada</option>
                    <option value="pending_review">Pendente de Revisão</option>
                    <option value="draft">Rascunho</option>
                    <option value="rejected">Rejeitada</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Conteúdo da Notícia</label>
                <textarea
                  rows={8}
                  required
                  value={editingArticle.content}
                  onChange={(e) => setEditingArticle({ ...editingArticle, content: e.target.value })}
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#0f3d59]"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setEditingArticle(null)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-lg"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-bold text-white bg-[#0f3d59] hover:bg-[#0a2540] rounded-lg cursor-pointer"
                >
                  Salvar Alterações
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
