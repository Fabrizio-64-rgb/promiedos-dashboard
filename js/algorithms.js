/**
 * Algoritmos predictivos y cálculos de apuestas
 */

class PredictionAlgorithms {
    /**
     * Algoritmo ELO para predicción de partidos
     */
    static calculateELO(homeTeam, awayTeam) {
        // Calcular rating ELO basado en puntos promedio
        const homeElo = 1500 + (parseFloat(homeTeam.pointsAvg) * 200) + CONFIG.ALGORITHMS.ELO.HOME_ADVANTAGE;
        const awayElo = 1500 + (parseFloat(awayTeam.pointsAvg) * 200);

        // Calcular probabilidades
        const expectedHome = 1 / (1 + Math.pow(10, (awayElo - homeElo) / 400));
        const expectedAway = 1 - expectedHome;
        const expectedDraw = 0.25; // Factor de empate

        // Normalizar probabilidades
        const total = expectedHome + expectedAway + expectedDraw;
        const probHome = expectedHome / total;
        const probDraw = expectedDraw / total;
        const probAway = expectedAway / total;

        // Calcular confianza basada en diferencia de ELO
        const eloDiff = Math.abs(homeElo - awayElo);
        const confidence = Math.min(0.95, 0.65 + (eloDiff / 1000));

        return {
            homeWin: parseFloat((probHome * 100).toFixed(2)),
            draw: parseFloat((probDraw * 100).toFixed(2)),
            awayWin: parseFloat((probAway * 100).toFixed(2)),
            confidence: parseFloat((confidence * 100).toFixed(2)),
            homeElo: Math.round(homeElo),
            awayElo: Math.round(awayElo)
        };
    }

    /**
     * Algoritmo MINIMAX para predicción conservadora
     */
    static calculateMINIMAX(homeTeam, awayTeam) {
        // Calcular fortaleza basada en victorias y puntos
        const homeWinRate = homeTeam.played > 0 ? (homeTeam.won / homeTeam.played) : 0;
        const awayWinRate = awayTeam.played > 0 ? (awayTeam.won / awayTeam.played) : 0;

        const homeStrength = (homeWinRate * CONFIG.ALGORITHMS.MINIMAX.WIN_WEIGHT) +
                            (parseFloat(homeTeam.pointsAvg) / 3 * CONFIG.ALGORITHMS.MINIMAX.POINTS_WEIGHT);
        const awayStrength = (awayWinRate * CONFIG.ALGORITHMS.MINIMAX.WIN_WEIGHT) +
                            (parseFloat(awayTeam.pointsAvg) / 3 * CONFIG.ALGORITHMS.MINIMAX.POINTS_WEIGHT);

        // Aplicar ventaja local
        const adjustedHome = homeStrength * CONFIG.ALGORITHMS.MINIMAX.HOME_MULTIPLIER;
        const adjustedAway = awayStrength * CONFIG.ALGORITHMS.MINIMAX.AWAY_MULTIPLIER;

        // Calcular probabilidades
        const total = adjustedHome + adjustedAway;
        const probHome = total > 0 ? (adjustedHome / total) : 0.33;
        const probAway = total > 0 ? (adjustedAway / total) : 0.33;
        const probDraw = 0.25;

        // Normalizar
        const sumProb = probHome + probDraw + probAway;
        const finalHome = probHome / sumProb;
        const finalDraw = probDraw / sumProb;
        const finalAway = probAway / sumProb;

        // Confianza más conservadora que ELO
        const strengthDiff = Math.abs(homeStrength - awayStrength);
        const confidence = Math.min(0.85, 0.55 + strengthDiff);

        return {
            homeWin: parseFloat((finalHome * 100).toFixed(2)),
            draw: parseFloat((finalDraw * 100).toFixed(2)),
            awayWin: parseFloat((finalAway * 100).toFixed(2)),
            confidence: parseFloat((confidence * 100).toFixed(2)),
            homeStrength: parseFloat(homeStrength.toFixed(3)),
            awayStrength: parseFloat(awayStrength.toFixed(3))
        };
    }

