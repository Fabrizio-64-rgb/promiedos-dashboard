/**
 * Servicio de API para obtener datos de fútbol en tiempo real
 */

class FootballAPIService {
    constructor() {
        this.cache = new Map();
        this.cacheExpiry = new Map();
        this.updateIntervals = new Map();
    }

    /**
     * Obtener clasificación de la liga
     */
    async getStandings(leagueId, season = null) {
        const cacheKey = `standings_${leagueId}_${season}`;

        if (this.isCacheValid(cacheKey)) {
            return this.cache.get(cacheKey);
        }

        try {
            // Intentar primero con TheSportsDB
            const url = `${CONFIG.THESPORTSDB.BASE_URL}/${CONFIG.THESPORTSDB.API_KEY}${CONFIG.THESPORTSDB.ENDPOINTS.STANDINGS}?l=${leagueId}${season ? `&s=${season}` : ''}`;
            const response = await fetch(url);
            const data = await response.json();

            if (data.table) {
                const standings = this.normalizeStandings(data.table);
                this.setCache(cacheKey, standings, 300000); // Cache por 5 minutos
                return standings;
            }

            // Si falla, usar datos simulados
            return this.getSimulatedStandings();
        } catch (error) {
            console.error('Error fetching standings:', error);
            return this.getSimulatedStandings();
        }
    }

    /**
     * Obtener próximos partidos
     */
    async getUpcomingFixtures(leagueId) {
        const cacheKey = `fixtures_${leagueId}`;

        if (this.isCacheValid(cacheKey)) {
            return this.cache.get(cacheKey);
        }

        try {
            const url = `${CONFIG.THESPORTSDB.BASE_URL}/${CONFIG.THESPORTSDB.API_KEY}${CONFIG.THESPORTSDB.ENDPOINTS.EVENTS}?id=${leagueId}`;
            const response = await fetch(url);
            const data = await response.json();

            if (data.events) {
                const fixtures = this.normalizeFixtures(data.events);
                this.setCache(cacheKey, fixtures, 600000); // Cache por 10 minutos
                return fixtures;
            }

            return this.getSimulatedFixtures();
        } catch (error) {
            console.error('Error fetching fixtures:', error);
            return this.getSimulatedFixtures();
        }
    }

    /**
     * Obtener marcadores en vivo
     */
    async getLiveScores(league = null) {
        try {
            const url = `${CONFIG.THESPORTSDB.BASE_URL}/${CONFIG.THESPORTSDB.API_KEY}${CONFIG.THESPORTSDB.ENDPOINTS.LIVE_SCORES}${league ? `?l=${league}` : ''}`;
            const response = await fetch(url);
            const data = await response.json();

            if (data.events) {
                return this.normalizeLiveScores(data.events);
            }

            return [];
        } catch (error) {
            console.error('Error fetching live scores:', error);
            return [];
        }
    }

    /**
     * Obtener detalles de un equipo
     */
    async getTeamDetails(teamId) {
        const cacheKey = `team_${teamId}`;

        if (this.isCacheValid(cacheKey)) {
            return this.cache.get(cacheKey);
        }

        try {
            const url = `${CONFIG.THESPORTSDB.BASE_URL}/${CONFIG.THESPORTSDB.API_KEY}${CONFIG.THESPORTSDB.ENDPOINTS.TEAM}?id=${teamId}`;
            const response = await fetch(url);
            const data = await response.json();

            if (data.teams && data.teams.length > 0) {
                const team = data.teams[0];
                this.setCache(cacheKey, team, 3600000); // Cache por 1 hora
                return team;
            }

            return null;
        } catch (error) {
            console.error('Error fetching team details:', error);
            return null;
        }
    }

    /**
     * Obtener cuotas de apuestas (simuladas)
     */
    async getOdds(eventId) {
        // En producción, esto se conectaría a una API de cuotas real
        // Por ahora, generamos cuotas simuladas basadas en probabilidades
        return this.generateSimulatedOdds();
    }

    /**
     * Normalizar datos de clasificación
     */
    normalizeStandings(rawData) {
        return rawData.map(team => ({
            position: parseInt(team.intRank) || 0,
            name: team.strTeam,
            teamId: team.idTeam,
            played: parseInt(team.intPlayed) || 0,
            won: parseInt(team.intWin) || 0,
            draw: parseInt(team.intDraw) || 0,
            lost: parseInt(team.intLoss) || 0,
            goalsFor: parseInt(team.intGoalsFor) || 0,
            goalsAgainst: parseInt(team.intGoalsAgainst) || 0,
            goalDifference: parseInt(team.intGoalDifference) || 0,
            points: parseInt(team.intPoints) || 0,
            form: team.strForm || '',
            pointsAvg: team.intPlayed > 0 ? (parseInt(team.intPoints) / parseInt(team.intPlayed)).toFixed(2) : '0.00'
        }));
    }

