export interface User {
  id: string;
  username: string;
  passwordHash: string;
  nickname: string;
  title?: string; // Título do jogador (ex: Rei da Mesa, Mestre da Lambreta)
  avatarBall: number; // Billiard ball number 1-15 or cue ball (0)
  avatarColor: string;
  createdAt: string;
  initialWins?: number;
  initialLosses?: number;
  initialLambretas?: number;
}

export interface Match {
  id: string;
  date: string; // YYYY-MM-DD
  winnerId: string;
  loserId: string;
  hasBet?: boolean;
  betAmount?: number;
  isLambreta: boolean; // Ponto extra / capote / lambreta
  location?: string;
  note?: string;
  createdAt: number; // Timestamp
}

export interface PlayerStats {
  user: User;
  rank: number;
  matchesPlayed: number;
  wins: number;
  losses: number;
  winRate: number; // Percentage 0-100
  points: number; // Wins * 1 + Lambretas * 3
  lambretasCount: number;
  pointsPerGame: number; // Média de pontos por jogo (ex: 2.50)
  weightedAverage: number; // Média ponderada baseada em jogos
  streak: {
    type: 'win' | 'loss' | 'none';
    count: number;
  };
}

export type AppTab = 'leaderboard' | 'matches' | 'tv' | 'deployment';

