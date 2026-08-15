import React from 'react';
import { LogOut, Trophy, PlusCircle, Tv, UserPlus, LogIn, Volume2, VolumeX, History, Edit3, RefreshCw, Cloud } from 'lucide-react';
import { User, AppTab } from '../types';
import { BilliardBallAvatar } from './BilliardBallAvatar';
import { soundFx } from '../lib/audio';
import { getPlayerTitle } from '../lib/storage';

interface NavbarProps {
  activeTab: AppTab;
  setActiveTab: (tab: AppTab) => void;
  currentUser: User | null;
  onOpenLogMatch: () => void;
  onOpenRegister: () => void;
  onOpenLogin: () => void;
  onOpenEditProfile?: () => void;
  onLogout: () => void;
  onOpenDeployment: () => void;
  soundEnabled: boolean;
  setSoundEnabled: (enabled: boolean) => void;
  isSyncing?: boolean;
  onForceSync?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  currentUser,
  onOpenLogMatch,
  onOpenRegister,
  onOpenLogin,
  onOpenEditProfile,
  onLogout,
  onOpenDeployment,
  soundEnabled,
  setSoundEnabled,
  isSyncing = false,
  onForceSync,
}) => {
  const toggleSound = () => {
    const next = !soundEnabled;
    soundFx.enabled = next;
    setSoundEnabled(next);
    if (next) soundFx.playCueHit();
  };

  return (
    <header className="glass sticky top-0 z-30 shadow-2xl backdrop-blur-md text-amber-50 border-b border-white/15">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo Brand */}
          <div className="flex items-center space-x-2 sm:space-x-3 cursor-pointer shrink-0" onClick={() => setActiveTab('leaderboard')}>
            <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-gradient-to-br from-amber-400 to-amber-600 p-0.5 shadow-md flex items-center justify-center shrink-0">
              <div className="w-full h-full bg-emerald-950 rounded-full flex items-center justify-center font-black text-amber-300 text-sm sm:text-lg">
                8
              </div>
            </div>
            <div>
              <div className="flex items-center space-x-1">
                <span className="font-extrabold text-base sm:text-xl tracking-tight text-amber-300 drop-shadow">
                  Placar
                </span>
              </div>
            </div>
          </div>

          {/* Action Center (Primary CTA Buttons) */}
          <div className="flex items-center space-x-1.5 sm:space-x-3 shrink-0">
            {/* Cloud Sync Button */}
            {onForceSync && (
              <button
                onClick={onForceSync}
                disabled={isSyncing}
                className="p-1.5 sm:px-2.5 sm:py-1.5 rounded-xl glass-dark hover:bg-white/10 text-emerald-300 border border-emerald-500/30 transition-all flex items-center space-x-1.5 text-xs font-semibold"
                title="Sincronização em tempo real entre todos os celulares, computadores e telão"
              >
                <RefreshCw className={`w-3.5 h-3.5 text-emerald-400 ${isSyncing ? 'animate-spin' : ''}`} />
                <span className="hidden md:inline text-[11px] text-emerald-300">
                  {isSyncing ? 'Sincronizando...' : 'Nuvem Ao Vivo'}
                </span>
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse hidden sm:inline-block" />
              </button>
            )}

            {/* Log Match CTA */}
            <button
              onClick={onOpenLogMatch}
              className="bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black px-2.5 sm:px-4 py-1.5 sm:py-2 rounded-xl sm:rounded-2xl text-xs sm:text-sm shadow-lg shadow-emerald-950/60 hover:scale-105 transition-all flex items-center space-x-1 sm:space-x-1.5 border border-emerald-300/50"
            >
              <PlusCircle className="w-4 h-4 text-slate-950 shrink-0" />
              <span>Registrar <span className="hidden sm:inline">Resultado</span></span>
            </button>

            {/* Telão / TV Mode Button */}
            <button
              onClick={() => setActiveTab('tv')}
              className={`p-1.5 sm:px-3 sm:py-2 rounded-xl sm:rounded-2xl text-xs sm:text-sm font-semibold flex items-center space-x-1.5 border transition-all ${
                activeTab === 'tv'
                  ? 'bg-amber-400 text-slate-950 border-amber-300 font-bold shadow-md'
                  : 'glass-dark text-amber-300 border-white/10 hover:border-white/25'
              }`}
              title="Modo Telão Público para TV do Bar / Lounge"
            >
              <Tv className="w-4 h-4 text-amber-400 shrink-0" />
              <span className="hidden sm:inline">Modo Telão</span>
            </button>

            {/* Sound Toggle */}
            <button
              onClick={toggleSound}
              className="p-1.5 sm:p-2 rounded-xl sm:rounded-2xl glass-dark hover:bg-white/10 text-amber-300 border border-white/10 transition-colors"
              title={soundEnabled ? 'Efeitos sonoros ativados' : 'Efeitos sonoros desativados'}
            >
              {soundEnabled ? <Volume2 className="w-4 h-4 text-amber-400" /> : <VolumeX className="w-4 h-4 text-slate-400" />}
            </button>

            {/* User Profile / Login */}
            {currentUser ? (
              <div className="flex items-center space-x-1.5 sm:space-x-2 glass-dark pl-1.5 sm:pl-2 pr-1.5 sm:pr-2 py-1 rounded-full border border-white/15 text-xs">
                <BilliardBallAvatar number={currentUser.avatarBall} color={currentUser.avatarColor} size="sm" />
                <div className="hidden md:block text-left">
                  <div className="font-extrabold text-amber-200 truncate max-w-[120px]">{currentUser.nickname}</div>
                  <div className="text-[9px] text-amber-300/80 font-black uppercase tracking-wider truncate max-w-[120px]">
                    {getPlayerTitle(currentUser)}
                  </div>
                </div>
                {onOpenEditProfile && (
                  <button
                    onClick={onOpenEditProfile}
                    className="text-[10px] sm:text-[11px] text-amber-300 hover:text-amber-100 font-extrabold flex items-center space-x-1 bg-amber-400/20 hover:bg-amber-400/30 p-1 sm:px-2 sm:py-0.5 rounded-full border border-amber-400/30 transition-all"
                    title="Editar Saldo Histórico e Perfil"
                  >
                    <Edit3 className="w-3 h-3 text-amber-300" />
                    <span className="hidden sm:inline">Editar Saldo</span>
                  </button>
                )}
                <button
                  onClick={onLogout}
                  className="text-[10px] sm:text-[11px] text-red-400 hover:text-red-200 font-extrabold flex items-center space-x-1 bg-red-500/10 hover:bg-red-500/20 p-1 sm:px-2 sm:py-0.5 rounded-full border border-red-500/30 transition-all"
                  title="Sair do Placar"
                >
                  <LogOut className="w-3 h-3 text-red-400" />
                  <span className="hidden sm:inline">Sair</span>
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-1">
                <button
                  onClick={onOpenLogin}
                  className="px-2 py-1 rounded-xl text-xs font-medium text-emerald-200 hover:text-amber-300 hover:bg-white/10 flex items-center space-x-1"
                >
                  <LogIn className="w-3.5 h-3.5" />
                  <span>Entrar</span>
                </button>
                <button
                  onClick={onOpenRegister}
                  className="px-2 py-1 rounded-xl text-xs font-semibold glass-dark text-amber-200 hover:bg-white/15 flex items-center space-x-1 border border-white/15"
                >
                  <UserPlus className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Cadastrar</span>
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Navigation Tabs Bar */}
        <div className="flex items-center space-x-1 sm:space-x-2 py-2 overflow-x-auto no-scrollbar border-t border-white/10 text-xs sm:text-sm">
          <button
            onClick={() => setActiveTab('leaderboard')}
            className={`px-3 py-1.5 rounded-xl font-medium flex items-center space-x-1.5 transition-all whitespace-nowrap ${
              activeTab === 'leaderboard'
                ? 'bg-amber-400 text-slate-950 font-bold shadow'
                : 'text-emerald-200 hover:bg-white/10 hover:text-amber-300'
            }`}
          >
            <Trophy className="w-4 h-4" />
            <span>Ranking & Destaques</span>
          </button>

          <button
            onClick={() => setActiveTab('matches')}
            className={`px-3 py-1.5 rounded-xl font-medium flex items-center space-x-1.5 transition-all whitespace-nowrap ${
              activeTab === 'matches'
                ? 'bg-amber-400 text-slate-950 font-bold shadow'
                : 'text-emerald-200 hover:bg-white/10 hover:text-amber-300'
            }`}
          >
            <History className="w-4 h-4" />
            <span>Histórico de Partidas</span>
          </button>
        </div>
      </div>
    </header>
  );
};

