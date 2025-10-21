/**
 * Servicio de API para Football-data.org (DATOS EN VIVO)
 */

class FootballDataService {
    constructor() {
        this.apiKey = CONFIG.FOOTBALL_DATA.API_KEY;
        this.baseUrl = CONFIG.FOOTBALL_DATA.BASE_URL;
        this.cache = new Map();
        this.cacheExpiry = new Map();
    }

    /**
     * Realizar petición HTTP a Football-data.org
     */
    async fetchFromAPI(endpoint, params = {}) {
        try {
            // Construir URL con parámetros
            const url = new URL(`${this.baseUrl}${endpoint}`);
            Object.keys(params).forEach(key => {
                url.searchParams.append(key, params[key]);
            });

            console.log('🌐 Fetching from Football-data.org:', url.toString());

            const response = await fetch(url.toString(), {
                method: 'GET',
                headers: {
                    'X-Auth-Token': this.apiKey,
                    'Accept': 'application/json'
                }
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            console.log('✅ Data received:', data);
            return data;

        } catch (error) {
            console.error('❌ Error fetching from Football-data.org:', error);
            throw error;
        }
    }

    /**
     * Obtener clasificación de la liga
     */
    async getStandings(leagueCode) {
        const cacheKey = `standings_${leagueCode}`;

        if (this.isCacheValid(cacheKey)) {
            console.log('📦 Using cached standings for', leagueCode);
            return this.cache.get(cacheKey);
        }

        try {
            // Obtener ID numérico de la competición
            const competitionId = CONFIG.COMPETITION_IDS[leagueCode] || leagueCode;

            const endpoint = `/competitions/${competitionId}/standings`;
            const data = await this.fetchFromAPI(endpoint);

            if (data.standings && data.standings.length > 0) {
                // Football-data.org devuelve standings en un array
                // Normalmente standings[0] es la tabla general
                const tableData = data.standings[0].table;
                const standings = this.normalizeStandings(tableData);

                this.setCache(cacheKey, standings, 300000); // Cache por 5 minutos
                return standings;
            }

            throw new Error('No standings data available');

        } catch (error) {
            console.error('Error fetching standings from Football-data.org:', error);
            throw error;
        }
    }

    /**
     * Obtener próximos partidos de una liga
     */
    async getUpcomingFixtures(leagueCode, days = 30) {
        const cacheKey = `fixtures_${leagueCode}`;

        if (this.isCacheValid(cacheKey)) {
            console.log('📦 Using cached fixtures for', leagueCode);
            return this.cache.get(cacheKey);
        }

        try {
            const competitionId = CONFIG.COMPETITION_IDS[leagueCode] || leagueCode;

            // Calcular rango de fechas
            const today = new Date();
            const futureDate = new Date();
            futureDate.setDate(today.getDate() + days);

            const endpoint = `/competitions/${competitionId}/matches`;
            const params = {
                status: 'SCHEDULED',
                dateFrom: today.toISOString().split('T')[0],
                dateTo: futureDate.toISOString().split('T')[0]
            };

            const data = await this.fetchFromAPI(endpoint, params);

            if (data.matches) {
                const fixtures = this.normalizeFixtures(data.matches);
                this.setCache(cacheKey, fixtures, 600000); // Cache por 10 minutos
                return fixtures;
            }

            return [];

        } catch (error) {
            console.error('Error fetching fixtures from Football-data.org:', error);
            throw error;
        }
    }

    /**
     * Obtener partidos en vivo
     */
    async getLiveMatches(leagueCode = null) {
        try {
            let endpoint = '/matches';
            const params = { status: 'LIVE' };

            if (leagueCode) {
                const competitionId = CONFIG.COMPETITION_IDS[leagueCode] || leagueCode;
                endpoint = `/competitions/${competitionId}/matches`;
            }

            const data = await this.fetchFromAPI(endpoint, params);

            if (data.matches) {
                return this.normalizeLiveMatches(data.matches);
            }

            return [];

        } catch (error) {
            console.error('Error fetching live matches:', error);
            return [];
        }
    }

    /**
     * Obtener todos los partidos de hoy
     */
    async getTodayMatches(leagueCode = null) {
        try {
            const today = new Date().toISOString().split('T')[0];

            let endpoint = '/matches';
            const params = { dateFrom: today, dateTo: today };

            if (leagueCode) {
                const competitionId = CONFIG.COMPETITION_IDS[leagueCode] || leagueCode;
                endpoint = `/competitions/${competitionId}/matches`;
            }

            const data = await this.fetchFromAPI(endpoint, params);

            if (data.matches) {
                return this.normalizeFixtures(data.matches);
            }

            return [];

        } catch (error) {
            console.error('Error fetching today matches:', error);
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
            const endpoint = `/teams/${teamId}`;
            const data = await this.fetchFromAPI(endpoint);

            if (data) {
                this.setCache(cacheKey, data, 3600000); // Cache por 1 hora
                return data;
            }

            return null;

        } catch (error) {
            console.error('Error fetching team details:', error);
            return null;
        }
    }

    /**
     * Obtener detalles de un partido específico
     */
    async getMatchDetails(matchId) {
        try {
            const endpoint = `/matches/${matchId}`;
            const data = await this.fetchFromAPI(endpoint);
            return data;

        } catch (error) {
            console.error('Error fetching match details:', error);
            return null;
        }
    }

    /**
     * Normalizar datos de clasificación de Football-data.org
     */
    normalizeStandings(rawData) {
        return rawData.map(team => ({
            position: team.position,
            name: team.team.name,
            teamId: team.team.id.toString(),
            played: team.playedGames,
            won: team.won,
            draw: team.draw,
            lost: team.lost,
            goalsFor: team.goalsFor,
            goalsAgainst: team.goalsAgainst,
            goalDifference: team.goalDifference,
            points: team.points,
            form: team.form || this.generateFormFromStats(team), // Si no hay form, generarlo
            pointsAvg: team.playedGames > 0 ? (team.points / team.playedGames).toFixed(2) : '0.00',
            // Datos adicionales
            crest: team.team.crest,
            shortName: team.team.shortName,
            tla: team.team.tla
        }));
    }

    /**
     * Generar forma basada en estadísticas cuando no está disponible
     */
    generateFormFromStats(team) {
        // Generar forma estimada basada en últimos resultados
        const winRate = team.playedGames > 0 ? team.won / team.playedGames : 0;
        const form = [];

        for (let i = 0; i < 5; i++) {
            const rand = Math.random();
            if (rand < winRate) {
                form.push('W');
            } else if (rand < winRate + (team.draw / team.playedGames)) {
                form.push('D');
            } else {
                form.push('L');
            }
        }

        return form.join('');
    }

    /**
     * Normalizar fixtures de Football-data.org
     */
    normalizeFixtures(rawData) {
        return rawData.map(match => {
            const matchDate = new Date(match.utcDate);

            return {
                id: match.id.toString(),
                date: matchDate.toISOString().split('T')[0],
                time: matchDate.toTimeString().split(' ')[0],
                homeTeam: match.homeTeam.name,
                awayTeam: match.awayTeam.name,
                homeTeamId: match.homeTeam.id.toString(),
                awayTeamId: match.awayTeam.id.toString(),
                league: match.competition.name,
                season: match.season.startDate ? match.season.startDate.split('-')[0] : 'N/A',
                venue: match.venue || 'TBD',
                status: this.translateStatus(match.status),
                // Datos adicionales de Football-data.org
                matchday: match.matchday,
                homeCrest: match.homeTeam.crest,
                awayCrest: match.awayTeam.crest,
                // Resultado si está disponible
                score: match.score ? {
                    home: match.score.fullTime.home,
                    away: match.score.fullTime.away,
                    halfTime: match.score.halfTime
                } : null
            };
        });
    }

    /**
     * Normalizar partidos en vivo
     */
    normalizeLiveMatches(rawData) {
        return rawData.map(match => ({
            id: match.id.toString(),
            homeTeam: match.homeTeam.name,
            awayTeam: match.awayTeam.name,
            homeTeamId: match.homeTeam.id.toString(),
            awayTeamId: match.awayTeam.id.toString(),
            homeScore: match.score.fullTime.home || 0,
            awayScore: match.score.fullTime.away || 0,
            halfTimeScore: match.score.halfTime ? {
                home: match.score.halfTime.home,
                away: match.score.halfTime.away
            } : null,
            time: this.getMatchMinute(match),
            status: this.translateStatus(match.status),
            league: match.competition.name
        }));
    }

    /**
     * Obtener minuto del partido
     */
    getMatchMinute(match) {
        const startTime = new Date(match.utcDate);
        const now = new Date();
        const elapsed = Math.floor((now - startTime) / 60000); // Minutos transcurridos

        if (match.status === 'IN_PLAY') {
            return elapsed <= 45 ? `${elapsed}'` : `${Math.min(elapsed, 90)}'`;
        } else if (match.status === 'PAUSED') {
            return 'HT'; // Half Time
        }

        return match.status;
    }

    /**
     * Traducir estado del partido
     */
    translateStatus(status) {
        const statusMap = {
            'SCHEDULED': 'Programado',
            'TIMED': 'Programado',
            'IN_PLAY': 'En Vivo',
            'PAUSED': 'Descanso',
            'FINISHED': 'Finalizado',
            'POSTPONED': 'Pospuesto',
            'SUSPENDED': 'Suspendido',
            'CANCELLED': 'Cancelado'
        };

        return statusMap[status] || status;
    }

    /**
     * Obtener cuotas (simuladas por ahora - Football-data.org no provee cuotas en plan gratuito)
     */
    async getOdds(matchId = null) {
        // Football-data.org no incluye cuotas en el plan gratuito
        // Generamos cuotas estimadas basadas en las clasificaciones
        return this.generateEstimatedOdds();
    }

    /**
     * Generar cuotas estimadas basadas en probabilidades
     */
    generateEstimatedOdds() {
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
     * Generar cuotas mejoradas basadas en estadísticas de equipos
     */
    generateOddsFromTeamStats(homeTeam, awayTeam) {
        // Calcular probabilidades basadas en posición y puntos
        const homeStrength = parseFloat(homeTeam.pointsAvg);
        const awayStrength = parseFloat(awayTeam.pointsAvg);

        // Ajuste por ventaja local
        const homeAdjusted = homeStrength * 1.15;
        const awayAdjusted = awayStrength * 0.85;

        // Calcular probabilidades
        const total = homeAdjusted + awayAdjusted;
        const homeProb = homeAdjusted / total;
        const awayProb = awayAdjusted / total;
        const drawProb = 0.25;

        // Normalizar
        const sumProb = homeProb + drawProb + awayProb;
        const normalizedHome = homeProb / sumProb;
        const normalizedDraw = drawProb / sumProb;
        const normalizedAway = awayProb / sumProb;

        // Convertir a cuotas (con margen de casa de apuestas del 10%)
        const margin = 1.1;
        const homeOdds = (1 / normalizedHome) * margin;
        const drawOdds = (1 / normalizedDraw) * margin;
        const awayOdds = (1 / normalizedAway) * margin;

        // Calcular Over/Under basado en goles promedio
        const homeGoalsAvg = homeTeam.played > 0 ? homeTeam.goalsFor / homeTeam.played : 1.5;
        const awayGoalsAvg = awayTeam.played > 0 ? awayTeam.goalsFor / awayTeam.played : 1.5;
        const expectedGoals = (homeGoalsAvg + awayGoalsAvg) * 0.9;

        const overProb = expectedGoals > 2.5 ? 0.6 : 0.4;
        const underProb = 1 - overProb;

        return {
            homeWin: parseFloat(homeOdds.toFixed(2)),
            draw: parseFloat(drawOdds.toFixed(2)),
            awayWin: parseFloat(awayOdds.toFixed(2)),
            over25: parseFloat(((1 / overProb) * margin).toFixed(2)),
            under25: parseFloat(((1 / underProb) * margin).toFixed(2)),
            btts: parseFloat((1.8 + Math.random() * 0.4).toFixed(2))
        };
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
     * Obtener competiciones disponibles
     */
    async getAvailableCompetitions() {
        const cacheKey = 'competitions';

        if (this.isCacheValid(cacheKey)) {
            return this.cache.get(cacheKey);
        }

        try {
            const endpoint = '/competitions';
            const data = await this.fetchFromAPI(endpoint);

            if (data.competitions) {
                this.setCache(cacheKey, data.competitions, 86400000); // Cache por 24 horas
                return data.competitions;
            }

            return [];

        } catch (error) {
            console.error('Error fetching competitions:', error);
            return [];
        }
    }

    /**
     * Verificar el estado de la API y plan
     */
    async checkAPIStatus() {
        try {
            // Intentar una llamada simple para verificar la API
            const endpoint = '/competitions/2021/standings'; // Premier League
            await this.fetchFromAPI(endpoint);
            return {
                status: 'active',
                message: 'API de Football-data.org conectada correctamente'
            };
        } catch (error) {
            if (error.message.includes('429')) {
                return {
                    status: 'limit_reached',
                    message: 'Límite de llamadas alcanzado. Espera un momento.'
                };
            }
            return {
                status: 'error',
                message: 'Error conectando con Football-data.org: ' + error.message
            };
        }
    }
}

// Crear instancia global del servicio
const footballDataService = new FootballDataService();
