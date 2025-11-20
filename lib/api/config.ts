export const API_CONFIG = {
  apiFootball: {
    baseUrl: 'https://v3.football.api-sports.io',
    key: process.env.FOOTBALL_API_KEY!,
    rateLimit: 100,
  },
  footballData: {
    baseUrl: 'https://api.football-data.org/v4',
    key: process.env.FOOTBALL_DATA_API_KEY || '',
    rateLimit: 10,
  },
};

export const CACHE_TTL = {
  liveScores: 30,
  fixtures: 900,
  standings: 43200,
  teamStats: 86400,
  h2h: 604800,
};
