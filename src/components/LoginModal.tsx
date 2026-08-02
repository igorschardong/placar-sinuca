import React, { useState } from 'react';
import { X, LogIn, Lock, User as UserIcon, CheckCircle2 } from 'lucide-react';
import { authenticateUser, getUsers, setCurrentUserId, getPlayerTitle } from '../lib/storage';
import { User } from '../types';
import { BilliardBallAvatar } from './BilliardBallAvatar';
import { soundFx } from '../lib/audio';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUserLoggedIn: (user: User) => void;
  onOpenRegister: () => void;
}

export const LoginModal: React.FC<LoginModalProps> = ({
  isOpen,
  onClose,
  onUserLoggedIn,
  onOpenRegister,
}) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const users = getUsers();

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const user = authenticateUser(username, password);
    if (user) {
      soundFx.playCueHit();
      onUserLoggedIn(user);
      onClose();
      setUsername('');
      setPassword('');
    } else {
      setError('Usuário ou senha incorretos.');
    }
  };

  const handleQuickSelect = (u: User) => {
    setCurrentUserId(u.id);
    soundFx.playCueHit();
    onUserLoggedIn(u);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fadeIn">
      <div className="glass-modal text-slate-100 rounded-[32px] border border-white/20 max-w-md w-full p-6 shadow-2xl relative overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-white/10 mb-4">
          <div className="flex items-center space-x-2">
            <div className="p-2 glass-dark text-amber-400 rounded-xl border border-white/10">
              <LogIn className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-extrabold text-lg text-amber-300">Entrar na Mesa</h2>
              <p className="text-xs text-emerald-300/80">Selecione seu perfil ou entre com usuário/senha</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Quick Select for Friends */}
        <div className="mb-6">
          <label className="block text-emerald-300 text-xs font-bold uppercase tracking-wider mb-2">
            Troca Rápida de Jogador (Partida Casual):
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-40 overflow-y-auto pr-1">
            {users.map(u => (
              <button
                key={u.id}
                onClick={() => handleQuickSelect(u)}
                className="flex items-center space-x-2.5 p-2 rounded-xl glass-dark hover:bg-white/15 border border-white/10 text-left transition-all hover:scale-[1.02]"
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

        <div className="relative my-4">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-white/10"></div>
          </div>
          <div className="relative flex justify-center text-xs">
            <span className="px-2 glass-dark rounded-full text-emerald-300/90 font-semibold border border-white/10">Ou acesse com credenciais</span>
          </div>
        </div>

        {error && (
          <div className="mb-3 p-2.5 rounded-xl bg-red-500/20 border border-red-500/40 text-red-300 text-xs font-semibold">
            {error}
          </div>
        )}

        {/* Credentials Form */}
        <form onSubmit={handleLoginSubmit} className="space-y-3 text-xs sm:text-sm">
          <div>
            <label className="block text-slate-300 font-medium mb-1">Usuário</label>
            <div className="relative">
              <UserIcon className="w-4 h-4 absolute left-3 top-3 text-emerald-400" />
              <input
                type="text"
                placeholder="Seu usuário"
                value={username}
                onChange={e => setUsername(e.target.value)}
                className="w-full glass-dark border border-white/15 rounded-xl py-2 pl-9 pr-3 text-slate-100 placeholder-slate-400 focus:outline-none focus:border-amber-400"
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
                className="w-full glass-dark border border-white/15 rounded-xl py-2 pl-9 pr-3 text-slate-100 placeholder-slate-400 focus:outline-none focus:border-amber-400"
              />
            </div>
          </div>

          <div className="pt-2 flex items-center space-x-2">
            <button
              type="submit"
              className="flex-1 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-extrabold py-2 rounded-xl shadow-md flex items-center justify-center space-x-1 border border-emerald-300/50"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>Entrar</span>
            </button>

            <button
              type="button"
              onClick={() => {
                onClose();
                onOpenRegister();
              }}
              className="px-3 py-2 rounded-xl border border-white/15 text-emerald-300 hover:bg-white/10 font-medium text-xs"
            >
              Criar Conta
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