    /**
     * Normalizar fixtures
     */
    normalizeFixtures(rawData) {
        return rawData.map(event => ({
            id: event.idEvent,
            date: event.dateEvent,
            time: event.strTime,
            homeTeam: event.strHomeTeam,
            awayTeam: event.strAwayTeam,
            homeTeamId: event.idHomeTeam,
            awayTeamId: event.idAwayTeam,
            league: event.strLeague,
            season: event.strSeason,
            venue: event.strVenue,
            status: event.strStatus || 'Scheduled'
        }));
    }

    /**
     * Normalizar marcadores en vivo
     */
    normalizeLiveScores(rawData) {
        return rawData.map(event => ({
            id: event.idEvent,
            homeTeam: event.strHomeTeam,
            awayTeam: event.strAwayTeam,
            homeScore: parseInt(event.intHomeScore) || 0,
            awayScore: parseInt(event.intAwayScore) || 0,
            time: event.strProgress,
            status: event.strStatus
        }));
    }

    /**
     * Sistema de caché
     */
    setCache(key, data, ttl) {
        this.cache.set(key, data);
        this.cacheExpiry.set(key, Date.now() + ttl);
    }

    isCacheValid(key) {
        if (!this.cache.has(key)) return false;
        const expiry = this.cacheExpiry.get(key);
        if (Date.now() > expiry) {
            this.cache.delete(key);
            this.cacheExpiry.delete(key);
            return false;
        }
        return true;
    }

    clearCache() {
        this.cache.clear();
        this.cacheExpiry.clear();
    }

    /**
     * Datos simulados para desarrollo/fallback
     */
    getSimulatedStandings() {
        return [
            { position: 1, name: 'Manchester City', teamId: '133613', played: 20, won: 16, draw: 3, lost: 1, goalsFor: 48, goalsAgainst: 15, goalDifference: 33, points: 51, form: 'WWDWW', pointsAvg: '2.55' },
            { position: 2, name: 'Liverpool', teamId: '133602', played: 20, won: 15, draw: 4, lost: 1, goalsFor: 52, goalsAgainst: 20, goalDifference: 32, points: 49, form: 'WWWDW', pointsAvg: '2.45' },
            { position: 3, name: 'Arsenal', teamId: '133604', played: 20, won: 14, draw: 4, lost: 2, goalsFor: 45, goalsAgainst: 18, goalDifference: 27, points: 46, form: 'WWWWD', pointsAvg: '2.30' },
            { position: 4, name: 'Chelsea', teamId: '133610', played: 20, won: 13, draw: 3, lost: 4, goalsFor: 42, goalsAgainst: 22, goalDifference: 20, points: 42, form: 'WLWWW', pointsAvg: '2.10' },
            { position: 5, name: 'Manchester United', teamId: '133612', played: 20, won: 12, draw: 4, lost: 4, goalsFor: 38, goalsAgainst: 25, goalDifference: 13, points: 40, form: 'DWWLW', pointsAvg: '2.00' },
            { position: 6, name: 'Tottenham', teamId: '133611', played: 20, won: 11, draw: 5, lost: 4, goalsFor: 40, goalsAgainst: 28, goalDifference: 12, points: 38, form: 'WDLWW', pointsAvg: '1.90' },
            { position: 7, name: 'Newcastle', teamId: '133626', played: 20, won: 10, draw: 6, lost: 4, goalsFor: 35, goalsAgainst: 24, goalDifference: 11, points: 36, form: 'DDWLW', pointsAvg: '1.80' },
            { position: 8, name: 'Brighton', teamId: '133632', played: 20, won: 10, draw: 5, lost: 5, goalsFor: 37, goalsAgainst: 28, goalDifference: 9, points: 35, form: 'WLWDW', pointsAvg: '1.75' },
            { position: 9, name: 'Aston Villa', teamId: '133605', played: 20, won: 9, draw: 6, lost: 5, goalsFor: 33, goalsAgainst: 29, goalDifference: 4, points: 33, form: 'DWLWD', pointsAvg: '1.65' },
            { position: 10, name: 'West Ham', teamId: '133619', played: 20, won: 9, draw: 5, lost: 6, goalsFor: 31, goalsAgainst: 30, goalDifference: 1, points: 32, form: 'LWDWL', pointsAvg: '1.60' },
            { position: 11, name: 'Brentford', teamId: '136307', played: 20, won: 8, draw: 7, lost: 5, goalsFor: 32, goalsAgainst: 28, goalDifference: 4, points: 31, form: 'DDWDL', pointsAvg: '1.55' },
            { position: 12, name: 'Fulham', teamId: '133609', played: 20, won: 8, draw: 6, lost: 6, goalsFor: 30, goalsAgainst: 29, goalDifference: 1, points: 30, form: 'WLDWD', pointsAvg: '1.50' },
            { position: 13, name: 'Crystal Palace', teamId: '133614', played: 20, won: 7, draw: 8, lost: 5, goalsFor: 26, goalsAgainst: 27, goalDifference: -1, points: 29, form: 'DDLWD', pointsAvg: '1.45' },
            { position: 14, name: 'Everton', teamId: '133608', played: 20, won: 7, draw: 7, lost: 6, goalsFor: 24, goalsAgainst: 26, goalDifference: -2, points: 28, form: 'LDWDL', pointsAvg: '1.40' },
            { position: 15, name: 'Wolves', teamId: '134301', played: 20, won: 6, draw: 8, lost: 6, goalsFor: 22, goalsAgainst: 28, goalDifference: -6, points: 26, form: 'DDLLW', pointsAvg: '1.30' },
            { position: 16, name: 'Bournemouth', teamId: '133616', played: 20, won: 6, draw: 6, lost: 8, goalsFor: 23, goalsAgainst: 32, goalDifference: -9, points: 24, form: 'LWLDD', pointsAvg: '1.20' },
            { position: 17, name: 'Nottingham Forest', teamId: '133622', played: 20, won: 5, draw: 7, lost: 8, goalsFor: 20, goalsAgainst: 31, goalDifference: -11, points: 22, form: 'DLLLD', pointsAvg: '1.10' },
            { position: 18, name: 'Luton Town', teamId: '133674', played: 20, won: 4, draw: 6, lost: 10, goalsFor: 18, goalsAgainst: 35, goalDifference: -17, points: 18, form: 'LLDLL', pointsAvg: '0.90' },
            { position: 19, name: 'Sheffield United', teamId: '133624', played: 20, won: 3, draw: 5, lost: 12, goalsFor: 16, goalsAgainst: 40, goalDifference: -24, points: 14, form: 'LLLLD', pointsAvg: '0.70' },
            { position: 20, name: 'Burnley', teamId: '133618', played: 20, won: 2, draw: 4, lost: 14, goalsFor: 14, goalsAgainst: 42, goalDifference: -28, points: 10, form: 'LLLLL', pointsAvg: '0.50' }
        ];
    }

