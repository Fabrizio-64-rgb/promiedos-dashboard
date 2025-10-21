/**
 * Configuración de APIs y constantes del dashboard
 */

const CONFIG = {
    // API de TheSportsDB (gratuita)
    THESPORTSDB: {
        API_KEY: '3', // API Key gratuita
        BASE_URL: 'https://www.thesportsdb.com/api/v1/json',
        ENDPOINTS: {
            LEAGUES: '/all_leagues.php',
            STANDINGS: '/lookuptable.php',
            EVENTS: '/eventsnextleague.php',
            LIVE_SCORES: '/livescore.php',
            TEAM: '/lookupteam.php',
            EVENT_DETAILS: '/lookupevent.php'
        }
    },

    // API-Football (requiere registro gratuito en api-football.com)
    API_FOOTBALL: {
        API_KEY: '', // Agregar tu API key de api-football.com
        BASE_URL: 'https://v3.football.api-sports.io',
        ENDPOINTS: {
            FIXTURES: '/fixtures',
            STANDINGS: '/standings',
            PREDICTIONS: '/predictions',
            ODDS: '/odds'
        }
    },

    // Ligas principales por defecto
    DEFAULT_LEAGUES: {
        PREMIER_LEAGUE: '4328',
        LA_LIGA: '4335',
        BUNDESLIGA: '4331',
        SERIE_A: '4332',
        LIGUE_1: '4334',
        CHAMPIONS_LEAGUE: '4480'
    },

    // Configuración de actualización
    UPDATE_INTERVALS: {
        LIVE_SCORES: 30000,      // 30 segundos
        STANDINGS: 300000,        // 5 minutos
        FIXTURES: 600000,         // 10 minutos
        PREDICTIONS: 900000       // 15 minutos
    },

    // Configuración de apuestas
    BETTING: {
        DEFAULT_BANKROLL: 1000,
        KELLY_FRACTIONS: [1, 0.5, 0.25],
        MAX_PARLAY_SIZE: 6,
        MIN_VALUE_THRESHOLD: 0.05, // 5% de valor mínimo
        CONFIDENCE_THRESHOLD: 0.7   // 70% de confianza mínima
    },

    // Configuración de algoritmos
    ALGORITHMS: {
        ELO: {
            K_FACTOR: 32,
            HOME_ADVANTAGE: 100
        },
        MINIMAX: {
            WIN_WEIGHT: 0.4,
            POINTS_WEIGHT: 0.6,
            HOME_MULTIPLIER: 1.15,
            AWAY_MULTIPLIER: 0.85
        }
    }
};

// Exportar configuración
if (typeof module !== 'undefined' && module.exports) {
    module.exports = CONFIG;
}
