import React, { useState } from 'react';
import { useStore } from '../../context/StoreContext';
import { FAQItem } from '../../types';
import {
  HelpCircle,
  PlusCircle,
  Edit,
  Trash2,
  CheckCircle2,
  X,
  Search,
  MessageSquare,
} from 'lucide-react';

export const AdminFAQ: React.FC = () => {
  const { faqs, addFAQ, updateFAQ, deleteFAQ } = useStore();

  const [searchTerm, setSearchTerm] = useState('');
  const [isAdding, setIsAdding] = useState(false);
  const [editingFaq, setEditingFaq] = useState<FAQItem | null>(null);

  // New FAQ form
  const [newQuestion, setNewQuestion] = useState('');
  const [newAnswer, setNewAnswer] = useState('');

  const [feedbackMsg, setFeedbackMsg] = useState<string | null>(null);

  const notify = (msg: string) => {
    setFeedbackMsg(msg);
    setTimeout(() => setFeedbackMsg(null), 3000);
  };

  const filteredFaqs = faqs.filter(
    (f) =>
      f.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
      f.answer.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newQuestion.trim() || !newAnswer.trim()) return;

    addFAQ({
      question: newQuestion.trim(),
      answer: newAnswer.trim(),
      order: faqs.length + 1,
      isActive: true,
    });

    notify('Pergunta frequente adicionada com sucesso!');
    setIsAdding(false);
    setNewQuestion('');
    setNewAnswer('');
  };

  const handleSaveEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingFaq) return;

    updateFAQ(editingFaq.id, {
      question: editingFaq.question,
      answer: editingFaq.answer,
      isActive: editingFaq.isActive,
    });

    notify('Pergunta frequente atualizada com sucesso!');
    setEditingFaq(null);
  };

  const handleDelete = (id: string, q: string) => {
    if (confirm(`Deseja excluir a pergunta "${q}"?`)) {
      deleteFAQ(id);
      notify('Pergunta excluída.');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-3 border-b border-slate-200">
        <div>
          <h3 className="font-editorial text-2xl font-bold text-slate-900 flex items-center gap-2">
            <HelpCircle className="w-6 h-6 text-[#0f3d59]" />
            <span>Gestão de FAQ (Perguntas Frequentes)</span>
          </h3>
          <p className="text-xs text-slate-500 font-sans">
            Insira, altere e organize as dúvidas frequentes da comunidade sobre apuração jornalística, sigilo de denúncias e anúncios.
          </p>
        </div>

        <button
          onClick={() => setIsAdding(true)}
          className="px-4 py-2 bg-[#0f3d59] hover:bg-[#0a2540] text-white text-xs font-bold rounded-lg transition-colors flex items-center gap-2 cursor-pointer shadow-xs self-start sm:self-auto"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Inserir Nova Dúvida (FAQ)</span>
        </button>
      </div>

      {feedbackMsg && (
        <div className="p-3 bg-emerald-50 border border-emerald-300 rounded-xl text-xs text-emerald-800 font-semibold flex items-center gap-2 animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0" />
          <span>{feedbackMsg}</span>
        </div>
      )}

      {/* Search */}
      <div className="relative">
        <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          placeholder="Buscar nas perguntas ou respostas..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-9 pr-4 py-2 text-xs bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#0f3d59]"
        />
      </div>

      {/* FAQ List */}
      <div className="space-y-3">
        {filteredFaqs.length > 0 ? (
          filteredFaqs.map((faq, idx) => (
            <div
              key={faq.id}
              className="bg-white border border-slate-200 rounded-xl p-4 shadow-2xs hover:border-slate-300 transition-all flex flex-col sm:flex-row sm:items-start justify-between gap-4"
            >
              <div className="space-y-1.5 flex-1">
                <div className="flex items-center gap-2">
                  <span className="w-5 h-5 rounded-full bg-slate-100 text-slate-700 text-[11px] font-bold flex items-center justify-center shrink-0">
                    {idx + 1}
                  </span>
                  <h4 className="font-semibold text-sm text-slate-900">{faq.question}</h4>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed pl-7">{faq.answer}</p>
              </div>

              <div className="flex items-center gap-2 shrink-0 self-end sm:self-start">
                <button
                  onClick={() => updateFAQ(faq.id, { isActive: !faq.isActive })}
                  className={`px-2 py-1 text-[10px] font-bold rounded cursor-pointer ${
                    faq.isActive ? 'bg-emerald-50 text-emerald-700' : 'bg-slate-100 text-slate-500'
                  }`}
                >
                  {faq.isActive ? 'Ativo' : 'Oculto'}
                </button>
                <button
                  onClick={() => setEditingFaq(faq)}
                  title="Editar Pergunta"
                  className="p-1.5 text-slate-500 hover:text-[#0f3d59] hover:bg-slate-100 rounded transition-colors cursor-pointer"
                >
                  <Edit className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleDelete(faq.id, faq.question)}
                  title="Excluir Pergunta"
                  className="p-1.5 text-slate-500 hover:text-red-700 hover:bg-red-50 rounded transition-colors cursor-pointer"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))
        ) : (
          <div className="p-8 text-center bg-white rounded-xl border border-dashed border-slate-300 text-slate-500 text-xs">
            Nenhuma pergunta encontrada.
          </div>
        )}
      </div>

      {/* Modal: Inserir FAQ */}
      {isAdding && (
        <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-2xs animate-in fade-in">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 border border-slate-200 shadow-2xl relative">
            <button
              onClick={() => setIsAdding(false)}
              className="absolute top-4 right-4 p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100"
            >
              <X className="w-5 h-5" />
            </button>

            <h4 className="font-editorial text-xl font-bold text-slate-900 mb-1 flex items-center gap-2">
              <PlusCircle className="w-5 h-5 text-[#0f3d59]" />
              <span>Inserir Nova Dúvida Frequente</span>
            </h4>
            <p className="text-xs text-slate-500 mb-4">
              Adicione uma nova pergunta e resposta para a seção de FAQ da página pública.
            </p>

            <form onSubmit={handleCreate} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Pergunta da Comunidade *
                </label>
                <input
                  type="text"
                  required
                  value={newQuestion}
                  onChange={(e) => setNewQuestion(e.target.value)}
                  placeholder="Ex: Como posso enviar fotos de denúncias pelo WhatsApp?"
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#0f3d59] focus:bg-white"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Resposta Oficial da Redação *
                </label>
                <textarea
                  rows={4}
                  required
                  value={newAnswer}
                  onChange={(e) => setNewAnswer(e.target.value)}
                  placeholder="Ex: Basta clicar no balão do WhatsApp no canto inferior da tela e enviar seus arquivos..."
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#0f3d59] focus:bg-white"
                />
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
                  Salvar Pergunta
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Editar FAQ */}
      {editingFaq && (
        <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-2xs animate-in fade-in">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 border border-slate-200 shadow-2xl relative">
            <button
              onClick={() => setEditingFaq(null)}
              className="absolute top-4 right-4 p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100"
            >
              <X className="w-5 h-5" />
            </button>

            <h4 className="font-editorial text-xl font-bold text-slate-900 mb-1 flex items-center gap-2">
              <Edit className="w-5 h-5 text-[#0f3d59]" />
              <span>Editar Dúvida Frequente</span>
            </h4>

            <form onSubmit={handleSaveEdit} className="space-y-3 mt-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Pergunta
                </label>
                <input
                  type="text"
                  required
                  value={editingFaq.question}
                  onChange={(e) => setEditingFaq({ ...editingFaq, question: e.target.value })}
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#0f3d59]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Resposta
                </label>
                <textarea
                  rows={4}
                  required
                  value={editingFaq.answer}
                  onChange={(e) => setEditingFaq({ ...editingFaq, answer: e.target.value })}
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#0f3d59]"
                />
              </div>

              <div className="flex items-center gap-2 pt-1">
                <label className="flex items-center gap-2 text-xs font-medium cursor-pointer">
                  <input
                    type="checkbox"
                    checked={editingFaq.isActive}
                    onChange={(e) => setEditingFaq({ ...editingFaq, isActive: e.target.checked })}
                    className="rounded text-[#0f3d59]"
                  />
                  <span>Pergunta visível na página pública</span>
                </label>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setEditingFaq(null)}
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