    getSimulatedFixtures() {
        const now = new Date();
        const fixtures = [];
        const teams = this.getSimulatedStandings();

        for (let i = 0; i < 10; i++) {
            const matchDate = new Date(now.getTime() + (i * 24 * 60 * 60 * 1000));
            const home = teams[Math.floor(Math.random() * teams.length)];
            const away = teams[Math.floor(Math.random() * teams.length)];

            if (home.teamId !== away.teamId) {
                fixtures.push({
                    id: `fixture_${i}`,
                    date: matchDate.toISOString().split('T')[0],
                    time: `${15 + i % 6}:00:00`,
                    homeTeam: home.name,
                    awayTeam: away.name,
                    homeTeamId: home.teamId,
                    awayTeamId: away.teamId,
                    league: 'Premier League',
                    season: '2024-2025',
                    venue: `${home.name} Stadium`,
                    status: 'Scheduled'
                });
            }
        }

        return fixtures;
    }

    generateSimulatedOdds() {
        // Generar cuotas realistas
        const homeWin = 1.5 + Math.random() * 3;
        const draw = 2.5 + Math.random() * 2;
        const awayWin = 1.5 + Math.random() * 3;

        return {
            homeWin: parseFloat(homeWin.toFixed(2)),
            draw: parseFloat(draw.toFixed(2)),
            awayWin: parseFloat(awayWin.toFixed(2)),
            over25: parseFloat((1.7 + Math.random() * 0.6).toFixed(2)),
            under25: parseFloat((1.7 + Math.random() * 0.6).toFixed(2)),
            btts: parseFloat((1.6 + Math.random() * 0.8).toFixed(2))
        };
    }

    /**
     * Iniciar actualización automática
     */
    startAutoUpdate(leagueId, callbacks) {
        // Actualizar clasificación cada 5 minutos
        this.updateIntervals.set('standings', setInterval(() => {
            this.getStandings(leagueId).then(data => {
                if (callbacks.onStandingsUpdate) {
                    callbacks.onStandingsUpdate(data);
                }
            });
        }, CONFIG.UPDATE_INTERVALS.STANDINGS));

        // Actualizar fixtures cada 10 minutos
        this.updateIntervals.set('fixtures', setInterval(() => {
            this.getUpcomingFixtures(leagueId).then(data => {
                if (callbacks.onFixturesUpdate) {
                    callbacks.onFixturesUpdate(data);
                }
            });
        }, CONFIG.UPDATE_INTERVALS.FIXTURES));

        // Actualizar marcadores en vivo cada 30 segundos
        this.updateIntervals.set('liveScores', setInterval(() => {
            this.getLiveScores(leagueId).then(data => {
                if (callbacks.onLiveScoresUpdate) {
                    callbacks.onLiveScoresUpdate(data);
                }
            });
        }, CONFIG.UPDATE_INTERVALS.LIVE_SCORES));
    }

    /**
     * Detener actualización automática
     */
    stopAutoUpdate() {
        this.updateIntervals.forEach(interval => clearInterval(interval));
        this.updateIntervals.clear();
    }
}

// Exportar servicio
const apiService = new FootballAPIService();
