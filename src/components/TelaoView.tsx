import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Tv, Trophy, Flame, QrCode, ArrowLeft, Crown } from 'lucide-react';
import { PlayerStats, Match } from '../types';
import { BilliardBallAvatar } from './BilliardBallAvatar';
import { getPlayerTitle } from '../lib/storage';

interface TelaoViewProps {
  stats: PlayerStats[];
  matches: Match[];
  onExit: () => void;
}

export const TelaoView: React.FC<TelaoViewProps> = ({ stats, matches, onExit }) => {
  const [showQrModal, setShowQrModal] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());

  // Clock ticker for big screen
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // REGRA: Apenas jogadores com partidas entram no ranking do telão
  const rankedStats = stats.filter(s => s.matchesPlayed > 0);
  const topPlayer = rankedStats.length > 0 ? rankedStats[0] : null;
  const lastPlayer = rankedStats.length > 1 ? rankedStats[rankedStats.length - 1] : null;
  const recentMatches = matches.slice(0, 5);

  const appUrl = typeof window !== 'undefined' ? window.location.href : 'https://ais-dev-7cpdpxrt63chckicc35vbm-714465855824.us-east1.run.app';

  return (
    <div className="min-h-screen table-gradient text-slate-100 flex flex-col justify-between font-sans relative overflow-hidden select-none p-4 sm:p-8">
      {/* Background Pool Felt & Lighting */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_20%,rgba(16,185,129,0.25)_0,rgba(2,44,34,0.95)_60%,#020617_100%)] pointer-events-none" />

      {/* Top Header Bar for TV */}
      <div className="relative z-10 flex items-center justify-between glass p-4 rounded-3xl border border-white/15 shadow-2xl mb-6">
        <div className="flex items-center space-x-3">
          <button
            onClick={onExit}
            className="p-2.5 rounded-2xl glass-dark hover:bg-white/10 text-amber-300 border border-white/10 transition-all flex items-center space-x-2 text-xs font-bold"
            title="Sair do Modo Telão"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="hidden sm:inline">Voltar pro App</span>
          </button>

          <div className="flex items-center space-x-2">
            <div className="w-10 h-10 rounded-full bg-amber-400 text-slate-950 font-black text-xl flex items-center justify-center shadow-lg shadow-amber-500/40 border-2 border-amber-200">
              8
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl font-black text-amber-300 tracking-tight flex items-center space-x-2">
                <span>PLACAR</span>
                <span className="bg-amber-400 text-slate-950 text-xs px-2 py-0.5 rounded-full font-black uppercase">
                  MODO TELÃO
                </span>
              </h1>
              <p className="text-xs text-emerald-300 font-semibold">Placar Oficial do Bar & Amigos</p>
            </div>
          </div>
        </div>

        {/* Live Clock & QR Share Button */}
        <div className="flex items-center space-x-3">
          <div className="text-right hidden sm:block">
            <div className="text-lg font-black text-amber-200 font-mono tracking-widest">
              {currentTime.toLocaleTimeString('pt-BR')}
            </div>
            <div className="text-[10px] text-emerald-400 uppercase font-bold">Ao Vivo</div>
          </div>

          <button
            onClick={() => setShowQrModal(true)}
            className="bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-extrabold px-3.5 py-2.5 rounded-2xl shadow-lg flex items-center space-x-2 text-xs sm:text-sm border border-emerald-300/50"
          >
            <QrCode className="w-4 h-4 text-slate-950" />
            <span className="hidden sm:inline">QR Code Mobile</span>
          </button>
        </div>
      </div>

      {/* Main Content Layout */}
      <div className="relative z-10 flex-1 flex flex-col gap-6">
        {/* Top Row: Equal Highlight Cards for Líder Supremo (1st) and Prego/Reco-Reco (Last) SIDE-BY-SIDE */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Top Player (King / Líder Supremo) */}
          {topPlayer && (
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="glass rounded-[32px] p-6 border-2 border-amber-400 shadow-2xl text-center relative overflow-hidden flex flex-col justify-between lambreta-glow"
            >
              {/* Floating Crown / Sparkle Badge */}
              <motion.div
                animate={{ y: [0, -6, 0], rotate: [-2, 2, -2] }}
                transition={{ repeat: Infinity, duration: 2.5, ease: "easeInOut" }}
                className="absolute top-3 right-3 z-20"
              >
                <span className="bg-gradient-to-r from-amber-400 via-amber-300 to-yellow-400 text-slate-950 text-[11px] font-black uppercase px-3 py-1 rounded-full shadow-lg flex items-center space-x-1 border border-amber-200 tracking-wider">
                  <Crown className="w-3.5 h-3.5" />
                  <span>👑 LÍDER SUPREMO</span>
                </span>
              </motion.div>

              {/* Sparkle ambient background element */}
              <div className="absolute top-0 right-0 w-48 h-48 bg-amber-400/20 rounded-full blur-3xl pointer-events-none" />

              <div className="my-2 relative">
                {/* Animated Crown Bobbing on Avatar */}
                <motion.div
                  animate={{ y: [0, -8, 0], scale: [1, 1.05, 1] }}
                  transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
                  className="inline-block relative my-2"
                >
                  {/* Shiny Golden Aura Ring */}
                  <motion.div
                    animate={{ scale: [1, 1.15, 1], opacity: [0.3, 0.7, 0.3] }}
                    transition={{ repeat: Infinity, duration: 1.8 }}
                    className="absolute inset-0 bg-amber-400/30 rounded-full blur-md"
                  />
                  <BilliardBallAvatar
                    number={topPlayer.user.avatarBall}
                    color={topPlayer.user.avatarColor}
                    size="xl"
                    showCrown={true}
                  />
                  {/* Floating Sparkles */}
                  <motion.span
                    animate={{ scale: [0, 1.2, 0], opacity: [0, 1, 0], rotate: [0, 180] }}
                    transition={{ repeat: Infinity, duration: 1.5, delay: 0.2 }}
                    className="absolute -top-3 -right-3 text-2xl"
                  >
                    ✨
                  </motion.span>
                  <motion.span
                    animate={{ scale: [0, 1.2, 0], opacity: [0, 1, 0], rotate: [0, -180] }}
                    transition={{ repeat: Infinity, duration: 1.5, delay: 0.8 }}
                    className="absolute -bottom-2 -left-3 text-2xl"
                  >
                    ⭐
                  </motion.span>
                </motion.div>

                <motion.h2
                  animate={{ scale: [1, 1.02, 1] }}
                  transition={{ repeat: Infinity, duration: 3 }}
                  className="text-2xl sm:text-3xl font-black text-amber-300 mt-1"
                >
                  {topPlayer.user.nickname}
                </motion.h2>
                <p className="text-xs text-amber-200 font-extrabold uppercase tracking-widest mt-0.5 bg-amber-400/20 px-3 py-1 rounded-full border border-amber-400/30 inline-block">
                  {getPlayerTitle(topPlayer.user, topPlayer, stats.length)}
                </p>
              </div>

              {/* Stats Overview Grid */}
              <div className="grid grid-cols-2 gap-2 glass-dark p-3.5 rounded-2xl border border-amber-400/40 text-center my-2">
                <div>
                  <span className="text-[10px] text-slate-400 uppercase font-bold block">Pontuação</span>
                  <span className="text-xl font-black text-amber-300">{topPlayer.points} PTS</span>
                </div>

                <div>
                  <span className="text-[10px] text-slate-400 uppercase font-bold block">Vitórias / Jogos</span>
                  <span className="text-xl font-black text-emerald-400">{topPlayer.wins}V / {topPlayer.matchesPlayed}J</span>
                </div>
              </div>

              <div className="text-[11px] text-amber-200/90 font-bold bg-amber-500/10 py-1.5 px-3 rounded-xl border border-amber-500/20 italic">
                "Mandando na mesa e no bar com autoridade!" 🏆
              </div>
            </motion.div>
          )}

          {/* Last Player (Prego / Reco-Reco) - Equal Size & Visual Weight */}
          {lastPlayer && (
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="glass-dark rounded-[32px] p-6 border-2 border-red-500/80 shadow-2xl text-center relative overflow-hidden flex flex-col justify-between bg-gradient-to-b from-red-950/60 via-slate-950 to-slate-950"
            >
              {/* Funny Trembling Badge */}
              <motion.div
                animate={{ x: [-2, 2, -2, 2, 0], y: [-1, 1, -1, 1, 0] }}
                transition={{ repeat: Infinity, duration: 0.6, ease: "linear" }}
                className="absolute top-3 right-3 z-20"
              >
                <span className="bg-gradient-to-r from-red-600 via-red-500 to-orange-600 text-white text-[11px] font-black uppercase px-3 py-1 rounded-full shadow-lg flex items-center space-x-1 border border-red-400 tracking-wider">
                  <motion.span
                    animate={{ rotate: [-20, 20, -20] }}
                    transition={{ repeat: Infinity, duration: 0.4 }}
                  >
                    🔨
                  </motion.span>
                  <span>💩 PREGO / RECO-RECO</span>
                </span>
              </motion.div>

              {/* Danger red ambient background glow */}
              <div className="absolute top-0 left-0 w-48 h-48 bg-red-600/20 rounded-full blur-3xl pointer-events-none" />

              <div className="my-2 relative">
                {/* Animated Trembling Ball with Poop & Crying Emojis */}
                <motion.div
                  animate={{
                    x: [-3, 3, -3, 3, -2, 2, 0],
                    rotate: [-4, 4, -4, 4, 0]
                  }}
                  transition={{ repeat: Infinity, duration: 1.2, ease: "easeInOut" }}
                  className="inline-block relative my-2"
                >
                  {/* Pulsing Red Hazard Aura */}
                  <motion.div
                    animate={{ scale: [1, 1.12, 1], opacity: [0.3, 0.8, 0.3] }}
                    transition={{ repeat: Infinity, duration: 1 }}
                    className="absolute inset-0 bg-red-600/40 rounded-full blur-md"
                  />

                  <BilliardBallAvatar
                    number={lastPlayer.user.avatarBall}
                    color={lastPlayer.user.avatarColor}
                    size="xl"
                  />

                  {/* Floating Poop & Crying Emojis */}
                  <motion.span
                    animate={{ y: [0, -10, 0], rotate: [0, 360] }}
                    transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
                    className="absolute -top-3 -right-3 text-2xl"
                  >
                    💩
                  </motion.span>
                  <motion.span
                    animate={{ y: [0, 8, 0], x: [-3, 3, -3] }}
                    transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
                    className="absolute -bottom-2 -left-3 text-2xl"
                  >
                    😭
                  </motion.span>
                </motion.div>

                <motion.h2
                  animate={{ x: [-1, 1, -1] }}
                  transition={{ repeat: Infinity, duration: 0.5 }}
                  className="text-2xl sm:text-3xl font-black text-red-300 mt-1"
                >
                  {lastPlayer.user.nickname}
                </motion.h2>
                <p className="text-xs text-amber-300 font-extrabold uppercase tracking-widest mt-0.5 bg-amber-400/20 px-3 py-1 rounded-full border border-amber-400/30 inline-block">
                  {getPlayerTitle(lastPlayer.user, lastPlayer, stats.length)}
                </p>
              </div>

              {/* Stats Overview Grid */}
              <div className="grid grid-cols-2 gap-2 glass-dark p-3.5 rounded-2xl border border-red-500/40 text-center my-2">
                <div>
                  <span className="text-[10px] text-slate-400 uppercase font-bold block">Pontuação</span>
                  <span className="text-xl font-black text-amber-300">{lastPlayer.points} PTS</span>
                </div>

                <div>
                  <span className="text-[10px] text-slate-400 uppercase font-bold block">Derrotas / Jogos</span>
                  <span className="text-xl font-black text-red-400">{lastPlayer.losses}D / {lastPlayer.matchesPlayed}J</span>
                </div>
              </div>

              <div className="text-[11px] text-red-300/90 font-bold bg-red-500/10 py-1.5 px-3 rounded-xl border border-red-500/20 italic">
                "Precisando urgente de aulas de tacada no bar!" 🔨
              </div>
            </motion.div>
          )}
        </div>

        {/* Bottom Row: Full-Width Leaderboard Table for TV */}
        <div className="glass rounded-[32px] border border-white/15 shadow-2xl overflow-hidden w-full">
          <div className="p-4 glass-dark border-b border-white/10 flex items-center justify-between">
            <h3 className="font-black text-base sm:text-lg text-amber-300 flex items-center space-x-2">
              <Trophy className="w-5 h-5 text-amber-400" />
              <span>CLASSIFICAÇÃO GERAL DE SINUCA</span>
            </h3>
            <span className="text-xs text-emerald-400 font-mono font-bold">ATUALIZAÇÃO EM TEMPO REAL</span>
          </div>

          <div className="divide-y divide-white/5">
            {rankedStats.length === 0 ? (
              <div className="p-8 text-center text-slate-300 text-sm">
                Nenhum jogador possui partidas registradas no momento.
              </div>
            ) : (
              <AnimatePresence mode="popLayout">
                {rankedStats.map((item, idx) => {
                  const isTop1 = item.rank === 1;
                  const isTop2 = item.rank === 2;
                  const isTop3 = item.rank === 3;
                  const isLast = item.rank === rankedStats.length && rankedStats.length > 1;

                  return (
                    <motion.div
                      key={item.user.id}
                      layout
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, scale: 0.9 }}
                      transition={{ type: 'spring', stiffness: 300, damping: 25 }}
                      className={`flex items-center justify-between p-3.5 sm:p-4 transition-colors ${
                        isTop1
                          ? 'glass-dark border-l-8 border-amber-400 bg-amber-500/5'
                          : isTop2
                          ? 'glass-dark border-l-8 border-slate-300'
                          : isTop3
                          ? 'glass-dark border-l-8 border-amber-700'
                          : isLast
                          ? 'glass-dark border-l-8 border-red-500 bg-red-500/10'
                          : 'hover:bg-white/10'
                      }`}
                    >
                      {/* Rank & Player */}
                      <div className="flex items-center space-x-4">
                        <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full flex items-center justify-center font-black text-base sm:text-lg shadow">
                          {isTop1 ? (
                            <span className="bg-amber-400 text-slate-950 w-full h-full rounded-full flex items-center justify-center">👑</span>
                          ) : isTop2 ? (
                            <span className="bg-slate-300 text-slate-950 w-full h-full rounded-full flex items-center justify-center">2º</span>
                          ) : isTop3 ? (
                            <span className="bg-amber-700 text-white w-full h-full rounded-full flex items-center justify-center">3º</span>
                          ) : isLast ? (
                            <span className="bg-red-950 text-red-300 border border-red-500 w-full h-full rounded-full flex items-center justify-center">💩</span>
                          ) : (
                            <span className="text-slate-400">{item.rank}º</span>
                          )}
                        </div>

                        <BilliardBallAvatar
                          number={item.user.avatarBall}
                          color={item.user.avatarColor}
                          size="md"
                        />

                        <div>
                          <div className="font-extrabold text-sm sm:text-lg text-slate-100 flex flex-wrap items-center gap-1.5">
                            <span className={isTop1 ? 'text-amber-300 font-black' : isLast ? 'text-red-300 font-bold' : ''}>
                              {item.user.nickname}
                            </span>
                            <span className="text-[10px] sm:text-xs bg-amber-400/20 text-amber-300 px-2 py-0.5 rounded-full font-extrabold border border-amber-400/30">
                              {getPlayerTitle(item.user, item, rankedStats.length)}
                            </span>
                            {item.lambretasCount > 0 && (
                              <span className="bg-amber-500/20 text-amber-300 text-[10px] sm:text-xs px-2 py-0.5 rounded-full font-bold">
                                🚗 {item.lambretasCount}
                              </span>
                            )}
                          </div>

                          <div className="text-xs text-emerald-400 font-semibold mt-0.5">
                            {item.wins}V / {item.losses}D ({item.winRate}% aproveitamento) • {item.pointsPerGame} pts/j
                          </div>
                        </div>
                      </div>

                      {/* Score */}
                      <div className="text-right">
                        <div className="text-lg sm:text-2xl font-black text-amber-300">{item.points} PTS</div>
                        <div className="text-[10px] text-emerald-300 font-semibold">Média Pond: {item.weightedAverage}</div>
                      </div>
                    </motion.div>
                  );
                })}
              </AnimatePresence>
            )}
          </div>
        </div>
      </div>

      {/* Bottom Rolling Ticker: Latest Matches ("Últimas Tacadas") */}
      <div className="relative z-10 bg-slate-950/90 border-t-2 border-amber-500/50 mt-6 pt-3 pb-2 px-4 rounded-2xl overflow-hidden flex items-center">
        <div className="bg-amber-400 text-slate-950 font-black text-xs px-3 py-1 rounded-xl uppercase tracking-wider shrink-0 mr-3 shadow">
          Últimas Tacadas
        </div>

        <div className="overflow-x-auto flex items-center space-x-4 no-scrollbar text-xs">
          {recentMatches.map(m => {
            const winnerUser = stats.find(s => s.user.id === m.winnerId)?.user;
            const loserUser = stats.find(s => s.user.id === m.loserId)?.user;
            const winner = winnerUser ? `${winnerUser.nickname} (${getPlayerTitle(winnerUser)})` : 'Vencedor';
            const loser = loserUser ? `${loserUser.nickname} (${getPlayerTitle(loserUser)})` : 'Perdedor';

            return (
              <div
                key={m.id}
                className="bg-slate-900 px-3 py-1.5 rounded-xl border border-emerald-800/80 shrink-0 flex items-center space-x-2 text-slate-200"
              >
                <span className="font-bold text-amber-300">{winner}</span>
                <span className="text-emerald-400 font-bold">venceu</span>
                <span className="font-bold text-slate-300">{loser}</span>
                {m.isLambreta && (
                  <span className="bg-amber-500/20 text-amber-300 font-bold px-1.5 py-0.5 rounded text-[10px]">
                    🚗 Lambreta
                  </span>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* QR Code Modal for Mobile Scan */}
      {showQrModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/90 backdrop-blur-md animate-fadeIn">
          <div className="bg-slate-900 border-2 border-amber-400 rounded-3xl p-6 text-center max-w-sm w-full shadow-2xl relative">
            <button
              onClick={() => setShowQrModal(false)}
              className="absolute top-3 right-3 text-slate-400 hover:text-white text-sm font-bold p-1"
            >
              ✕
            </button>

            <div className="p-3 bg-amber-400/20 text-amber-300 rounded-2xl inline-block mb-3">
              <QrCode className="w-8 h-8" />
            </div>

            <h3 className="text-xl font-black text-amber-300 mb-1">Acesse no Celular</h3>
            <p className="text-xs text-emerald-300 mb-4">
              Escaneie o código abaixo com a câmera do celular para entrar e cadastrar partidas!
            </p>

            {/* Pure SVG QR Code representation */}
            <div className="p-4 bg-white rounded-2xl inline-block shadow-inner mb-4">
              <img
                src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(
                  appUrl
                )}`}
                alt="QR Code Mobile"
                className="w-48 h-48 mx-auto"
              />
            </div>

            <div className="text-[11px] text-slate-400 font-mono break-all bg-slate-950 p-2 rounded-xl border border-slate-800">
              {appUrl}
            </div>

            <button
              onClick={() => setShowQrModal(false)}
              className="w-full mt-4 bg-amber-400 text-slate-950 font-black py-2.5 rounded-xl uppercase tracking-wider text-xs shadow-lg"
            >
              Fechar
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

