import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Trophy, Flame, Award, PlusCircle, Search, Crown, Scale, HelpCircle, Users, Sparkles, Edit3 } from 'lucide-react';
import { PlayerStats } from '../types';
import { BilliardBallAvatar } from './BilliardBallAvatar';
import { getPlayerTitle } from '../lib/storage';

interface LeaderboardProps {
  stats: PlayerStats[];
  currentUserId?: string | null;
  onOpenLogMatch: () => void;
  onOpenRegister: () => void;
  onOpenEditProfile?: () => void;
}

type FilterType = 'points' | 'weighted' | 'wins' | 'lambretas';

export const Leaderboard: React.FC<LeaderboardProps> = ({
  stats,
  currentUserId,
  onOpenLogMatch,
  onOpenRegister,
  onOpenEditProfile,
}) => {
  const [filter, setFilter] = useState<FilterType>('points');
  const [searchQuery, setSearchQuery] = useState('');
  const [showUnranked, setShowUnranked] = useState(false);

  // REGRA CRÍTICA: Se não tiver jogos, NÃO entra no ranking!
  const rankedPlayers = stats.filter(s => s.matchesPlayed > 0);
  const unrankedPlayers = stats.filter(s => s.matchesPlayed === 0);

  // Filter & Sort stats based on active classification mode
  let sortedStats = [...rankedPlayers];

  if (filter === 'weighted') {
    // Classificação por Média Ponderada baseada em jogos
    sortedStats.sort((a, b) => {
      if (b.weightedAverage !== a.weightedAverage) return b.weightedAverage - a.weightedAverage;
      if (b.pointsPerGame !== a.pointsPerGame) return b.pointsPerGame - a.pointsPerGame;
      if (b.points !== a.points) return b.points - a.points;
      return b.matchesPlayed - a.matchesPlayed;
    });
  } else if (filter === 'lambretas') {
    sortedStats.sort((a, b) => b.lambretasCount - a.lambretasCount || b.points - a.points || b.wins - a.wins);
  } else if (filter === 'wins') {
    sortedStats.sort((a, b) => b.wins - a.wins || b.points - a.points);
  } else {
    // Classificação Padrão por Pontos Totais
    sortedStats.sort((a, b) => {
      if (b.points !== a.points) return b.points - a.points;
      if (b.weightedAverage !== a.weightedAverage) return b.weightedAverage - a.weightedAverage;
      if (b.wins !== a.wins) return b.wins - a.wins;
      if (b.lambretasCount !== a.lambretasCount) return b.lambretasCount - a.lambretasCount;
      return b.winRate - a.winRate;
    });
  }

  if (searchQuery.trim()) {
    const q = searchQuery.toLowerCase();
    sortedStats = sortedStats.filter(
      s => s.user.nickname.toLowerCase().includes(q) || s.user.username.toLowerCase().includes(q)
    );
  }

  const topPlayer = sortedStats.length > 0 ? sortedStats[0] : null;
  const lastPlayer = sortedStats.length > 1 ? sortedStats[sortedStats.length - 1] : null;

  return (
    <div className="space-y-6">
      {/* Scoring Scheme Banner Card */}
      <div className="glass-dark border border-amber-500/30 rounded-2xl p-3.5 sm:p-4 text-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-3 text-slate-200">
        <div className="flex items-center space-x-2.5">
          <div className="w-8 h-8 rounded-xl bg-amber-400/20 border border-amber-400/40 text-amber-300 flex items-center justify-center shrink-0">
            <Trophy className="w-4 h-4 text-amber-400" />
          </div>
          <div>
            <div className="font-extrabold text-amber-300 text-sm flex items-center space-x-1.5">
              <span>Esquema Oficial de Pontuação</span>
            </div>
            <div className="flex flex-wrap items-center gap-2 mt-0.5 text-[11px] text-emerald-200 font-medium">
              <span className="bg-emerald-950/80 px-2 py-0.5 rounded-lg border border-emerald-500/30">
                🟢 Vitória = <strong className="text-emerald-300 font-bold">1 ponto</strong>
              </span>
              <span className="bg-emerald-950/80 px-2 py-0.5 rounded-lg border border-emerald-500/30">
                🔴 Derrota = <strong className="text-red-300 font-bold">0 pontos</strong>
              </span>
              <span className="bg-amber-400/20 px-2 py-0.5 rounded-lg border border-amber-400/40 text-amber-300 font-bold">
                🚗💨 Lambreta = <strong>3 pontos</strong> (equivale a 3 vitórias)
              </span>
            </div>
          </div>
        </div>

        <div className="text-[11px] text-emerald-300/80 italic shrink-0">
          *Jogadores sem partidas não pontuam nem entram no ranking.
        </div>
      </div>

      {/* High Evidence Dual Highlight: Rei (1st) and Vexame (Last) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* King of the Table (1st Place) - Spans 2 Cols on MD */}
        {topPlayer ? (
          <div className="md:col-span-2 glass rounded-[32px] p-5 sm:p-6 shadow-2xl relative overflow-hidden lambreta-glow border-2 border-amber-400/80">
            {/* Subtle Ambient Glow */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-amber-400/15 rounded-full blur-3xl pointer-events-none" />

            <div className="flex flex-col sm:flex-row items-center sm:items-start justify-between gap-4 relative z-10 text-center sm:text-left">
              <div className="flex flex-col sm:flex-row items-center space-y-3 sm:space-y-0 sm:space-x-4">
                <div className="relative shrink-0">
                  <BilliardBallAvatar
                    number={topPlayer.user.avatarBall}
                    color={topPlayer.user.avatarColor}
                    size="xl"
                    showCrown={true}
                  />
                </div>

                <div>
                  <div className="flex flex-wrap items-center justify-center sm:justify-start gap-1.5">
                    <span className="bg-amber-400 text-slate-950 font-black text-[10px] sm:text-xs uppercase tracking-wider px-2.5 py-0.5 rounded-full shadow flex items-center space-x-1">
                      <Crown className="w-3.5 h-3.5" />
                      <span>👑 LÍDER DO RANKING & REI DA MESA</span>
                    </span>
                    {topPlayer.streak.type === 'win' && topPlayer.streak.count > 1 && (
                      <span className="bg-orange-500 text-white font-bold text-[10px] px-2 py-0.5 rounded-full flex items-center space-x-1">
                        <Flame className="w-3 h-3 fill-amber-200" />
                        <span>{topPlayer.streak.count}x Imbatível</span>
                      </span>
                    )}
                  </div>

                  <h1 className="text-2xl sm:text-3xl font-black text-amber-300 mt-1">
                    {topPlayer.user.nickname}
                  </h1>
                  <div className="mt-1">
                    <span className="text-xs sm:text-sm font-extrabold text-amber-200 bg-amber-400/20 px-3 py-1 rounded-full border border-amber-400/40 inline-block">
                      {getPlayerTitle(topPlayer.user, topPlayer, sortedStats.length)}
                    </span>
                  </div>

                  <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 mt-2 text-xs sm:text-sm text-emerald-200/90 font-medium">
                    <span className="bg-emerald-950/80 px-2.5 py-1 rounded-xl border border-emerald-500/30">
                      <strong className="text-amber-300 font-extrabold">{topPlayer.points}</strong> Pontos Totais
                    </span>
                    <span className="bg-emerald-950/80 px-2.5 py-1 rounded-xl border border-emerald-500/30">
                      <strong className="text-amber-300 font-bold">{topPlayer.weightedAverage}</strong> Média Ponderada
                    </span>
                    <span className="bg-emerald-950/80 px-2.5 py-1 rounded-xl border border-emerald-500/30">
                      <strong className="text-emerald-300 font-bold">{topPlayer.wins}V</strong> / <strong className="text-red-300">{topPlayer.losses}D</strong> ({topPlayer.matchesPlayed} jogos)
                    </span>
                  </div>
                </div>
              </div>

              {/* Quick Action */}
              <div className="shrink-0 w-full sm:w-auto">
                <button
                  onClick={onOpenLogMatch}
                  className="w-full bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-extrabold px-4 py-3 rounded-2xl shadow-xl hover:scale-105 transition-all flex items-center justify-center space-x-2 text-xs uppercase tracking-wide border border-emerald-300/50"
                >
                  <PlusCircle className="w-4 h-4 text-slate-950" />
                  <span>Desafiar o Rei</span>
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div className="md:col-span-2 glass rounded-[32px] p-6 text-center border border-white/10 flex flex-col items-center justify-center space-y-2">
            <Trophy className="w-10 h-10 text-amber-400/60" />
            <h3 className="font-extrabold text-lg text-amber-200">Aguardando primeiras partidas</h3>
            <p className="text-xs text-slate-300 max-w-md">
              Nenhum jogador disputou partidas ainda. Registre o primeiro confronto para iniciar o ranking!
            </p>
            <button
              onClick={onOpenLogMatch}
              className="mt-2 px-4 py-2 bg-emerald-500 text-slate-950 font-black rounded-xl text-xs uppercase"
            >
              Registrar 1º Jogo
            </button>
          </div>
        )}

        {/* The Shame / Vexame Player (Last Place) - Spans 1 Col on MD */}
        {lastPlayer && (
          <div className="glass-dark rounded-[32px] p-5 shadow-2xl relative overflow-hidden border-2 border-red-500/60 bg-gradient-to-b from-red-950/40 to-slate-950/80 text-center flex flex-col justify-between">
            {/* Background Hazard Glow */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-red-500/10 rounded-full blur-2xl pointer-events-none" />

            <div>
              <div className="inline-flex items-center space-x-1 bg-red-500/20 text-red-300 border border-red-500/40 text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full mb-2">
                <span>💩 O VEXAME / LANTERNA DA MESA</span>
              </div>

              <div className="flex items-center justify-center space-x-3 my-2">
                <div className="relative">
                  <BilliardBallAvatar
                    number={lastPlayer.user.avatarBall}
                    color={lastPlayer.user.avatarColor}
                    size="md"
                  />
                  <div className="absolute -bottom-1 -right-1 text-base">💩</div>
                </div>
                <div className="text-left">
                  <div className="font-extrabold text-red-300 text-base leading-tight">
                    {lastPlayer.user.nickname}
                  </div>
                  <div className="text-[11px] text-amber-300 font-extrabold bg-amber-400/20 px-2 py-0.5 rounded-full border border-amber-400/30 inline-block mt-1">
                    {getPlayerTitle(lastPlayer.user, lastPlayer, sortedStats.length)}
                  </div>
                </div>
              </div>

              <p className="text-[11px] text-slate-300 italic my-2">
                "{lastPlayer.losses} derrotas em {lastPlayer.matchesPlayed} jogos. Precisa de mais treino urgente!"
              </p>
            </div>

            <div className="mt-2 pt-2 border-t border-red-500/20 flex items-center justify-around text-xs font-bold text-red-300">
              <div>
                <span className="block text-[10px] text-slate-400 font-normal">Pontos</span>
                <span className="text-amber-300">{lastPlayer.points} pts</span>
              </div>
              <div className="h-4 w-px bg-red-500/20" />
              <div>
                <span className="block text-[10px] text-slate-400 font-normal">Média/Jogo</span>
                <span>{lastPlayer.pointsPerGame}</span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Filter Tabs & Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 glass p-3 rounded-2xl backdrop-blur-md">
        {/* Classification Mode Buttons */}
        <div className="flex items-center space-x-1 sm:space-x-2 overflow-x-auto w-full sm:w-auto no-scrollbar pb-1 sm:pb-0">
          <button
            onClick={() => setFilter('points')}
            className={`px-3.5 py-2 rounded-xl text-xs font-black transition-all whitespace-nowrap flex items-center space-x-1.5 ${
              filter === 'points'
                ? 'bg-amber-400 text-slate-950 shadow-lg scale-105 ring-2 ring-amber-300'
                : 'text-slate-200 hover:bg-white/10 hover:text-amber-300'
            }`}
            title="Classificação por soma total de pontos"
          >
            <Trophy className="w-3.5 h-3.5" />
            <span>Por Pontos Totais</span>
          </button>

          <button
            onClick={() => setFilter('weighted')}
            className={`px-3.5 py-2 rounded-xl text-xs font-black transition-all whitespace-nowrap flex items-center space-x-1.5 ${
              filter === 'weighted'
                ? 'bg-amber-400 text-slate-950 shadow-lg scale-105 ring-2 ring-amber-300'
                : 'text-slate-200 hover:bg-white/10 hover:text-amber-300'
            }`}
            title="Classificação ponderada baseada na regularidade e quantidade de partidas"
          >
            <Scale className="w-3.5 h-3.5" />
            <span>Média Ponderada (Jogos)</span>
          </button>

          <button
            onClick={() => setFilter('wins')}
            className={`px-3.5 py-2 rounded-xl text-xs font-black transition-all whitespace-nowrap flex items-center space-x-1.5 ${
              filter === 'wins'
                ? 'bg-amber-400 text-slate-950 shadow-lg scale-105 ring-2 ring-amber-300'
                : 'text-slate-200 hover:bg-white/10 hover:text-amber-300'
            }`}
          >
            <Crown className="w-3.5 h-3.5" />
            <span>Mais Vitórias</span>
          </button>

          <button
            onClick={() => setFilter('lambretas')}
            className={`px-3.5 py-2 rounded-xl text-xs font-black transition-all whitespace-nowrap flex items-center space-x-1.5 ${
              filter === 'lambretas'
                ? 'bg-amber-400 text-slate-950 shadow-lg scale-105 ring-2 ring-amber-300'
                : 'text-slate-200 hover:bg-white/10 hover:text-amber-300'
            }`}
          >
            <Award className="w-3.5 h-3.5" />
            <span>Mestres da Lambreta 🚗</span>
          </button>
        </div>

        {/* Search Bar */}
        <div className="relative w-full sm:w-64">
          <Search className="w-4 h-4 absolute left-3 top-2.5 text-emerald-400" />
          <input
            type="text"
            placeholder="Buscar jogador no ranking..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="w-full glass-dark border border-white/15 rounded-xl py-1.5 pl-9 pr-3 text-xs text-slate-100 placeholder-slate-400 focus:outline-none focus:border-amber-400"
          />
        </div>
      </div>

      {/* Animated Ranking Table */}
      <div className="glass rounded-[32px] shadow-2xl overflow-hidden border border-white/15">
        {/* Table Header */}
        <div className="grid grid-cols-12 gap-1.5 sm:gap-2 p-2.5 sm:p-4 glass-dark text-emerald-300 font-extrabold text-[10px] sm:text-xs uppercase tracking-wider border-b border-white/10 items-center">
          <div className="col-span-2 sm:col-span-1 text-center">Pos.</div>
          <div className="col-span-4 sm:col-span-4">Jogador & Título</div>
          <div className="col-span-3 sm:col-span-3 text-center">Vit / Der / Jogos</div>
          <div className="col-span-3 sm:col-span-4 text-right">
            {filter === 'weighted' ? 'Média Ponderada / Jogo' : 'Pontuação Oficial'}
          </div>
        </div>

        {/* Animated Rows List using Framer Motion */}
        <div className="divide-y divide-white/5">
          {sortedStats.length === 0 ? (
            <div className="p-8 text-center text-slate-300 text-sm">
              {searchQuery ? (
                <span>Nenhum participante com jogos encontrado para a busca.</span>
              ) : (
                <span>
                  Nenhum jogador possui partidas registradas no momento.{' '}
                  <button onClick={onOpenLogMatch} className="text-amber-400 font-bold underline">
                    Registrar uma partida agora
                  </button>
                </span>
              )}
            </div>
          ) : (
            <AnimatePresence mode="popLayout">
              {sortedStats.map((item, index) => {
                const displayRank = index + 1;
                const isTop1 = index === 0;
                const isTop2 = index === 1;
                const isTop3 = index === 2;
                const isLast = index === sortedStats.length - 1 && sortedStats.length > 1;

                return (
                  <motion.div
                    key={item.user.id}
                    layout
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ type: 'spring', stiffness: 350, damping: 25 }}
                    className={`grid grid-cols-12 gap-2 p-3 sm:p-4 items-center transition-colors hover:bg-white/10 ${
                      isTop1
                        ? 'glass-dark border-l-4 border-amber-400 bg-amber-500/10'
                        : isTop2
                        ? 'glass-dark border-l-4 border-slate-300'
                        : isTop3
                        ? 'glass-dark border-l-4 border-amber-700'
                        : isLast
                        ? 'glass-dark border-l-4 border-red-500 bg-red-500/10'
                        : ''
                    }`}
                  >
                    {/* Rank Position */}
                    <div className="col-span-2 sm:col-span-1 flex items-center justify-center">
                      {isTop1 ? (
                        <div className="w-8 h-8 rounded-full bg-amber-400 text-slate-950 font-black flex items-center justify-center text-sm shadow-md shadow-amber-500/30">
                          👑
                        </div>
                      ) : isTop2 ? (
                        <div className="w-8 h-8 rounded-full bg-slate-300 text-slate-950 font-black flex items-center justify-center text-sm shadow-md">
                          2º
                        </div>
                      ) : isTop3 ? (
                        <div className="w-8 h-8 rounded-full bg-amber-700 text-white font-black flex items-center justify-center text-sm shadow-md">
                          3º
                        </div>
                      ) : isLast ? (
                        <div className="w-8 h-8 rounded-full bg-red-950 border border-red-500 text-red-300 font-black flex items-center justify-center text-xs shadow-md">
                          💩
                        </div>
                      ) : (
                        <span className="font-extrabold text-slate-400 text-sm">{displayRank}º</span>
                      )}
                    </div>

                    {/* Player Info: Nome & Título Sempre Visíveis */}
                    <div className="col-span-4 sm:col-span-4 flex items-center space-x-2 sm:space-x-2.5 overflow-hidden">
                      <BilliardBallAvatar
                        number={item.user.avatarBall}
                        color={item.user.avatarColor}
                        size="md"
                        showCrown={isTop1}
                      />
                      <div className="overflow-hidden">
                        <div className="font-extrabold text-slate-100 text-xs sm:text-sm truncate flex items-center space-x-1.5">
                          <span className={isTop1 ? 'text-amber-300 font-black' : isLast ? 'text-red-300 font-bold' : ''}>
                            {item.user.nickname}
                          </span>
                          {currentUserId === item.user.id && (
                            <span className="bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-[9px] px-1.5 py-0.2 rounded-full font-black uppercase">
                              Você
                            </span>
                          )}
                          {currentUserId === item.user.id && onOpenEditProfile && (
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                onOpenEditProfile();
                              }}
                              className="text-amber-400 hover:text-amber-200 p-0.5 rounded hover:bg-white/10"
                              title="Alterar seu ícone, nome e título"
                            >
                              <Edit3 className="w-3 h-3" />
                            </button>
                          )}
                        </div>

                        {/* Always Displayed Player Title */}
                        <div className="flex flex-wrap items-center gap-1 mt-0.5 text-[9px] sm:text-[10px]">
                          <span className="bg-amber-400/20 text-amber-300 px-1.5 py-0.5 rounded font-extrabold border border-amber-400/30 truncate max-w-[100px] xs:max-w-[140px] sm:max-w-[200px]">
                            {getPlayerTitle(item.user, item, sortedStats.length)}
                          </span>

                          {item.lambretasCount > 0 && (
                            <span className="bg-amber-500/20 text-amber-300 px-1 py-0.5 rounded font-semibold flex items-center space-x-0.5 border border-amber-500/30 shrink-0">
                              <span>🚗</span>
                              <span>{item.lambretasCount}</span>
                            </span>
                          )}

                          {item.streak.type === 'win' && item.streak.count >= 2 && (
                            <span className="bg-orange-500/20 text-orange-400 px-1 py-0.5 rounded font-bold flex items-center space-x-0.5 border border-orange-500/30 shrink-0">
                              <Flame className="w-2.5 h-2.5 fill-orange-400" />
                              <span>{item.streak.count}V</span>
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Wins / Losses / Rate */}
                    <div className="col-span-3 sm:col-span-3 text-center">
                      <div className="font-bold text-slate-100 text-xs sm:text-sm whitespace-nowrap">
                        <span className="text-emerald-400 font-extrabold">{item.wins}V</span> - <span className="text-red-400 font-extrabold">{item.losses}D</span>
                      </div>
                      <div className="text-[9px] sm:text-[10px] text-emerald-300 font-medium truncate">
                        {item.winRate}% ({item.matchesPlayed} {item.matchesPlayed === 1 ? 'jogo' : 'jogos'})
                      </div>
                    </div>

                    {/* Score / Weighted Output */}
                    <div className="col-span-3 sm:col-span-4 text-right">
                      {filter === 'weighted' ? (
                        <div>
                          <div className="font-black text-amber-300 text-xs sm:text-base whitespace-nowrap flex items-center justify-end space-x-1">
                            <span className="text-emerald-400 text-xs font-semibold">Índice:</span>
                            <span>{item.weightedAverage}</span>
                          </div>
                          <div className="text-[9px] sm:text-[10px] text-slate-300 font-medium">
                            {item.pointsPerGame} pts/j • {item.points} pts totais
                          </div>
                        </div>
                      ) : (
                        <div>
                          <div className="font-black text-amber-300 text-xs sm:text-base whitespace-nowrap">
                            {item.points} pts
                          </div>
                          <div className="text-[9px] sm:text-[10px] text-emerald-400 font-medium hidden sm:block">
                            ({item.pointsPerGame} pts/jogo • {item.lambretasCount > 0 ? `${item.lambretasCount} lambretas` : '1pt/vitória'})
                          </div>
                        </div>
                      )}
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          )}
        </div>
      </div>

      {/* Unranked Section (Players with 0 games) */}
      {unrankedPlayers.length > 0 && (
        <div className="glass-dark rounded-2xl p-4 border border-white/10 text-xs text-slate-300">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Users className="w-4 h-4 text-amber-400" />
              <span className="font-bold text-slate-200">
                Jogadores Cadastrados Sem Jogos ({unrankedPlayers.length})
              </span>
              <span className="text-[10px] text-amber-300/80 bg-amber-400/10 px-2 py-0.5 rounded-full border border-amber-400/20">
                Aguardando 1º confronto
              </span>
            </div>
            <button
              onClick={() => setShowUnranked(!showUnranked)}
              className="text-amber-400 font-semibold hover:underline text-xs"
            >
              {showUnranked ? 'Ocultar' : 'Ver Jogadores'}
            </button>
          </div>

          {showUnranked && (
            <div className="mt-3 pt-3 border-t border-white/10 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
              {unrankedPlayers.map(u => (
                <div
                  key={u.user.id}
                  className="flex items-center space-x-2 glass p-2 rounded-xl border border-white/10"
                >
                  <BilliardBallAvatar number={u.user.avatarBall} color={u.user.avatarColor} size="sm" />
                  <div className="overflow-hidden text-left">
                    <div className="font-bold text-slate-200 text-xs truncate">{u.user.nickname}</div>
                    <div className="text-[10px] text-emerald-400 font-medium">0 jogos • Sem pontuação</div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};


