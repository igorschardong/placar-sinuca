import React, { useState, useEffect } from 'react';
import { AppTab, User, Match, PlayerStats } from './types';
import {
  getUsers,
  getMatches,
  getCurrentUserId,
  setCurrentUserId,
  calculatePlayerStats,
  subscribeToUsers,
  subscribeToMatches,
} from './lib/storage';
import { testFirebaseConnection } from './lib/firebase';
import { Navbar } from './components/Navbar';
import { Leaderboard } from './components/Leaderboard';
import { MatchHistory } from './components/MatchHistory';
import { TelaoView } from './components/TelaoView';
import { LogMatchModal } from './components/LogMatchModal';
import { RegisterPlayerModal } from './components/RegisterPlayerModal';
import { LoginModal } from './components/LoginModal';
import { LoginScreen } from './components/LoginScreen';
import { EditPlayerModal } from './components/EditPlayerModal';
import { VictoryModal } from './components/VictoryModal';
import { DeploymentGuideModal } from './components/DeploymentGuideModal';

export default function App() {
  const [activeTab, setActiveTab] = useState<AppTab>('leaderboard');
  const [users, setUsers] = useState<User[]>([]);
  const [matches, setMatches] = useState<Match[]>([]);
  const [currentUserId, setCurrentUserIdState] = useState<string | null>(null);

  // Modals state
  const [isLogMatchOpen, setIsLogMatchOpen] = useState(false);
  const [isRegisterOpen, setIsRegisterOpen] = useState(false);
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isEditProfileOpen, setIsEditProfileOpen] = useState(false);
  const [isDeploymentOpen, setIsDeploymentOpen] = useState(false);
  const [lastMatchLogged, setLastMatchLogged] = useState<Match | null>(null);
  const [soundEnabled, setSoundEnabled] = useState(true);

  // Refresh data from storage
  const reloadData = () => {
    const uList = getUsers();
    const mList = getMatches();
    const cId = getCurrentUserId();
    setUsers(uList);
    setMatches(mList);
    setCurrentUserIdState(cId);
  };

  useEffect(() => {
    reloadData();
    testFirebaseConnection();

    // Subscribe to real-time Firestore updates
    const unsubscribeUsers = subscribeToUsers((updatedUsers) => {
      setUsers(updatedUsers);
    });
    const unsubscribeMatches = subscribeToMatches((updatedMatches) => {
      setMatches(updatedMatches);
    });

    return () => {
      unsubscribeUsers();
      unsubscribeMatches();
    };
  }, []);

  const currentUser = users.find(u => u.id === currentUserId) || null;
  const playerStats: PlayerStats[] = calculatePlayerStats(users, matches);

  const handleMatchLogged = (newMatch: Match) => {
    reloadData();
    setLastMatchLogged(newMatch); // Triggers celebration VictoryModal!
  };

  const handleUserRegistered = (newUser: User) => {
    setCurrentUserId(newUser.id);
    reloadData();
  };

  const handleUserLoggedIn = (user: User) => {
    reloadData();
  };

  const handleLogout = () => {
    setCurrentUserId(null);
    reloadData();
  };

  // If Fullscreen TV / Telão View is selected (PUBLIC)
  if (activeTab === 'tv') {
    return (
      <TelaoView
        stats={playerStats}
        matches={matches}
        onExit={() => setActiveTab('leaderboard')}
      />
    );
  }

  // If User is not logged in, show Login Screen (Restricted Access)
  if (!currentUser) {
    return (
      <>
        <LoginScreen
          onUserLoggedIn={handleUserLoggedIn}
          onOpenRegister={() => setIsRegisterOpen(true)}
          onOpenTelao={() => setActiveTab('tv')}
        />

        <RegisterPlayerModal
          isOpen={isRegisterOpen}
          onClose={() => setIsRegisterOpen(false)}
          onUserRegistered={handleUserRegistered}
        />
      </>
    );
  }

  return (
    <div className="min-h-screen table-gradient text-slate-100 flex flex-col font-sans selection:bg-amber-400 selection:text-slate-950 max-w-[100vw] overflow-x-hidden">
      {/* Background Pool Felt Ambient Lighting */}
      <div className="fixed inset-0 bg-[radial-gradient(circle_at_center,rgba(6,95,70,0.4)_0%,rgba(6,78,59,0.7)_60%,rgba(2,44,34,0.95)_100%)] pointer-events-none z-0" />

      {/* Top Navbar */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        currentUser={currentUser}
        onOpenLogMatch={() => setIsLogMatchOpen(true)}
        onOpenRegister={() => setIsRegisterOpen(true)}
        onOpenLogin={() => setIsLoginOpen(true)}
        onOpenEditProfile={() => setIsEditProfileOpen(true)}
        onLogout={handleLogout}
        onOpenDeployment={() => setIsDeploymentOpen(true)}
        soundEnabled={soundEnabled}
        setSoundEnabled={setSoundEnabled}
      />

      {/* Main Body */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-3 sm:px-6 lg:px-8 py-6 relative z-10">
        {activeTab === 'leaderboard' && (
          <Leaderboard
            stats={playerStats}
            onOpenLogMatch={() => setIsLogMatchOpen(true)}
            onOpenRegister={() => setIsRegisterOpen(true)}
          />
        )}

        {activeTab === 'matches' && (
          <MatchHistory
            matches={matches}
            users={users}
            onMatchesUpdated={reloadData}
            onOpenLogMatch={() => setIsLogMatchOpen(true)}
          />
        )}
      </main>

      {/* Footer */}
      <footer className="glass border-t border-white/10 text-emerald-300/80 text-xs py-4 px-4 text-center relative z-10 backdrop-blur-md">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
          <div className="flex items-center space-x-1 font-bold">
            <span className="text-amber-300">Placar</span>
          </div>

          <div className="flex items-center space-x-4 text-[11px]">
            <button
              onClick={() => setActiveTab('tv')}
              className="text-amber-300 font-bold hover:underline flex items-center space-x-1"
            >
              <span>📺 Abrir Telão</span>
            </button>
          </div>
        </div>
      </footer>

      {/* Modals */}
      <LogMatchModal
        isOpen={isLogMatchOpen}
        onClose={() => setIsLogMatchOpen(false)}
        onMatchLogged={handleMatchLogged}
        currentUser={currentUser}
      />

      <RegisterPlayerModal
        isOpen={isRegisterOpen}
        onClose={() => setIsRegisterOpen(false)}
        onUserRegistered={handleUserRegistered}
      />

      <LoginModal
        isOpen={isLoginOpen}
        onClose={() => setIsLoginOpen(false)}
        onUserLoggedIn={handleUserLoggedIn}
        onOpenRegister={() => setIsRegisterOpen(true)}
      />

      <EditPlayerModal
        isOpen={isEditProfileOpen}
        user={currentUser}
        onClose={() => setIsEditProfileOpen(false)}
        onUserUpdated={reloadData}
      />

      <VictoryModal
        match={lastMatchLogged}
        users={users}
        onClose={() => setLastMatchLogged(null)}
      />

      <DeploymentGuideModal
        isOpen={isDeploymentOpen}
        onClose={() => setIsDeploymentOpen(false)}
      />
    </div>
  );
}

