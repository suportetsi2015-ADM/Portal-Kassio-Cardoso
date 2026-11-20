import React, { useState } from 'react';
import { useStore } from '../../context/StoreContext';
import {
  MapPin,
  PlusCircle,
  Edit,
  Trash2,
  CheckCircle2,
  X,
  Search,
  Waves,
} from 'lucide-react';

export const AdminLocations: React.FC = () => {
  const { locations, addLocation, updateLocation, deleteLocation } = useStore();

  const [searchTerm, setSearchTerm] = useState('');
  const [newLocName, setNewLocName] = useState('');
  const [editingOldName, setEditingOldName] = useState<string | null>(null);
  const [editingNewName, setEditingNewName] = useState('');
  const [feedbackMsg, setFeedbackMsg] = useState<string | null>(null);

  const notify = (msg: string) => {
    setFeedbackMsg(msg);
    setTimeout(() => setFeedbackMsg(null), 3000);
  };

  const filteredLocations = locations.filter((loc) =>
    loc.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = newLocName.trim();
    if (!trimmed) return;

    if (locations.some((l) => l.toLowerCase() === trimmed.toLowerCase())) {
      alert('Esta localidade já está cadastrada.');
      return;
    }

    addLocation(trimmed);
    notify(`Localidade "${trimmed}" adicionada com sucesso!`);
    setNewLocName('');
  };

  const handleSaveEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingOldName || !editingNewName.trim()) return;

    updateLocation(editingOldName, editingNewName.trim());
    notify(`Localidade renomeada para "${editingNewName.trim()}".`);
    setEditingOldName(null);
    setEditingNewName('');
  };

  const handleDelete = (name: string) => {
    if (confirm(`Deseja remover a localidade "${name}"?`)) {
      deleteLocation(name);
      notify(`Localidade "${name}" removida.`);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-3 border-b border-slate-200">
        <div>
          <h3 className="font-editorial text-2xl font-bold text-slate-900 flex items-center gap-2">
            <MapPin className="w-6 h-6 text-[#0f3d59]" />
            <span>Gestão de Localidades & Territórios do Amazonas</span>
          </h3>
          <p className="text-xs text-slate-500 font-sans">
            Insira, altere ou exclua municípios, zonas de Manaus, bairros e comunidades ribeirinhas cobertas pelo portal.
          </p>
        </div>
      </div>

      {feedbackMsg && (
        <div className="p-3 bg-emerald-50 border border-emerald-300 rounded-xl text-xs text-emerald-800 font-semibold flex items-center gap-2 animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0" />
          <span>{feedbackMsg}</span>
        </div>
      )}

      {/* Add new Location Form */}
      <form onSubmit={handleAdd} className="bg-white p-4 border border-slate-200 rounded-xl shadow-2xs flex flex-col sm:flex-row gap-3">
        <input
          type="text"
          value={newLocName}
          onChange={(e) => setNewLocName(e.target.value)}
          placeholder="Ex: Parintins, Tefé, Manaus - Compensa, ou Calha do Rio Madeira..."
          className="flex-1 px-3.5 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#0f3d59] focus:bg-white"
        />
        <button
          type="submit"
          className="px-5 py-2.5 bg-[#0f3d59] hover:bg-[#0a2540] text-white text-xs font-bold rounded-lg transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-xs"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Adicionar Localidade</span>
        </button>
      </form>

      {/* Search */}
      <div className="relative">
        <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          placeholder="Filtrar municípios ou bairros cadastrados..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-9 pr-4 py-2 text-xs bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#0f3d59]"
        />
      </div>

      {/* Locations Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
        {filteredLocations.map((loc) => (
          <div
            key={loc}
            className="p-3.5 bg-white border border-slate-200 rounded-xl shadow-2xs flex items-center justify-between group hover:border-[#0f3d59] transition-all"
          >
            <div className="flex items-center gap-2 min-w-0">
              <div className="p-1.5 bg-blue-50 text-[#0f3d59] rounded-lg shrink-0">
                <MapPin className="w-3.5 h-3.5" />
              </div>
              <span className="font-semibold text-xs text-slate-800 truncate" title={loc}>
                {loc}
              </span>
            </div>

            <div className="flex items-center gap-1 shrink-0">
              <button
                onClick={() => {
                  setEditingOldName(loc);
                  setEditingNewName(loc);
                }}
                title="Editar Localidade"
                className="p-1 text-slate-400 hover:text-[#0f3d59] hover:bg-slate-100 rounded cursor-pointer"
              >
                <Edit className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => handleDelete(loc)}
                title="Excluir Localidade"
                className="p-1 text-slate-400 hover:text-red-700 hover:bg-red-50 rounded cursor-pointer"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Modal: Editar Localidade */}
      {editingOldName && (
        <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-2xs animate-in fade-in">
          <div className="bg-white rounded-2xl max-w-sm w-full p-6 border border-slate-200 shadow-2xl relative">
            <button
              onClick={() => setEditingOldName(null)}
              className="absolute top-4 right-4 p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100"
            >
              <X className="w-5 h-5" />
            </button>

            <h4 className="font-editorial text-lg font-bold text-slate-900 mb-1 flex items-center gap-2">
              <Edit className="w-5 h-5 text-[#0f3d59]" />
              <span>Editar Localidade</span>
            </h4>
            <p className="text-xs text-slate-500 mb-4">
              Renomeie o território ou município amazônico.
            </p>

            <form onSubmit={handleSaveEdit} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Nome da Localidade</label>
                <input
                  type="text"
                  autoFocus
                  required
                  value={editingNewName}
                  onChange={(e) => setEditingNewName(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#0f3d59]"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setEditingOldName(null)}
                  className="px-3 py-1.5 text-xs text-slate-600 hover:bg-slate-100 rounded-lg"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 text-xs font-bold text-white bg-[#0f3d59] hover:bg-[#0a2540] rounded-lg cursor-pointer"
                >
                  Salvar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
