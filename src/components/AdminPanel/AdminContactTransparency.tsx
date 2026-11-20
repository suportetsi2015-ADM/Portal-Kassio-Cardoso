import React, { useState, useEffect } from 'react';
import { useStore } from '../../context/StoreContext';
import { InstitutionalPages, PortalConfig } from '../../types';
import {
  Shield,
  FileText,
  Mail,
  Phone,
  MapPin,
  CheckCircle2,
  BookCheck,
  AlertCircle,
  Megaphone,
  RotateCcw,
  Sparkles,
  ExternalLink,
  Lock,
} from 'lucide-react';
import { INITIAL_PORTAL_CONFIG } from '../../data/initialData';

export const AdminContactTransparency: React.FC = () => {
  const {
    config,
    updateInstitutional,
    updateContactInfo,
    updateStructureTexts,
  } = useStore();

  const [activeSubTab, setActiveSubTab] = useState<
    'contatos' | 'masthead' | 'ethics' | 'privacy' | 'corrections' | 'advertising'
  >('contatos');

  // Contact Info state
  const [email, setEmail] = useState(config.contactEmail || 'redacao@comunidadeemacao.am');
  const [phone, setPhone] = useState(config.contactPhone || '(92) 98144-0022');
  const [address, setAddress] = useState(config.contactAddress || 'Manaus, Amazonas — Brasil');

  // Section Headers state
  const [eyebrow, setEyebrow] = useState(
    config.structureTexts?.contactEyebrow || 'Transparência & Conformidade'
  );
  const [sectionTitle, setSectionTitle] = useState(
    config.structureTexts?.contactSectionTitle || 'Expediente, Políticas e Contato'
  );
  const [sectionSubtitle, setSectionSubtitle] = useState(
    config.structureTexts?.contactSectionSubtitle ||
      'Garantias de conformidade com a Lei Geral de Proteção de Dados (LGPD) e transparência da equipe editorial.'
  );

  // Institutional Pages state
  const [institutional, setInstitutional] = useState<InstitutionalPages>(
    config.institutional || INITIAL_PORTAL_CONFIG.institutional
  );

  const [savedSuccess, setSavedSuccess] = useState(false);

  // Sync when config updates
  useEffect(() => {
    if (config.contactEmail) setEmail(config.contactEmail);
    if (config.contactPhone) setPhone(config.contactPhone);
    if (config.contactAddress) setAddress(config.contactAddress);
    if (config.structureTexts?.contactEyebrow) setEyebrow(config.structureTexts.contactEyebrow);
    if (config.structureTexts?.contactSectionTitle) setSectionTitle(config.structureTexts.contactSectionTitle);
    if (config.structureTexts?.contactSectionSubtitle) setSectionSubtitle(config.structureTexts.contactSectionSubtitle);
    if (config.institutional) setInstitutional(config.institutional);
  }, [config]);

  // Real-time synchronization
  const handleUpdateContact = (newEmail?: string, newPhone?: string, newAddress?: string) => {
    const updatedEmail = newEmail !== undefined ? newEmail : email;
    const updatedPhone = newPhone !== undefined ? newPhone : phone;
    const updatedAddress = newAddress !== undefined ? newAddress : address;

    if (newEmail !== undefined) setEmail(newEmail);
    if (newPhone !== undefined) setPhone(newPhone);
    if (newAddress !== undefined) setAddress(newAddress);

    updateContactInfo({
      email: updatedEmail,
      phone: updatedPhone,
      address: updatedAddress,
    });
  };

  const handleUpdateHeaders = (newEyebrow?: string, newTitle?: string, newSubtitle?: string) => {
    const e = newEyebrow !== undefined ? newEyebrow : eyebrow;
    const t = newTitle !== undefined ? newTitle : sectionTitle;
    const s = newSubtitle !== undefined ? newSubtitle : sectionSubtitle;

    if (newEyebrow !== undefined) setEyebrow(e);
    if (newTitle !== undefined) setSectionTitle(t);
    if (newSubtitle !== undefined) setSectionSubtitle(s);

    updateStructureTexts({
      contactEyebrow: e,
      contactSectionTitle: t,
      contactSectionSubtitle: s,
    });
  };

  const handleUpdateInstitutional = (field: keyof InstitutionalPages, value: string) => {
    const updated = { ...institutional, [field]: value };
    setInstitutional(updated);
    updateInstitutional(updated);
  };

  const handleSaveAll = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    updateContactInfo({ email, phone, address });
    updateStructureTexts({
      contactEyebrow: eyebrow,
      contactSectionTitle: sectionTitle,
      contactSectionSubtitle: sectionSubtitle,
    });
    updateInstitutional(institutional);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3500);
  };

  const handleRestoreDefault = () => {
    if (
      confirm(
        'Deseja restaurar todos os textos de Expediente, Políticas e Contato para o padrão oficial do Amazonas?'
      )
    ) {
      setEmail(INITIAL_PORTAL_CONFIG.contactEmail);
      setPhone(INITIAL_PORTAL_CONFIG.contactPhone);
      setAddress(INITIAL_PORTAL_CONFIG.contactAddress);
      setEyebrow('Transparência & Conformidade');
      setSectionTitle('Expediente, Políticas e Contato');
      setSectionSubtitle(
        'Garantias de conformidade com a Lei Geral de Proteção de Dados (LGPD) e transparência da equipe editorial.'
      );
      setInstitutional(INITIAL_PORTAL_CONFIG.institutional);

      updateContactInfo({
        email: INITIAL_PORTAL_CONFIG.contactEmail,
        phone: INITIAL_PORTAL_CONFIG.contactPhone,
        address: INITIAL_PORTAL_CONFIG.contactAddress,
      });
      updateStructureTexts({
        contactEyebrow: 'Transparência & Conformidade',
        contactSectionTitle: 'Expediente, Políticas e Contato',
        contactSectionSubtitle:
          'Garantias de conformidade com a Lei Geral de Proteção de Dados (LGPD) e transparência da equipe editorial.',
      });
      updateInstitutional(INITIAL_PORTAL_CONFIG.institutional);

      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 3500);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-200 gap-3">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1.5 bg-emerald-100 text-emerald-800 rounded-lg">
              <Shield className="w-5 h-5" />
            </span>
            <h3 className="font-editorial text-2xl font-bold text-slate-900">
              Expediente, Políticas e Contato
            </h3>
            <span className="text-[10px] bg-emerald-600 text-white font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">
              100% Editável
            </span>
          </div>
          <p className="text-xs text-slate-500 font-sans mt-1">
            Controle integral em tempo real: edite e-mails, telefones, sede, expediente editorial, princípios éticos, conformidade com a LGPD e termos de publicidade.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleRestoreDefault}
            className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-lg transition-colors cursor-pointer flex items-center gap-1.5"
            title="Restaurar valores oficiais do Amazonas"
          >
            <RotateCcw className="w-3.5 h-3.5 text-slate-500" />
            <span>Restaurar Padrão</span>
          </button>

          <button
            type="button"
            onClick={() => handleSaveAll()}
            className="px-4 py-2 bg-[#0f3d59] hover:bg-[#0a2540] text-white text-xs font-bold rounded-lg transition-colors cursor-pointer shadow-xs flex items-center gap-2"
          >
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>Salvar Alterações</span>
          </button>
        </div>
      </div>

      {/* Success Notification */}
      {savedSuccess && (
        <div className="p-4 bg-emerald-50 border border-emerald-300 rounded-xl text-xs text-emerald-900 font-semibold flex items-center gap-3 shadow-xs animate-in fade-in">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
          <div>
            <p className="font-bold">Alterações salvas e sincronizadas em tempo real!</p>
            <p className="text-[11px] text-emerald-700 font-normal">
              A seção 'Expediente, Políticas e Contato' na One Page já reflete todos os ajustes realizados pelo Administrador.
            </p>
          </div>
        </div>
      )}

      {/* Subtabs Bar */}
      <div className="flex items-center gap-1.5 border-b border-slate-200 pb-2 overflow-x-auto scrollbar-none">
        <button
          type="button"
          onClick={() => setActiveSubTab('contatos')}
          className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors cursor-pointer flex items-center gap-1.5 whitespace-nowrap ${
            activeSubTab === 'contatos'
              ? 'bg-[#0f3d59] text-white shadow-xs'
              : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
          }`}
        >
          <Mail className="w-3.5 h-3.5" />
          <span>1. Títulos & Contatos Diretos</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveSubTab('masthead')}
          className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors cursor-pointer flex items-center gap-1.5 whitespace-nowrap ${
            activeSubTab === 'masthead'
              ? 'bg-[#0f3d59] text-white shadow-xs'
              : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
          }`}
        >
          <FileText className="w-3.5 h-3.5" />
          <span>2. Expediente Editorial</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveSubTab('ethics')}
          className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors cursor-pointer flex items-center gap-1.5 whitespace-nowrap ${
            activeSubTab === 'ethics'
              ? 'bg-[#0f3d59] text-white shadow-xs'
              : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
          }`}
        >
          <BookCheck className="w-3.5 h-3.5" />
          <span>3. Princípios Editoriais</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveSubTab('privacy')}
          className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors cursor-pointer flex items-center gap-1.5 whitespace-nowrap ${
            activeSubTab === 'privacy'
              ? 'bg-[#0f3d59] text-white shadow-xs'
              : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
          }`}
        >
          <Shield className="w-3.5 h-3.5" />
          <span>4. Privacidade & LGPD</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveSubTab('corrections')}
          className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors cursor-pointer flex items-center gap-1.5 whitespace-nowrap ${
            activeSubTab === 'corrections'
              ? 'bg-[#0f3d59] text-white shadow-xs'
              : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
          }`}
        >
          <AlertCircle className="w-3.5 h-3.5" />
          <span>5. Correções & Resposta</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveSubTab('advertising')}
          className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors cursor-pointer flex items-center gap-1.5 whitespace-nowrap ${
            activeSubTab === 'advertising'
              ? 'bg-[#0f3d59] text-white shadow-xs'
              : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
          }`}
        >
          <Megaphone className="w-3.5 h-3.5" />
          <span>6. Termos de Publicidade</span>
        </button>
      </div>

      {/* SUBTAB 1: TÍTULOS & CONTATOS DIRETOS */}
      {activeSubTab === 'contatos' && (
        <div className="space-y-6 animate-in fade-in">
          {/* Section Titles Config */}
          <div className="bg-white p-5 border border-slate-200 rounded-xl space-y-4 shadow-2xs">
            <h4 className="font-editorial text-base font-bold text-slate-900 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-[#0f3d59]" />
              <span>Títulos da Seção na One Page</span>
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Chapéu / Eyebrow
                </label>
                <input
                  type="text"
                  value={eyebrow}
                  onChange={(e) => handleUpdateHeaders(e.target.value, undefined, undefined)}
                  placeholder="Ex: Transparência & Conformidade"
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#0f3d59] focus:bg-white"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Título Principal da Seção
                </label>
                <input
                  type="text"
                  value={sectionTitle}
                  onChange={(e) => handleUpdateHeaders(undefined, e.target.value, undefined)}
                  placeholder="Ex: Expediente, Políticas e Contato"
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#0f3d59] focus:bg-white font-semibold"
                />
              </div>

              <div className="sm:col-span-3">
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Subtítulo Descritivo
                </label>
                <input
                  type="text"
                  value={sectionSubtitle}
                  onChange={(e) => handleUpdateHeaders(undefined, undefined, e.target.value)}
                  placeholder="Ex: Garantias de conformidade com a Lei Geral de Proteção de Dados (LGPD)..."
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#0f3d59] focus:bg-white"
                />
              </div>
            </div>
          </div>

          {/* Direct Contacts Cards */}
          <div className="bg-white p-5 border border-slate-200 rounded-xl space-y-4 shadow-2xs">
            <h4 className="font-editorial text-base font-bold text-slate-900 flex items-center gap-2">
              <Mail className="w-4 h-4 text-emerald-700" />
              <span>Cartões de Contato Direto da Redação</span>
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-2">
                <div className="flex items-center gap-2 text-blue-700 font-semibold text-xs">
                  <Mail className="w-4 h-4" />
                  <span>E-mail da Redação</span>
                </div>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => handleUpdateContact(e.target.value, undefined, undefined)}
                  placeholder="redacao@comunidadeemacao.am"
                  className="w-full px-3 py-2 text-xs bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#0f3d59] font-medium"
                />
                <span className="text-[11px] text-slate-500 block">
                  Exibido no card de e-mail e nos links 'mailto:' da One Page.
                </span>
              </div>

              <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-2">
                <div className="flex items-center gap-2 text-emerald-700 font-semibold text-xs">
                  <Phone className="w-4 h-4" />
                  <span>Telefone & WhatsApp</span>
                </div>
                <input
                  type="text"
                  value={phone}
                  onChange={(e) => handleUpdateContact(undefined, e.target.value, undefined)}
                  placeholder="(92) 98144-0022"
                  className="w-full px-3 py-2 text-xs bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#0f3d59] font-medium"
                />
                <span className="text-[11px] text-slate-500 block">
                  Contato telefônico oficial e linha de atendimento ao cidadão.
                </span>
              </div>

              <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-2">
                <div className="flex items-center gap-2 text-amber-700 font-semibold text-xs">
                  <MapPin className="w-4 h-4" />
                  <span>Sede Operacional / Endereço</span>
                </div>
                <input
                  type="text"
                  value={address}
                  onChange={(e) => handleUpdateContact(undefined, undefined, e.target.value)}
                  placeholder="Manaus, Amazonas — Brasil"
                  className="w-full px-3 py-2 text-xs bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#0f3d59] font-medium"
                />
                <span className="text-[11px] text-slate-500 block">
                  Localização institucional do portal no estado do Amazonas.
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* SUBTAB 2: EXPEDIENTE EDITORIAL */}
      {activeSubTab === 'masthead' && (
        <div className="bg-white p-5 border border-slate-200 rounded-xl space-y-4 shadow-2xs animate-in fade-in">
          <div className="flex items-center justify-between">
            <h4 className="font-editorial text-base font-bold text-slate-900 flex items-center gap-2">
              <FileText className="w-4 h-4 text-[#0f3d59]" />
              <span>Texto do Expediente Editorial</span>
            </h4>
            <span className="text-[11px] text-slate-500 font-mono">Chave: institutional.masthead</span>
          </div>
          <p className="text-xs text-slate-500">
            Defina o corpo editorial, idealizador (Kássio Cardoso), jornalistas participantes, abrangência geográfica no Amazonas e sede. Suporta quebra de linha.
          </p>

          <textarea
            rows={10}
            value={institutional.masthead}
            onChange={(e) => handleUpdateInstitutional('masthead', e.target.value)}
            className="w-full p-4 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-[#0f3d59] focus:bg-white font-mono leading-relaxed"
            placeholder="Digite o expediente editorial..."
          />
        </div>
      )}

      {/* SUBTAB 3: PRINCÍPIOS EDITORIAIS */}
      {activeSubTab === 'ethics' && (
        <div className="bg-white p-5 border border-slate-200 rounded-xl space-y-4 shadow-2xs animate-in fade-in">
          <div className="flex items-center justify-between">
            <h4 className="font-editorial text-base font-bold text-slate-900 flex items-center gap-2">
              <BookCheck className="w-4 h-4 text-[#0f3d59]" />
              <span>Princípios Editoriais & Código de Ética</span>
            </h4>
            <span className="text-[11px] text-slate-500 font-mono">Chave: institutional.editorialPrinciples</span>
          </div>
          <p className="text-xs text-slate-500">
            Diretrizes de apuração, valorização das comunidades ribeirinhas e povos tradicionais, e normas de verificação factual do portal.
          </p>

          <textarea
            rows={10}
            value={institutional.editorialPrinciples}
            onChange={(e) => handleUpdateInstitutional('editorialPrinciples', e.target.value)}
            className="w-full p-4 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-[#0f3d59] focus:bg-white font-mono leading-relaxed"
            placeholder="Digite os princípios editoriais..."
          />
        </div>
      )}

      {/* SUBTAB 4: PRIVACIDADE & LGPD */}
      {activeSubTab === 'privacy' && (
        <div className="bg-white p-5 border border-slate-200 rounded-xl space-y-4 shadow-2xs animate-in fade-in">
          <div className="flex items-center justify-between">
            <h4 className="font-editorial text-base font-bold text-slate-900 flex items-center gap-2">
              <Shield className="w-4 h-4 text-[#0f3d59]" />
              <span>Política de Privacidade & Conformidade LGPD</span>
            </h4>
            <span className="text-[11px] text-slate-500 font-mono">Chave: institutional.privacyPolicy</span>
          </div>
          <p className="text-xs text-slate-500">
            Regras de tratamento de dados sob a Lei 13.709/2018 (LGPD) e garantia constitucional de sigilo absoluto da fonte (Art. 5º, XIV da CF/88) para as denúncias comunitárias.
          </p>

          <textarea
            rows={10}
            value={institutional.privacyPolicy}
            onChange={(e) => handleUpdateInstitutional('privacyPolicy', e.target.value)}
            className="w-full p-4 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-[#0f3d59] focus:bg-white font-mono leading-relaxed"
            placeholder="Digite a política de privacidade..."
          />
        </div>
      )}

      {/* SUBTAB 5: CORREÇÕES & RESPOSTA */}
      {activeSubTab === 'corrections' && (
        <div className="bg-white p-5 border border-slate-200 rounded-xl space-y-4 shadow-2xs animate-in fade-in">
          <div className="flex items-center justify-between">
            <h4 className="font-editorial text-base font-bold text-slate-900 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-[#0f3d59]" />
              <span>Política de Correções e Direito de Resposta</span>
            </h4>
            <span className="text-[11px] text-slate-500 font-mono">Chave: institutional.correctionsPolicy</span>
          </div>
          <p className="text-xs text-slate-500">
            Compromisso de retificação transparente de erros factuais e procedimento para solicitação de direito de resposta por pessoas ou órgãos citados.
          </p>

          <textarea
            rows={10}
            value={institutional.correctionsPolicy}
            onChange={(e) => handleUpdateInstitutional('correctionsPolicy', e.target.value)}
            className="w-full p-4 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-[#0f3d59] focus:bg-white font-mono leading-relaxed"
            placeholder="Digite a política de correções..."
          />
        </div>
      )}

      {/* SUBTAB 6: TERMOS DE PUBLICIDADE */}
      {activeSubTab === 'advertising' && (
        <div className="bg-white p-5 border border-slate-200 rounded-xl space-y-4 shadow-2xs animate-in fade-in">
          <div className="flex items-center justify-between">
            <h4 className="font-editorial text-base font-bold text-slate-900 flex items-center gap-2">
              <Megaphone className="w-4 h-4 text-[#0f3d59]" />
              <span>Regras & Termos de Publicidade</span>
            </h4>
            <span className="text-[11px] text-slate-500 font-mono">Chave: institutional.advertisingTerms</span>
          </div>
          <p className="text-xs text-slate-500">
            Critérios para anúncios de marcas, cooperativas e empreendedores locais, estabelecendo clara separação entre publicidade e linha editorial jornalística.
          </p>

          <textarea
            rows={10}
            value={institutional.advertisingTerms}
            onChange={(e) => handleUpdateInstitutional('advertisingTerms', e.target.value)}
            className="w-full p-4 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-[#0f3d59] focus:bg-white font-mono leading-relaxed"
            placeholder="Digite as regras de publicidade..."
          />
        </div>
      )}

      {/* Live Preview Box */}
      <div className="bg-slate-100/80 p-5 border border-slate-200 rounded-xl space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
            <span>Prévia em Tempo Real da Seção One Page</span>
          </span>
          <span className="text-[11px] text-slate-500">Ancoragem: #contato</span>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
          <div className="text-[11px] font-semibold text-emerald-800 uppercase tracking-widest font-sans">
            {eyebrow}
          </div>
          <h4 className="text-lg font-bold font-editorial text-slate-900 mt-0.5">
            {sectionTitle}
          </h4>
          <p className="text-xs text-slate-600 mt-1">{sectionSubtitle}</p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-4 pt-3 border-t border-slate-100 text-xs">
            <div className="p-2.5 bg-blue-50/50 rounded-lg border border-blue-100">
              <span className="text-[10px] font-bold text-slate-500 block uppercase">E-mail:</span>
              <span className="font-semibold text-slate-900 break-all">{email}</span>
            </div>
            <div className="p-2.5 bg-emerald-50/50 rounded-lg border border-emerald-100">
              <span className="text-[10px] font-bold text-slate-500 block uppercase">Telefone / WhatsApp:</span>
              <span className="font-semibold text-slate-900">{phone}</span>
            </div>
            <div className="p-2.5 bg-amber-50/50 rounded-lg border border-amber-100">
              <span className="text-[10px] font-bold text-slate-500 block uppercase">Sede:</span>
              <span className="font-semibold text-slate-900">{address}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
