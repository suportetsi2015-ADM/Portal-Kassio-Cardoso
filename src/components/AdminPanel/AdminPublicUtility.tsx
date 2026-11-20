import React, { useState } from 'react';
import { useStore } from '../../context/StoreContext';
import { PublicUtilityItem } from '../../types';
import { INITIAL_PUBLIC_UTILITY } from '../../data/initialData';
import {
  PhoneCall,
  PlusCircle,
  Edit,
  Trash2,
  CheckCircle2,
  AlertTriangle,
  RotateCcw,
  Search,
  Building,
  Phone,
  MessageCircle,
  Clock,
  MapPin,
  Shield,
  HeartPulse,
  Flame,
  Waves,
  Users,
} from 'lucide-react';

const CATEGORIES = [
  'Segurança & Polícia',
  'Emergência & Resgate',
  'Saúde & SOS',
  'Defesa Civil & Rios',
  'Direitos & Proteção',
  'Serviços ao Cidadão',
] as const;

export const AdminPublicUtility: React.FC = () => {
  const {
    config,
    updatePublicUtility,
    addPublicUtilityItem,
    updatePublicUtilityItem,
    deletePublicUtilityItem,
    resetPublicUtilityToDefault,
  } = useStore();

  const currentUtility = config.publicUtility || {
    title: 'Utilidade Pública & Emergências do Amazonas',
    subtitle: 'Telefones de emergência 24h, hospitais, delegacias, bombeiros e canais de apoio à população.',
    items: INITIAL_PUBLIC_UTILITY,
  };

  const [title, setTitle] = useState(currentUtility.title);
  const [subtitle, setSubtitle] = useState(currentUtility.subtitle);

  React.useEffect(() => {
    if (config.publicUtility) {
      setTitle(config.publicUtility.title || 'Utilidade Pública & Emergências do Amazonas');
      setSubtitle(config.publicUtility.subtitle || '');
    }
  }, [config.publicUtility]);

  const [searchTerm, setSearchTerm] = useState('');
  const [editingItem, setEditingItem] = useState<PublicUtilityItem | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [savedMsg, setSavedMsg] = useState<string | null>(null);

  // New item form state
  const [name, setName] = useState('');
  const [category, setCategory] = useState<PublicUtilityItem['category']>('Segurança & Polícia');
  const [phone, setPhone] = useState('');
  const [whatsapp, setWhatsapp] = useState('');
  const [address, setAddress] = useState('');
  const [hours, setHours] = useState('Plantão 24 Horas');
  const [description, setDescription] = useState('');
  const [isEmergency, setIsEmergency] = useState(false);

  const notify = (msg: string) => {
    setSavedMsg(msg);
    setTimeout(() => setSavedMsg(null), 3500);
  };

  const items = currentUtility.items || INITIAL_PUBLIC_UTILITY;

  const filteredItems = items.filter(
    (item) =>
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.phone.includes(searchTerm)
  );

  const handleSaveHeader = (e: React.FormEvent) => {
    e.preventDefault();
    updatePublicUtility({
      title: title.trim() || 'Utilidade Pública & Emergências do Amazonas',
      subtitle: subtitle.trim(),
    });
    notify('Cabeçalho de Utilidade Pública salvo e sincronizado em tempo real na One Page!');
  };

  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !phone.trim()) {
      alert('Nome do órgão e telefone principal são obrigatórios.');
      return;
    }

    addPublicUtilityItem({
      name: name.trim(),
      category,
      phone: phone.trim(),
      whatsapp: whatsapp.trim() || undefined,
      address: address.trim() || 'Manaus - AM',
      hours: hours.trim() || 'Plantão 24 Horas',
      description: description.trim() || 'Atendimento e suporte à população.',
      isEmergency,
    });

    notify(`Órgão "${name}" adicionado com sucesso!`);
    setIsCreating(false);
    setName('');
    setPhone('');
    setWhatsapp('');
    setAddress('');
    setDescription('');
    setIsEmergency(false);
  };

  const handleEditSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingItem) return;

    updatePublicUtilityItem(editingItem.id, editingItem);
    notify(`Contato "${editingItem.name}" atualizado com sucesso!`);
    setEditingItem(null);
  };

  const handleDelete = (id: string, itemName: string) => {
    if (confirm(`Deseja realmente excluir "${itemName}" da Utilidade Pública?`)) {
      deletePublicUtilityItem(id);
      notify(`Contato "${itemName}" excluído.`);
    }
  };

  const handleResetDefaults = () => {
    if (confirm('Deseja restaurar todos os contatos de Utilidade Pública oficiais do Amazonas?')) {
      resetPublicUtilityToDefault();
      setTitle('Utilidade Pública & Emergências do Amazonas');
      setSubtitle('Telefones de emergência 24h, hospitais, delegacias, bombeiros e canais de apoio à população.');
      notify('Contatos oficiais restaurados com sucesso!');
    }
  };

  return (
    <div className="space-y-8">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <h3 className="font-editorial text-2xl font-bold text-slate-900 flex items-center gap-2">
            <PhoneCall className="w-6 h-6 text-red-600" />
            <span>Gestão de Utilidade Pública & Telefones Úteis</span>
          </h3>
          <p className="text-xs text-slate-500 font-sans mt-0.5">
            Insira, edite, altere e exclua 100% dos contatos, telefones de emergência, WhatsApp e endereços dos órgãos coerentes à redação e à comunidade local (Polícia, Bombeiros, SOS, SAMU, etc.).
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={handleResetDefaults}
            className="px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-lg transition-colors cursor-pointer flex items-center gap-1.5"
            title="Restaurar lista oficial de órgãos"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Restaurar Padrão</span>
          </button>

          <button
            onClick={() => {
              setIsCreating(true);
              setEditingItem(null);
            }}
            className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-xs font-bold rounded-lg transition-colors cursor-pointer flex items-center gap-1.5 shadow-xs"
          >
            <PlusCircle className="w-4 h-4" />
            <span>+ Novo Contato Útil</span>
          </button>
        </div>
      </div>

      {savedMsg && (
        <div className="p-3.5 bg-emerald-50 border border-emerald-300 rounded-xl text-xs text-emerald-800 font-semibold flex items-center gap-2 animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0" />
          <span>{savedMsg}</span>
        </div>
      )}

      {/* Header Texts Form */}
      <form onSubmit={handleSaveHeader} className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs space-y-4">
        <h4 className="font-editorial text-base font-bold text-slate-900 flex items-center gap-2">
          <Building className="w-4 h-4 text-[#0f3d59]" />
          <span>Títulos da Seção na One Page</span>
        </h4>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Título Principal da Seção
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => {
                setTitle(e.target.value);
                updatePublicUtility({ title: e.target.value });
              }}
              className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#0f3d59] focus:bg-white"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Subtítulo / Descrição da Seção
            </label>
            <input
              type="text"
              value={subtitle}
              onChange={(e) => {
                setSubtitle(e.target.value);
                updatePublicUtility({ subtitle: e.target.value });
              }}
              className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#0f3d59] focus:bg-white"
            />
          </div>
        </div>

        <div className="flex justify-end pt-2">
          <button
            type="submit"
            className="px-4 py-2 bg-[#0f3d59] hover:bg-[#0a2540] text-white text-xs font-bold rounded-lg transition-colors cursor-pointer flex items-center gap-1.5 shadow-xs"
          >
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>Salvar Títulos</span>
          </button>
        </div>
      </form>

      {/* Modal / Form: Create New Item */}
      {isCreating && (
        <form onSubmit={handleCreateSubmit} className="bg-amber-50/60 p-6 rounded-2xl border border-amber-300 shadow-sm space-y-4 animate-in fade-in">
          <div className="flex items-center justify-between pb-2 border-b border-amber-200">
            <h4 className="font-editorial text-lg font-bold text-amber-950 flex items-center gap-2">
              <PlusCircle className="w-5 h-5 text-red-600" />
              <span>Inserir Novo Órgão ou Contato de Utilidade Pública</span>
            </h4>
            <button
              type="button"
              onClick={() => setIsCreating(false)}
              className="text-xs text-amber-900 hover:text-black font-semibold cursor-pointer"
            >
              Cancelar
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-800 mb-1">
                Nome do Órgão / Entidade *
              </label>
              <input
                type="text"
                placeholder="Ex: Polícia Militar do Amazonas - Emergência 190"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="w-full px-3 py-2 text-xs bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-red-600"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-800 mb-1">
                Categoria do Serviço *
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as PublicUtilityItem['category'])}
                className="w-full px-3 py-2 text-xs bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-red-600"
              >
                {CATEGORIES.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-800 mb-1">
                Telefone Principal de Chamada (Ligar) *
              </label>
              <input
                type="text"
                placeholder="Ex: 190 ou (92) 3214-5000"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                required
                className="w-full px-3 py-2 text-xs bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-red-600 font-mono"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-800 mb-1">
                WhatsApp Oficial (DDD + Número)
              </label>
              <input
                type="text"
                placeholder="Ex: (92) 98842-1800 ou 5592988421800"
                value={whatsapp}
                onChange={(e) => setWhatsapp(e.target.value)}
                className="w-full px-3 py-2 text-xs bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-emerald-600 font-mono"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-800 mb-1">
                Horário de Atendimento
              </label>
              <input
                type="text"
                placeholder="Ex: Plantão 24 Horas ou Seg a Sex das 08h às 17h"
                value={hours}
                onChange={(e) => setHours(e.target.value)}
                className="w-full px-3 py-2 text-xs bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-red-600"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-800 mb-1">
                Endereço / Sede / Abrangência
              </label>
              <input
                type="text"
                placeholder="Ex: Av. Lourenço da Silva Braga, Centro, Manaus - AM"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className="w-full px-3 py-2 text-xs bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-red-600"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-800 mb-1">
              Descrição e Atribuições do Órgão
            </label>
            <textarea
              rows={2}
              placeholder="Ex: Atendimento imediato a ocorrências policiais, policiamento fluvial e apoio à comunidade."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-3 py-2 text-xs bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-red-600"
            />
          </div>

          <div className="flex items-center gap-2 pt-1">
            <input
              type="checkbox"
              id="isEmergencyNew"
              checked={isEmergency}
              onChange={(e) => setIsEmergency(e.target.checked)}
              className="w-4 h-4 text-red-600 rounded border-slate-300 focus:ring-red-500"
            />
            <label htmlFor="isEmergencyNew" className="text-xs font-bold text-red-900 cursor-pointer">
              Marcar como Emergência 24 Horas prioritária (Destaque Vermelho)
            </label>
          </div>

          <div className="flex justify-end gap-2 pt-2 border-t border-amber-200">
            <button
              type="button"
              onClick={() => setIsCreating(false)}
              className="px-4 py-2 bg-white border border-slate-300 hover:bg-slate-100 text-slate-700 text-xs font-bold rounded-lg cursor-pointer"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-5 py-2 bg-red-600 hover:bg-red-700 text-white text-xs font-bold rounded-lg transition-colors cursor-pointer shadow-xs flex items-center gap-1.5"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>Salvar e Publicar Contato</span>
            </button>
          </div>
        </form>
      )}

      {/* Edit Item Modal / Inline Form */}
      {editingItem && (
        <form onSubmit={handleEditSubmit} className="bg-blue-50/70 p-6 rounded-2xl border border-blue-300 shadow-sm space-y-4 animate-in fade-in">
          <div className="flex items-center justify-between pb-2 border-b border-blue-200">
            <h4 className="font-editorial text-lg font-bold text-blue-950 flex items-center gap-2">
              <Edit className="w-5 h-5 text-[#0f3d59]" />
              <span>Editar Contato: {editingItem.name}</span>
            </h4>
            <button
              type="button"
              onClick={() => setEditingItem(null)}
              className="text-xs text-blue-900 hover:text-black font-semibold cursor-pointer"
            >
              Cancelar
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-800 mb-1">
                Nome do Órgão / Entidade *
              </label>
              <input
                type="text"
                value={editingItem.name}
                onChange={(e) => setEditingItem({ ...editingItem, name: e.target.value })}
                required
                className="w-full px-3 py-2 text-xs bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#0f3d59]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-800 mb-1">
                Categoria do Serviço *
              </label>
              <select
                value={editingItem.category}
                onChange={(e) =>
                  setEditingItem({
                    ...editingItem,
                    category: e.target.value as PublicUtilityItem['category'],
                  })
                }
                className="w-full px-3 py-2 text-xs bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#0f3d59]"
              >
                {CATEGORIES.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-800 mb-1">
                Telefone Principal de Chamada (Ligar) *
              </label>
              <input
                type="text"
                value={editingItem.phone}
                onChange={(e) => setEditingItem({ ...editingItem, phone: e.target.value })}
                required
                className="w-full px-3 py-2 text-xs bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#0f3d59] font-mono"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-800 mb-1">
                WhatsApp Oficial
              </label>
              <input
                type="text"
                value={editingItem.whatsapp || ''}
                onChange={(e) => setEditingItem({ ...editingItem, whatsapp: e.target.value })}
                placeholder="Ex: (92) 98842-1800"
                className="w-full px-3 py-2 text-xs bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-emerald-600 font-mono"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-800 mb-1">
                Horário de Atendimento
              </label>
              <input
                type="text"
                value={editingItem.hours}
                onChange={(e) => setEditingItem({ ...editingItem, hours: e.target.value })}
                className="w-full px-3 py-2 text-xs bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#0f3d59]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-800 mb-1">
                Endereço / Sede
              </label>
              <input
                type="text"
                value={editingItem.address}
                onChange={(e) => setEditingItem({ ...editingItem, address: e.target.value })}
                className="w-full px-3 py-2 text-xs bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#0f3d59]"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-800 mb-1">
              Descrição e Atribuições
            </label>
            <textarea
              rows={2}
              value={editingItem.description}
              onChange={(e) => setEditingItem({ ...editingItem, description: e.target.value })}
              className="w-full px-3 py-2 text-xs bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#0f3d59]"
            />
          </div>

          <div className="flex items-center gap-2 pt-1">
            <input
              type="checkbox"
              id="isEmergencyEdit"
              checked={editingItem.isEmergency}
              onChange={(e) => setEditingItem({ ...editingItem, isEmergency: e.target.checked })}
              className="w-4 h-4 text-red-600 rounded border-slate-300 focus:ring-red-500"
            />
            <label htmlFor="isEmergencyEdit" className="text-xs font-bold text-red-900 cursor-pointer">
              Marcar como Emergência 24 Horas prioritária (Destaque Vermelho)
            </label>
          </div>

          <div className="flex justify-end gap-2 pt-2 border-t border-blue-200">
            <button
              type="button"
              onClick={() => setEditingItem(null)}
              className="px-4 py-2 bg-white border border-slate-300 hover:bg-slate-100 text-slate-700 text-xs font-bold rounded-lg cursor-pointer"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-5 py-2 bg-[#0f3d59] hover:bg-[#0a2540] text-white text-xs font-bold rounded-lg transition-colors cursor-pointer shadow-xs flex items-center gap-1.5"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>Salvar Alterações</span>
            </button>
          </div>
        </form>
      )}

      {/* Directory Management Table / Cards */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-2xs overflow-hidden">
        {/* Search Bar */}
        <div className="p-4 border-b border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3 bg-slate-50/50">
          <div className="relative w-full sm:w-80">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Filtrar órgãos por nome, telefone..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-4 py-2 text-xs bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#0f3d59]"
            />
          </div>

          <span className="text-xs text-slate-500 font-sans font-medium">
            Total cadastrado: <strong>{items.length} órgãos</strong>
          </span>
        </div>

        {/* List of items */}
        <div className="divide-y divide-slate-100">
          {filteredItems.map((item) => (
            <div
              key={item.id}
              className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-slate-50 transition-colors"
            >
              <div className="space-y-1 max-w-2xl">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-xs font-bold text-slate-800">{item.name}</span>
                  <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-slate-100 text-slate-700">
                    {item.category}
                  </span>
                  {item.isEmergency && (
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-red-100 text-red-800 uppercase tracking-wider">
                      Emergência 24h
                    </span>
                  )}
                </div>

                <p className="text-xs text-slate-600 line-clamp-2">{item.description}</p>

                <div className="flex flex-wrap items-center gap-4 text-[11px] text-slate-500 font-sans pt-1">
                  <span className="flex items-center gap-1 font-semibold text-slate-800">
                    <Phone className="w-3 h-3 text-red-600" />
                    <span>Tel: {item.phone}</span>
                  </span>

                  {item.whatsapp && (
                    <span className="flex items-center gap-1 font-semibold text-emerald-800">
                      <MessageCircle className="w-3 h-3 text-[#25D366]" />
                      <span>WhatsApp: {item.whatsapp}</span>
                    </span>
                  )}

                  <span className="flex items-center gap-1">
                    <Clock className="w-3 h-3 text-slate-400" />
                    <span>{item.hours}</span>
                  </span>

                  <span className="flex items-center gap-1">
                    <MapPin className="w-3 h-3 text-slate-400" />
                    <span className="line-clamp-1">{item.address}</span>
                  </span>
                </div>
              </div>

              {/* Action buttons */}
              <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
                <button
                  onClick={() => {
                    setEditingItem(item);
                    setIsCreating(false);
                  }}
                  className="p-2 text-slate-600 hover:text-blue-700 hover:bg-blue-50 rounded-lg transition-colors cursor-pointer border border-slate-200"
                  title="Editar dados deste órgão"
                >
                  <Edit className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleDelete(item.id, item.name)}
                  className="p-2 text-slate-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors cursor-pointer border border-slate-200"
                  title="Excluir este contato"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}

          {filteredItems.length === 0 && (
            <div className="p-8 text-center text-xs text-slate-500">
              Nenhum órgão encontrado com este termo.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
