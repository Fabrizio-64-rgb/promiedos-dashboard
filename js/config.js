/**
 * Configuración de APIs y constantes del dashboard
 */

const CONFIG = {
    // API PRINCIPAL: Football-data.org (DATOS EN VIVO)
    FOOTBALL_DATA: {
        API_KEY: '8a95311bd0a24419b86409b558b1bc0c',
        BASE_URL: 'https://api.football-data.org/v4',
        ENDPOINTS: {
            COMPETITIONS: '/competitions',
            STANDINGS: '/competitions/{id}/standings',
            MATCHES: '/competitions/{id}/matches',
            LIVE_MATCHES: '/matches',
            TEAM: '/teams/{id}',
            MATCH_DETAILS: '/matches/{id}'
        }
    },

    // API de TheSportsDB (fallback)
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

    // API-Football (fallback alternativo)
    API_FOOTBALL: {
        API_KEY: '', // Agregar tu API key de api-football.com si deseas
        BASE_URL: 'https://v3.football.api-sports.io',
        ENDPOINTS: {
            FIXTURES: '/fixtures',
            STANDINGS: '/standings',
            PREDICTIONS: '/predictions',
            ODDS: '/odds'
        }
    },

    // Ligas principales - IDs de Football-data.org
    DEFAULT_LEAGUES: {
        PREMIER_LEAGUE: 'PL',      // 2021 - Premier League
        LA_LIGA: 'PD',             // 2014 - Primera División
        BUNDESLIGA: 'BL1',         // 2002 - Bundesliga
        SERIE_A: 'SA',             // 2019 - Serie A
        LIGUE_1: 'FL1',            // 2015 - Ligue 1
        CHAMPIONS_LEAGUE: 'CL'     // 2001 - Champions League
    },

    // IDs numéricos de las competiciones
    COMPETITION_IDS: {
        PL: 2021,    // Premier League
        PD: 2014,    // La Liga
        BL1: 2002,   // Bundesliga
        SA: 2019,    // Serie A
        FL1: 2015,   // Ligue 1
        CL: 2001,    // Champions League
        WC: 2000,    // World Cup
        EC: 2018     // European Championship
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
