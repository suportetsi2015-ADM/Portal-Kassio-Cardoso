import React, { useState } from 'react';
import { useStore } from '../../context/StoreContext';
import {
  ShieldAlert,
  KeyRound,
  CheckCircle2,
  AlertCircle,
  FileCheck2,
  Trash2,
  Search,
  Lock,
} from 'lucide-react';

export const AdminSecurity: React.FC = () => {
  const {
    config,
    updateAdminPassword,
    auditLogs,
    clearAuditLogs,
  } = useStore();

  const [currentMasterPass, setCurrentMasterPass] = useState('');
  const [newMasterPass, setNewMasterPass] = useState('');
  const [confirmMasterPass, setConfirmMasterPass] = useState('');
  const [passwordMsg, setPasswordMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const [logSearch, setLogSearch] = useState('');

  const handleUpdatePassword = (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordMsg(null);

    if (currentMasterPass !== config.adminPasswordMaster) {
      setPasswordMsg({ type: 'error', text: 'Senha atual do Administrador incorreta.' });
      return;
    }

    if (newMasterPass.length < 4) {
      setPasswordMsg({ type: 'error', text: 'A nova senha deve possuir no mínimo 4 caracteres.' });
      return;
    }

    if (newMasterPass !== confirmMasterPass) {
      setPasswordMsg({ type: 'error', text: 'A confirmação de senha não confere.' });
      return;
    }

    const res = updateAdminPassword(newMasterPass);
    if (res.success) {
      setPasswordMsg({ type: 'success', text: 'Senha Master do Administrador alterada com sucesso!' });
      setCurrentMasterPass('');
      setNewMasterPass('');
      setConfirmMasterPass('');
    } else {
      setPasswordMsg({ type: 'error', text: res.message || 'Erro ao atualizar senha.' });
    }
  };

  const filteredLogs = auditLogs.filter(
    (log) =>
      log.action.toLowerCase().includes(logSearch.toLowerCase()) ||
      log.details.toLowerCase().includes(logSearch.toLowerCase()) ||
      log.userName.toLowerCase().includes(logSearch.toLowerCase()) ||
      log.targetEntity.toLowerCase().includes(logSearch.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between pb-3 border-b border-slate-200">
        <div>
          <h3 className="font-editorial text-2xl font-bold text-slate-900 flex items-center gap-2">
            <ShieldAlert className="w-6 h-6 text-[#0f3d59]" />
            <span>Segurança, Senha Master & Auditoria</span>
          </h3>
          <p className="text-xs text-slate-500 font-sans">
            Gerencie a senha mestra exclusiva do Administrador e acompanhe o registro detalhado de todas as ações executadas no portal.
          </p>
        </div>
      </div>

      {/* Section 1: Change Admin Master Password */}
      <div className="bg-white p-5 border border-slate-200 rounded-xl space-y-4 shadow-2xs">
        <div className="flex items-center gap-2">
          <div className="p-2 bg-blue-100 text-[#0f3d59] rounded-lg">
            <KeyRound className="w-5 h-5" />
          </div>
          <div>
            <h4 className="font-editorial text-base font-bold text-slate-900">
              Alterar Senha do Administrador
            </h4>
            <span className="text-xs text-slate-500">
              Esta senha é exclusiva do painel restrito do Administrador (distinta de contas de usuários comuns).
            </span>
          </div>
        </div>

        {passwordMsg && (
          <div
            className={`p-3 rounded-xl text-xs flex items-center gap-2 animate-in fade-in ${
              passwordMsg.type === 'success'
                ? 'bg-emerald-50 border border-emerald-300 text-emerald-800'
                : 'bg-red-50 border border-red-300 text-red-800'
            }`}
          >
            {passwordMsg.type === 'success' ? (
              <CheckCircle2 className="w-4 h-4 shrink-0" />
            ) : (
              <AlertCircle className="w-4 h-4 shrink-0" />
            )}
            <span>{passwordMsg.text}</span>
          </div>
        )}

        <form onSubmit={handleUpdatePassword} className="space-y-3 max-w-lg">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Senha Atual do Administrador *
            </label>
            <input
              type="password"
              required
              value={currentMasterPass}
              onChange={(e) => setCurrentMasterPass(e.target.value)}
              placeholder="Digite sua senha atual"
              className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#0f3d59] focus:bg-white"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Nova Senha do Administrador *
              </label>
              <input
                type="password"
                required
                value={newMasterPass}
                onChange={(e) => setNewMasterPass(e.target.value)}
                placeholder="Mínimo 4 caracteres"
                className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#0f3d59] focus:bg-white"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Confirmar Nova Senha *
              </label>
              <input
                type="password"
                required
                value={confirmMasterPass}
                onChange={(e) => setConfirmMasterPass(e.target.value)}
                placeholder="Repita a nova senha"
                className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#0f3d59] focus:bg-white"
              />
            </div>
          </div>

          <button
            type="submit"
            className="px-5 py-2.5 bg-[#0f3d59] hover:bg-[#0a2540] text-white text-xs font-bold rounded-lg transition-colors cursor-pointer shadow-xs"
          >
            Salvar Nova Senha do Administrador
          </button>
        </form>
      </div>

      {/* Section 2: Audit Logs */}
      <div className="bg-white p-5 border border-slate-200 rounded-xl space-y-4 shadow-2xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <FileCheck2 className="w-5 h-5 text-emerald-800" />
            <h4 className="font-editorial text-base font-bold text-slate-900">
              Registro de Auditoria & Segurança ({auditLogs.length} eventos)
            </h4>
          </div>

          <button
            onClick={() => {
              if (confirm('Deseja limpar todos os registros de auditoria?')) {
                clearAuditLogs();
              }
            }}
            className="text-xs text-red-600 hover:text-red-800 hover:underline flex items-center gap-1 cursor-pointer self-start sm:self-auto"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Limpar Histórico de Auditoria</span>
          </button>
        </div>

        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Filtrar por ação, operador ou entidade..."
            value={logSearch}
            onChange={(e) => setLogSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#0f3d59]"
          />
        </div>

        <div className="max-h-72 overflow-y-auto space-y-2 border border-slate-100 rounded-lg p-2">
          {filteredLogs.map((log) => (
            <div
              key={log.id}
              className="p-2.5 bg-slate-50 rounded-lg border border-slate-200 text-xs flex flex-col sm:flex-row sm:items-center justify-between gap-2 hover:bg-slate-100 transition-colors"
            >
              <div className="space-y-0.5">
                <div className="flex items-center gap-2">
                  <span className="font-mono font-bold text-[10px] bg-blue-100 text-blue-900 px-1.5 py-0.5 rounded">
                    {log.action}
                  </span>
                  <span className="text-slate-500 font-medium text-[11px]">
                    [{log.targetEntity}]
                  </span>
                  <span className="text-slate-800 font-semibold text-[11px]">
                    Operador: {log.userName}
                  </span>
                </div>
                <p className="text-slate-600 text-[11px] font-sans">{log.details}</p>
              </div>

              <span className="text-[10px] text-slate-400 font-mono shrink-0">
                {new Date(log.timestamp).toLocaleString('pt-BR')}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