    /**
     * Análisis de goles (Over/Under 2.5)
     */
    static analyzeGoals(homeTeam, awayTeam) {
        const homeAvgGoals = homeTeam.played > 0 ? homeTeam.goalsFor / homeTeam.played : 0;
        const awayAvgGoals = awayTeam.played > 0 ? awayTeam.goalsFor / awayTeam.played : 0;
        const totalExpected = (homeAvgGoals + awayAvgGoals) * 0.9; // Factor de ajuste

        const over25Prob = totalExpected > 2.5 ?
            Math.min(0.85, 0.5 + ((totalExpected - 2.5) * 0.15)) :
            Math.max(0.15, 0.5 - ((2.5 - totalExpected) * 0.15));

        const under25Prob = 1 - over25Prob;

        // BTTS (Both Teams To Score)
        const homeScoringProb = homeAvgGoals > 0.8 ? 0.7 : 0.4;
        const awayScoringProb = awayAvgGoals > 0.8 ? 0.7 : 0.4;
        const bttsProb = homeScoringProb * awayScoringProb;

        return {
            expectedGoals: parseFloat(totalExpected.toFixed(2)),
            over25: parseFloat((over25Prob * 100).toFixed(2)),
            under25: parseFloat((under25Prob * 100).toFixed(2)),
            btts: parseFloat((bttsProb * 100).toFixed(2)),
            homeAvgGoals: parseFloat(homeAvgGoals.toFixed(2)),
            awayAvgGoals: parseFloat(awayAvgGoals.toFixed(2))
        };
    }

    /**
     * Análisis marginal (halftime/fulltime, posesión, etc.)
     */
    static analyzeMarginals(homeTeam, awayTeam) {
        // Estimación de goles por tiempo
        const totalExpected = this.analyzeGoals(homeTeam, awayTeam).expectedGoals;
        const firstHalfGoals = totalExpected * 0.45;
        const secondHalfGoals = totalExpected * 0.55;

        // Estimación de posesión basada en fortaleza
        const homeStrength = parseFloat(homeTeam.pointsAvg);
        const awayStrength = parseFloat(awayTeam.pointsAvg);
        const totalStrength = homeStrength + awayStrength;
        const homePossession = totalStrength > 0 ?
            (homeStrength / totalStrength) * 100 * 1.1 : 50; // Factor de local

        // Índice de riesgo (volatilidad)
        const homeVolatility = homeTeam.played > 0 ?
            Math.abs(homeTeam.goalsFor - homeTeam.goalsAgainst) / homeTeam.played : 0;
        const awayVolatility = awayTeam.played > 0 ?
            Math.abs(awayTeam.goalsFor - awayTeam.goalsAgainst) / awayTeam.played : 0;
        const riskIndex = (homeVolatility + awayVolatility) / 2;

        // Tipología del equipo
        const homeType = this.getTeamTypology(homeTeam);
        const awayType = this.getTeamTypology(awayTeam);

        return {
            firstHalfGoals: parseFloat(firstHalfGoals.toFixed(2)),
            secondHalfGoals: parseFloat(secondHalfGoals.toFixed(2)),
            homePossession: Math.min(70, Math.max(30, parseFloat(homePossession.toFixed(1)))),
            awayPossession: Math.min(70, Math.max(30, parseFloat((100 - homePossession).toFixed(1)))),
            riskIndex: parseFloat(riskIndex.toFixed(2)),
            homeTypology: homeType,
            awayTypology: awayType
        };
    }

    /**
     * Clasificar tipología del equipo
     */
    static getTeamTypology(team) {
        const goalsForAvg = team.played > 0 ? team.goalsFor / team.played : 0;
        const goalsAgainstAvg = team.played > 0 ? team.goalsAgainst / team.played : 0;

        if (goalsForAvg > 1.8 && goalsAgainstAvg > 1.5) {
            return 'Ofensivo/Alto Riesgo';
        } else if (goalsForAvg > 1.8 && goalsAgainstAvg < 1.0) {
            return 'Ofensivo/Equilibrado';
        } else if (goalsForAvg < 1.2 && goalsAgainstAvg < 1.0) {
            return 'Defensivo/Conservador';
        } else if (goalsForAvg < 1.2 && goalsAgainstAvg > 1.5) {
            return 'Defensivo/Vulnerable';
        } else {
            return 'Equilibrado';
        }
    }
}

