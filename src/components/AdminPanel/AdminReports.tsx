import React, { useState } from 'react';
import { useStore } from '../../context/StoreContext';
import * as XLSX from 'xlsx';
import { jsPDF } from 'jspdf';
import {
  FileSpreadsheet,
  FileText,
  Download,
  CheckCircle2,
  Calendar,
  Layers,
  Users,
  Megaphone,
  MessageSquare,
  Newspaper,
  ShieldCheck,
} from 'lucide-react';

export const AdminReports: React.FC = () => {
  const {
    articles,
    communityStories,
    users,
    advertisements,
    categories,
    config,
    auditLogs,
  } = useStore();

  const [generating, setGenerating] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const notifySuccess = (msg: string) => {
    setSuccessMsg(msg);
    setTimeout(() => setSuccessMsg(null), 4000);
  };

  // 1. Export Complete Multi-Sheet Excel Workbook (.XLSX)
  const handleExportExcelAll = () => {
    setGenerating('xlsx-all');
    try {
      const wb = XLSX.utils.book_new();

      // Sheet 1: Notícias & Matérias
      const articlesData = articles.map((a) => ({
        ID: a.id,
        Título: a.title,
        Subtítulo: a.subtitle || '',
        Categoria: a.category,
        Localidade: a.location,
        Autor: a.authorName,
        Status: a.status,
        Visualizações: a.viewsCount,
        Destaque: a.isFeatured ? 'Sim' : 'Não',
        'Data Criação': new Date(a.createdAt).toLocaleDateString('pt-BR'),
        'Data Publicação': a.publishedAt ? new Date(a.publishedAt).toLocaleDateString('pt-BR') : 'Pendente',
      }));
      const wsArticles = XLSX.utils.json_to_sheet(articlesData);
      XLSX.utils.book_append_sheet(wb, wsArticles, 'Notícias');

      // Sheet 2: Denúncias da Comunidade
      const storiesData = communityStories.map((s) => ({
        Protocolo: s.protocolNumber || s.id,
        Título: s.storyTitle,
        Relato: s.storyText,
        Cidadão: s.isAnonymous ? 'Anônimo' : s.submitterName,
        Contato: s.submitterContact || '',
        Bairro: s.neighborhood || '',
        Localidade: s.location,
        Categoria: s.categorySuggestion,
        Urgência: s.urgency || 'Normal',
        'Tem Mídia': s.mediaType && s.mediaType !== 'none' ? s.mediaType : 'Não',
        Status: s.status,
        'Data Recebimento': new Date(s.createdAt).toLocaleDateString('pt-BR'),
      }));
      const wsStories = XLSX.utils.json_to_sheet(storiesData);
      XLSX.utils.book_append_sheet(wb, wsStories, 'Denúncias Cidadãs');

      // Sheet 3: Usuários & Colaboradores
      const usersData = users.map((u) => ({
        ID: u.id,
        Nome: u.name,
        Email: u.email,
        Função: u.role,
        Status: u.status,
        Município: u.city || '',
        Biografia: u.bio || '',
        'Data Cadastro': new Date(u.createdAt).toLocaleDateString('pt-BR'),
      }));
      const wsUsers = XLSX.utils.json_to_sheet(usersData);
      XLSX.utils.book_append_sheet(wb, wsUsers, 'Usuários');

      // Sheet 4: Publicidade & Banners
      const adsData = advertisements.map((ad) => ({
        ID: ad.id,
        Campanha: ad.title,
        Anunciante: ad.advertiserName,
        Contato: ad.contact,
        Posição: ad.position,
        Status: ad.status,
        Impressões: ad.impressions,
        Cliques: ad.clicks,
        Orçamento: ad.budgetOrValue || '',
        'Link Destino': ad.targetUrl,
      }));
      const wsAds = XLSX.utils.json_to_sheet(adsData);
      XLSX.utils.book_append_sheet(wb, wsAds, 'Publicidade');

      // Save file
      const fileName = `Relatorio_Geral_ComunidadeEmAcao_${new Date().toISOString().slice(0, 10)}.xlsx`;
      XLSX.writeFile(wb, fileName);
      notifySuccess(`Relatório Excel completo gerado: ${fileName}`);
    } catch (err) {
      console.error(err);
      alert('Erro ao gerar planilha Excel.');
    } finally {
      setGenerating(null);
    }
  };

  // 2. Export Excel for Denúncias only
  const handleExportExcelStories = () => {
    setGenerating('xlsx-stories');
    try {
      const wb = XLSX.utils.book_new();
      const storiesData = communityStories.map((s) => ({
        Protocolo: s.protocolNumber || s.id,
        Título: s.storyTitle,
        Relato: s.storyText,
        Cidadão: s.isAnonymous ? 'Anônimo' : s.submitterName,
        Contato: s.submitterContact || '',
        Bairro: s.neighborhood || '',
        Localidade: s.location,
        Categoria: s.categorySuggestion,
        Urgência: s.urgency || 'Normal',
        Status: s.status,
        Data: new Date(s.createdAt).toLocaleDateString('pt-BR'),
      }));
      const ws = XLSX.utils.json_to_sheet(storiesData);
      XLSX.utils.book_append_sheet(wb, ws, 'Denúncias');
      XLSX.writeFile(wb, `Denuncias_Comunidade_${new Date().toISOString().slice(0, 10)}.xlsx`);
      notifySuccess('Planilha de Denúncias exportada com sucesso!');
    } catch (err) {
      console.error(err);
    } finally {
      setGenerating(null);
    }
  };

  // 3. Export PDF Executive Report using jsPDF
  const handleExportPDF = (type: 'executive' | 'stories') => {
    setGenerating(`pdf-${type}`);
    try {
      const doc = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4',
      });

      const today = new Date().toLocaleDateString('pt-BR', {
        day: '2-digit',
        month: 'long',
        year: 'numeric',
      });

      // Header Bar
      doc.setFillColor(15, 61, 89); // #0f3d59
      doc.rect(0, 0, 210, 28, 'F');

      // Header Brand
      doc.setTextColor(255, 255, 255);
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(16);
      doc.text(config.siteName || 'COMUNIDADE EM AÇÃO', 14, 13);

      doc.setFontSize(9);
      doc.setFont('helvetica', 'normal');
      doc.text('PORTAL DE NOTÍCIAS LOCAIS DO AMAZONAS · RELATÓRIO OFICIAL', 14, 20);
      doc.text(`Emissão: ${today}`, 155, 20);

      let y = 38;

      if (type === 'executive') {
        // Document Title
        doc.setTextColor(15, 23, 42);
        doc.setFontSize(14);
        doc.setFont('helvetica', 'bold');
        doc.text('Relatório Executivo Geral de Desempenho Editorial', 14, y);
        y += 8;

        doc.setFontSize(9);
        doc.setFont('helvetica', 'normal');
        doc.setTextColor(100, 116, 139);
        doc.text(`Responsável Editorial: ${config.authorCredit || 'Kássio Cardoso'}`, 14, y);
        y += 10;

        // KPI Summary Box
        doc.setDrawColor(226, 232, 240);
        doc.setFillColor(248, 250, 252);
        doc.roundedRect(14, y, 182, 24, 3, 3, 'FD');

        doc.setFontSize(10);
        doc.setTextColor(15, 23, 42);
        doc.setFont('helvetica', 'bold');

        doc.text(`Notícias Cadastradas: ${articles.length}`, 20, y + 9);
        doc.text(`Denúncias Recebidas: ${communityStories.length}`, 80, y + 9);
        doc.text(`Usuários Ativos: ${users.length}`, 140, y + 9);

        const published = articles.filter((a) => a.status === 'published').length;
        const totalViews = articles.reduce((acc, a) => acc + (a.viewsCount || 0), 0);
        doc.text(`Matérias Publicadas: ${published}`, 20, y + 18);
        doc.text(`Total de Leituras: ${totalViews}`, 80, y + 18);
        doc.text(`Banners Ativos: ${advertisements.filter((ad) => ad.status === 'active').length}`, 140, y + 18);

        y += 34;

        // Section: Notícias Recentes
        doc.setFontSize(12);
        doc.setFont('helvetica', 'bold');
        doc.setTextColor(15, 61, 89);
        doc.text('1. Resumo das Matérias Jornalísticas', 14, y);
        y += 8;

        doc.setFontSize(8);
        doc.setFont('helvetica', 'bold');
        doc.setTextColor(71, 85, 105);
        doc.text('Título da Matéria', 14, y);
        doc.text('Categoria', 110, y);
        doc.text('Status', 145, y);
        doc.text('Leituras', 175, y);
        y += 3;
        doc.setDrawColor(203, 213, 225);
        doc.line(14, y, 196, y);
        y += 5;

        doc.setFont('helvetica', 'normal');
        doc.setTextColor(15, 23, 42);

        const displayArticles = articles.slice(0, 10);
        if (displayArticles.length === 0) {
          doc.text('(Nenhuma matéria cadastrada até o momento)', 14, y);
          y += 8;
        } else {
          displayArticles.forEach((art) => {
            const shortTitle = art.title.length > 55 ? art.title.substring(0, 52) + '...' : art.title;
            doc.text(shortTitle, 14, y);
            doc.text(art.category || 'Geral', 110, y);
            doc.text(art.status === 'published' ? 'Publicada' : art.status, 145, y);
            doc.text(String(art.viewsCount || 0), 175, y);
            y += 6;
          });
        }

        y += 8;

        // Section: Denúncias Cidadãs
        doc.setFontSize(12);
        doc.setFont('helvetica', 'bold');
        doc.setTextColor(15, 61, 89);
        doc.text('2. Relatos e Denúncias da População', 14, y);
        y += 8;

        doc.setFontSize(8);
        doc.setFont('helvetica', 'bold');
        doc.setTextColor(71, 85, 105);
        doc.text('Protocolo', 14, y);
        doc.text('Assunto / Título', 45, y);
        doc.text('Localidade', 130, y);
        doc.text('Status', 170, y);
        y += 3;
        doc.line(14, y, 196, y);
        y += 5;

        doc.setFont('helvetica', 'normal');
        doc.setTextColor(15, 23, 42);

        const displayStories = communityStories.slice(0, 8);
        if (displayStories.length === 0) {
          doc.text('(Nenhuma denúncia registrada na plataforma)', 14, y);
          y += 8;
        } else {
          displayStories.forEach((st) => {
            doc.text(st.protocolNumber || st.id.slice(0, 8), 14, y);
            const shortTitle = st.storyTitle.length > 45 ? st.storyTitle.substring(0, 42) + '...' : st.storyTitle;
            doc.text(shortTitle, 45, y);
            doc.text(st.neighborhood ? `${st.neighborhood}` : st.location, 130, y);
            doc.text(st.status, 170, y);
            y += 6;
          });
        }
      } else {
        // Relatório detalhado de denúncias
        doc.setTextColor(15, 23, 42);
        doc.setFontSize(14);
        doc.setFont('helvetica', 'bold');
        doc.text('Relatório Completo de Denúncias e Demandas Comunitárias', 14, y);
        y += 8;

        doc.setFontSize(9);
        doc.setFont('helvetica', 'normal');
        doc.setTextColor(100, 116, 139);
        doc.text(`Total de Demandas Registradas: ${communityStories.length}`, 14, y);
        y += 12;

        if (communityStories.length === 0) {
          doc.setFontSize(10);
          doc.text('Nenhuma denúncia cadastrada no banco de dados.', 14, y);
        } else {
          communityStories.slice(0, 12).forEach((st, idx) => {
            if (y > 260) {
              doc.addPage();
              y = 20;
            }

            doc.setDrawColor(226, 232, 240);
            doc.setFillColor(248, 250, 252);
            doc.roundedRect(14, y, 182, 20, 2, 2, 'FD');

            doc.setFontSize(9);
            doc.setFont('helvetica', 'bold');
            doc.setTextColor(15, 61, 89);
            doc.text(`[${st.protocolNumber || 'DEN'}] ${st.storyTitle}`, 18, y + 6);

            doc.setFontSize(8);
            doc.setFont('helvetica', 'normal');
            doc.setTextColor(71, 85, 105);
            doc.text(
              `Bairro/Local: ${st.neighborhood || st.location} · Cidadão: ${st.isAnonymous ? 'Anônimo' : st.submitterName} · Urgência: ${st.urgency || 'Normal'}`,
              18,
              y + 11
            );
            doc.text(`Status: ${st.status} · Contato: ${st.submitterContact || 'Não informado'}`, 18, y + 16);

            y += 24;
          });
        }
      }

      // Footer Note
      doc.setFontSize(8);
      doc.setTextColor(148, 163, 184);
      doc.text(
        'Documento gerado automaticamente pelo Painel Administrativo do COMUNIDADE EM AÇÃO.',
        14,
        287
      );

      doc.save(`Relatorio_${type}_ComunidadeEmAcao_${new Date().toISOString().slice(0, 10)}.pdf`);
      notifySuccess(`Relatório PDF (${type}) emitido e baixado com sucesso!`);
    } catch (err) {
      console.error(err);
      alert('Erro ao gerar documento PDF.');
    } finally {
      setGenerating(null);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between pb-3 border-b border-slate-200">
        <div>
          <h3 className="font-editorial text-2xl font-bold text-slate-900 flex items-center gap-2">
            <FileSpreadsheet className="w-6 h-6 text-emerald-800" />
            <span>Relatórios Institucionais (.XLSX e PDF)</span>
          </h3>
          <p className="text-xs text-slate-500 font-sans">
            Exporte planilhas completas em formato Excel real (.xlsx) e documentos em PDF estilizados para prestação de contas e arquivo da redação.
          </p>
        </div>
      </div>

      {successMsg && (
        <div className="p-4 bg-emerald-50 border border-emerald-300 rounded-xl text-xs text-emerald-800 flex items-center gap-2 animate-in fade-in">
          <CheckCircle2 className="w-5 h-5 text-emerald-700 shrink-0" />
          <span className="font-semibold">{successMsg}</span>
        </div>
      )}

      {/* Grid of Report Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Card 1: Excel Completo (.XLSX) */}
        <div className="bg-white border-2 border-emerald-200 rounded-2xl p-6 shadow-xs hover:border-emerald-400 transition-all flex flex-col justify-between">
          <div>
            <div className="w-12 h-12 bg-emerald-100 text-emerald-800 rounded-xl flex items-center justify-center mb-4">
              <FileSpreadsheet className="w-7 h-7" />
            </div>
            <h4 className="font-editorial text-lg font-bold text-slate-900">
              Planilha Geral Consolidada (.XLSX)
            </h4>
            <p className="text-xs text-slate-600 mt-2 leading-relaxed">
              Arquivo em formato Microsoft Excel (.xlsx) contendo 4 abas independentes:
            </p>
            <ul className="text-xs text-slate-600 mt-2 space-y-1 list-disc list-inside">
              <li><strong>Notícias:</strong> títulos, editorias, status e visualizações</li>
              <li><strong>Denúncias Cidadãs:</strong> protocolos, bairros, relatos e status</li>
              <li><strong>Usuários:</strong> repórteres, cargos e dados de cadastro</li>
              <li><strong>Publicidade:</strong> campanhas, anunciantes, cliques e orçamentos</li>
            </ul>
          </div>

          <div className="mt-6 pt-4 border-t border-slate-100">
            <button
              onClick={handleExportExcelAll}
              disabled={generating !== null}
              className="w-full py-3 bg-emerald-800 hover:bg-emerald-900 text-white font-bold text-xs rounded-xl transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-xs disabled:opacity-50"
            >
              <Download className="w-4 h-4" />
              <span>{generating === 'xlsx-all' ? 'Processando Excel...' : 'Exportar Planilha Completa (.XLSX)'}</span>
            </button>
          </div>
        </div>

        {/* Card 2: Relatório PDF Executivo */}
        <div className="bg-white border-2 border-blue-200 rounded-2xl p-6 shadow-xs hover:border-blue-400 transition-all flex flex-col justify-between">
          <div>
            <div className="w-12 h-12 bg-blue-100 text-[#0f3d59] rounded-xl flex items-center justify-center mb-4">
              <FileText className="w-7 h-7" />
            </div>
            <h4 className="font-editorial text-lg font-bold text-slate-900">
              Relatório Executivo Oficial (.PDF)
            </h4>
            <p className="text-xs text-slate-600 mt-2 leading-relaxed">
              Documento formal em PDF de alta qualidade, pronto para impressão ou envio por e-mail:
            </p>
            <ul className="text-xs text-slate-600 mt-2 space-y-1 list-disc list-inside">
              <li>Cabeçalho institucional com marca COMUNIDADE EM AÇÃO</li>
              <li>Indicadores-chave (KPIs de audiência, denúncias e matérias)</li>
              <li>Tabelas de acompanhamento editorial e demandas públicas</li>
              <li>Assinatura de responsabilidade editorial de Kássio Cardoso</li>
            </ul>
          </div>

          <div className="mt-6 pt-4 border-t border-slate-100">
            <button
              onClick={() => handleExportPDF('executive')}
              disabled={generating !== null}
              className="w-full py-3 bg-[#0f3d59] hover:bg-[#0a2540] text-white font-bold text-xs rounded-xl transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-xs disabled:opacity-50"
            >
              <Download className="w-4 h-4" />
              <span>{generating === 'pdf-executive' ? 'Gerando Documento...' : 'Baixar Relatório Executivo (.PDF)'}</span>
            </button>
          </div>
        </div>

        {/* Card 3: Planilha de Denúncias Específica */}
        <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 text-slate-800 font-bold text-sm mb-1">
              <MessageSquare className="w-4 h-4 text-amber-600" />
              <span>Planilha Exclusiva de Denúncias (.XLSX)</span>
            </div>
            <p className="text-xs text-slate-500">
              Ideal para a equipe de apuração e checagem em campo, com contatos e bairros dos relatos.
            </p>
          </div>
          <button
            onClick={handleExportExcelStories}
            disabled={generating !== null}
            className="mt-4 py-2 px-4 bg-white border border-slate-300 hover:bg-slate-100 text-slate-800 font-semibold text-xs rounded-lg transition-colors flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
          >
            <Download className="w-3.5 h-3.5 text-slate-600" />
            <span>Baixar Denúncias em Excel</span>
          </button>
        </div>

        {/* Card 4: Livro de Denúncias em PDF */}
        <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 text-slate-800 font-bold text-sm mb-1">
              <ShieldCheck className="w-4 h-4 text-emerald-700" />
              <span>Livro de Demandas da Comunidade (.PDF)</span>
            </div>
            <p className="text-xs text-slate-500">
              Dossiê diagramado em fichas com cada relato recebido pela população para arquivamento ou protocolo público.
            </p>
          </div>
          <button
            onClick={() => handleExportPDF('stories')}
            disabled={generating !== null}
            className="mt-4 py-2 px-4 bg-white border border-slate-300 hover:bg-slate-100 text-slate-800 font-semibold text-xs rounded-lg transition-colors flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
          >
            <Download className="w-3.5 h-3.5 text-slate-600" />
            <span>Baixar Dossiê em PDF</span>
          </button>
        </div>
      </div>
    </div>
  );
};
