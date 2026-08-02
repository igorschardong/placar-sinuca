import React, { useState } from 'react';
import { History, Calendar, Trash2, AlertTriangle, X, Check } from 'lucide-react';
import { Match, User } from '../types';
import { BilliardBallAvatar } from './BilliardBallAvatar';
import { deleteMatch, getPlayerTitle } from '../lib/storage';

interface MatchHistoryProps {
  matches: Match[];
  users: User[];
  onMatchesUpdated: () => void;
  onOpenLogMatch: () => void;
}

export const MatchHistory: React.FC<MatchHistoryProps> = ({
  matches,
  users,
  onMatchesUpdated,
  onOpenLogMatch,
}) => {
  const [filterUser, setFilterUser] = useState<string>('all');
  const [matchToDelete, setMatchToDelete] = useState<Match | null>(null);

  const filteredMatches = matches.filter(m => {
    if (filterUser === 'all') return true;
    return m.winnerId === filterUser || m.loserId === filterUser;
  });

  const confirmDelete = () => {
    if (matchToDelete) {
      deleteMatch(matchToDelete.id);
      onMatchesUpdated();
      setMatchToDelete(null);
    }
  };

  return (
    <div className="space-y-4">
      {/* Header & Filter */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 glass p-4 sm:p-5 rounded-[28px] border border-white/15 shadow-xl">
        <div>
          <h2 className="text-lg sm:text-xl font-extrabold text-amber-300 flex items-center space-x-2">
            <History className="w-5 h-5 text-amber-400 shrink-0" />
            <span>Histórico de Confrontos</span>
          </h2>
          <p className="text-xs text-emerald-300/80">
            Registro detalhado de todas as partidas disputadas
          </p>
        </div>

        {/* Filter dropdown */}
        <div className="w-full sm:w-auto flex flex-col sm:flex-row items-start sm:items-center gap-1.5 sm:gap-2">
          <label className="text-xs text-slate-300 font-bold shrink-0">Filtrar por Jogador:</label>
          <select
            value={filterUser}
            onChange={e => setFilterUser(e.target.value)}
            className="w-full sm:w-auto glass-dark border border-white/15 rounded-xl py-2 px-3 text-xs text-amber-200 font-semibold focus:outline-none focus:border-amber-400"
          >
            <option value="all" className="bg-slate-900 text-slate-100">Todos os Jogadores</option>
            {users.map(u => (
              <option key={u.id} value={u.id} className="bg-slate-900 text-slate-100">
                {u.nickname} ({getPlayerTitle(u)})
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Match Cards List */}
      {filteredMatches.length === 0 ? (
        <div className="p-8 sm:p-12 text-center glass rounded-[28px] border border-white/10 text-slate-300 text-xs sm:text-sm">
          Nenhuma partida registrada ainda.{' '}
          <button onClick={onOpenLogMatch} className="text-amber-400 font-bold underline mt-1 sm:mt-0 inline-block">
            Registrar primeiro resultado agora
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          {filteredMatches.map(m => {
            const winner = users.find(u => u.id === m.winnerId);
            const loser = users.find(u => u.id === m.loserId);

            return (
              <div
                key={m.id}
                className="glass glass-hover rounded-2xl p-3.5 sm:p-4 border border-white/15 shadow-lg flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 sm:gap-4"
              >
                {/* Matchup Details */}
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 w-full">
                  {/* Date Badge */}
                  <div className="flex items-center justify-between sm:justify-start w-full sm:w-auto">
                    <div className="glass-dark px-2.5 py-1.5 sm:p-2.5 rounded-xl border border-white/10 text-center flex sm:flex-col items-center space-x-2 sm:space-x-0 shrink-0">
                      <Calendar className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-amber-400" />
                      <span className="text-[10px] font-mono text-emerald-300 font-bold">
                        {m.date}
                      </span>
                    </div>

                    {/* Mobile Lambreta Tag (Visible on mobile top-right) */}
                    {m.isLambreta && (
                      <span className="sm:hidden bg-amber-400 text-slate-950 font-black text-[10px] px-2 py-0.5 rounded-full flex items-center space-x-1 shadow lambreta-glow">
                        <span>🚗 Lambreta! (+1pt)</span>
                      </span>
                    )}
                  </div>

                  {/* Players Versus */}
                  <div className="grid grid-cols-2 sm:flex sm:items-center gap-2 sm:gap-3 w-full">
                    {/* Winner */}
                    <div className="glass-dark p-2 sm:p-0 sm:bg-transparent rounded-xl border sm:border-0 border-emerald-500/30 flex items-center space-x-2 overflow-hidden">
                      <BilliardBallAvatar
                        number={winner?.avatarBall || 8}
                        color={winner?.avatarColor}
                        size="sm"
                      />
                      <div className="overflow-hidden">
                        <div className="font-extrabold text-amber-300 text-xs sm:text-sm truncate">
                          {winner?.nickname || 'Vencedor'}
                        </div>
                        <span className="text-[9px] sm:text-[10px] text-emerald-300 font-black bg-emerald-500/20 px-1.5 py-0.2 rounded border border-emerald-500/30 truncate block max-w-[120px] sm:max-w-[160px]">
                          {winner ? getPlayerTitle(winner) : 'Vencedor'}
                        </span>
                      </div>
                    </div>

                    {/* Loser */}
                    <div className="glass-dark p-2 sm:p-0 sm:bg-transparent rounded-xl border sm:border-0 border-red-500/30 flex items-center space-x-2 overflow-hidden">
                      <BilliardBallAvatar
                        number={loser?.avatarBall || 1}
                        color={loser?.avatarColor}
                        size="sm"
                      />
                      <div className="overflow-hidden">
                        <div className="font-bold text-slate-300 text-xs sm:text-sm truncate">
                          {loser?.nickname || 'Perdedor'}
                        </div>
                        <span className="text-[9px] sm:text-[10px] text-red-300 font-black bg-red-500/20 px-1.5 py-0.2 rounded border border-red-500/30 truncate block max-w-[120px] sm:max-w-[160px]">
                          {loser ? getPlayerTitle(loser) : 'Perdedor'}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Desktop Lambreta Tag & Delete Button */}
                <div className="flex items-center justify-between sm:justify-end space-x-3 w-full sm:w-auto pt-2 sm:pt-0 border-t sm:border-t-0 border-white/10 shrink-0">
                  {m.isLambreta && (
                    <span className="hidden sm:flex bg-amber-400 text-slate-950 font-black text-xs px-2.5 py-1 rounded-xl items-center space-x-1 shadow lambreta-glow shrink-0">
                      <span>🚗 Lambreta! (+1pt)</span>
                    </span>
                  )}

                  {/* Delete / Rollback button with touch-friendly 44px min-height */}
                  <button
                    onClick={() => setMatchToDelete(m)}
                    className="w-full sm:w-auto min-h-[40px] px-3 py-2 rounded-xl text-red-400 hover:text-red-300 bg-red-500/10 hover:bg-red-500/20 border border-red-500/30 transition-all flex items-center justify-center space-x-1.5 text-xs font-bold"
                    title="Excluir confronto e estornar pontos"
                  >
                    <Trash2 className="w-4 h-4" />
                    <span>Apagar Registro</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Modal Deletar Partida */}
      {matchToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fadeIn select-none">
          <div className="glass-modal text-slate-100 rounded-[32px] border border-red-500/40 max-w-sm w-full p-6 shadow-2xl relative overflow-hidden">
            <div className="flex items-center justify-between pb-3 border-b border-white/10 mb-4">
              <div className="flex items-center space-x-2.5">
                <div className="p-2.5 bg-red-500/20 text-red-400 rounded-xl border border-red-500/40">
                  <Trash2 className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-extrabold text-base text-red-300">Apagar Confronto?</h3>
                  <p className="text-[11px] text-slate-300">Estorno automático de estatísticas</p>
                </div>
              </div>
              <button
                onClick={() => setMatchToDelete(null)}
                className="p-1 text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed mb-5">
              Tem certeza que deseja excluir esta partida do histórico? Os pontos e vitórias/derrotas serão estornados dos jogadores no ranking.
            </p>

            <div className="flex items-center space-x-3">
              <button
                onClick={() => setMatchToDelete(null)}
                className="w-1/2 py-2.5 rounded-xl border border-white/15 hover:bg-white/10 text-slate-300 font-semibold text-xs"
              >
                Cancelar
              </button>
              <button
                onClick={confirmDelete}
                className="w-1/2 bg-red-500 hover:bg-red-400 text-white font-extrabold py-2.5 rounded-xl shadow-lg border border-red-300/50 uppercase text-xs flex items-center justify-center space-x-1"
              >
                <Check className="w-4 h-4" />
                <span>Confirmar</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};