class BettingCalculations {
    /**
     * Kelly Criterion para dimensionamiento óptimo de apuestas
     */
    static kellyCalculator(probability, odds, bankroll, fraction = 1) {
        const p = probability / 100; // Convertir a decimal
        const q = 1 - p;
        const b = odds - 1; // Net odds

        // Fórmula de Kelly: f = (bp - q) / b
        const kelly = (b * p - q) / b;
        const adjustedKelly = Math.max(0, kelly * fraction); // No apostar si es negativo

        const stake = bankroll * adjustedKelly;
        const potentialReturn = stake * odds;
        const potentialProfit = potentialReturn - stake;

        return {
            kellyPercentage: parseFloat((adjustedKelly * 100).toFixed(2)),
            recommendedStake: parseFloat(stake.toFixed(2)),
            potentialReturn: parseFloat(potentialReturn.toFixed(2)),
            potentialProfit: parseFloat(potentialProfit.toFixed(2)),
            riskLevel: this.getRiskLevel(adjustedKelly)
        };
    }

    /**
     * Calcular valor esperado (EV)
     */
    static calculateEV(probability, odds) {
        const p = probability / 100;
        const ev = (p * (odds - 1)) - (1 - p);
        const evPercentage = ev * 100;

        return {
            ev: parseFloat(ev.toFixed(4)),
            evPercentage: parseFloat(evPercentage.toFixed(2)),
            isValue: ev > 0
        };
    }

    /**
     * Value Betting - Encontrar apuestas con valor
     */
    static findValueBets(predictions, odds) {
        const bets = [
            { type: 'Home Win', probability: predictions.homeWin, odds: odds.homeWin },
            { type: 'Draw', probability: predictions.draw, odds: odds.draw },
            { type: 'Away Win', probability: predictions.awayWin, odds: odds.awayWin }
        ];

        const valueBets = bets.map(bet => {
            const ev = this.calculateEV(bet.probability, bet.odds);
            const impliedProb = (1 / bet.odds) * 100;
            const valuePercent = bet.probability - impliedProb;

            return {
                ...bet,
                ...ev,
                impliedProbability: parseFloat(impliedProb.toFixed(2)),
                valuePercent: parseFloat(valuePercent.toFixed(2)),
                hasValue: valuePercent > CONFIG.BETTING.MIN_VALUE_THRESHOLD * 100
            };
        }).sort((a, b) => b.evPercentage - a.evPercentage);

        return valueBets;
    }

    /**
     * Sugeridor de Parlays (apuestas combinadas)
     */
    static generateParlays(fixtures, maxSize = CONFIG.BETTING.MAX_PARLAY_SIZE) {
        const parlays = [];

        // Generar combinaciones de 2 a maxSize
        for (let size = 2; size <= Math.min(maxSize, fixtures.length); size++) {
            const combinations = this.getCombinations(fixtures, size);

            combinations.forEach(combo => {
                const parlay = this.calculateParlayOdds(combo);
                if (parlay.totalProbability > 20) { // Mínimo 20% de probabilidad
                    parlays.push(parlay);
                }
            });
        }

        // Ordenar por EV y tomar los mejores 6
        return parlays.sort((a, b) => b.ev - a.ev).slice(0, 6);
    }

    /**
     * Calcular cuotas acumuladas de parlay
     */
    static calculateParlayOdds(selections) {
        let totalOdds = 1;
        let totalProbability = 100;

        selections.forEach(sel => {
            totalOdds *= sel.odds;
            totalProbability *= (sel.probability / 100);
        });

        totalProbability *= 100;

        const ev = this.calculateEV(totalProbability, totalOdds);
        const stake = 10; // Stake fija de ejemplo
        const potentialReturn = stake * totalOdds;

        return {
            selections: selections.map(s => `${s.match}: ${s.type}`),
            size: selections.length,
            totalOdds: parseFloat(totalOdds.toFixed(2)),
            totalProbability: parseFloat(totalProbability.toFixed(2)),
            ev: ev.evPercentage,
            stake: stake,
            potentialReturn: parseFloat(potentialReturn.toFixed(2)),
            potentialProfit: parseFloat((potentialReturn - stake).toFixed(2)),
            riskReward: parseFloat((potentialReturn / stake).toFixed(2))
        };
    }

    /**
     * Generar combinaciones
     */
    static getCombinations(arr, size) {
        if (size > arr.length) return [];
        if (size === 1) return arr.map(el => [el]);

        const combinations = [];
        for (let i = 0; i < arr.length - size + 1; i++) {
            const head = arr[i];
            const tailCombos = this.getCombinations(arr.slice(i + 1), size - 1);
            tailCombos.forEach(combo => {
                combinations.push([head, ...combo]);
            });
        }
        return combinations;
    }

