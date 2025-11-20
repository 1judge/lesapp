export interface TeamStats {
  matchesPlayed: number;
  wins: number;
  draws: number;
  losses: number;
  goalsScored: number;
  goalsConceded: number;
  home: { played: number; wins: number; goalsScored: number; goalsConceded: number };
  away: { played: number; wins: number; goalsScored: number; goalsConceded: number };
  lastFive: Array<{ result: 'W' | 'L' | 'D'; goalsScored: number; goalsConceded: number; opponent: string }>;
  leaguePosition: number;
  points: number;
  form: string;
}

export interface LeagueStats { avgGoals: number }

export interface PredictionResult {
  matchOutcome: {
    homeWin: number;
    draw: number;
    awayWin: number;
    prediction: 'home' | 'draw' | 'away';
    confidence: number;
  };
  goals: {
    expectedTotal: number;
    overUnder: Record<'0.5' | '1.5' | '2.5' | '3.5', { over: number; under: number }>;
    btts: { yes: number; no: number };
    topScores: Array<{ homeScore: number; awayScore: number; probability: number }>;
  };
  corners: {
    expectedTotal: number;
    overUnder: Record<'8.5' | '9.5' | '10.5', { over: number; under: number }>;
  };
  cards: {
    expectedYellow: number;
    expectedRed: number;
    overUnder: Record<'3.5' | '4.5', { over: number; under: number }>;
  };
  handicaps: Array<{
    line: number; // home handicap in goals (e.g., -1 means home -1)
    home: number;
    draw: number;
    away: number;
  }>;
  keyInsights: string[];
  riskLevel: 'low' | 'medium' | 'high';
  lastUpdated: string;
}

class PredictionEngine {
  async generatePrediction(
    homeTeamId: number,
    awayTeamId: number,
    fixtureId: number,
    leagueId: number,
    fetchers: {
      getTeamStats: (teamId: number, leagueId: number, isHome: boolean) => Promise<TeamStats>;
      getHeadToHead: (homeId: number, awayId: number) => Promise<any[]>;
      getLeagueStats: (leagueId: number) => Promise<LeagueStats>;
    }
  ): Promise<PredictionResult> {
    const [homeStats, awayStats, h2h, leagueStats] = await Promise.all([
      fetchers.getTeamStats(homeTeamId, leagueId, true),
      fetchers.getTeamStats(awayTeamId, leagueId, false),
      fetchers.getHeadToHead(homeTeamId, awayTeamId),
      fetchers.getLeagueStats(leagueId),
    ]);

    const homeAttack = this.calculateAttackStrength(homeStats, leagueStats, true);
    const homeDefense = this.calculateDefenseStrength(homeStats, leagueStats, true);
    const awayAttack = this.calculateAttackStrength(awayStats, leagueStats, false);
    const awayDefense = this.calculateDefenseStrength(awayStats, leagueStats, false);

    const homeXG = homeAttack * awayDefense * leagueStats.avgGoals * 1.3;
    const awayXG = awayAttack * homeDefense * leagueStats.avgGoals;

    const matchOutcome = this.calculateMatchOutcome(homeXG, awayXG);
    const goalsPredictions = this.calculateGoalsPredictions(homeXG, awayXG);
    const cornersPrediction = this.predictCorners(homeStats, awayStats);
    const cardsPrediction = this.predictCards(homeStats, awayStats);
    const handicaps = this.calculateHandicaps(homeXG, awayXG, [-1, 0, 1]);
    const insights = this.generateInsights(homeStats, awayStats, h2h, matchOutcome);
    const riskLevel = this.assessRiskLevel(homeStats, awayStats, matchOutcome.confidence);

    return {
      matchOutcome,
      goals: goalsPredictions,
      corners: cornersPrediction,
      cards: cardsPrediction,
      handicaps,
      keyInsights: insights,
      riskLevel,
      lastUpdated: new Date().toISOString(),
    };
  }

  private calculateAttackStrength(stats: TeamStats, leagueStats: LeagueStats, isHome: boolean): number {
    const relevantStats = isHome ? stats.home : stats.away;
    const goalsPerGame = relevantStats.played ? relevantStats.goalsScored / relevantStats.played : 0.01;
    const leagueAvg = leagueStats.avgGoals / 2;
    const recentGoals = stats.lastFive.reduce((sum, match) => sum + match.goalsScored, 0) / Math.max(1, stats.lastFive.length);
    const formMultiplier = goalsPerGame ? recentGoals / goalsPerGame : 1;
    return (goalsPerGame / (leagueAvg || 1)) * (0.7 + formMultiplier * 0.3);
  }

