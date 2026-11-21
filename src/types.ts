export type SportType = 'football' | 'basketball' | 'tennis' | 'cricket';

export type MatchStatus = 'LIVE' | 'UPCOMING' | 'FINISHED' | 'HT';

export interface Team {
  id: string;
  name: string;
  shortName: string;
  logo: string;
  color: string;
  rank?: number;
  form?: ('W' | 'D' | 'L')[];
}

export interface MatchEvent {
  minute: number;
  type: 'goal' | 'yellow_card' | 'red_card' | 'sub' | 'penalty';
  teamId: string;
  player: string;
  detail?: string;
}

export interface MatchStats {
  possession: [number, number]; // [home, away]
  shots: [number, number];
  shotsOnTarget: [number, number];
  xg: [number, number];
  corners: [number, number];
  fouls: [number, number];
  yellowCards: [number, number];
  redCards: [number, number];
}

export interface PlayerLineup {
  name: string;
  number: number;
  position: string;
  isCaptain?: boolean;
  x: number; // 0-100 percentage for pitch layout
  y: number; // 0-100 percentage for pitch layout
}

export interface LineupData {
  formation: string;
  startingXI: PlayerLineup[];
  substitutes: string[];
}

export interface H2HRecord {
  date: string;
  competition: string;
  homeScore: number;
  awayScore: number;
  winner: 'home' | 'away' | 'draw';
}

export interface PredictionData {
  homeTeam: string;
  awayTeam: string;
  league: string;
  sport: string;
  mostGivenPrediction: string;
  confidence: number;
  recommendedBet: string;
  projectedScore: {
    home: number;
    away: number;
  };
  worldConsensus: {
    homeWinPercentage: number;
    drawPercentage: number;
    awayWinPercentage: number;
    over25GoalsPercentage: number;
    under25GoalsPercentage: number;
    bttsYesPercentage: number;
    bttsNoPercentage: number;
    totalWorldVotesAnalyzed: number;
    sentimentByRegion: {
      europe: { home: number; draw: number; away: number };
      americas: { home: number; draw: number; away: number };
      asia: { home: number; draw: number; away: number };
      africa: { home: number; draw: number; away: number };
    };
  };
  scorelineProbabilities: Array<{
    score: string;
    probability: number;
    label: string;
  }>;
  graphicalAnalysis: {
    radarMetrics: {
      homeMetrics: {
        attack: number;
        defense: number;
        form: number;
        h2hDominance: number;
        squadDepth: number;
        tacticalDiscipline: number;
      };
      awayMetrics: {
        attack: number;
        defense: number;
        form: number;
        h2hDominance: number;
        squadDepth: number;
        tacticalDiscipline: number;
      };
    };
    expectedGoals: {
      homeXg: number;
      awayXg: number;
    };
    possessionForecast: {
      home: number;
      away: number;
    };
    keyMatchup: {
      playerHome: string;
      playerAway: string;
      description: string;
    };
    tacticalSummary: string;
    keyStrengthsHome: string[];
    keyStrengthsAway: string[];
    riskFactors: string[];
  };
  expertSourcesConsensus: Array<{
    source: string;
    prediction: string;
    confidence: number;
  }>;
  isAIGenerated?: boolean;
}

export interface Match {
  id: string;
  sport: SportType;
  league: string;
  leagueCountry: string;
  leagueBadge: string;
  homeTeam: Team;
  awayTeam: Team;
  status: MatchStatus;
  minute?: number;
  startTime: string; // e.g. "20:00" or ISO
  dateStr: string; // YYYY-MM-DD
  score: {
    home: number;
    away: number;
    htHome?: number;
    htAway?: number;
  };
  events: MatchEvent[];
  stats: MatchStats;
  homeLineup: LineupData;
  awayLineup: LineupData;
  h2h: H2HRecord[];
  quickPredictionPreview?: {
    favorite: string;
    percentage: number;
    score: string;
  };
  odds?: {
    home: number;
    draw: number;
    away: number;
  };
}
