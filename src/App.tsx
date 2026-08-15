import React, { useState, useEffect } from 'react';
import { X, Edit3, Check, Trophy, Sparkles, UserCheck, Shield } from 'lucide-react';
import { updateUser } from '../lib/storage';
import { User } from '../types';
import { BilliardBallAvatar } from './BilliardBallAvatar';
import { soundFx } from '../lib/audio';

interface EditPlayerModalProps {
  isOpen: boolean;
  user: User | null;
  onClose: () => void;
  onUserUpdated: () => void;
}

const PRESET_TITLES = [
  '👑 Rei da Mesa',
  '🚗 Mestre da Lambreta',
  '🎱 Taco de Ouro',
  '🎯 Tacada Certeira',
  '⚡ Bruxo das Tabelas',
  '🔥 Imbatível da Mesa',
  '🌪️ Furacão da Sinuca',
  '🪄 Mão Santa',
  '🎱 Caçapeiro de Elite',
  '💩 Saco de Pancadas',
];

export const EditPlayerModal: React.FC<EditPlayerModalProps> = ({
  isOpen,
  user,
  onClose,
  onUserUpdated,
}) => {
  const [nickname, setNickname] = useState('');
  const [username, setUsername] = useState('');
  const [title, setTitle] = useState('');
  const [avatarBall, setAvatarBall] = useState<number>(8);
  const [avatarColor, setAvatarColor] = useState<string>('#09090b');
  const [initialWins, setInitialWins] = useState<number>(0);
  const [initialLosses, setInitialLosses] = useState<number>(0);
  const [initialLambretas, setInitialLambretas] = useState<number>(0);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (user) {
      setNickname(user.nickname || '');
      setUsername(user.username || '');
      setTitle(user.title || '');
      setAvatarBall(user.avatarBall !== undefined ? user.avatarBall : 8);
      setAvatarColor(user.avatarColor || '#09090b');
      setInitialWins(user.initialWins || 0);
      setInitialLosses(user.initialLosses || 0);
      setInitialLambretas(user.initialLambretas || 0);
      setError('');
      setSuccess(false);
    }
  }, [user, isOpen]);

  if (!isOpen || !user) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!nickname.trim()) {
      setError('Por favor, informe seu apelido na sinuca.');
      return;
    }

    const updated = updateUser(user.id, {
      nickname: nickname.trim(),
      username: username.trim() || user.username,
      title: title.trim() ? title.trim() : undefined,
      avatarBall: Number(avatarBall),
      avatarColor,
      initialWins: Number(initialWins) || 0,
      initialLosses: Number(initialLosses) || 0,
      initialLambretas: Number(initialLambretas) || 0,
    });

    if (updated) {
      soundFx.playCueHit();
      setSuccess(true);
      setTimeout(() => {
        onUserUpdated();
        onClose();
      }, 400);
    }
  };

  const balls = [
    { num: 1, name: '1 - Amarela (Lisa)' },
    { num: 2, name: '2 - Azul (Lisa)' },
    { num: 3, name: '3 - Vermelha (Lisa)' },
    { num: 4, name: '4 - Rosa (Lisa)' },
    { num: 5, name: '5 - Laranja (Lisa)' },
    { num: 6, name: '6 - Verde (Lisa)' },
    { num: 7, name: '7 - Marrom (Lisa)' },
    { num: 8, name: '8 - Preta (A Clássica)' },
    { num: 9, name: '9 - Amarela (Listrada)' },
    { num: 10, name: '10 - Azul (Listrada)' },
    { num: 11, name: '11 - Vermelha (Listrada)' },
    { num: 12, name: '12 - Rosa (Listrada)' },
    { num: 13, name: '13 - Laranja (Listrada)' },
    { num: 14, name: '14 - Verde (Listrada)' },
    { num: 15, name: '15 - Marrom (Listrada)' },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/85 backdrop-blur-md animate-fadeIn select-none overflow-y-auto">
      <div className="glass-modal text-slate-100 rounded-[32px] border border-white/20 max-w-lg w-full p-5 sm:p-6 shadow-2xl relative overflow-hidden my-auto max-h-[92vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-white/10 shrink-0">
          <div className="flex items-center space-x-2.5">
            <div className="p-2 glass-dark text-amber-400 rounded-2xl border border-white/10">
              <Edit3 className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-black text-base sm:text-lg text-amber-300">Editar Meu Perfil</h2>
              <p className="text-[11px] text-emerald-300/80">Altere seu ícone, apelido, título e saldo histórico</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Live Profile Card Preview */}
        <div className="mt-3 p-3.5 rounded-2xl glass-dark border border-amber-400/30 flex items-center space-x-3.5 shrink-0 bg-amber-500/5">
          <div className="shrink-0">
            <BilliardBallAvatar number={avatarBall} color={avatarColor} size="lg" />
          </div>
          <div className="min-w-0 flex-1">
            <div className="text-[10px] text-amber-300/80 uppercase font-black tracking-wider">Pré-visualização ao vivo:</div>
            <div className="text-base sm:text-lg font-black text-amber-200 truncate">
              {nickname || 'Seu Apelido'}
            </div>
            <div className="flex items-center space-x-1.5 mt-0.5">
              <span className="text-[10px] sm:text-xs bg-amber-400/20 text-amber-300 px-2 py-0.5 rounded-full font-bold border border-amber-400/30 truncate">
                {title.trim() || '🎱 Título Automático do Ranking'}
              </span>
            </div>
          </div>
        </div>

        {error && (
          <div className="mt-3 p-2.5 rounded-xl bg-red-500/20 border border-red-500/40 text-red-300 text-xs font-semibold shrink-0">
            {error}
          </div>
        )}

        {/* Scrollable Form Body */}
        <form onSubmit={handleSubmit} className="space-y-4 text-xs sm:text-sm mt-3 overflow-y-auto pr-1 flex-1">
          {/* 1. Escolher Ícone / Bola Avatar */}
          <div>
            <label className="block text-amber-300 font-extrabold mb-1.5 flex items-center justify-between">
              <span>1. Escolha seu Ícone (Bola de Sinuca):</span>
              <span className="text-[10px] text-emerald-400 font-bold">Bola #{avatarBall} selecionada</span>
            </label>
            <div className="grid grid-cols-5 sm:grid-cols-8 gap-2 p-2.5 glass-dark rounded-2xl border border-white/10">
              {balls.map(b => {
                const isSelected = avatarBall === b.num;
                return (
                  <button
                    type="button"
                    key={b.num}
                    onClick={() => setAvatarBall(b.num)}
                    title={b.name}
                    className={`flex flex-col items-center justify-center p-1 rounded-xl transition-all transform hover:scale-110 ${
                      isSelected
                        ? 'bg-amber-400/20 ring-2 ring-amber-400 scale-105 border border-amber-300'
                        : 'opacity-70 hover:opacity-100 hover:bg-white/5'
                    }`}
                  >
                    <BilliardBallAvatar number={b.num} size="sm" />
                  </button>
                );
              })}
            </div>
          </div>

          {/* 2. Apelido e Nome */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-200 font-extrabold mb-1">
                2. Apelido na Mesa (Exibição) *
              </label>
              <input
                type="text"
                value={nickname}
                onChange={e => setNickname(e.target.value)}
                placeholder="Ex: Baianinho de Mauá"
                className="w-full glass-dark border border-white/15 rounded-xl py-2 px-3 text-slate-100 font-bold focus:outline-none focus:border-amber-400"
                required
              />
            </div>

            <div>
              <label className="block text-slate-200 font-extrabold mb-1">
                Login / Usuário
              </label>
              <input
                type="text"
                value={username}
                onChange={e => setUsername(e.target.value)}
                placeholder="Seu usuário de login"
                className="w-full glass-dark border border-white/15 rounded-xl py-2 px-3 text-slate-100 font-semibold focus:outline-none focus:border-amber-400"
              />
            </div>
          </div>

          {/* 3. Título Personalizado */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="block text-amber-300 font-extrabold">
                3. Título / Patente do Jogador:
              </label>
              {title && (
                <button
                  type="button"
                  onClick={() => setTitle('')}
                  className="text-[10px] text-emerald-400 hover:text-emerald-200 underline font-semibold"
                >
                  Usar automático do Ranking
                </button>
              )}
            </div>
            <input
              type="text"
              placeholder="Digite um título customizado ou clique numa sugestão abaixo"
              value={title}
              onChange={e => setTitle(e.target.value)}
              className="w-full glass-dark border border-white/15 rounded-xl py-2 px-3 text-slate-100 placeholder-slate-500 focus:outline-none focus:border-amber-400 font-semibold mb-2"
            />

            {/* Quick Title Suggestions */}
            <div className="flex flex-wrap gap-1.5">
              {PRESET_TITLES.map((t) => (
                <button
                  type="button"
                  key={t}
                  onClick={() => setTitle(t)}
                  className={`text-[10px] px-2 py-1 rounded-lg border transition-all ${
                    title === t
                      ? 'bg-amber-400 text-slate-950 font-black border-amber-300 shadow-sm'
                      : 'glass-dark text-emerald-200 border-white/10 hover:border-amber-400/50 hover:text-amber-300'
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>

          {/* 4. Saldo Histórico Antigo */}
          <div className="glass-dark p-3 rounded-2xl border border-amber-500/30 space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-extrabold text-amber-300 text-xs uppercase tracking-wide flex items-center space-x-1">
                <Trophy className="w-3.5 h-3.5 text-amber-400" />
                <span>4. Saldo Histórico Antigo (Opcional)</span>
              </span>
            </div>
            <p className="text-[10px] text-slate-300 leading-tight">
              Vitórias, derrotas e lambretas anteriores à instalação deste placar.
            </p>

            <div className="grid grid-cols-3 gap-2">
              <div>
                <label className="block text-emerald-400 font-bold text-[10px] uppercase mb-0.5">
                  Vitórias
                </label>
                <input
                  type="number"
                  min="0"
                  value={initialWins}
                  onChange={e => setInitialWins(Math.max(0, parseInt(e.target.value) || 0))}
                  className="w-full glass-dark border border-emerald-500/50 rounded-xl py-1.5 px-2 text-emerald-300 font-extrabold text-center focus:outline-none focus:border-emerald-400"
                />
              </div>

              <div>
                <label className="block text-red-400 font-bold text-[10px] uppercase mb-0.5">
                  Derrotas
                </label>
                <input
                  type="number"
                  min="0"
                  value={initialLosses}
                  onChange={e => setInitialLosses(Math.max(0, parseInt(e.target.value) || 0))}
                  className="w-full glass-dark border border-red-500/50 rounded-xl py-1.5 px-2 text-red-300 font-extrabold text-center focus:outline-none focus:border-red-400"
                />
              </div>

              <div>
                <label className="block text-amber-400 font-bold text-[10px] uppercase mb-0.5">
                  Lambretas
                </label>
                <input
                  type="number"
                  min="0"
                  value={initialLambretas}
                  onChange={e => setInitialLambretas(Math.max(0, parseInt(e.target.value) || 0))}
                  className="w-full glass-dark border border-amber-500/50 rounded-xl py-1.5 px-2 text-amber-300 font-extrabold text-center focus:outline-none focus:border-amber-400"
                />
              </div>
            </div>
          </div>

          {/* Submit Action Buttons */}
          <div className="pt-2 flex items-center space-x-3 shrink-0 pb-1">
            <button
              type="button"
              onClick={onClose}
              className="w-1/3 py-2.5 rounded-xl border border-white/15 hover:bg-white/10 text-slate-300 font-semibold"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="w-2/3 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black py-2.5 rounded-xl shadow-lg flex items-center justify-center space-x-2 border border-emerald-300/50 uppercase text-xs transition-all hover:scale-[1.02]"
            >
              <Check className="w-4 h-4 text-slate-950" />
              <span>{success ? 'Salvo com Sucesso!' : 'Salvar Alterações'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
