import React, { useState } from 'react';
import { useStore } from '../../context/StoreContext';
import { Advertisement, AdPosition, AdStatus } from '../../types';
import {
  Megaphone,
  PlusCircle,
  Edit,
  Trash2,
  CheckCircle2,
  X,
  Upload,
  ExternalLink,
  Eye,
  MousePointerClick,
} from 'lucide-react';
import { compressImageFile } from '../../utils/imageCompression';

export const AdminAds: React.FC = () => {
  const { advertisements, createAd, updateAd, deleteAd } = useStore();

  const [isAdding, setIsAdding] = useState(false);
  const [editingAd, setEditingAd] = useState<Advertisement | null>(null);

  // New Ad form
  const [title, setTitle] = useState('');
  const [advertiserName, setAdvertiserName] = useState('');
  const [contact, setContact] = useState('');
  const [bannerUrl, setBannerUrl] = useState('');
  const [targetUrl, setTargetUrl] = useState('');
  const [position, setPosition] = useState<AdPosition>('header');
  const [budgetOrValue, setBudgetOrValue] = useState('R$ 800,00/mês');
  const [startDate, setStartDate] = useState(new Date().toISOString().slice(0, 10));
  const [endDate, setEndDate] = useState(
    new Date(Date.now() + 30 * 24 * 3600 * 1000).toISOString().slice(0, 10)
  );

  const [feedbackMsg, setFeedbackMsg] = useState<string | null>(null);

  const notify = (msg: string) => {
    setFeedbackMsg(msg);
    setTimeout(() => setFeedbackMsg(null), 3000);
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, isEdit = false) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const result = await compressImageFile(file, 900, 500, 0.82);
      if (isEdit && editingAd) {
        setEditingAd({ ...editingAd, bannerUrl: result });
      } else {
        setBannerUrl(result);
      }
    } catch {
      const reader = new FileReader();
      reader.onload = (event) => {
        const result = event.target?.result as string;
        if (isEdit && editingAd) {
          setEditingAd({ ...editingAd, bannerUrl: result });
        } else {
          setBannerUrl(result);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !advertiserName.trim() || !bannerUrl.trim()) {
      alert('Preencha os campos obrigatórios (Campanha, Anunciante e Imagem do Banner).');
      return;
    }

    createAd({
      title: title.trim(),
      advertiserName: advertiserName.trim(),
      contact: contact.trim(),
      bannerUrl: bannerUrl.trim(),
      targetUrl: targetUrl.trim() || '#',
      position,
      status: 'active',
      budgetOrValue,
      startDate,
      endDate,
    });

    notify('Banner publicitário cadastrado e ativado com sucesso!');
    setIsAdding(false);
    setTitle('');
    setAdvertiserName('');
    setContact('');
    setBannerUrl('');
    setTargetUrl('');
  };

  const handleSaveEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingAd) return;

    updateAd(editingAd.id, {
      title: editingAd.title,
      advertiserName: editingAd.advertiserName,
      contact: editingAd.contact,
      bannerUrl: editingAd.bannerUrl,
      targetUrl: editingAd.targetUrl,
      position: editingAd.position,
      status: editingAd.status,
      budgetOrValue: editingAd.budgetOrValue,
      startDate: editingAd.startDate,
      endDate: editingAd.endDate,
    });

    notify('Banner atualizado com sucesso!');
    setEditingAd(null);
  };

  const handleDelete = (id: string, adTitle: string) => {
    if (confirm(`Deseja excluir o banner "${adTitle}"?`)) {
      deleteAd(id);
      notify('Banner removido.');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-3 border-b border-slate-200">
        <div>
          <h3 className="font-editorial text-2xl font-bold text-slate-900 flex items-center gap-2">
            <Megaphone className="w-6 h-6 text-amber-600" />
            <span>Banners Publicitários & Anúncios Comerciais ({advertisements.length})</span>
          </h3>
          <p className="text-xs text-slate-500 font-sans">
            Insira, edite e acompanhe banners publicitários no topo da página (Header), entre as notícias (In-Feed) ou laterais, com métricas de cliques.
          </p>
        </div>

        <button
          onClick={() => setIsAdding(true)}
          className="px-4 py-2 bg-[#0f3d59] hover:bg-[#0a2540] text-white text-xs font-bold rounded-lg transition-colors flex items-center gap-2 cursor-pointer shadow-xs self-start sm:self-auto"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Postar Novo Banner Publicitário</span>
        </button>
      </div>

      {feedbackMsg && (
        <div className="p-3 bg-emerald-50 border border-emerald-300 rounded-xl text-xs text-emerald-800 font-semibold flex items-center gap-2 animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0" />
          <span>{feedbackMsg}</span>
        </div>
      )}

      {/* Ads List Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {advertisements.map((ad) => (
          <div
            key={ad.id}
            className="bg-white border border-slate-200 rounded-xl p-5 shadow-2xs hover:shadow-sm transition-all space-y-3 flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between text-xs mb-2">
                <span className="font-bold text-slate-900 flex items-center gap-1.5">
                  <span
                    className={`w-2 h-2 rounded-full ${
                      ad.status === 'active' ? 'bg-emerald-500' : 'bg-amber-500'
                    }`}
                  />
                  <span>{ad.advertiserName}</span>
                </span>
                <span className="text-[10px] uppercase tracking-wider font-bold bg-slate-100 text-slate-700 px-2 py-0.5 rounded">
                  Posição: {ad.position}
                </span>
              </div>

              <h4 className="font-editorial text-base font-bold text-slate-900">{ad.title}</h4>

              {/* Banner Image Preview */}
              <div className="mt-2 rounded-lg overflow-hidden border border-slate-200 bg-slate-100 max-h-32 flex items-center justify-center">
                <img
                  src={ad.bannerUrl}
                  alt={ad.title}
                  className="w-full h-28 object-cover"
                />
              </div>

              {/* Metrics */}
              <div className="grid grid-cols-2 gap-2 mt-3 p-2 bg-slate-50 rounded-lg text-xs">
                <div className="flex items-center gap-1.5 text-slate-600">
                  <Eye className="w-3.5 h-3.5 text-slate-400" />
                  <span>Impressões: <strong>{ad.impressions || 0}</strong></span>
                </div>
                <div className="flex items-center gap-1.5 text-slate-600">
                  <MousePointerClick className="w-3.5 h-3.5 text-amber-600" />
                  <span>Cliques: <strong>{ad.clicks || 0}</strong></span>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <button
                  onClick={() =>
                    updateAd(ad.id, {
                      status: ad.status === 'active' ? 'paused' : 'active',
                    })
                  }
                  className={`px-2.5 py-1 text-xs font-bold rounded cursor-pointer ${
                    ad.status === 'active'
                      ? 'bg-emerald-50 text-emerald-800 hover:bg-emerald-100'
                      : 'bg-amber-50 text-amber-800 hover:bg-amber-100'
                  }`}
                >
                  {ad.status === 'active' ? 'Ativo (Pausar)' : 'Pausado (Ativar)'}
                </button>
                {ad.targetUrl && ad.targetUrl !== '#' && (
                  <a
                    href={ad.targetUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-1 text-slate-400 hover:text-slate-700"
                    title="Visitar Link de Destino"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                )}
              </div>

              <div className="flex items-center gap-1">
                <button
                  onClick={() => setEditingAd(ad)}
                  className="p-1.5 text-slate-500 hover:text-[#0f3d59] hover:bg-slate-100 rounded cursor-pointer"
                  title="Editar Anúncio"
                >
                  <Edit className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleDelete(ad.id, ad.title)}
                  className="p-1.5 text-slate-500 hover:text-red-700 hover:bg-red-50 rounded cursor-pointer"
                  title="Excluir Anúncio"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Modal: Postar Novo Banner */}
      {isAdding && (
        <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-2xs animate-in fade-in">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 border border-slate-200 shadow-2xl relative max-h-[92vh] overflow-y-auto">
            <button
              onClick={() => setIsAdding(false)}
              className="absolute top-4 right-4 p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100"
            >
              <X className="w-5 h-5" />
            </button>

            <h4 className="font-editorial text-xl font-bold text-slate-900 mb-1 flex items-center gap-2">
              <PlusCircle className="w-5 h-5 text-amber-600" />
              <span>Postar Novo Banner Publicitário</span>
            </h4>
            <p className="text-xs text-slate-500 mb-4">
              Preencha os dados da campanha comercial e faça upload da imagem do banner.
            </p>

            <form onSubmit={handleCreate} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Título da Campanha / Anúncio *
                </label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Ex: Oferta Especial Feira do Produtor ou Apoio Cultural"
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#0f3d59] focus:bg-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Nome do Anunciante *
                  </label>
                  <input
                    type="text"
                    required
                    value={advertiserName}
                    onChange={(e) => setAdvertiserName(e.target.value)}
                    placeholder="Empresa, Cooperativa ou Marca"
                    className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#0f3d59] focus:bg-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Contato do Anunciante
                  </label>
                  <input
                    type="text"
                    value={contact}
                    onChange={(e) => setContact(e.target.value)}
                    placeholder="(92) 99999-9999 ou email"
                    className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#0f3d59] focus:bg-white"
                  />
                </div>
              </div>

              {/* Banner Image */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Imagem do Banner (Upload ou Link Direto) *
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    required
                    value={bannerUrl}
                    onChange={(e) => setBannerUrl(e.target.value)}
                    placeholder="https://exemplo.com/banner.jpg"
                    className="flex-1 px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#0f3d59] focus:bg-white"
                  />
                  <label className="px-3 py-2 bg-slate-200 hover:bg-slate-300 text-slate-800 text-xs font-semibold rounded-lg flex items-center gap-1 cursor-pointer shrink-0">
                    <Upload className="w-3.5 h-3.5" />
                    <span>Upload</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleFileUpload(e, false)}
                      className="hidden"
                    />
                  </label>
                </div>
                {bannerUrl && (
                  <div className="mt-2 rounded overflow-hidden border border-slate-200 max-h-24">
                    <img src={bannerUrl} alt="Preview" className="w-full h-24 object-cover" />
                  </div>
                )}
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Posição na Página
                  </label>
                  <select
                    value={position}
                    onChange={(e) => setPosition(e.target.value as AdPosition)}
                    className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#0f3d59] focus:bg-white"
                  >
                    <option value="header">Banner Superior (Topo)</option>
                    <option value="in_feed">No Feed (Entre Notícias)</option>
                    <option value="sidebar">Lateral / Cartão Comercial</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Link de Destino ao Clicar
                  </label>
                  <input
                    type="text"
                    value={targetUrl}
                    onChange={(e) => setTargetUrl(e.target.value)}
                    placeholder="https://site-do-anunciante.com.br"
                    className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#0f3d59] focus:bg-white"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsAdding(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-lg"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-bold text-white bg-[#0f3d59] hover:bg-[#0a2540] rounded-lg cursor-pointer"
                >
                  Publicar Banner
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Editar Banner */}
      {editingAd && (
        <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-2xs animate-in fade-in">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 border border-slate-200 shadow-2xl relative max-h-[92vh] overflow-y-auto">
            <button
              onClick={() => setEditingAd(null)}
              className="absolute top-4 right-4 p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100"
            >
              <X className="w-5 h-5" />
            </button>

            <h4 className="font-editorial text-xl font-bold text-slate-900 mb-1 flex items-center gap-2">
              <Edit className="w-5 h-5 text-[#0f3d59]" />
              <span>Editar Banner Publicitário</span>
            </h4>

            <form onSubmit={handleSaveEdit} className="space-y-3 mt-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Título da Campanha</label>
                <input
                  type="text"
                  required
                  value={editingAd.title}
                  onChange={(e) => setEditingAd({ ...editingAd, title: e.target.value })}
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#0f3d59]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Anunciante</label>
                  <input
                    type="text"
                    required
                    value={editingAd.advertiserName}
                    onChange={(e) => setEditingAd({ ...editingAd, advertiserName: e.target.value })}
                    className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#0f3d59]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Status</label>
                  <select
                    value={editingAd.status}
                    onChange={(e) => setEditingAd({ ...editingAd, status: e.target.value as AdStatus })}
                    className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#0f3d59]"
                  >
                    <option value="active">Ativo</option>
                    <option value="paused">Pausado</option>
                    <option value="pending">Pendente</option>
                    <option value="expired">Expirado</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Link de Destino</label>
                <input
                  type="text"
                  value={editingAd.targetUrl}
                  onChange={(e) => setEditingAd({ ...editingAd, targetUrl: e.target.value })}
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#0f3d59]"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setEditingAd(null)}
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
