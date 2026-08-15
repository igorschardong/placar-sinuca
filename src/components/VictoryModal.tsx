import React, { useEffect } from 'react';
import confetti from 'canvas-confetti';
import { Trophy, Sparkles, CheckCircle } from 'lucide-react';
import { Match, User } from '../types';
import { BilliardBallAvatar } from './BilliardBallAvatar';
import { soundFx } from '../lib/audio';
import { getPlayerTitle } from '../lib/storage';

interface VictoryModalProps {
  match: Match | null;
  users: User[];
  onClose: () => void;
}

const VICTORY_BANTERS = [
  'MANDOU O ADVERSÁRIO PRO BOLSO SEM DÓ!',
  'FOI UMA AULA DE SINUCA! TACADA DE MESTRE!',
  'PASSOU O RODO NA MESA! OITAVA BOLA MATADORA!',
  'EFEITO PERFEITO, CAÇAPA CERTEIRA!',
  'O REI DA MESA MOSTROU QUEM MANDA NO BAR!',
  'MAIS UMA VITÓRIA PRA CONTA DO CAMPEÃO!'
];

const LAMBRETA_BANTERS = [
  '🚗💨 LEVOU DE LAMBRETA! NEM VIU A COR DA BOLA!',
  'CAPOTE TOTAL! DEIXOU O ADVERSÁRIO A VER NAVIOS!',
  'LAVADA HISTÓRICA! +3 PONTOS NO RANKING (EQUIVALE A 3 VITÓRIAS)!'
];

export const VictoryModal: React.FC<VictoryModalProps> = ({ match, users, onClose }) => {
  useEffect(() => {
    if (match) {
      // Trigger sounds
      soundFx.playBallPocket();
      setTimeout(() => soundFx.playVictoryFanfare(), 200);
      if (match.isLambreta) {
        setTimeout(() => soundFx.playLambretaSound(), 600);
      }

      // Trigger Confetti Burst
      try {
        confetti({
          particleCount: 100,
          spread: 80,
          origin: { y: 0.6 },
          colors: ['#f59e0b', '#10b981', '#3b82f6', '#ef4444'],
        });

        if (match.isLambreta) {
          setTimeout(() => {
            confetti({
              particleCount: 80,
              angle: 60,
              spread: 55,
              origin: { x: 0 },
            });
            confetti({
              particleCount: 80,
              angle: 120,
              spread: 55,
              origin: { x: 1 },
            });
          }, 300);
        }
      } catch (e) {
        console.log('Confetti error:', e);
      }
    }
  }, [match]);

  if (!match) return null;

  const winner = users.find(u => u.id === match.winnerId);
  const loser = users.find(u => u.id === match.loserId);

  const banterList = match.isLambreta ? LAMBRETA_BANTERS : VICTORY_BANTERS;
  const banter = banterList[Math.floor(Math.random() * banterList.length)];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fadeIn">
      <div className="glass-modal text-slate-100 rounded-[32px] border-2 border-amber-400 max-w-md w-full p-6 shadow-2xl relative text-center overflow-hidden animate-scaleUp lambreta-glow">
        {/* Animated Background Rays */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(245,158,11,0.15)_0,transparent_70%)] pointer-events-none" />

        {/* Floating Crown / Trophy */}
        <div className="relative z-10 my-2">
          <div className="inline-flex p-4 bg-emerald-500 rounded-full shadow-xl ring-8 ring-amber-400/20 animate-bounce">
            <Trophy className="w-12 h-12 text-slate-950" />
          </div>
        </div>

        {/* Title */}
        <div className="relative z-10 mt-2">
          <span className="bg-amber-500/20 text-amber-300 text-xs font-black uppercase tracking-widest px-3 py-1 rounded-full border border-amber-400/40">
            {match.isLambreta ? '🚗💨 VITÓRIA COM LAMBRETA!' : '👑 VITÓRIA NA MESA!'}
          </span>

          <h2 className="text-2xl sm:text-3xl font-black text-amber-300 mt-2 drop-shadow-md">
            {winner?.nickname || 'Vencedor'} VENCEU!
          </h2>

          <p className="text-emerald-300 font-extrabold text-xs sm:text-sm mt-1 uppercase tracking-wide">
            "{banter}"
          </p>
        </div>

        {/* Match Result Breakdown Card */}
        <div className="relative z-10 glass-dark my-5 p-4 rounded-2xl border border-white/10 text-left space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-white/10">
            <div className="flex items-center space-x-2">
              <BilliardBallAvatar number={winner?.avatarBall || 8} color={winner?.avatarColor} size="sm" />
              <div>
                <div className="font-extrabold text-amber-300 text-xs">{winner?.nickname}</div>
                <div className="text-[10px] text-amber-200/90 font-bold">{winner ? getPlayerTitle(winner) : ''}</div>
              </div>
            </div>
            <div className="text-right">
              <span className="text-emerald-400 font-black text-sm">
                {match.isLambreta ? 'VENCEU (+3 PTS)' : 'VENCEU (+1 PT)'}
              </span>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <BilliardBallAvatar number={loser?.avatarBall || 1} color={loser?.avatarColor} size="sm" />
              <div>
                <div className="font-bold text-slate-300 text-xs">{loser?.nickname}</div>
                <div className="text-[10px] text-amber-200/80 font-bold">{loser ? getPlayerTitle(loser) : ''}</div>
              </div>
            </div>
            <div className="text-right">
              <span className="text-red-400 font-bold text-xs">DERROTA (0 PT)</span>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="relative z-10 flex items-center space-x-3">
          <button
            onClick={() => {
              soundFx.playVictoryFanfare();
              try {
                confetti({ particleCount: 50, spread: 60 });
              } catch (e) {}
            }}
            className="p-3 rounded-xl glass-dark hover:bg-white/10 text-amber-300 border border-white/15 transition-colors flex items-center justify-center"
            title="Tocar Comemoração Novamente"
          >
            <Sparkles className="w-5 h-5" />
          </button>

          <button
            onClick={onClose}
            className="flex-1 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black py-3 rounded-xl shadow-xl text-sm uppercase tracking-wider flex items-center justify-center space-x-2 border border-emerald-300/50"
          >
            <CheckCircle className="w-5 h-5 text-slate-950" />
            <span>Ver Ranking Atualizado</span>
          </button>
        </div>
      </div>
    </div>
  );
};

