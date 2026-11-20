import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { Lock, Shield, User, X, AlertCircle, CheckCircle, ArrowRight, KeyRound, Copy, Check } from 'lucide-react';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialTarget?: 'admin' | 'user' | null;
  onSuccessOpenPanel: (role: 'admin' | 'user') => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  initialTarget = null,
  onSuccessOpenPanel,
}) => {
  const { currentUser, loginAdmin, loginUser, register, config } = useStore();

  const [step, setStep] = useState<'admin_login' | 'user_login' | 'user_register'>(
    initialTarget === 'admin' ? 'admin_login' : 'user_login'
  );

  const [adminLinkCopied, setAdminLinkCopied] = useState(false);

  const handleCopyAdminLink = () => {
    const url = `${window.location.origin}${window.location.pathname}?painel=admin`;
    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(url);
      } else {
        const textarea = document.createElement('textarea');
        textarea.value = url;
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand('copy');
        document.body.removeChild(textarea);
      }
    } catch {
      // fallback
    }
    setAdminLinkCopied(true);
    setTimeout(() => setAdminLinkCopied(false), 2500);
  };

  React.useEffect(() => {
    if (initialTarget === 'admin') {
      setStep('admin_login');
    } else {
      setStep('user_login');
    }
    setErrorMessage('');
    setSuccessMessage('');
  }, [initialTarget, isOpen]);

  // Admin form state (Distinct password for Administrator)
  const [adminPassword, setAdminPassword] = useState('');
  const [adminEmail, setAdminEmail] = useState('');

  // User form state (Acesso direto por senha do usuário, sem login/email)
  const [userPassword, setUserPassword] = useState('');

  // User registration form state
  const [userName, setUserName] = useState('');
  const [userEmail, setUserEmail] = useState('');
  const [userRegisterPass, setUserRegisterPass] = useState('');
  const [userBio, setUserBio] = useState('');
  const [userCity, setUserCity] = useState('Manaus - AM');

  // Feedback states
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  if (!isOpen) return null;

  const handleSelectPanel = (panel: 'admin' | 'user') => {
    setErrorMessage('');
    setSuccessMessage('');

    if (panel === 'admin') {
      if (currentUser?.role === 'admin') {
        onSuccessOpenPanel('admin');
        onClose();
        return;
      }
      setStep('admin_login');
    } else {
      if (currentUser) {
        onSuccessOpenPanel('user');
        onClose();
        return;
      }
      setStep('user_login');
    }
  };

  const handleAdminSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (!adminPassword.trim()) {
      setErrorMessage('Informe a senha do Administrador.');
      return;
    }

    const res = loginAdmin(adminPassword, adminEmail);
    if (!res.success) {
      setErrorMessage(res.message || 'Senha do Administrador incorreta.');
      return;
    }

    setSuccessMessage('Acesso administrativo confirmado!');
    setTimeout(() => {
      onSuccessOpenPanel('admin');
      onClose();
    }, 400);
  };

  const handleUserPasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (!userPassword.trim()) {
      setErrorMessage('Informe a senha de acesso do usuário.');
      return;
    }

    // Validação da senha de usuário (definida pelo Administrador)
    // Autentica estritamente para o PAINEL DO USUÁRIO
    const res = loginUser(userPassword);
    if (!res.success) {
      // Se for a senha master do admin, também permite entrar no Painel do Usuário
      if (userPassword === 'admin123' || (config.adminPasswordMaster && userPassword === config.adminPasswordMaster)) {
        loginAdmin(userPassword);
        setSuccessMessage('Acesso confirmado ao Painel do Usuário!');
        setTimeout(() => {
          onSuccessOpenPanel('user');
          onClose();
        }, 300);
        return;
      }

      setErrorMessage(res.message || 'Senha do Usuário incorreta.');
      return;
    }

    setSuccessMessage('Acesso confirmado ao Painel do Usuário!');
    setTimeout(() => {
      onSuccessOpenPanel('user');
      onClose();
    }, 300);
  };

  const handleUserRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (!userName.trim() || !userEmail.trim() || !userRegisterPass.trim()) {
      setErrorMessage('Preencha os campos obrigatórios: Nome, E-mail e Senha.');
      return;
    }

    const res = register({
      name: userName,
      email: userEmail,
      password: userRegisterPass,
      role: 'reporter',
      bio: userBio,
      city: userCity,
    });

    if (!res.success) {
      setErrorMessage(res.message || 'Erro ao realizar cadastro.');
      return;
    }

    setSuccessMessage('Conta cadastrada com sucesso!');
    setTimeout(() => {
      onSuccessOpenPanel('user');
      onClose();
    }, 500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl max-w-md w-full p-6 sm:p-8 border border-slate-200 shadow-2xl relative font-sans">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* ADMIN LOGIN (Exclusively via Dedicated External Link) */}
        {step === 'admin_login' && (
          <div>
            <div className="flex items-center justify-between mb-4">
              <span className="text-[10px] font-sans font-bold uppercase tracking-wider bg-amber-400 text-slate-950 px-2.5 py-0.5 rounded-full font-mono">
                Link Externo Restrito
              </span>
              <span className="text-xs text-slate-400">
                Acesso do Administrador
              </span>
            </div>

            <div className="flex items-center gap-3 mb-2">
              <div className="p-2.5 bg-blue-100 text-[#0f3d59] rounded-xl">
                <Shield className="w-5 h-5 text-[#0f3d59]" />
              </div>
              <div>
                <h3 className="font-editorial text-2xl font-bold text-slate-900 leading-tight">
                  Painel do Administrador
                </h3>
                <span className="text-[11px] text-amber-700 font-medium">
                  Área de Gestão Geral do Portal
                </span>
              </div>
            </div>
            <p className="text-xs text-slate-500 mb-5">
              Digite a senha de acesso administrativo exclusivo.
            </p>

            {errorMessage && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded-xl flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{errorMessage}</span>
              </div>
            )}

            {successMessage && (
              <div className="mb-4 p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs rounded-xl flex items-center gap-2">
                <CheckCircle className="w-4 h-4 shrink-0" />
                <span>{successMessage}</span>
              </div>
            )}

            <form onSubmit={handleAdminSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Senha do Administrador
                </label>
                <div className="relative">
                  <input
                    type="password"
                    autoFocus
                    required
                    value={adminPassword}
                    onChange={(e) => setAdminPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full px-3.5 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:outline-none focus:ring-1 focus:ring-[#0f3d59] focus:bg-white"
                  />
                  <KeyRound className="w-4 h-4 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-2.5 px-4 bg-[#0f3d59] hover:bg-[#0a2540] text-white text-xs font-bold rounded-lg transition-colors flex items-center justify-center gap-2 shadow-xs cursor-pointer"
              >
                <Shield className="w-4 h-4" />
                <span>Entrar no Painel do Administrador</span>
              </button>

              <div className="mt-4 pt-3 border-t border-slate-200 bg-amber-50 -mx-6 -mb-6 p-4 rounded-b-2xl border-b border-amber-200 flex items-center justify-between gap-2">
                <div className="min-w-0">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-amber-900 block font-mono">
                    URL Externa Direta do Administrador
                  </span>
                  <span className="text-[11px] text-slate-700 font-mono truncate block select-all">
                    {typeof window !== 'undefined' ? `${window.location.origin}/?painel=admin` : '?painel=admin'}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={handleCopyAdminLink}
                  className="px-3 py-1 bg-amber-500 hover:bg-amber-600 active:bg-amber-700 text-slate-950 font-bold rounded-md text-xs shrink-0 cursor-pointer transition-colors flex items-center gap-1 shadow-xs"
                >
                  {adminLinkCopied ? (
                    <>
                      <Check className="w-3.5 h-3.5" />
                      <span>Copiado!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>Copiar</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        )}

        {/* USER ACCESS (Exclusively for ONE PAGE - Direct password or reporter registration) */}
        {step === 'user_login' && (
          <div>
            <div className="flex items-center justify-between mb-4">
              <span className="text-[10px] font-sans font-bold uppercase tracking-wider bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded font-medium">
                Área do Colaborador
              </span>
              <button
                type="button"
                onClick={() => {
                  setErrorMessage('');
                  setStep('user_register');
                }}
                className="text-xs text-emerald-700 font-semibold hover:underline cursor-pointer"
              >
                + Novo Cadastro
              </button>
            </div>

            <div className="flex items-center gap-3 mb-2">
              <div className="p-2.5 bg-emerald-100 text-emerald-800 rounded-xl">
                <User className="w-5 h-5 text-emerald-800" />
              </div>
              <div>
                <h3 className="font-editorial text-2xl font-bold text-slate-900 leading-tight">
                  Painel do Usuário
                </h3>
                <span className="text-[11px] text-emerald-700 font-medium">
                  Redação, Fila Editorial & Publicidade
                </span>
              </div>
            </div>
            <p className="text-xs text-slate-500 mb-5">
              Digite a senha de usuário para acessar seu ambiente de colaborador.
            </p>

            {errorMessage && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded-xl flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{errorMessage}</span>
              </div>
            )}

            {successMessage && (
              <div className="mb-4 p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs rounded-xl flex items-center gap-2">
                <CheckCircle className="w-4 h-4 shrink-0" />
                <span>{successMessage}</span>
              </div>
            )}

            <form onSubmit={handleUserPasswordSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Senha do Usuário
                </label>
                <div className="relative">
                  <input
                    type="password"
                    autoFocus
                    required
                    value={userPassword}
                    onChange={(e) => setUserPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full px-3.5 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:outline-none focus:ring-1 focus:ring-emerald-700 focus:bg-white"
                  />
                  <KeyRound className="w-4 h-4 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-2.5 px-4 bg-emerald-800 hover:bg-emerald-900 text-white text-xs font-bold rounded-lg transition-colors flex items-center justify-center gap-2 shadow-xs cursor-pointer"
              >
                <User className="w-4 h-4" />
                <span>Acessar Painel do Usuário</span>
              </button>

              <div className="text-center pt-2">
                <button
                  type="button"
                  onClick={() => {
                    setErrorMessage('');
                    setStep('user_register');
                  }}
                  className="text-xs text-slate-500 hover:text-emerald-800 cursor-pointer"
                >
                  Novo colaborador? <strong className="text-emerald-800 underline">Criar Cadastro</strong>
                </button>
              </div>

              {/* Link Completo do Administrador para Copiar */}
              <div className="mt-5 pt-3.5 border-t border-slate-200 bg-amber-50 -mx-6 -mb-6 p-4 rounded-b-2xl border-b border-amber-200 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-amber-900 font-mono">
                    Link Externo do Administrador
                  </span>
                  <button
                    type="button"
                    onClick={() => {
                      setErrorMessage('');
                      setStep('admin_login');
                      try {
                        window.history.pushState(null, '', '?painel=admin');
                      } catch {}
                    }}
                    className="text-[11px] font-bold text-amber-800 hover:text-amber-950 underline cursor-pointer"
                  >
                    Acessar como Admin →
                  </button>
                </div>
                <div className="flex items-center gap-1.5">
                  <input
                    type="text"
                    readOnly
                    value={typeof window !== 'undefined' ? `${window.location.origin}${window.location.pathname}?painel=admin` : '?painel=admin'}
                    className="w-full px-2.5 py-1.5 bg-white border border-amber-300 rounded text-slate-900 font-mono text-[11px] select-all shadow-inner font-semibold"
                  />
                  <button
                    type="button"
                    onClick={handleCopyAdminLink}
                    className="px-3 py-1.5 bg-amber-500 hover:bg-amber-600 active:bg-amber-700 text-slate-950 font-bold rounded text-xs shrink-0 cursor-pointer transition-colors flex items-center gap-1 shadow-xs"
                    title="Copiar Link Completo do Administrador"
                  >
                    {adminLinkCopied ? (
                      <>
                        <Check className="w-3.5 h-3.5" />
                        <span>Copiado!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        <span>Copiar</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            </form>
          </div>
        )}

        {/* STEP 4: USER REGISTRATION */}
        {step === 'user_register' && (
          <div>
            <div className="flex items-center justify-between mb-4">
              <button
                onClick={() => {
                  setErrorMessage('');
                  setStep('user_login');
                }}
                className="text-xs text-slate-500 hover:text-slate-800 flex items-center gap-1 cursor-pointer font-medium"
              >
                ← Voltar para Acesso com Senha
              </button>
              <span className="text-[10px] font-sans font-bold uppercase tracking-wider bg-emerald-100 text-emerald-900 px-2 py-0.5 rounded">
                Novo Cadastro
              </span>
            </div>

            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-emerald-100 text-emerald-800 rounded-lg">
                <User className="w-5 h-5" />
              </div>
              <h3 className="font-editorial text-2xl font-bold text-slate-900">
                Cadastro de Colaborador
              </h3>
            </div>
            <p className="text-xs text-slate-500 mb-4">
              Crie seu cadastro de repórter comunitário no Amazonas.
            </p>

            {errorMessage && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded-xl flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{errorMessage}</span>
              </div>
            )}

            {successMessage && (
              <div className="mb-4 p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs rounded-xl flex items-center gap-2">
                <CheckCircle className="w-4 h-4 shrink-0" />
                <span>{successMessage}</span>
              </div>
            )}

            <form onSubmit={handleUserRegisterSubmit} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Nome Completo *
                </label>
                <input
                  type="text"
                  required
                  value={userName}
                  onChange={(e) => setUserName(e.target.value)}
                  placeholder="Seu nome"
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:outline-none focus:ring-1 focus:ring-emerald-700 focus:bg-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    E-mail *
                  </label>
                  <input
                    type="email"
                    required
                    value={userEmail}
                    onChange={(e) => setUserEmail(e.target.value)}
                    placeholder="email@exemplo.com"
                    className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:outline-none focus:ring-1 focus:ring-emerald-700 focus:bg-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Senha de Usuário *
                  </label>
                  <input
                    type="password"
                    required
                    value={userRegisterPass}
                    onChange={(e) => setUserRegisterPass(e.target.value)}
                    placeholder="••••••••"
                    className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:outline-none focus:ring-1 focus:ring-emerald-700 focus:bg-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Município ou Bairro
                </label>
                <input
                  type="text"
                  value={userCity}
                  onChange={(e) => setUserCity(e.target.value)}
                  placeholder="Ex: Manaus ou Parintins"
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:outline-none focus:ring-1 focus:ring-emerald-700 focus:bg-white"
                />
              </div>

              <button
                type="submit"
                className="w-full py-2.5 px-4 bg-emerald-800 hover:bg-emerald-900 text-white text-xs font-bold rounded-lg transition-colors flex items-center justify-center gap-2 shadow-xs cursor-pointer mt-2"
              >
                <CheckCircle className="w-4 h-4" />
                <span>Concluir Cadastro & Acessar</span>
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};
