import { User, Match, PlayerStats } from '../types';
import { db } from './firebase';
import { collection, doc, setDoc, deleteDoc, onSnapshot, query } from 'firebase/firestore';

const USERS_STORAGE_KEY = 'sinuca_saas_users_v4';
const MATCHES_STORAGE_KEY = 'sinuca_saas_matches_v4';
const AUTH_USER_KEY = 'sinuca_saas_current_user_id_v4';

// Default Seed Data - empty so the user starts with clean real data
const DEFAULT_USERS: User[] = [];
const DEFAULT_MATCHES: Match[] = [];

// Realtime Firestore Subscriptions
export function subscribeToUsers(callback: (users: User[]) => void) {
  try {
    const q = query(collection(db, 'users'));
    return onSnapshot(
      q,
      (snapshot) => {
        const users: User[] = [];
        snapshot.forEach((docSnap) => {
          users.push(docSnap.data() as User);
        });
        if (users.length > 0) {
          saveUsers(users);
          callback(users);
        } else {
          callback(getUsers());
        }
      },
      (error) => {
        // Silently fallback to LocalStorage if offline or connection unavailable
        if (error?.code !== 'unavailable') {
          console.warn('Firestore users subscription status:', error?.message || error);
        }
        callback(getUsers());
      }
    );
  } catch (e) {
    callback(getUsers());
    return () => {};
  }
}

export function subscribeToMatches(callback: (matches: Match[]) => void) {
  try {
    const q = query(collection(db, 'matches'));
    return onSnapshot(
      q,
      (snapshot) => {
        const matches: Match[] = [];
        snapshot.forEach((docSnap) => {
          matches.push(docSnap.data() as Match);
        });
        matches.sort((a, b) => b.createdAt - a.createdAt);
        if (matches.length > 0) {
          saveMatches(matches);
          callback(matches);
        } else {
          callback(getMatches());
        }
      },
      (error) => {
        // Silently fallback to LocalStorage if offline or connection unavailable
        if (error?.code !== 'unavailable') {
          console.warn('Firestore matches subscription status:', error?.message || error);
        }
        callback(getMatches());
      }
    );
  } catch (e) {
    callback(getMatches());
    return () => {};
  }
}

// Read Users
export function getUsers(): User[] {
  try {
    const data = localStorage.getItem(USERS_STORAGE_KEY);
    if (!data) {
      saveUsers(DEFAULT_USERS);
      return DEFAULT_USERS;
    }
    return JSON.parse(data);
  } catch (e) {
    console.error('Error reading users from storage:', e);
    return DEFAULT_USERS;
  }
}

export function saveUsers(users: User[]) {
  localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(users));
}

// Read Matches
export function getMatches(): Match[] {
  try {
    const data = localStorage.getItem(MATCHES_STORAGE_KEY);
    if (!data) {
      saveMatches(DEFAULT_MATCHES);
      return DEFAULT_MATCHES;
    }
    return JSON.parse(data);
  } catch (e) {
    console.error('Error reading matches from storage:', e);
    return DEFAULT_MATCHES;
  }
}

export function saveMatches(matches: Match[]) {
  localStorage.setItem(MATCHES_STORAGE_KEY, JSON.stringify(matches));
}

// Authentication / Current Logged-in User
export function getCurrentUserId(): string | null {
  return localStorage.getItem(AUTH_USER_KEY) || null;
}

export function setCurrentUserId(userId: string | null) {
  if (userId) {
    localStorage.setItem(AUTH_USER_KEY, userId);
  } else {
    localStorage.removeItem(AUTH_USER_KEY);
  }
}

export function authenticateUser(username: string, passwordHash: string): User | null {
  const users = getUsers();
  const found = users.find(
    u => u.username.toLowerCase() === username.toLowerCase() && u.passwordHash === passwordHash
  );
  if (found) {
    setCurrentUserId(found.id);
  }
  return found || null;
}

