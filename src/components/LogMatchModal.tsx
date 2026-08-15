import React, { useState, useEffect } from 'react';
import { X, Trophy, Calendar, Check, AlertCircle } from 'lucide-react';
import { getUsers, addMatch, getPlayerTitle } from '../lib/storage';
import { User, Match } from '../types';
import { BilliardBallAvatar } from './BilliardBallAvatar';

interface LogMatchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onMatchLogged: (match: Match) => void;
  currentUser: User | null;
}

export const LogMatchModal: React.FC<LogMatchModalProps> = ({
  isOpen,
  onClose,
  onMatchLogged,
  currentUser,
}) => {
  // Default date = Today (YYYY-MM-DD)
  const [date, setDate] = useState<string>(() => new Date().toISOString().split('T')[0]);
  const [winnerId, setWinnerId] = useState<string>('');
  const [loserId, setLoserId] = useState<string>('');
  const [isLambreta, setIsLambreta] = useState<boolean>(false);
  const [note, setNote] = useState<string>('');
  const [error, setError] = useState<string>('');

  const users = getUsers();

  // Pre-select winner/loser when modal opens
  useEffect(() => {
    if (isOpen && users.length >= 2) {
      if (currentUser) {
        setWinnerId(currentUser.id);
        const opponent = users.find(u => u.id !== currentUser.id);
        if (opponent) setLoserId(opponent.id);
      } else {
        setWinnerId(users[0].id);
        setLoserId(users[1].id);
      }
      setDate(new Date().toISOString().split('T')[0]);
      setError('');
    }
  }, [isOpen, currentUser]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (users.length < 2) {
      setError('Cadastre pelo menos 2 participantes para registrar um resultado.');
      return;
    }
    if (!winnerId) {
      setError('Selecione o vencedor da partida.');
      return;
    }
    if (!loserId) {
      setError('Selecione o perdedor da partida.');
      return;
    }
    if (winnerId === loserId) {
      setError('O vencedor e o perdedor não podem ser a mesma pessoa!');
      return;
    }

    const newMatch = addMatch({
      date: date || new Date().toISOString().split('T')[0],
      winnerId,
      loserId,
      isLambreta,
      note: note.trim(),
    });

    onMatchLogged(newMatch);
    onClose();
  };

  const winnerUser = users.find(u => u.id === winnerId);
  const loserUser = users.find(u => u.id === loserId);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/80 backdrop-blur-md animate-fadeIn">
      <div className="glass-modal text-slate-100 rounded-[32px] border border-white/20 max-w-lg w-full p-5 sm:p-6 shadow-2xl relative overflow-hidden max-h-[90vh] overflow-y-auto">
        {/* Decorative Felt Glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-2 bg-gradient-to-r from-amber-500 to-emerald-400 rounded-b-full blur-sm" />

        {/* Modal Header */}
        <div className="flex items-center justify-between pb-3 border-b border-white/10 mb-4">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-2xl glass-dark text-amber-400 flex items-center justify-center border border-white/10">
              <Trophy className="w-6 h-6 text-amber-400" />
            </div>
            <div>
              <h2 className="font-black text-xl text-amber-300">Registrar Resultado</h2>
              <p className="text-xs text-emerald-300/80">Registre quem ganhou, quem perdeu e se teve lambreta</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {error && (
          <div className="mb-4 p-3 rounded-xl bg-red-500/20 border border-red-500/40 text-red-300 text-xs font-semibold flex items-center space-x-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {users.length < 2 ? (
          <div className="p-6 text-center space-y-3">
            <p className="text-amber-200 font-bold text-sm">
              É necessário cadastrar pelo menos 2 participantes para registrar um resultado.
            </p>
            <button
              onClick={onClose}
              className="px-4 py-2 bg-amber-400 text-slate-950 font-black rounded-xl text-xs uppercase"
            >
              Entendido
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4 text-xs sm:text-sm">
            {/* Winner and Loser Selector Grid */}
            <div className="grid grid-cols-2 gap-3 glass-dark p-3 rounded-2xl border border-white/10">
              {/* Winner */}
              <div>
                <label className="block text-emerald-300 font-extrabold uppercase text-[10px] tracking-wider mb-1.5 flex items-center space-x-1">
                  <span className="text-amber-400">👑</span>
                  <span>Vencedor (Quem Ganhou)</span>
                </label>
                <select
                  value={winnerId}
                  onChange={e => {
                    setWinnerId(e.target.value);
                    if (e.target.value === loserId) {
                      const other = users.find(u => u.id !== e.target.value);
                      if (other) setLoserId(other.id);
                    }
                  }}
                  className="w-full glass-dark border border-amber-500/50 rounded-xl py-2.5 px-3 text-amber-200 font-bold focus:outline-none focus:border-amber-400"
                >
                  {users.map(u => (
                    <option key={u.id} value={u.id} className="bg-slate-900 text-slate-100">
                      {u.nickname} ({getPlayerTitle(u)})
                    </option>
                  ))}
                </select>
                {winnerUser && (
                  <div className="mt-2 flex items-center space-x-2 glass p-2 rounded-xl border border-white/10 overflow-hidden">
                    <BilliardBallAvatar number={winnerUser.avatarBall} color={winnerUser.avatarColor} size="sm" />
                    <div className="overflow-hidden text-left">
                      <div className="text-xs font-bold text-emerald-300 truncate">{winnerUser.nickname}</div>
                      <div className="text-[10px] text-amber-300 font-extrabold truncate">{getPlayerTitle(winnerUser)}</div>
                    </div>
                  </div>
                )}
              </div>

              {/* Loser */}
              <div>
                <label className="block text-red-300 font-extrabold uppercase text-[10px] tracking-wider mb-1.5 flex items-center space-x-1">
                  <span>💩</span>
                  <span>Perdedor (Derrotado)</span>
                </label>
                <select
                  value={loserId}
                  onChange={e => setLoserId(e.target.value)}
                  className="w-full glass-dark border border-red-500/50 rounded-xl py-2.5 px-3 text-slate-200 font-bold focus:outline-none focus:border-red-400"
                >
                  {users
                    .filter(u => u.id !== winnerId)
                    .map(u => (
                      <option key={u.id} value={u.id} className="bg-slate-900 text-slate-100">
                        {u.nickname} ({getPlayerTitle(u)})
                      </option>
                    ))}
                </select>
                {loserUser && (
                  <div className="mt-2 flex items-center space-x-2 glass p-2 rounded-xl border border-white/10 overflow-hidden">
                    <BilliardBallAvatar number={loserUser.avatarBall} color={loserUser.avatarColor} size="sm" />
                    <div className="overflow-hidden text-left">
                      <div className="text-xs font-bold text-red-300 truncate">{loserUser.nickname}</div>
                      <div className="text-[10px] text-amber-300 font-extrabold truncate">{getPlayerTitle(loserUser)}</div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Date Selector (Default: Today) */}
            <div>
              <label className="block text-slate-300 font-medium mb-1 flex items-center space-x-1">
                <Calendar className="w-4 h-4 text-amber-400" />
                <span>Data do Confronto (Padrão Hoje) *</span>
              </label>
              <input
                type="date"
                value={date}
                onChange={e => setDate(e.target.value)}
                className="w-full glass-dark border border-white/15 rounded-xl py-2 px-3 text-amber-300 font-bold focus:outline-none focus:border-amber-400"
                required
              />
            </div>

            {/* Lambreta / Capote Extra Bonus Toggle */}
            <div className="bg-gradient-to-r from-amber-500/10 to-orange-500/10 p-3.5 rounded-2xl border border-amber-500/40">
              <label className="flex items-start space-x-3 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={isLambreta}
                  onChange={e => setIsLambreta(e.target.checked)}
                  className="w-5 h-5 rounded text-amber-500 focus:ring-amber-400 bg-slate-900 border-amber-500/60 mt-0.5 cursor-pointer"
                />
                <div>
                  <div className="font-extrabold text-amber-300 flex items-center space-x-1.5 text-sm">
                    <span>🚗💨 TEVE LAMBRETA / CAPOTE?</span>
                    <span className="bg-amber-400 text-slate-950 text-[10px] font-black px-1.5 py-0.5 rounded-full uppercase">
                      3 Pontos (3 Vitórias)
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-300 mt-0.5">
                    Marque se o vencedor ganhou sem o perdedor colocar nenhuma bola na caçapa. Concede <strong>3 pontos</strong> (equivale a 3 vitórias) no lugar de 1 ponto!
                  </p>
                </div>
              </label>
            </div>

            {/* Note */}
            <div>
              <label className="block text-slate-300 font-medium mb-1">Observação / Zombaria</label>
              <input
                type="text"
                placeholder="Ex: Tacada de tabela incrível"
                value={note}
                onChange={e => setNote(e.target.value)}
                className="w-full glass-dark border border-white/15 rounded-xl py-2 px-3 text-slate-100 placeholder-slate-400 focus:outline-none focus:border-amber-400"
              />
            </div>

            {/* Submit CTAs */}
            <div className="pt-2 flex items-center space-x-3">
              <button
                type="button"
                onClick={onClose}
                className="w-1/3 py-3 rounded-xl border border-white/15 hover:bg-white/10 text-slate-300 font-semibold"
              >
                Cancelar
              </button>

              <button
                type="submit"
                className="w-2/3 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black py-3 rounded-xl shadow-xl hover:scale-[1.02] transition-all flex items-center justify-center space-x-2 text-sm uppercase tracking-wide border border-emerald-300/50"
              >
                <Check className="w-5 h-5 text-slate-950" />
                <span>Confirmar Tacada</span>
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

