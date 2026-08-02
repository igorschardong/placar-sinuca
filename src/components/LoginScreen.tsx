import React, { useState } from 'react';
import { LogIn, Lock, User as UserIcon, CheckCircle2, UserPlus, Tv, ShieldAlert } from 'lucide-react';
import { authenticateUser, getUsers, setCurrentUserId, getPlayerTitle } from '../lib/storage';
import { User } from '../types';
import { BilliardBallAvatar } from './BilliardBallAvatar';
import { soundFx } from '../lib/audio';

interface LoginScreenProps {
  onUserLoggedIn: (user: User) => void;
  onOpenRegister: () => void;
  onOpenTelao: () => void;
}

export const LoginScreen: React.FC<LoginScreenProps> = ({
  onUserLoggedIn,
  onOpenRegister,
  onOpenTelao,
}) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const users = getUsers();

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!username.trim()) {
      setError('Informe o usuário.');
      return;
    }

    const user = authenticateUser(username, password);
    if (user) {
      soundFx.playCueHit();
      onUserLoggedIn(user);
    } else {
      setError('Usuário ou senha incorretos.');
    }
  };

  const handleQuickSelect = (u: User) => {
    setCurrentUserId(u.id);
    soundFx.playCueHit();
    onUserLoggedIn(u);
  };

  return (
    <div className="min-h-screen table-gradient text-slate-100 flex flex-col justify-between font-sans relative overflow-hidden select-none p-4 sm:p-6">
      {/* Background Ambient Lighting */}
      <div className="fixed inset-0 bg-[radial-gradient(circle_at_center,rgba(6,95,70,0.4)_0%,rgba(6,78,59,0.7)_60%,rgba(2,44,34,0.95)_100%)] pointer-events-none z-0" />

      {/* Top Header */}
      <header className="relative z-10 max-w-4xl mx-auto w-full flex items-center justify-between py-2">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-amber-400 to-amber-600 p-0.5 shadow-lg flex items-center justify-center">
            <div className="w-full h-full bg-emerald-950 rounded-full flex items-center justify-center font-black text-amber-300 text-lg">
              8
            </div>
          </div>
          <span className="font-extrabold text-2xl tracking-tight text-amber-300 drop-shadow">
            Placar
          </span>
        </div>

        {/* Public Telao Button */}
        <button
          onClick={onOpenTelao}
          className="bg-amber-400 hover:bg-amber-300 text-slate-950 font-extrabold px-4 py-2 rounded-2xl text-xs sm:text-sm shadow-xl flex items-center space-x-2 border border-amber-200 transition-all hover:scale-105"
        >
          <Tv className="w-4 h-4 text-slate-950" />
          <span>📺 Acessar Telão Público</span>
        </button>
      </header>

      {/* Main Login Card */}
      <main className="relative z-10 max-w-md w-full mx-auto my-auto py-8">
        <div className="glass-modal text-slate-100 rounded-[32px] border border-white/20 p-6 sm:p-8 shadow-2xl relative overflow-hidden">
          {/* Badge */}
          <div className="inline-flex items-center space-x-1.5 bg-amber-400/20 text-amber-300 text-xs font-bold px-3 py-1 rounded-full border border-amber-400/30 mb-4">
            <ShieldAlert className="w-3.5 h-3.5 text-amber-400" />
            <span>Área Restrita — Faça Login</span>
          </div>

          <h1 className="font-black text-2xl sm:text-3xl text-amber-300 tracking-tight mb-1">
            Entrar no Placar
          </h1>
          <p className="text-xs sm:text-sm text-emerald-300/80 mb-6">
            Identifique-se para acessar o placar e registrar os resultados da mesa.
          </p>

          {/* Quick Select if users exist */}
          {users.length > 0 && (
            <div className="mb-6">
              <label className="block text-emerald-300 text-xs font-extrabold uppercase tracking-wider mb-2">
                Selecione seu Perfil:
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-48 overflow-y-auto pr-1">
                {users.map(u => (
                  <button
                    key={u.id}
                    onClick={() => handleQuickSelect(u)}
                    className="flex items-center space-x-2.5 p-2.5 rounded-2xl glass-dark hover:bg-white/15 border border-white/10 text-left transition-all hover:scale-[1.02] active:scale-95"
                  >
                    <BilliardBallAvatar number={u.avatarBall} color={u.avatarColor} size="sm" />
                    <div className="overflow-hidden">
                      <div className="font-extrabold text-amber-200 text-xs truncate">{u.nickname}</div>
                      <div className="text-[10px] text-amber-300 font-extrabold truncate">{getPlayerTitle(u)}</div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {users.length > 0 && (
            <div className="relative my-4">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-white/10"></div>
              </div>
              <div className="relative flex justify-center text-xs">
                <span className="px-3 glass-dark rounded-full text-emerald-300/90 font-semibold border border-white/10">
                  Ou acesse com credenciais
                </span>
              </div>
            </div>
          )}

          {error && (
            <div className="mb-4 p-3 rounded-2xl bg-red-500/20 border border-red-500/40 text-red-300 text-xs font-semibold">
              {error}
            </div>
          )}

          {/* Credentials Form */}
          <form onSubmit={handleLoginSubmit} className="space-y-3.5 text-xs sm:text-sm">
            <div>
              <label className="block text-slate-300 font-medium mb-1">Usuário</label>
              <div className="relative">
                <UserIcon className="w-4 h-4 absolute left-3 top-3 text-emerald-400" />
                <input
                  type="text"
                  placeholder="Seu nome de usuário"
                  value={username}
                  onChange={e => setUsername(e.target.value)}
                  className="w-full glass-dark border border-white/15 rounded-xl py-2.5 pl-9 pr-3 text-slate-100 placeholder-slate-400 focus:outline-none focus:border-amber-400"
                />
              </div>
            </div>

            <div>
              <label className="block text-slate-300 font-medium mb-1">Senha</label>
              <div className="relative">
                <Lock className="w-4 h-4 absolute left-3 top-3 text-emerald-400" />
                <input
                  type="password"
                  placeholder="Sua senha"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  className="w-full glass-dark border border-white/15 rounded-xl py-2.5 pl-9 pr-3 text-slate-100 placeholder-slate-400 focus:outline-none focus:border-amber-400"
                />
              </div>
            </div>

            <div className="pt-2 flex flex-col sm:flex-row items-center gap-2">
              <button
                type="submit"
                className="w-full bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black py-3 rounded-2xl shadow-xl flex items-center justify-center space-x-2 border border-emerald-300/50 uppercase tracking-wide text-xs transition-all hover:scale-[1.02]"
              >
                <LogIn className="w-4 h-4" />
                <span>Entrar no Sistema</span>
              </button>
            </div>
          </form>

          {/* Register Option */}
          <div className="mt-6 pt-4 border-t border-white/10 text-center">
            <p className="text-xs text-slate-300 mb-2">Ainda não tem cadastro de participante?</p>
            <button
              type="button"
              onClick={onOpenRegister}
              className="w-full py-2.5 rounded-2xl glass-dark hover:bg-white/15 text-amber-300 font-extrabold text-xs border border-white/15 flex items-center justify-center space-x-2 transition-all"
            >
              <UserPlus className="w-4 h-4 text-amber-400" />
              <span>Cadastrar Novo Participante</span>
            </button>
          </div>
        </div>

        {/* Telão Banner Card */}
        <div className="mt-4 glass-dark p-4 rounded-2xl border border-white/10 text-center">
          <p className="text-xs text-emerald-300/80 mb-2">
            Procurando apenas o placar ao vivo para a TV do bar?
          </p>
          <button
            onClick={onOpenTelao}
            className="text-amber-300 hover:text-amber-200 font-extrabold text-xs underline inline-flex items-center space-x-1"
          >
            <span>📺 Abrir Modo Telão Público</span>
          </button>
        </div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 text-center text-xs text-emerald-300/60 py-2">
        Placar — Somente o Telão é público.
      </footer>
    </div>
  );
};
