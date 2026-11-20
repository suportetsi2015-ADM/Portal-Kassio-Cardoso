import React, { useState, useMemo } from 'react';
import { useStore } from '../context/StoreContext';
import { ClassifiedItem, JobType } from '../types';
import {
  Briefcase,
  Search,
  MapPin,
  Banknote,
  Clock,
  CheckCircle2,
  Send,
  Building2,
  PlusCircle,
  X,
  Sparkles,
  ExternalLink,
  MessageCircle,
  Share2,
} from 'lucide-react';

export const ClassifiedsSection: React.FC = () => {
  const { classifieds, addClassified } = useStore();

  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedJob, setSelectedJob] = useState<ClassifiedItem | null>(null);
  const [isSubmitModalOpen, setIsSubmitModalOpen] = useState(false);
  const [submitFeedback, setSubmitFeedback] = useState<string | null>(null);

  // Form states for submitting new job
  const [newTitle, setNewTitle] = useState('');
  const [newCompany, setNewCompany] = useState('');
  const [newLocation, setNewLocation] = useState('Manaus - Distrito Industrial');
  const [newCategory, setNewCategory] = useState('Polo Industrial');
  const [newType, setNewType] = useState<JobType>('Tempo Integral (CLT)');
  const [newSalary, setNewSalary] = useState('');
  const [newDescription, setNewDescription] = useState('');
  const [newRequirements, setNewRequirements] = useState('');
  const [newBenefits, setNewBenefits] = useState('');
  const [newWhatsapp, setNewWhatsapp] = useState('');
  const [newEmail, setNewEmail] = useState('');

  const categoriesList = [
    { id: 'all', label: 'Todas as Vagas' },
    { id: 'Polo Industrial', label: '🏭 Polo Industrial (PIM)' },
    { id: 'Comércio & Vendas', label: '🛍️ Comércio & Vendas' },
    { id: 'Saúde & Cuidados', label: '🏥 Saúde & Cuidados' },
    { id: 'Educação & Estágios', label: '🎓 Estágios & Aprendiz' },
    { id: 'Serviços & Manutenção', label: '🔧 Serviços Gerais' },
  ];

  const filteredJobs = useMemo(() => {
    return classifieds.filter((job) => {
      const matchesCategory =
        selectedCategory === 'all' ||
        job.category.toLowerCase() === selectedCategory.toLowerCase();

      const term = searchTerm.toLowerCase();
      const matchesSearch =
        !term ||
        job.title.toLowerCase().includes(term) ||
        job.company.toLowerCase().includes(term) ||
        job.location.toLowerCase().includes(term) ||
        job.description.toLowerCase().includes(term);

      return matchesCategory && matchesSearch;
    });
  }, [classifieds, selectedCategory, searchTerm]);

  const handleOpenWhatsAppApply = (job: ClassifiedItem) => {
    const rawNumber = job.contactWhatsapp || '(92) 98144-0022';
    const cleanNumber = rawNumber.replace(/\D/g, '') || '5592981440022';
    const fullNumber = cleanNumber.startsWith('55') ? cleanNumber : `55${cleanNumber}`;
    const text = encodeURIComponent(
      `Olá! Tenho interesse na vaga "${job.title}" na empresa "${job.company}", divulgada no Portal COMUNIDADE EM AÇÃO. Gostaria de enviar meu currículo para participar da seleção.`
    );
    const url = `https://wa.me/${fullNumber}?text=${text}`;
    
    // Open application via standard link
    const link = document.createElement('a');
    link.href = url;
    link.target = '_blank';
    link.rel = 'noopener noreferrer';
    link.click();
  };

  const handleSubmitNewJob = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newCompany.trim()) return;

    const reqArray = newRequirements
      .split('\n')
      .map((r) => r.trim())
      .filter((r) => r.length > 0);

    const benArray = newBenefits
      .split('\n')
      .map((b) => b.trim())
      .filter((b) => b.length > 0);

    addClassified({
      title: newTitle.trim(),
      company: newCompany.trim(),
      location: newLocation.trim(),
      category: newCategory,
      type: newType,
      salary: newSalary.trim() || 'A combinar',
      description: newDescription.trim(),
      requirements: reqArray.length > 0 ? reqArray : ['Experiência ou interesse na área'],
      benefits: benArray,
      contactWhatsapp: newWhatsapp.trim() || '(92) 98144-0022',
      contactEmail: newEmail.trim() || 'vagas@comunidadeemacao.am',
      status: 'active',
      isFeatured: false,
    });

    setSubmitFeedback('Vaga cadastrada com sucesso! Ela já está visível para a comunidade.');
    setTimeout(() => {
      setIsSubmitModalOpen(false);
      setSubmitFeedback(null);
      // Reset form
      setNewTitle('');
      setNewCompany('');
      setNewSalary('');
      setNewDescription('');
      setNewRequirements('');
      setNewBenefits('');
      setNewWhatsapp('');
      setNewEmail('');
    }, 1500);
  };

  return (
    <section id="classificados" className="py-16 sm:py-20 bg-slate-50 border-b border-slate-200 scroll-mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold text-emerald-800 uppercase tracking-widest font-sans mb-1.5">
              <span className="p-1.5 bg-emerald-100 text-emerald-800 rounded-lg">
                <Briefcase className="w-4 h-4" />
              </span>
              <span>Balcão de Empregos do Amazonas</span>
            </div>
            <h2 className="text-2xl sm:text-4xl font-bold font-editorial text-slate-900">
              Classificados & Oportunidades
            </h2>
            <p className="text-sm sm:text-base text-slate-600 mt-2 font-sans max-w-2xl">
              Confira vagas abertas no Polo Industrial de Manaus, comércios de bairro, clínicas e serviços nos municípios. Publicações gratuitas para apoiar os trabalhadores locais.
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={() => setIsSubmitModalOpen(true)}
              className="flex items-center gap-2 px-4 py-2.5 bg-[#0f3d59] hover:bg-[#0a2540] text-white text-xs sm:text-sm font-bold rounded-xl transition-all shadow-xs hover:shadow-md cursor-pointer"
            >
              <PlusCircle className="w-4 h-4 text-amber-400" />
              <span>Publicar uma Vaga</span>
            </button>
          </div>
        </div>

        {/* Search & Category Filter Bar */}
        <div className="bg-white rounded-2xl border border-slate-200 p-4 sm:p-5 shadow-2xs mb-8">
          <div className="flex flex-col lg:flex-row gap-4 items-stretch lg:items-center justify-between">
            {/* Search input */}
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Buscar por cargo, empresa, bairro ou cidade..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#0f3d59]/30 focus:bg-white transition-all"
              />
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 text-xs"
                >
                  Limpar
                </button>
              )}
            </div>

            {/* Total count badge */}
            <div className="flex items-center gap-2 text-xs font-semibold text-slate-600 shrink-0">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
              <span>
                <strong>{filteredJobs.length}</strong> {filteredJobs.length === 1 ? 'vaga encontrada' : 'vagas disponíveis'}
              </span>
            </div>
          </div>

          {/* Category Tabs */}
          <div className="flex items-center gap-2 overflow-x-auto pt-4 mt-4 border-t border-slate-100 scrollbar-none pb-1">
            {categoriesList.map((cat) => {
              const isSelected = selectedCategory === cat.id;
              const count =
                cat.id === 'all'
                  ? classifieds.length
                  : classifieds.filter((j) => j.category.toLowerCase() === cat.id.toLowerCase()).length;

              return (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`px-3.5 py-2 text-xs font-semibold rounded-lg whitespace-nowrap transition-all cursor-pointer flex items-center gap-2 ${
                    isSelected
                      ? 'bg-[#0f3d59] text-white shadow-xs'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  <span>{cat.label}</span>
                  <span
                    className={`text-[11px] px-1.5 py-0.2 rounded-full ${
                      isSelected ? 'bg-white/20 text-white' : 'bg-slate-200 text-slate-600'
                    }`}
                  >
                    {count}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Job Listings Grid */}
        {filteredJobs.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredJobs.map((job) => (
              <div
                key={job.id}
                className="bg-white border border-slate-200 rounded-2xl p-5 hover:border-slate-300 hover:shadow-md transition-all flex flex-col justify-between group relative"
              >
                {/* Card Top: Tags */}
                <div>
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <span className="px-2.5 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider bg-emerald-100 text-emerald-800">
                      {job.type}
                    </span>
                    {job.isFeatured && (
                      <span className="flex items-center gap-1 text-[10px] font-bold text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200">
                        <Sparkles className="w-3 h-3" />
                        <span>Destaque</span>
                      </span>
                    )}
                  </div>

                  <h3
                    onClick={() => setSelectedJob(job)}
                    className="font-editorial text-lg font-bold text-slate-900 group-hover:text-[#0f3d59] transition-colors cursor-pointer line-clamp-2"
                  >
                    {job.title}
                  </h3>

                  <div className="flex items-center gap-1.5 text-xs text-slate-600 font-medium mt-1.5 mb-2">
                    <Building2 className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span className="line-clamp-1">{job.company}</span>
                  </div>

                  <div className="flex items-center gap-1.5 text-xs text-slate-500 mb-3">
                    <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span className="line-clamp-1">{job.location}</span>
                  </div>

                  <div className="bg-slate-50 rounded-xl p-2.5 border border-slate-100 mb-4 flex items-center gap-2">
                    <Banknote className="w-4 h-4 text-emerald-700 shrink-0" />
                    <div>
                      <span className="text-[10px] text-slate-500 block uppercase font-sans">Salário / Remuneração</span>
                      <span className="text-xs font-bold text-slate-900">{job.salary}</span>
                    </div>
                  </div>

                  <p className="text-xs text-slate-600 line-clamp-3 mb-4 font-sans">
                    {job.description}
                  </p>

                  {/* Requirements Snippets */}
                  <div className="space-y-1 mb-4">
                    {job.requirements.slice(0, 2).map((req, idx) => (
                      <div key={idx} className="flex items-start gap-1.5 text-[11px] text-slate-500">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                        <span className="line-clamp-1">{req}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Card Actions */}
                <div className="pt-4 border-t border-slate-100 flex items-center gap-2">
                  <button
                    onClick={() => handleOpenWhatsAppApply(job)}
                    className="flex-1 flex items-center justify-center gap-1.5 py-2 px-3 bg-[#25D366] hover:bg-[#20ba5a] text-white text-xs font-bold rounded-lg transition-colors cursor-pointer shadow-2xs"
                  >
                    <MessageCircle className="w-3.5 h-3.5" />
                    <span>Candidatar via WhatsApp</span>
                  </button>

                  <button
                    onClick={() => setSelectedJob(job)}
                    className="py-2 px-3 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-lg transition-colors cursor-pointer"
                    title="Ver detalhes da vaga"
                  >
                    Detalhes
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-2xl border border-dashed border-slate-300 p-12 text-center max-w-lg mx-auto">
            <Briefcase className="w-10 h-10 text-slate-300 mx-auto mb-3" />
            <h4 className="font-editorial text-lg font-bold text-slate-800">
              Nenhuma vaga encontrada para esta busca
            </h4>
            <p className="text-xs text-slate-500 mt-1 mb-4">
              Tente selecionar outra categoria ou limpar os termos da pesquisa.
            </p>
            <button
              onClick={() => {
                setSelectedCategory('all');
                setSearchTerm('');
              }}
              className="px-4 py-2 bg-[#0f3d59] text-white text-xs font-bold rounded-lg cursor-pointer"
            >
              Ver todas as vagas
            </button>
          </div>
        )}

        {/* Community Callout Banner */}
        <div className="mt-12 bg-gradient-to-r from-[#0f3d59] to-[#0a2540] rounded-2xl p-6 sm:p-8 text-white flex flex-col sm:flex-row sm:items-center justify-between gap-6 shadow-sm">
          <div>
            <span className="text-xs font-semibold text-amber-300 uppercase tracking-wider block mb-1">
              Divulgue gratuitamente no Portal
            </span>
            <h3 className="font-editorial text-xl sm:text-2xl font-bold">
              Tem uma empresa ou comércio no Amazonas e precisa contratar?
            </h3>
            <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-xl">
              Publique vagas de forma simples, rápida e gratuita para alcançar milhares de leitores e moradores dos bairros de Manaus e do interior.
            </p>
          </div>
          <button
            onClick={() => setIsSubmitModalOpen(true)}
            className="px-5 py-3 bg-amber-400 hover:bg-amber-300 text-slate-950 text-xs sm:text-sm font-bold rounded-xl transition-all shrink-0 cursor-pointer shadow-md"
          >
            Anunciar Vaga Grátis
          </button>
        </div>
      </div>

      {/* MODAL 1: Detalhes Completos da Vaga */}
      {selectedJob && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-xs animate-in fade-in overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-xl w-full p-6 sm:p-8 border border-slate-200 shadow-2xl relative my-8">
            <button
              onClick={() => setSelectedJob(null)}
              className="absolute top-5 right-5 p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 cursor-pointer"
              aria-label="Fechar"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-2 mb-2">
              <span className="px-2.5 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-emerald-100 text-emerald-800">
                {selectedJob.type}
              </span>
              <span className="text-xs text-slate-500 font-sans">
                {selectedJob.category}
              </span>
            </div>

            <h3 className="font-editorial text-2xl font-bold text-slate-900 pr-8">
              {selectedJob.title}
            </h3>

            <div className="flex flex-wrap items-center gap-4 text-xs text-slate-600 mt-2 pb-4 border-b border-slate-100">
              <span className="flex items-center gap-1">
                <Building2 className="w-4 h-4 text-slate-400" />
                <strong className="text-slate-800">{selectedJob.company}</strong>
              </span>
              <span className="flex items-center gap-1">
                <MapPin className="w-4 h-4 text-slate-400" />
                <span>{selectedJob.location}</span>
              </span>
            </div>

            {/* Salary & Publication Date */}
            <div className="grid grid-cols-2 gap-3 my-4">
              <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                <span className="text-[10px] text-slate-500 uppercase block font-sans">Remuneração</span>
                <span className="text-sm font-bold text-emerald-800">{selectedJob.salary}</span>
              </div>
              <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                <span className="text-[10px] text-slate-500 uppercase block font-sans">Publicado em</span>
                <span className="text-sm font-semibold text-slate-700">
                  {new Date(selectedJob.publishedAt).toLocaleDateString('pt-BR')}
                </span>
              </div>
            </div>

            {/* Description */}
            <div className="mb-4">
              <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-1 font-sans">
                Descrição da Função
              </h4>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-sans">
                {selectedJob.description}
              </p>
            </div>

            {/* Requirements */}
            {selectedJob.requirements && selectedJob.requirements.length > 0 && (
              <div className="mb-4">
                <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-2 font-sans">
                  Requisitos & Qualificações
                </h4>
                <ul className="space-y-1.5">
                  {selectedJob.requirements.map((req, i) => (
                    <li key={i} className="flex items-start gap-2 text-xs text-slate-700">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                      <span>{req}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Benefits */}
            {selectedJob.benefits && selectedJob.benefits.length > 0 && (
              <div className="mb-4">
                <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-2 font-sans">
                  Benefícios Oferecidos
                </h4>
                <div className="flex flex-wrap gap-1.5">
                  {selectedJob.benefits.map((b, i) => (
                    <span
                      key={i}
                      className="text-[11px] font-medium bg-emerald-50 text-emerald-800 border border-emerald-200 px-2.5 py-1 rounded-md"
                    >
                      {b}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* How to Apply */}
            {selectedJob.howToApply && (
              <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 mb-5 text-xs text-amber-900">
                <strong>Como se candidatar:</strong> {selectedJob.howToApply}
              </div>
            )}

            {/* Action Buttons */}
            <div className="pt-4 border-t border-slate-100 flex flex-col sm:flex-row gap-3">
              <button
                onClick={() => handleOpenWhatsAppApply(selectedJob)}
                className="flex-1 py-3 px-4 bg-[#25D366] hover:bg-[#20ba5a] text-white text-xs sm:text-sm font-bold rounded-xl transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-md"
              >
                <MessageCircle className="w-4 h-4" />
                <span>Enviar Currículo pelo WhatsApp</span>
              </button>

              {selectedJob.contactEmail && (
                <a
                  href={`mailto:${selectedJob.contactEmail}?subject=Candidatura: ${encodeURIComponent(
                    selectedJob.title
                  )}`}
                  className="py-3 px-4 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs sm:text-sm font-bold rounded-xl transition-colors flex items-center justify-center gap-1.5 cursor-pointer text-center"
                >
                  <Send className="w-3.5 h-3.5 text-slate-600" />
                  <span>E-mail</span>
                </a>
              )}
            </div>
          </div>
        </div>
      )}

      {/* MODAL 2: Publicar Nova Vaga */}
      {isSubmitModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-xs animate-in fade-in overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-xl w-full p-6 sm:p-8 border border-slate-200 shadow-2xl relative my-8">
            <button
              onClick={() => setIsSubmitModalOpen(false)}
              className="absolute top-5 right-5 p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 cursor-pointer"
              aria-label="Fechar"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-2.5 mb-1">
              <div className="p-2 bg-emerald-100 text-emerald-800 rounded-lg">
                <Briefcase className="w-5 h-5" />
              </div>
              <h3 className="font-editorial text-2xl font-bold text-slate-900">
                Publicar Vaga de Emprego
              </h3>
            </div>
            <p className="text-xs text-slate-500 mb-5">
              Preencha os dados da oportunidade. A publicação é gratuita e ficará disponível no portal.
            </p>

            {submitFeedback && (
              <div className="mb-4 p-3 bg-emerald-50 text-emerald-800 border border-emerald-300 rounded-xl text-xs font-semibold flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0" />
                <span>{submitFeedback}</span>
              </div>
            )}

            <form onSubmit={handleSubmitNewJob} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Título do Cargo *
                  </label>
                  <input
                    type="text"
                    required
                    value={newTitle}
                    onChange={(e) => setNewTitle(e.target.value)}
                    placeholder="Ex: Auxiliar de Almoxarifado"
                    className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#0f3d59] focus:bg-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Nome da Empresa / Comércio *
                  </label>
                  <input
                    type="text"
                    required
                    value={newCompany}
                    onChange={(e) => setNewCompany(e.target.value)}
                    placeholder="Ex: Comercial Zona Leste Ltda"
                    className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#0f3d59] focus:bg-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Categoria
                  </label>
                  <select
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value)}
                    className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#0f3d59] focus:bg-white"
                  >
                    <option value="Polo Industrial">Polo Industrial</option>
                    <option value="Comércio & Vendas">Comércio & Vendas</option>
                    <option value="Saúde & Cuidados">Saúde & Cuidados</option>
                    <option value="Educação & Estágios">Educação & Estágios</option>
                    <option value="Serviços & Manutenção">Serviços & Manutenção</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Tipo de Vaga
                  </label>
                  <select
                    value={newType}
                    onChange={(e) => setNewType(e.target.value as JobType)}
                    className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#0f3d59] focus:bg-white"
                  >
                    <option value="Tempo Integral (CLT)">Tempo Integral (CLT)</option>
                    <option value="Meio Período">Meio Período</option>
                    <option value="Estágio">Estágio</option>
                    <option value="Jovem Aprendiz">Jovem Aprendiz</option>
                    <option value="Temporário">Temporário</option>
                    <option value="Freelancer / Diária">Freelancer / Diária</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Salário / Bolsa
                  </label>
                  <input
                    type="text"
                    value={newSalary}
                    onChange={(e) => setNewSalary(e.target.value)}
                    placeholder="Ex: R$ 1.800,00 + VT"
                    className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#0f3d59] focus:bg-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Localidade / Município / Bairro *
                </label>
                <input
                  type="text"
                  required
                  value={newLocation}
                  onChange={(e) => setNewLocation(e.target.value)}
                  placeholder="Ex: Manaus - Zona Leste (São José)"
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#0f3d59] focus:bg-white"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Descrição das Atividades *
                </label>
                <textarea
                  required
                  rows={3}
                  value={newDescription}
                  onChange={(e) => setNewDescription(e.target.value)}
                  placeholder="Descreva as principais funções do dia a dia e responsabilidades do profissional."
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#0f3d59] focus:bg-white"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Requisitos (um por linha)
                  </label>
                  <textarea
                    rows={2}
                    value={newRequirements}
                    onChange={(e) => setNewRequirements(e.target.value)}
                    placeholder="Ensino Médio completo&#10;Experiência básica&#10;Disponibilidade de horário"
                    className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#0f3d59] focus:bg-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Benefícios (um por linha)
                  </label>
                  <textarea
                    rows={2}
                    value={newBenefits}
                    onChange={(e) => setNewBenefits(e.target.value)}
                    placeholder="Vale Transporte&#10;Alimentação no local&#10;Plano de saúde"
                    className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#0f3d59] focus:bg-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    WhatsApp para Receber Currículos *
                  </label>
                  <input
                    type="text"
                    required
                    value={newWhatsapp}
                    onChange={(e) => setNewWhatsapp(e.target.value)}
                    placeholder="(92) 99999-9999"
                    className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#0f3d59] focus:bg-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    E-mail do RH / Seleção
                  </label>
                  <input
                    type="email"
                    value={newEmail}
                    onChange={(e) => setNewEmail(e.target.value)}
                    placeholder="selecao@empresa.com.br"
                    className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#0f3d59] focus:bg-white"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsSubmitModalOpen(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-lg cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-xs font-bold text-white bg-[#0f3d59] hover:bg-[#0a2540] rounded-lg cursor-pointer shadow-xs"
                >
                  Publicar Vaga
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </section>
  );
};
