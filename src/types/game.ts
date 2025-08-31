export interface Player {
  id: string;
  name: string;
  position: string;
  teamId: string;
  teamName: string;
  rating: number;
  avatar?: string;
}

export interface Game {
  id: string;
  team1: {
    id: string;
    name: string;
    score?: number;
  };
  team2: {
    id: string;
    name: string;
    score?: number;
  };
  date: string;
  time: string;
  location: string;
  status: 'CONFIRMED' | 'PENDING' | 'CANCELED' | 'FINISHED';
  type: 'FRIENDLY' | 'TOURNAMENT' | 'LEAGUE';
  bestPlayer?: Player;
  votes?: {
    playerId: string;
    playerName: string;
    teamName: string;
    count: number;
  }[];
  votingStartTime?: string; // ISO string
  votingEndTime?: string; // ISO string
}

export interface Vote {
  gameId: string;
  playerId: string;
  voterTeamId: string;
}