    /**
     * Sistema de alertas y anomalías
     */
    static generateAlerts(homeTeam, awayTeam, predictions, odds) {
        const alerts = [];

        // Alerta de cambio drástico de cuotas (simulada)
        if (Math.random() > 0.7) {
            alerts.push({
                type: 'Odds Movement',
                severity: 'Warning',
                message: `Las cuotas del ${homeTeam.name} han bajado un 15% en las últimas 2 horas`,
                action: 'Revisar noticias recientes del equipo',
                timestamp: new Date().toISOString()
            });
        }

        // Alerta de valor extremo
        const valueBets = this.findValueBets(predictions, odds);
        const highValue = valueBets.find(b => b.valuePercent > 10);
        if (highValue) {
            alerts.push({
                type: 'High Value',
                severity: 'Info',
                message: `Oportunidad de alto valor en ${highValue.type}: ${highValue.valuePercent}% sobre cuota`,
                action: 'Considerar apuesta de valor',
                timestamp: new Date().toISOString()
            });
        }

        // Alerta de forma reciente
        if (homeTeam.form && homeTeam.form.slice(-3) === 'LLL') {
            alerts.push({
                type: 'Poor Form',
                severity: 'Warning',
                message: `${homeTeam.name} ha perdido sus últimos 3 partidos`,
                action: 'Evaluar impacto en predicción',
                timestamp: new Date().toISOString()
            });
        }

        // Alerta de lesiones (simulada)
        if (Math.random() > 0.8) {
            alerts.push({
                type: 'Injury Report',
                severity: 'Critical',
                message: `Jugador clave de ${awayTeam.name} podría estar lesionado`,
                action: 'Verificar alineación oficial antes de apostar',
                timestamp: new Date().toISOString()
            });
        }

        return alerts;
    }

    /**
     * Nivel de riesgo de Kelly
     */
    static getRiskLevel(kellyFraction) {
        if (kellyFraction < 0.02) return 'Muy Bajo';
        if (kellyFraction < 0.05) return 'Bajo';
        if (kellyFraction < 0.10) return 'Moderado';
        if (kellyFraction < 0.20) return 'Alto';
        return 'Muy Alto';
    }

    /**
     * Dashboard de rendimiento
     */
    static calculatePerformanceMetrics(predictions, results) {
        if (!results || results.length === 0) {
            return {
                accuracy: 0,
                roi: 0,
                sharpeRatio: 0,
                maxDrawdown: 0,
                totalBets: 0,
                winRate: 0
            };
        }

        const totalBets = results.length;
        const wins = results.filter(r => r.won).length;
        const winRate = (wins / totalBets) * 100;

        const totalStake = results.reduce((sum, r) => sum + r.stake, 0);
        const totalReturn = results.reduce((sum, r) => sum + (r.won ? r.return : 0), 0);
        const roi = ((totalReturn - totalStake) / totalStake) * 100;

        // Sharpe Ratio simplificado
        const returns = results.map(r => r.won ? ((r.return - r.stake) / r.stake) : -1);
        const avgReturn = returns.reduce((sum, r) => sum + r, 0) / returns.length;
        const stdDev = Math.sqrt(
            returns.reduce((sum, r) => sum + Math.pow(r - avgReturn, 2), 0) / returns.length
        );
        const sharpeRatio = stdDev > 0 ? (avgReturn / stdDev) : 0;

        // Max Drawdown
        let peak = 0;
        let maxDrawdown = 0;
        let bankroll = CONFIG.BETTING.DEFAULT_BANKROLL;

        results.forEach(r => {
            bankroll += r.won ? (r.return - r.stake) : -r.stake;
            if (bankroll > peak) peak = bankroll;
            const drawdown = ((peak - bankroll) / peak) * 100;
            if (drawdown > maxDrawdown) maxDrawdown = drawdown;
        });

        return {
            accuracy: parseFloat(winRate.toFixed(2)),
            roi: parseFloat(roi.toFixed(2)),
            sharpeRatio: parseFloat(sharpeRatio.toFixed(2)),
            maxDrawdown: parseFloat(maxDrawdown.toFixed(2)),
            totalBets: totalBets,
            winRate: parseFloat(winRate.toFixed(2))
        };
    }
}