// Helper to compute or retrieve Player Title
export function getPlayerTitle(user: User, stats?: PlayerStats, totalPlayers: number = 0): string {
  if (user.title && user.title.trim()) {
    return user.title.trim();
  }
  if (!stats) {
    return '🎱 Caçapeiro';
  }
  if (stats.rank === 1 && stats.matchesPlayed > 0) return '👑 Rei da Mesa';
  if (stats.rank === 2 && stats.matchesPlayed > 0) return '🥈 Vice-Líder da Mesa';
  if (stats.rank === 3 && stats.matchesPlayed > 0) return '🥉 Top 3 da Mesa';
  if (totalPlayers > 1 && stats.rank === totalPlayers && stats.matchesPlayed > 0) return '💩 Saco de Pancadas';
  if (stats.lambretasCount >= 2) return '🚗 Mestre da Lambreta';
  if (stats.streak.type === 'win' && stats.streak.count >= 2) return `🔥 Imbatível (${stats.streak.count}V)`;
  if (stats.winRate >= 70 && stats.matchesPlayed >= 3) return '🎯 Tacada Certeira';
  if (stats.winRate >= 50 && stats.matchesPlayed >= 2) return '🎱 Taco de Ouro';
  if (stats.matchesPlayed > 0) return '🎱 Caçapeiro de Respeito';
  return '🎱 Aspirante da Mesa';
}

// Create New User Participant
export function createUser(userData: {
  username: string;
  passwordHash: string;
  nickname: string;
  title?: string;
  avatarBall: number;
  avatarColor: string;
  initialWins?: number;
  initialLosses?: number;
  initialLambretas?: number;
}): User {
  const users = getUsers();
  const newUser: User = {
    id: `usr_${Date.now()}_${Math.floor(Math.random() * 1000)}`,
    username: userData.username,
    passwordHash: userData.passwordHash,
    nickname: userData.nickname,
    title: userData.title?.trim() || undefined,
    avatarBall: userData.avatarBall,
    avatarColor: userData.avatarColor,
    createdAt: new Date().toISOString(),
    initialWins: userData.initialWins || 0,
    initialLosses: userData.initialLosses || 0,
    initialLambretas: userData.initialLambretas || 0,
  };
  users.push(newUser);
  saveUsers(users);

  // Sync with Firestore
  setDoc(doc(db, 'users', newUser.id), newUser).catch((err) => {
    console.error('Firestore setDoc user error:', err);
  });

  return newUser;
}

// Update User Participant
export function updateUser(userId: string, updateData: Partial<User>): User | null {
  const users = getUsers();
  const index = users.findIndex(u => u.id === userId);
  if (index === -1) return null;

  users[index] = {
    ...users[index],
    ...updateData,
  };
  saveUsers(users);

  // Sync with Firestore
  setDoc(doc(db, 'users', userId), users[index], { merge: true }).catch((err) => {
    console.error('Firestore setDoc update user error:', err);
  });

  return users[index];
}

// Register Match
export function addMatch(matchData: {
  date: string;
  winnerId: string;
  loserId: string;
  isLambreta: boolean;
  note?: string;
}): Match {
  const matches = getMatches();
  const newMatch: Match = {
    id: `mtc_${Date.now()}_${Math.floor(Math.random() * 1000)}`,
    date: matchData.date || new Date().toISOString().split('T')[0],
    winnerId: matchData.winnerId,
    loserId: matchData.loserId,
    isLambreta: matchData.isLambreta,
    note: matchData.note || '',
    createdAt: Date.now(),
  };

  matches.unshift(newMatch); // newest first
  saveMatches(matches);

  // Sync with Firestore
  setDoc(doc(db, 'matches', newMatch.id), newMatch).catch((err) => {
    console.error('Firestore setDoc match error:', err);
  });

  return newMatch;
}

// Delete Match
export function deleteMatch(matchId: string) {
  const matches = getMatches();
  const filtered = matches.filter(m => m.id !== matchId);
  saveMatches(filtered);

  // Sync with Firestore
  deleteDoc(doc(db, 'matches', matchId)).catch((err) => {
    console.error('Firestore deleteDoc match error:', err);
  });
}