  private calculateDefenseStrength(stats: TeamStats, leagueStats: LeagueStats, isHome: boolean): number {
    const relevantStats = isHome ? stats.home : stats.away;
    const concededPerGame = relevantStats.played ? relevantStats.goalsConceded / relevantStats.played : 0.01;
    const leagueAvg = leagueStats.avgGoals / 2;
    const recentConceded = stats.lastFive.reduce((sum, m) => sum + m.goalsConceded, 0) / Math.max(1, stats.lastFive.length);
    const formMultiplier = concededPerGame ? recentConceded / concededPerGame : 1;
    return (concededPerGame / (leagueAvg || 1)) * (0.7 + formMultiplier * 0.3);
  }

  private calculateMatchOutcome(homeXG: number, awayXG: number) {
    const maxGoals = 10;
    let homeWinProb = 0;
    let drawProb = 0;
    let awayWinProb = 0;

    for (let h = 0; h <= maxGoals; h++) {
      for (let a = 0; a <= maxGoals; a++) {
        const prob = this.poissonProbability(h, homeXG) * this.poissonProbability(a, awayXG);
        if (h > a) homeWinProb += prob;
        else if (h === a) drawProb += prob;
        else awayWinProb += prob;
      }
    }

    homeWinProb *= 100;
    drawProb *= 100;
    awayWinProb *= 100;

    const maxProb = Math.max(homeWinProb, drawProb, awayWinProb);
    let prediction: 'home' | 'draw' | 'away';
    if (maxProb === homeWinProb) prediction = 'home';
    else if (maxProb === awayWinProb) prediction = 'away';
    else prediction = 'draw';

    const probs = [homeWinProb, drawProb, awayWinProb].sort((a, b) => b - a);
    const confidence = Math.min(100, Math.round(maxProb + (probs[0] - probs[1])));

    return {
      homeWin: Math.round(homeWinProb),
      draw: Math.round(drawProb),
      awayWin: Math.round(awayWinProb),
      prediction,
      confidence,
    };
  }

  private poissonProbability(k: number, lambda: number): number {
    return Math.exp(-lambda) * Math.pow(lambda, k) / this.factorial(k);
  }

  private factorial(n: number): number {
    if (n <= 1) return 1;
    return n * this.factorial(n - 1);
  }

  private calculateGoalsPredictions(homeXG: number, awayXG: number) {
    const totalXG = homeXG + awayXG;
    const overUnder = {
      '0.5': this.calculateOverUnder(totalXG, 0.5),
      '1.5': this.calculateOverUnder(totalXG, 1.5),
      '2.5': this.calculateOverUnder(totalXG, 2.5),
      '3.5': this.calculateOverUnder(totalXG, 3.5),
    } as const;

    const bttsYes = (1 - Math.exp(-homeXG)) * (1 - Math.exp(-awayXG)) * 100;
    const bttsNo = 100 - bttsYes;
    const topScores = this.calculateTopScores(homeXG, awayXG);

    return {
      expectedTotal: parseFloat(totalXG.toFixed(2)),
      overUnder: overUnder as any,
      btts: { yes: Math.round(bttsYes), no: Math.round(bttsNo) },
      topScores,
    };
  }

  private calculateOverUnder(totalXG: number, line: number) {
    let underProb = 0;
    for (let goals = 0; goals <= Math.floor(line); goals++) {
      underProb += this.poissonProbability(goals, totalXG);
    }
    const overProb = 1 - underProb;
    return { over: Math.round(overProb * 100), under: Math.round(underProb * 100) };
  }

  private calculateTopScores(homeXG: number, awayXG: number) {
    const scores: Array<{ homeScore: number; awayScore: number; probability: number }> = [];
    for (let home = 0; home <= 5; home++) {
      for (let away = 0; away <= 5; away++) {
        const prob = this.poissonProbability(home, homeXG) * this.poissonProbability(away, awayXG) * 100;
        scores.push({ homeScore: home, awayScore: away, probability: prob });
      }
    }
    return scores.sort((a, b) => b.probability - a.probability).slice(0, 5);
  }

