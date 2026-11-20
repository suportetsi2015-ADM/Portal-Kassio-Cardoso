import React, { useState } from 'react';
import { useStore } from '../../context/StoreContext';
import { CommunityStory } from '../../types';
import {
  MessageSquare,
  AlertTriangle,
  CheckCircle2,
  Trash2,
  Eye,
  FileText,
  X,
  Phone,
  MapPin,
  Image as ImageIcon,
  Video,
  Search,
} from 'lucide-react';

interface AdminStoriesProps {
  onConvertToArticle?: (story: CommunityStory) => void;
}

export const AdminStories: React.FC<AdminStoriesProps> = ({ onConvertToArticle }) => {
  const { communityStories, updateStoryStatus, deleteCommunityStory } = useStore();

  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | CommunityStory['status']>('all');
  const [inspectingStory, setInspectingStory] = useState<CommunityStory | null>(null);

  const filteredStories = communityStories.filter((s) => {
    const matchesSearch =
      s.storyTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.storyText.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.submitterName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (s.neighborhood && s.neighborhood.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesStatus = statusFilter === 'all' || s.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleDelete = (id: string, title: string) => {
    if (confirm(`Deseja excluir a denúncia "${title}"?`)) {
      deleteCommunityStory(id);
      if (inspectingStory?.id === id) setInspectingStory(null);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-3 border-b border-slate-200">
        <div>
          <h3 className="font-editorial text-2xl font-bold text-slate-900 flex items-center gap-2">
            <MessageSquare className="w-6 h-6 text-amber-600" />
            <span>Denúncias & Relatos da Comunidade ({communityStories.length})</span>
          </h3>
          <p className="text-xs text-slate-500 font-sans">
            Acompanhe as pautas enviadas pela população com fotos e vídeos, controle o status de apuração e transforme demandas populares em matérias.
          </p>
        </div>
      </div>

      {/* Filter and Search */}
      <div className="flex flex-col sm:flex-row items-center gap-3">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Buscar por assunto, bairro ou cidadão..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-xs bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#0f3d59]"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <button
            onClick={() => setStatusFilter('all')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg cursor-pointer ${
              statusFilter === 'all' ? 'bg-[#0f3d59] text-white' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            Todas ({communityStories.length})
          </button>
          <button
            onClick={() => setStatusFilter('received')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg cursor-pointer ${
              statusFilter === 'received' ? 'bg-[#0f3d59] text-white' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            Recebidas
          </button>
          <button
            onClick={() => setStatusFilter('investigating')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg cursor-pointer ${
              statusFilter === 'investigating' ? 'bg-[#0f3d59] text-white' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            Em Apuração
          </button>
        </div>
      </div>

      {/* Stories Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredStories.length > 0 ? (
          filteredStories.map((story) => (
            <div
              key={story.id}
              className="bg-white border border-slate-200 rounded-xl p-5 shadow-2xs hover:shadow-sm transition-all flex flex-col justify-between space-y-4"
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-[10px] bg-slate-100 text-slate-700 px-2 py-0.5 rounded font-bold">
                    {story.protocolNumber || story.id.slice(0, 10)}
                  </span>
                  <span
                    className={`px-2 py-0.5 text-[10px] font-bold rounded uppercase tracking-wider ${
                      story.status === 'received'
                        ? 'bg-amber-100 text-amber-900'
                        : story.status === 'investigating'
                        ? 'bg-blue-100 text-blue-900'
                        : story.status === 'converted'
                        ? 'bg-emerald-100 text-emerald-900'
                        : 'bg-slate-100 text-slate-600'
                    }`}
                  >
                    {story.status === 'received'
                      ? 'Recebida'
                      : story.status === 'investigating'
                      ? 'Em Apuração'
                      : story.status === 'converted'
                      ? 'Virou Notícia'
                      : 'Arquivada'}
                  </span>
                </div>

                <h4 className="font-editorial text-base font-bold text-slate-900 leading-snug">
                  {story.storyTitle}
                </h4>

                <p className="text-xs text-slate-600 font-sans line-clamp-3 leading-relaxed">
                  {story.storyText}
                </p>

                {/* Evidence Media indicator */}
                {story.mediaType && story.mediaType !== 'none' && story.mediaUrl && (
                  <div className="flex items-center gap-2 p-2 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-700">
                    {story.mediaType === 'image' ? (
                      <ImageIcon className="w-4 h-4 text-emerald-700 shrink-0" />
                    ) : (
                      <Video className="w-4 h-4 text-red-600 shrink-0" />
                    )}
                    <span className="truncate text-[11px] font-medium">
                      Anexo: {story.mediaFileName || `${story.mediaType} enviada`}
                    </span>
                  </div>
                )}

                <div className="text-[11px] text-slate-500 pt-2 border-t border-slate-100 flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-slate-400" />
                    <span>{story.neighborhood ? `${story.neighborhood} (${story.location})` : story.location}</span>
                  </div>
                  <span>{new Date(story.createdAt).toLocaleDateString('pt-BR')}</span>
                </div>
              </div>

              {/* Action buttons */}
              <div className="pt-2 border-t border-slate-100 flex items-center justify-between gap-2">
                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => setInspectingStory(story)}
                    className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-semibold rounded-lg flex items-center gap-1 cursor-pointer"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    <span>Ver Detalhes</span>
                  </button>
                  {onConvertToArticle && (
                    <button
                      onClick={() => onConvertToArticle(story)}
                      className="px-3 py-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 text-xs font-semibold rounded-lg flex items-center gap-1 cursor-pointer"
                    >
                      <FileText className="w-3.5 h-3.5" />
                      <span>Virar Notícia</span>
                    </button>
                  )}
                </div>

                <button
                  onClick={() => handleDelete(story.id, story.storyTitle)}
                  className="p-1.5 text-slate-400 hover:text-red-700 hover:bg-red-50 rounded cursor-pointer"
                  title="Excluir Denúncia"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))
        ) : (
          <div className="col-span-2 p-12 text-center bg-white rounded-xl border border-dashed border-slate-300 text-slate-500 text-xs">
            Nenhuma denúncia cadastrada ou encontrada com este filtro.
          </div>
        )}
      </div>

      {/* Modal: Inspecionar Denúncia com Foto/Vídeo Completo */}
      {inspectingStory && (
        <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-2xs animate-in fade-in">
          <div className="bg-white rounded-2xl max-w-xl w-full max-h-[90vh] overflow-y-auto p-6 border border-slate-200 shadow-2xl relative">
            <button
              onClick={() => setInspectingStory(null)}
              className="absolute top-4 right-4 p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-2 mb-2">
              <span className="font-mono text-xs bg-slate-100 text-slate-800 px-2 py-0.5 rounded font-bold">
                Protocolo: {inspectingStory.protocolNumber || inspectingStory.id}
              </span>
              <span className="text-xs text-slate-400">
                {new Date(inspectingStory.createdAt).toLocaleString('pt-BR')}
              </span>
            </div>

            <h3 className="font-editorial text-xl font-bold text-slate-900 mb-3">
              {inspectingStory.storyTitle}
            </h3>

            {/* Media Viewer if exists */}
            {inspectingStory.mediaUrl && (
              <div className="mb-4 rounded-xl overflow-hidden border border-slate-200 bg-slate-950 max-h-72 flex items-center justify-center">
                {inspectingStory.mediaType === 'image' ? (
                  <img
                    src={inspectingStory.mediaUrl}
                    alt="Evidência da denúncia"
                    className="max-h-72 w-full object-contain"
                  />
                ) : (
                  <video
                    src={inspectingStory.mediaUrl}
                    controls
                    className="max-h-72 w-full object-contain"
                  />
                )}
              </div>
            )}

            <div className="space-y-3 text-xs text-slate-700 bg-slate-50 p-4 rounded-xl border border-slate-200">
              <div>
                <strong className="text-slate-900 block mb-1">Relato Cidadão:</strong>
                <p className="leading-relaxed whitespace-pre-wrap">{inspectingStory.storyText}</p>
              </div>

              {inspectingStory.evidenceNote && (
                <div>
                  <strong className="text-slate-900 block mb-0.5">Observação de Evidência:</strong>
                  <p className="text-slate-600">{inspectingStory.evidenceNote}</p>
                </div>
              )}

              <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-200 text-[11px]">
                <div>
                  <strong>Cidadão:</strong> {inspectingStory.isAnonymous ? 'Anônimo (Sigilo Constitucional)' : inspectingStory.submitterName}
                </div>
                <div>
                  <strong>Contato:</strong> {inspectingStory.submitterContact || 'Não informado'}
                </div>
                <div>
                  <strong>Bairro:</strong> {inspectingStory.neighborhood || 'Não especificado'}
                </div>
                <div>
                  <strong>Localidade:</strong> {inspectingStory.location}
                </div>
              </div>
            </div>

            {/* Change Status */}
            <div className="mt-4 pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold text-slate-700">Alterar Status:</span>
                <select
                  value={inspectingStory.status}
                  onChange={(e) => {
                    updateStoryStatus(inspectingStory.id, e.target.value as CommunityStory['status']);
                    setInspectingStory({ ...inspectingStory, status: e.target.value as CommunityStory['status'] });
                  }}
                  className="px-3 py-1.5 text-xs bg-white border border-slate-300 rounded-lg font-semibold"
                >
                  <option value="received">Recebida</option>
                  <option value="investigating">Em Apuração</option>
                  <option value="converted">Convertida em Matéria</option>
                  <option value="dismissed">Arquivada</option>
                </select>
              </div>

              {onConvertToArticle && (
                <button
                  onClick={() => {
                    onConvertToArticle(inspectingStory);
                    setInspectingStory(null);
                  }}
                  className="px-4 py-2 bg-emerald-800 hover:bg-emerald-900 text-white text-xs font-bold rounded-lg transition-colors cursor-pointer"
                >
                  Criar Matéria a partir desta Pauta
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
