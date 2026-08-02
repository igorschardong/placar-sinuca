import React, { useState } from 'react';
import { X, UserPlus, Lock, User as UserIcon, Check } from 'lucide-react';
import { createUser } from '../lib/storage';
import { User } from '../types';
import { BilliardBallAvatar } from './BilliardBallAvatar';
import { soundFx } from '../lib/audio';

interface RegisterPlayerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUserRegistered: (user: User) => void;
}

export const RegisterPlayerModal: React.FC<RegisterPlayerModalProps> = ({
  isOpen,
  onClose,
  onUserRegistered,
}) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [nickname, setNickname] = useState('');
  const [title, setTitle] = useState('');
  const [avatarBall, setAvatarBall] = useState<number>(8); // Default 8-ball
  const [avatarColor, setAvatarColor] = useState<string>('#09090b');
  const [initialWins, setInitialWins] = useState<number>(0);
  const [initialLosses, setInitialLosses] = useState<number>(0);
  const [initialLambretas, setInitialLambretas] = useState<number>(0);
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!username.trim()) {
      setError('Informe um nome de usuário.');
      return;
    }
    if (!password.trim() || password.length < 4) {
      setError('A senha deve ter pelo menos 4 caracteres.');
      return;
    }
    if (!nickname.trim()) {
      setError('Informe um apelido para a mesa de sinuca.');
      return;
    }

    try {
      const newUser = createUser({
        username: username.trim(),
        passwordHash: password,
        nickname: nickname.trim(),
        title: title.trim() || undefined,
        avatarBall,
        avatarColor,
        initialWins: Number(initialWins) || 0,
        initialLosses: Number(initialLosses) || 0,
        initialLambretas: Number(initialLambretas) || 0,
      });

      soundFx.playCueHit();
      onUserRegistered(newUser);
      onClose();

      // Reset Form
      setUsername('');
      setPassword('');
      setNickname('');
      setTitle('');
      setInitialWins(0);
      setInitialLosses(0);
      setInitialLambretas(0);
    } catch (err) {
      setError('Erro ao cadastrar jogador. Tente outro nome de usuário.');
    }
  };

  const balls = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fadeIn">
      <div className="glass-modal text-slate-100 rounded-[32px] border border-white/20 max-w-md w-full p-6 shadow-2xl relative overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-white/10 mb-4">
          <div className="flex items-center space-x-2">
            <div className="p-2 glass-dark text-amber-400 rounded-xl border border-white/10">
              <UserPlus className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-extrabold text-lg text-amber-300">Novo Jogador</h2>
              <p className="text-xs text-emerald-300/80">Cadastre o participante para entrar no ranking</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {error && (
          <div className="mb-4 p-3 rounded-xl bg-red-500/20 border border-red-500/40 text-red-300 text-xs font-semibold">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4 text-xs sm:text-sm">
          {/* Billiard Ball Picker */}
          <div>
            <label className="block text-emerald-300 font-bold mb-2">
              Escolha a Bola da Sorte (Avatar):
            </label>
            <div className="flex items-center space-x-2 overflow-x-auto pb-2 no-scrollbar">
              {balls.map(num => (
                <button
                  type="button"
                  key={num}
                  onClick={() => setAvatarBall(num)}
                  className={`p-1 rounded-full transition-all transform hover:scale-110 ${
                    avatarBall === num ? 'ring-4 ring-amber-400 scale-110' : 'opacity-70 hover:opacity-100'
                  }`}
                >
                  <BilliardBallAvatar number={num} size="sm" />
                </button>
              ))}
            </div>
          </div>

          {/* Nickname / Apelido */}
          <div>
            <label className="block text-slate-300 font-medium mb-1">
              Apelido na Sinuca *
            </label>
            <div className="relative">
              <UserIcon className="w-4 h-4 absolute left-3 top-3 text-emerald-400" />
              <input
                type="text"
                placeholder="Ex: Zé 'Tacada Certeira'"
                value={nickname}
                onChange={e => setNickname(e.target.value)}
                className="w-full glass-dark border border-white/15 rounded-xl py-2.5 pl-9 pr-3 text-slate-100 placeholder-slate-400 focus:outline-none focus:border-amber-400 font-semibold"
                required
              />
            </div>
          </div>

          {/* Title / Título Personalizado */}
          <div>
            <label className="block text-amber-300 font-semibold mb-1 flex items-center justify-between">
              <span>Título do Jogador</span>
              <span className="text-[10px] text-emerald-400 font-normal">Opcional (ou automático pelo Ranking)</span>
            </label>
            <input
              type="text"
              placeholder="Ex: Mestre do Efeito, Gavião da Caçapa, etc."
              value={title}
              onChange={e => setTitle(e.target.value)}
              className="w-full glass-dark border border-white/15 rounded-xl py-2.5 px-3 text-slate-100 placeholder-slate-500 focus:outline-none focus:border-amber-400"
            />
          </div>

          {/* Username */}
          <div>
            <label className="block text-slate-300 font-medium mb-1">
              Usuário de Acesso *
            </label>
            <input
              type="text"
              placeholder="ex: zedasimuca"
              value={username}
              onChange={e => setUsername(e.target.value)}
              className="w-full glass-dark border border-white/15 rounded-xl py-2.5 px-3 text-slate-100 placeholder-slate-400 focus:outline-none focus:border-amber-400"
              required
            />
          </div>

          {/* Password */}
          <div>
            <label className="block text-slate-300 font-medium mb-1">
              Senha de Acesso *
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 absolute left-3 top-3 text-emerald-400" />
              <input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={e => setPassword(e.target.value)}
                className="w-full glass-dark border border-white/15 rounded-xl py-2.5 pl-9 pr-3 text-slate-100 placeholder-slate-400 focus:outline-none focus:border-amber-400"
                required
              />
            </div>
          </div>

          {/* Saldo Histórico Antigo (Opcional) */}
          <div className="glass-dark p-3.5 rounded-2xl border border-amber-500/30 space-y-3">
            <div className="flex items-center justify-between">
              <span className="font-extrabold text-amber-300 text-xs uppercase tracking-wide">
                🏆 Saldo Histórico (Jogos Antigos)
              </span>
              <span className="text-[10px] text-emerald-300 bg-emerald-500/20 px-2 py-0.5 rounded-full font-semibold border border-emerald-500/30">
                Opcional
              </span>
            </div>
            <p className="text-[11px] text-slate-300 leading-tight">
              Informe partidas já disputadas anteriormente para importar o placar e histórico antigo do jogador.
            </p>

            <div className="grid grid-cols-3 gap-2">
              <div>
                <label className="block text-emerald-400 font-bold text-[10px] uppercase mb-1">
                  Vitórias
                </label>
                <input
                  type="number"
                  min="0"
                  value={initialWins}
                  onChange={e => setInitialWins(Math.max(0, parseInt(e.target.value) || 0))}
                  className="w-full glass-dark border border-emerald-500/50 rounded-xl py-2 px-2.5 text-emerald-300 font-extrabold text-center focus:outline-none focus:border-emerald-400"
                />
              </div>

              <div>
                <label className="block text-red-400 font-bold text-[10px] uppercase mb-1">
                  Derrotas
                </label>
                <input
                  type="number"
                  min="0"
                  value={initialLosses}
                  onChange={e => setInitialLosses(Math.max(0, parseInt(e.target.value) || 0))}
                  className="w-full glass-dark border border-red-500/50 rounded-xl py-2 px-2.5 text-red-300 font-extrabold text-center focus:outline-none focus:border-red-400"
                />
              </div>

              <div>
                <label className="block text-amber-400 font-bold text-[10px] uppercase mb-1">
                  Lambretas
                </label>
                <input
                  type="number"
                  min="0"
                  value={initialLambretas}
                  onChange={e => setInitialLambretas(Math.max(0, parseInt(e.target.value) || 0))}
                  className="w-full glass-dark border border-amber-500/50 rounded-xl py-2 px-2.5 text-amber-300 font-extrabold text-center focus:outline-none focus:border-amber-400"
                />
              </div>
            </div>
          </div>

          {/* Submit CTA */}
          <div className="pt-2 flex items-center space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="w-1/3 py-2.5 rounded-xl border border-white/15 hover:bg-white/10 text-slate-300 font-semibold"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="w-2/3 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-extrabold py-2.5 rounded-xl shadow-lg flex items-center justify-center space-x-2 border border-emerald-300/50"
            >
              <Check className="w-4 h-4" />
              <span>Cadastrar Jogador</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