// Calculate Player Stats & Rankings
export function calculatePlayerStats(users: User[], matches: Match[]): PlayerStats[] {
  const statsMap = new Map<string, PlayerStats>();

  // Initialize for all users with their historical / initial balances
  users.forEach(u => {
    const initWins = u.initialWins || 0;
    const initLosses = u.initialLosses || 0;
    const initLambretas = u.initialLambretas || 0;
    const initMatches = initWins + initLosses;

    // Regra: Vitória = 1 ponto, Derrota = 0 ponto, Lambreta = 3 pontos (equivale a 3 vitórias)
    // Se initWins inclui lambretas: (initWins - initLambretas) * 1 + (initLambretas * 3) = initWins + (initLambretas * 2)
    const initPoints = (initWins * 1) + (initLambretas * 2);

    statsMap.set(u.id, {
      user: { ...u },
      rank: 0,
      matchesPlayed: initMatches,
      wins: initWins,
      losses: initLosses,
      winRate: 0,
      points: Math.max(0, initPoints),
      lambretasCount: initLambretas,
      pointsPerGame: 0,
      weightedAverage: 0,
      streak: { type: 'none', count: 0 },
    });
  });

  // Process matches in chronological order (oldest to newest) to accurately compute streaks
  const chronoMatches = [...matches].sort((a, b) => a.createdAt - b.createdAt);

  chronoMatches.forEach(m => {
    const winnerStats = statsMap.get(m.winnerId);
    const loserStats = statsMap.get(m.loserId);

    if (winnerStats) {
      winnerStats.matchesPlayed += 1;
      winnerStats.wins += 1;
      // Regra de pontuação:
      // Vitória normal = 1 ponto
      // Lambreta = 3 pontos (equivale a 3 vitórias)
      if (m.isLambreta) {
        winnerStats.lambretasCount += 1;
        winnerStats.points += 3;
      } else {
        winnerStats.points += 1;
      }

      // Streak update
      if (winnerStats.streak.type === 'win') {
        winnerStats.streak.count += 1;
      } else {
        winnerStats.streak.type = 'win';
        winnerStats.streak.count = 1;
      }
    }

    if (loserStats) {
      loserStats.matchesPlayed += 1;
      loserStats.losses += 1;
      // Derrota = 0 ponto

      // Streak update
      if (loserStats.streak.type === 'loss') {
        loserStats.streak.count += 1;
      } else {
        loserStats.streak.type = 'loss';
        loserStats.streak.count = 1;
      }
    }
  });

  // Calculate Win Rates, Points Per Game and Weighted Average
  const allStats: PlayerStats[] = Array.from(statsMap.values()).map(s => {
    s.winRate = s.matchesPlayed > 0 ? Math.round((s.wins / s.matchesPlayed) * 100) : 0;
    s.pointsPerGame = s.matchesPlayed > 0 ? Number((s.points / s.matchesPlayed).toFixed(2)) : 0;
    
    // Média Ponderada baseada em jogos:
    // Ponderação bayesiana suave para equilibrar aproveitamento médio e consistência/volume de partidas
    // (Pontos + C * Base) / (Jogos + C) onde C=2 jogos e Base=1.00 pt/jogo
    if (s.matchesPlayed > 0) {
      const C = 2; // Constante de amortização de confiança
      const baselineScore = 1.0;
      const bayesian = (s.points + (C * baselineScore)) / (s.matchesPlayed + C);
      s.weightedAverage = Number(bayesian.toFixed(2));
    } else {
      s.weightedAverage = 0;
    }
    return s;
  });

  // Separate players with matches from players with 0 matches
  // REGRA: Se não tiver jogos, NÃO entra no ranking!
  const rankedPlayers = allStats.filter(s => s.matchesPlayed > 0);
  const unrankedPlayers = allStats.filter(s => s.matchesPlayed === 0);

  // Sort ranked players by default Points criteria
  rankedPlayers.sort((a, b) => {
    if (b.points !== a.points) return b.points - a.points;
    if (b.weightedAverage !== a.weightedAverage) return b.weightedAverage - a.weightedAverage;
    if (b.wins !== a.wins) return b.wins - a.wins;
    if (b.lambretasCount !== a.lambretasCount) return b.lambretasCount - a.lambretasCount;
    return b.winRate - a.winRate;
  });

  // Assign ranks strictly to players who have played at least 1 match
  rankedPlayers.forEach((item, index) => {
    item.rank = index + 1;
  });

  // Unranked players keep rank = 0
  unrankedPlayers.forEach(item => {
    item.rank = 0;
  });

  return [...rankedPlayers, ...unrankedPlayers];
}

