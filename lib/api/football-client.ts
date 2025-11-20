import axios, { AxiosInstance } from 'axios';
import { getCachedData } from '@/lib/cache';
import { API_CONFIG, CACHE_TTL } from './config';

class FootballClient {
  private apiFootball: AxiosInstance;
  private footballData: AxiosInstance;
  private requestCount = 0;

  constructor() {
    this.apiFootball = axios.create({
      baseURL: API_CONFIG.apiFootball.baseUrl,
      headers: {
        'x-apisports-key': API_CONFIG.apiFootball.key,
      },
      timeout: 10000,
    });

    this.footballData = axios.create({
      baseURL: API_CONFIG.footballData.baseUrl,
      headers: {
        'X-Auth-Token': API_CONFIG.footballData.key,
      },
      timeout: 10000,
    });

    this.setupInterceptors();
  }

  private setupInterceptors() {
    this.apiFootball.interceptors.request.use((config) => {
      this.requestCount++;
      console.log(`[API-Football] Request #${this.requestCount}: ${config.url}`);
      return config;
    });

    this.apiFootball.interceptors.response.use(
      (response) => response,
      async (error) => {
        if (error.response?.status === 429) {
          console.warn('[API-Football] Rate limited');
        }
        throw error;
      }
    );
  }

  async getFixtures(params: { date?: string; league?: number; team?: number; season?: number; live?: 'all' | string; last?: number }) {
    const cacheKey = `fixtures:${JSON.stringify(params)}`;
    const ttl = params.live ? CACHE_TTL.liveScores : CACHE_TTL.fixtures;
    return getCachedData(cacheKey, async () => {
      const response = await this.apiFootball.get('/fixtures', { params });
      return response.data.response;
    }, ttl);
  }

  async getFixtureDetails(fixtureId: number) {
    const cacheKey = `fixture:${fixtureId}`;
    return getCachedData(cacheKey, async () => {
      const response = await this.apiFootball.get('/fixtures', { params: { id: fixtureId } });
      return response.data.response?.[0];
    }, CACHE_TTL.fixtures);
  }

  async getTeamStatistics(teamId: number, season: number, leagueId: number) {
    const cacheKey = `team-stats:${teamId}:${season}:${leagueId}`;
    return getCachedData(cacheKey, async () => {
      const response = await this.apiFootball.get('/teams/statistics', { params: { team: teamId, season, league: leagueId } });
      return response.data.response;
    }, CACHE_TTL.teamStats);
  }

  async getHeadToHead(team1: number, team2: number) {
    const cacheKey = `h2h:${team1}:${team2}`;
    return getCachedData(cacheKey, async () => {
      const response = await this.apiFootball.get('/fixtures/headtohead', { params: { h2h: `${team1}-${team2}`, last: 10 } });
      return response.data.response;
    }, CACHE_TTL.h2h);
  }

  async getStandings(leagueId: number, season: number) {
    const cacheKey = `standings:${leagueId}:${season}`;
    return getCachedData(cacheKey, async () => {
      const response = await this.apiFootball.get('/standings', { params: { league: leagueId, season } });
      return response.data.response?.[0];
    }, CACHE_TTL.standings);
  }

  async searchTeams(query: string) {
    const response = await this.apiFootball.get('/teams', { params: { search: query } });
    return response.data.response;
  }

  async getLeagues() {
    const cacheKey = 'leagues:all';
    return getCachedData(cacheKey, async () => {
      const response = await this.apiFootball.get('/leagues');
      return response.data.response;
    }, CACHE_TTL.standings);
  }
}

export const footballClient = new FootballClient();