  private predictCorners(homeStats: TeamStats, awayStats: TeamStats) {
    const homeCorners = (homeStats.goalsScored / Math.max(1, homeStats.matchesPlayed)) * 4;
    const awayCorners = (awayStats.goalsScored / Math.max(1, awayStats.matchesPlayed)) * 4;
    const expectedTotal = homeCorners + awayCorners;
    return {
      expectedTotal: parseFloat(expectedTotal.toFixed(1)),
      overUnder: {
        '8.5': this.calculateOverUnder(expectedTotal, 8.5),
        '9.5': this.calculateOverUnder(expectedTotal, 9.5),
        '10.5': this.calculateOverUnder(expectedTotal, 10.5),
      },
    };
  }

  private predictCards(homeStats: TeamStats, awayStats: TeamStats) {
    const expectedYellow = 3.5;
    const expectedRed = 0.2;
    return {
      expectedYellow,
      expectedRed,
      overUnder: {
        '3.5': this.calculateOverUnder(expectedYellow, 3.5),
        '4.5': this.calculateOverUnder(expectedYellow, 4.5),
      },
    };
  }

  private calculateHandicaps(homeXG: number, awayXG: number, lines: number[]) {
    return lines.map((line) => {
      const { home, draw, away } = this.handicapOutcome(homeXG, awayXG, line);
      return { line, home: Math.round(home * 100), draw: Math.round(draw * 100), away: Math.round(away * 100) };
    });
  }

  private handicapOutcome(homeXG: number, awayXG: number, line: number) {
    const maxGoals = 10;
    let home = 0, draw = 0, away = 0;
    for (let h = 0; h <= maxGoals; h++) {
      for (let a = 0; a <= maxGoals; a++) {
        const prob = this.poissonProbability(h, homeXG) * this.poissonProbability(a, awayXG);
        const diff = h - a + line; // apply handicap to home
        if (diff > 0) home += prob;
        else if (diff === 0) draw += prob;
        else away += prob;
      }
    }
    return { home, draw, away };
  }

  private generateInsights(homeStats: TeamStats, awayStats: TeamStats, h2h: any[], matchOutcome: any): string[] {
    const insights: string[] = [];
    const homeFormWins = homeStats.form.split('').filter((r) => r === 'W').length;
    const awayFormWins = awayStats.form.split('').filter((r) => r === 'W').length;

    if (homeFormWins >= 4) insights.push(`Home team in excellent form with ${homeFormWins} wins in last 5`);
    if (awayFormWins >= 4) insights.push(`Away team in excellent form with ${awayFormWins} wins in last 5`);
    if (homeFormWins === 0) insights.push(`Home team winless in last 5 matches`);
    if (awayFormWins === 0) insights.push(`Away team winless in last 5 matches`);

    const homeAvgGoals = homeStats.home.played ? homeStats.home.goalsScored / homeStats.home.played : 0;
    const awayAvgGoals = awayStats.away.played ? awayStats.away.goalsScored / awayStats.away.played : 0;

    if (homeAvgGoals > 2) insights.push(`Home team averaging ${homeAvgGoals.toFixed(1)} goals at home`);
    if (awayAvgGoals > 1.5) insights.push(`Away team scoring well on the road (${awayAvgGoals.toFixed(1)} per game)`);

    if (h2h && h2h.length > 0) {
      const recentH2H = h2h.slice(0, 3);
      const homeWinsH2H = recentH2H.filter((m) => (m as any).winner === 'home').length;
      if (homeWinsH2H === 3) insights.push(`Home team won all of the last 3 meetings`);
    }

    if (matchOutcome.confidence > 70) insights.push(`High confidence prediction (${matchOutcome.confidence}%)`);
    else if (matchOutcome.confidence < 40) insights.push(`Evenly matched teams - difficult to predict`);

    return insights.slice(0, 5);
  }

  private assessRiskLevel(homeStats: TeamStats, awayStats: TeamStats, confidence: number): 'low' | 'medium' | 'high' {
    if (confidence > 65) return 'low';
    if (confidence > 45) return 'medium';
    return 'high';
  }
}

export const predictionEngine = new PredictionEngine();
