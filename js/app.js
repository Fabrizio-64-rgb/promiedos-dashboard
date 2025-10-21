/**
 * Promiedos Dashboard Pro - Aplicación Principal
 * Gestiona toda la lógica de la interfaz y actualización de datos
 */

class DashboardApp {
    constructor() {
        this.currentLeague = CONFIG.DEFAULT_LEAGUES.PREMIER_LEAGUE; // 'PL' para Football-data.org
        this.selectedHomeTeam = null;
        this.selectedAwayTeam = null;
        this.standings = [];
        this.fixtures = [];
        this.liveScores = [];
        this.autoUpdateEnabled = false;
        this.currentTab = 'dashboard';
        this.historicalResults = this.loadHistoricalResults();
        this.dataSource = 'unknown'; // Rastrear fuente de datos actual

        this.init();
    }

    /**
     * Inicializar aplicación
     */
    async init() {
        this.setupEventListeners();
        await this.loadInitialData();
        this.renderDashboard();
    }

    /**
     * Configurar event listeners
     */
    setupEventListeners() {
        // Toggle sidebar
        const menuToggle = document.getElementById('menuToggle');
        const sidebar = document.getElementById('sidebar');
        const mainContent = document.getElementById('mainContent');

        menuToggle?.addEventListener('click', () => {
            sidebar?.classList.toggle('collapsed');
            mainContent?.classList.toggle('expanded');
        });

        // Auto-update toggle
        const autoUpdateToggle = document.getElementById('autoUpdate');
        autoUpdateToggle?.addEventListener('change', (e) => {
            this.toggleAutoUpdate(e.target.checked);
        });

        // Team selectors
        const homeSelect = document.getElementById('homeTeam');
        const awaySelect = document.getElementById('awayTeam');

        homeSelect?.addEventListener('change', (e) => {
            this.selectHomeTeam(e.target.value);
        });

        awaySelect?.addEventListener('change', (e) => {
            this.selectAwayTeam(e.target.value);
        });

        // Analyze button
        const analyzeBtn = document.getElementById('analyzeBtn');
        analyzeBtn?.addEventListener('click', () => {
            this.analyzeMatch();
        });

        // Download CSV
        const downloadBtn = document.getElementById('downloadCSV');
        downloadBtn?.addEventListener('click', () => {
            this.downloadStandingsCSV();
        });

        // Navigation tabs
        document.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const tab = link.dataset.tab;
                if (tab) {
                    this.switchTab(tab);
                }
            });
        });
    }

    /**
     * Cargar datos iniciales
     */
    async loadInitialData() {
        this.showLoading();

        try {
            this.standings = await apiService.getStandings(this.currentLeague);
            this.fixtures = await apiService.getUpcomingFixtures(this.currentLeague);

            this.populateTeamSelectors();
            this.renderStandingsTable();
            this.renderFixturesTable();
            this.updateQuickStats();
        } catch (error) {
            console.error('Error loading initial data:', error);
            this.showError('Error al cargar datos. Usando datos simulados.');
        } finally {
            this.hideLoading();
        }
    }

    /**
     * Poblar selectores de equipos
     */
    populateTeamSelectors() {
        const homeSelect = document.getElementById('homeTeam');
        const awaySelect = document.getElementById('awayTeam');

        if (!homeSelect || !awaySelect) return;

        const options = this.standings.map(team =>
            `<option value="${team.teamId}">${team.name}</option>`
        ).join('');

        homeSelect.innerHTML = '<option value="">Seleccionar equipo local...</option>' + options;
        awaySelect.innerHTML = '<option value="">Seleccionar equipo visitante...</option>' + options;
    }

    /**
     * Seleccionar equipo local
     */
    selectHomeTeam(teamId) {
        this.selectedHomeTeam = this.standings.find(t => t.teamId === teamId);
        if (this.selectedHomeTeam && this.selectedAwayTeam) {
            this.analyzeMatch();
        }
    }

    /**
     * Seleccionar equipo visitante
     */
    selectAwayTeam(teamId) {
        this.selectedAwayTeam = this.standings.find(t => t.teamId === teamId);
        if (this.selectedHomeTeam && this.selectedAwayTeam) {
            this.analyzeMatch();
        }
    }

    /**
     * Analizar partido
     */
    async analyzeMatch() {
        if (!this.selectedHomeTeam || !this.selectedAwayTeam) {
            alert('Por favor selecciona ambos equipos');
            return;
        }

        if (this.selectedHomeTeam.teamId === this.selectedAwayTeam.teamId) {
            alert('Por favor selecciona equipos diferentes');
            return;
        }

        this.showLoading();

        try {
            // Obtener cuotas mejoradas basadas en estadísticas de equipos
            const odds = await apiService.getOdds(null, this.selectedHomeTeam, this.selectedAwayTeam);

            // Calcular predicciones
            const eloPrediction = PredictionAlgorithms.calculateELO(
                this.selectedHomeTeam,
                this.selectedAwayTeam
            );

            const minimaxPrediction = PredictionAlgorithms.calculateMINIMAX(
                this.selectedHomeTeam,
                this.selectedAwayTeam
            );

            const goalsAnalysis = PredictionAlgorithms.analyzeGoals(
                this.selectedHomeTeam,
                this.selectedAwayTeam
            );

            const marginalsAnalysis = PredictionAlgorithms.analyzeMarginals(
                this.selectedHomeTeam,
                this.selectedAwayTeam
            );

            // Calcular value bets
            const valueBets = BettingCalculations.findValueBets(eloPrediction, odds);

            // Generar alertas
            const alerts = BettingCalculations.generateAlerts(
                this.selectedHomeTeam,
                this.selectedAwayTeam,
                eloPrediction,
                odds
            );

            // Renderizar resultados
            this.renderPredictions(eloPrediction, minimaxPrediction);
            this.renderTrends();
            this.renderRecommendations(eloPrediction, odds, valueBets);
            this.renderValueBetting(valueBets, odds);
            this.renderGoalsAnalysis(goalsAnalysis);
            this.renderMarginals(marginalsAnalysis);
            this.renderParlays(odds, eloPrediction);
            this.renderRiskDashboard(eloPrediction, odds);
            this.renderAlerts(alerts);

        } catch (error) {
            console.error('Error analyzing match:', error);
            this.showError('Error al analizar el partido');
        } finally {
            this.hideLoading();
        }
    }

    /**
     * Renderizar tabla de clasificación
     */
    renderStandingsTable() {
        const container = document.getElementById('standingsTable');
        if (!container) return;

        const html = `
            <div class="table-container">
                <table>
                    <thead>
                        <tr>
                            <th>Pos</th>
                            <th>Equipo</th>
                            <th>PJ</th>
                            <th>G</th>
                            <th>E</th>
                            <th>P</th>
                            <th>GF</th>
                            <th>GC</th>
                            <th>DG</th>
                            <th>Pts</th>
                            <th>Prom</th>
                            <th>Forma</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${this.standings.map(team => `
                            <tr>
                                <td><strong>${team.position}</strong></td>
                                <td><strong>${team.name}</strong></td>
                                <td>${team.played}</td>
                                <td class="text-success">${team.won}</td>
                                <td class="text-warning">${team.draw}</td>
                                <td class="text-danger">${team.lost}</td>
                                <td>${team.goalsFor}</td>
                                <td>${team.goalsAgainst}</td>
                                <td class="${team.goalDifference > 0 ? 'text-success' : team.goalDifference < 0 ? 'text-danger' : ''}">${team.goalDifference > 0 ? '+' : ''}${team.goalDifference}</td>
                                <td><strong>${team.points}</strong></td>
                                <td>${team.pointsAvg}</td>
                                <td>${this.renderForm(team.form)}</td>
                            </tr>
                        `).join('')}
                    </tbody>
                </table>
            </div>
        `;

        container.innerHTML = html;
    }

    /**
     * Renderizar forma del equipo
     */
    renderForm(form) {
        if (!form) return '';

        return form.split('').map(result => {
            let color = 'var(--text-muted)';
            if (result === 'W') color = 'var(--color-win)';
            else if (result === 'L') color = 'var(--color-loss)';
            else if (result === 'D') color = 'var(--color-draw)';

            return `<span style="color: ${color}; font-weight: bold; margin: 0 2px;">${result}</span>`;
        }).join('');
    }

    /**
     * Renderizar tabla de fixtures
     */
    renderFixturesTable() {
        const container = document.getElementById('fixturesTable');
        if (!container || !this.fixtures.length) return;

        const html = `
            <div class="table-container">
                <table>
                    <thead>
                        <tr>
                            <th>Fecha</th>
                            <th>Hora</th>
                            <th>Local</th>
                            <th></th>
                            <th>Visitante</th>
                            <th>Estado</th>
                            <th>Acción</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${this.fixtures.slice(0, 10).map(fixture => `
                            <tr>
                                <td>${new Date(fixture.date).toLocaleDateString('es-ES')}</td>
                                <td>${fixture.time}</td>
                                <td><strong>${fixture.homeTeam}</strong></td>
                                <td class="text-center">vs</td>
                                <td><strong>${fixture.awayTeam}</strong></td>
                                <td><span class="badge-info card-badge">${fixture.status}</span></td>
                                <td>
                                    <button class="btn btn-secondary btn-sm" onclick="app.loadFixture('${fixture.homeTeamId}', '${fixture.awayTeamId}')">
                                        Analizar
                                    </button>
                                </td>
                            </tr>
                        `).join('')}
                    </tbody>
                </table>
            </div>
        `;

        container.innerHTML = html;
    }

    /**
     * Cargar fixture específico
     */
    loadFixture(homeTeamId, awayTeamId) {
        document.getElementById('homeTeam').value = homeTeamId;
        document.getElementById('awayTeam').value = awayTeamId;
        this.selectHomeTeam(homeTeamId);
        this.selectAwayTeam(awayTeamId);
    }

    /**
     * Actualizar estadísticas rápidas
     */
    updateQuickStats() {
        if (!this.standings.length) return;

        const leader = this.standings[0];
        const totalGoals = this.standings.reduce((sum, team) => sum + team.goalsFor, 0);
        const totalMatches = this.standings.reduce((sum, team) => sum + team.played, 0);

        document.getElementById('leaderTeam').textContent = leader.name;
        document.getElementById('leaderPoints').textContent = `${leader.points} pts`;
        document.getElementById('totalGoals').textContent = totalGoals;
        document.getElementById('totalMatches').textContent = totalMatches;
    }

    /**
     * Renderizar predicciones
     */
    renderPredictions(elo, minimax) {
        const container = document.getElementById('predictionsContent');
        if (!container) return;

        const html = `
            <div class="cards-grid">
                <div class="card">
                    <div class="card-header">
                        <h3 class="card-title">Algoritmo ELO</h3>
                        <span class="badge-success card-badge">${elo.confidence}% Confianza</span>
                    </div>
                    <div class="probability-indicator">
                        <span class="prob-label">Victoria Local</span>
                        <div class="prob-bar">
                            <div class="prob-fill" style="width: ${elo.homeWin}%">${elo.homeWin}%</div>
                        </div>
                    </div>
                    <div class="probability-indicator">
                        <span class="prob-label">Empate</span>
                        <div class="prob-bar">
                            <div class="prob-fill" style="width: ${elo.draw}%">${elo.draw}%</div>
                        </div>
                    </div>
                    <div class="probability-indicator">
                        <span class="prob-label">Victoria Visitante</span>
                        <div class="prob-bar">
                            <div class="prob-fill" style="width: ${elo.awayWin}%">${elo.awayWin}%</div>
                        </div>
                    </div>
                    <div class="mt-2 text-muted" style="font-size: 0.875rem;">
                        ELO Local: ${elo.homeElo} | ELO Visitante: ${elo.awayElo}
                    </div>
                </div>

                <div class="card">
                    <div class="card-header">
                        <h3 class="card-title">Algoritmo MINIMAX</h3>
                        <span class="badge-warning card-badge">${minimax.confidence}% Confianza</span>
                    </div>
                    <div class="probability-indicator">
                        <span class="prob-label">Victoria Local</span>
                        <div class="prob-bar">
                            <div class="prob-fill" style="width: ${minimax.homeWin}%">${minimax.homeWin}%</div>
                        </div>
                    </div>
                    <div class="probability-indicator">
                        <span class="prob-label">Empate</span>
                        <div class="prob-bar">
                            <div class="prob-fill" style="width: ${minimax.draw}%">${minimax.draw}%</div>
                        </div>
                    </div>
                    <div class="probability-indicator">
                        <span class="prob-label">Victoria Visitante</span>
                        <div class="prob-bar">
                            <div class="prob-fill" style="width: ${minimax.awayWin}%">${minimax.awayWin}%</div>
                        </div>
                    </div>
                    <div class="mt-2 text-muted" style="font-size: 0.875rem;">
                        Fortaleza Local: ${minimax.homeStrength} | Fortaleza Visitante: ${minimax.awayStrength}
                    </div>
                </div>
            </div>

            <div class="card">
                <div class="card-header">
                    <h3 class="card-title">Comparación de Equipos</h3>
                </div>
                <div class="team-comparison">
                    <div class="team-info">
                        <div class="team-name">${this.selectedHomeTeam.name}</div>
                        <div class="team-stats">
                            <div class="team-stat">
                                <div class="team-stat-label">Posición</div>
                                <div class="team-stat-value">${this.selectedHomeTeam.position}°</div>
                            </div>
                            <div class="team-stat">
                                <div class="team-stat-label">Puntos</div>
                                <div class="team-stat-value">${this.selectedHomeTeam.points}</div>
                            </div>
                            <div class="team-stat">
                                <div class="team-stat-label">Forma</div>
                                <div class="team-stat-value">${this.renderForm(this.selectedHomeTeam.form)}</div>
                            </div>
                        </div>
                    </div>
                    <div class="vs-badge">VS</div>
                    <div class="team-info">
                        <div class="team-name">${this.selectedAwayTeam.name}</div>
                        <div class="team-stats">
                            <div class="team-stat">
                                <div class="team-stat-label">Posición</div>
                                <div class="team-stat-value">${this.selectedAwayTeam.position}°</div>
                            </div>
                            <div class="team-stat">
                                <div class="team-stat-label">Puntos</div>
                                <div class="team-stat-value">${this.selectedAwayTeam.points}</div>
                            </div>
                            <div class="team-stat">
                                <div class="team-stat-label">Forma</div>
                                <div class="team-stat-value">${this.renderForm(this.selectedAwayTeam.form)}</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;

        container.innerHTML = html;
    }

    /**
     * Renderizar tendencias
     */
    renderTrends() {
        const container = document.getElementById('trendsContent');
        if (!container) return;

        const html = `
            <div class="cards-grid">
                <div class="stat-card">
                    <div class="stat-label">${this.selectedHomeTeam.name}</div>
                    <div class="stat-value">${this.selectedHomeTeam.pointsAvg}</div>
                    <div class="stat-change positive">Puntos promedio</div>
                    <div class="mt-2">
                        <div class="text-muted" style="font-size: 0.875rem;">Forma: ${this.renderForm(this.selectedHomeTeam.form)}</div>
                    </div>
                </div>

                <div class="stat-card">
                    <div class="stat-label">${this.selectedAwayTeam.name}</div>
                    <div class="stat-value">${this.selectedAwayTeam.pointsAvg}</div>
                    <div class="stat-change positive">Puntos promedio</div>
                    <div class="mt-2">
                        <div class="text-muted" style="font-size: 0.875rem;">Forma: ${this.renderForm(this.selectedAwayTeam.form)}</div>
                    </div>
                </div>
            </div>

            <div class="card">
                <div class="card-header">
                    <h3 class="card-title">Estadísticas Detalladas</h3>
                </div>
                <div class="table-container">
                    <table>
                        <thead>
                            <tr>
                                <th>Métrica</th>
                                <th>${this.selectedHomeTeam.name}</th>
                                <th>${this.selectedAwayTeam.name}</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td>Partidos Jugados</td>
                                <td>${this.selectedHomeTeam.played}</td>
                                <td>${this.selectedAwayTeam.played}</td>
                            </tr>
                            <tr>
                                <td>Victorias</td>
                                <td class="text-success">${this.selectedHomeTeam.won}</td>
                                <td class="text-success">${this.selectedAwayTeam.won}</td>
                            </tr>
                            <tr>
                                <td>Empates</td>
                                <td class="text-warning">${this.selectedHomeTeam.draw}</td>
                                <td class="text-warning">${this.selectedAwayTeam.draw}</td>
                            </tr>
                            <tr>
                                <td>Derrotas</td>
                                <td class="text-danger">${this.selectedHomeTeam.lost}</td>
                                <td class="text-danger">${this.selectedAwayTeam.lost}</td>
                            </tr>
                            <tr>
                                <td>Goles a Favor</td>
                                <td>${this.selectedHomeTeam.goalsFor}</td>
                                <td>${this.selectedAwayTeam.goalsFor}</td>
                            </tr>
                            <tr>
                                <td>Goles en Contra</td>
                                <td>${this.selectedHomeTeam.goalsAgainst}</td>
                                <td>${this.selectedAwayTeam.goalsAgainst}</td>
                            </tr>
                            <tr>
                                <td>Diferencia de Goles</td>
                                <td class="${this.selectedHomeTeam.goalDifference > 0 ? 'text-success' : 'text-danger'}">${this.selectedHomeTeam.goalDifference > 0 ? '+' : ''}${this.selectedHomeTeam.goalDifference}</td>
                                <td class="${this.selectedAwayTeam.goalDifference > 0 ? 'text-success' : 'text-danger'}">${this.selectedAwayTeam.goalDifference > 0 ? '+' : ''}${this.selectedAwayTeam.goalDifference}</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        `;

        container.innerHTML = html;
    }

    /**
     * Renderizar recomendaciones
     */
    renderRecommendations(prediction, odds, valueBets) {
        const container = document.getElementById('recommendationsContent');
        if (!container) return;

        const bestBet = valueBets[0];

        const html = `
            <div class="card">
                <div class="card-header">
                    <h3 class="card-title">Mejor Apuesta del Día</h3>
                    <span class="badge-success card-badge">Alta Confianza</span>
                </div>
                <div style="padding: var(--spacing-lg); background-color: var(--bg-tertiary); border-radius: 8px;">
                    <h4 style="font-size: 1.5rem; margin-bottom: var(--spacing-md);">${bestBet.type}</h4>
                    <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(150px, 1fr)); gap: var(--spacing-md); margin-bottom: var(--spacing-md);">
                        <div>
                            <div class="text-muted" style="font-size: 0.875rem;">Probabilidad</div>
                            <div style="font-size: 1.25rem; font-weight: 700;">${bestBet.probability}%</div>
                        </div>
                        <div>
                            <div class="text-muted" style="font-size: 0.875rem;">Cuota</div>
                            <div style="font-size: 1.25rem; font-weight: 700;">${bestBet.odds}</div>
                        </div>
                        <div>
                            <div class="text-muted" style="font-size: 0.875rem;">Valor EV</div>
                            <div style="font-size: 1.25rem; font-weight: 700;" class="${bestBet.evPercentage > 0 ? 'text-success' : 'text-danger'}">${bestBet.evPercentage > 0 ? '+' : ''}${bestBet.evPercentage}%</div>
                        </div>
                    </div>
                    <div class="text-muted">
                        <strong>Razonamiento:</strong> Esta apuesta ofrece un valor esperado positivo de ${bestBet.evPercentage}%,
                        lo que significa una ventaja matemática sobre el mercado.
                    </div>
                </div>
            </div>

            <div class="card">
                <div class="card-header">
                    <h3 class="card-title">Todas las Opciones de Apuesta</h3>
                </div>
                <div class="table-container">
                    <table>
                        <thead>
                            <tr>
                                <th>Tipo</th>
                                <th>Probabilidad</th>
                                <th>Cuota</th>
                                <th>Prob. Implícita</th>
                                <th>Valor %</th>
                                <th>EV %</th>
                                <th>Recomendación</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${valueBets.map(bet => `
                                <tr>
                                    <td><strong>${bet.type}</strong></td>
                                    <td>${bet.probability}%</td>
                                    <td>${bet.odds}</td>
                                    <td>${bet.impliedProbability}%</td>
                                    <td class="${bet.valuePercent > 0 ? 'text-success' : 'text-danger'}">${bet.valuePercent > 0 ? '+' : ''}${bet.valuePercent}%</td>
                                    <td class="${bet.evPercentage > 0 ? 'text-success' : 'text-danger'}">${bet.evPercentage > 0 ? '+' : ''}${bet.evPercentage}%</td>
                                    <td>
                                        ${bet.hasValue ? '<span class="badge-success card-badge">Recomendado</span>' : '<span class="badge-danger card-badge">No recomendado</span>'}
                                    </td>
                                </tr>
                            `).join('')}
                        </tbody>
                    </table>
                </div>
            </div>
        `;

        container.innerHTML = html;
    }

    /**
     * Renderizar value betting
     */
    renderValueBetting(valueBets, odds) {
        const container = document.getElementById('valueBettingContent');
        if (!container) return;

        const valueOpportunities = valueBets.filter(b => b.hasValue);

        const html = `
            <div class="card">
                <div class="card-header">
                    <h3 class="card-title">Oportunidades de Valor</h3>
                    <span class="badge-info card-badge">${valueOpportunities.length} encontradas</span>
                </div>
                ${valueOpportunities.length > 0 ? `
                    <div class="cards-grid">
                        ${valueOpportunities.map(bet => `
                            <div class="stat-card">
                                <div class="stat-label">${bet.type}</div>
                                <div class="stat-value text-success">+${bet.valuePercent}%</div>
                                <div class="stat-change positive">Valor sobre mercado</div>
                                <div class="mt-2" style="font-size: 0.875rem;">
                                    <div>Probabilidad: ${bet.probability}%</div>
                                    <div>Cuota: ${bet.odds}</div>
                                    <div>EV: ${bet.evPercentage}%</div>
                                </div>
                            </div>
                        `).join('')}
                    </div>
                ` : `
                    <div class="alert alert-info">
                        <div class="alert-icon">ℹ️</div>
                        <div class="alert-content">
                            <div class="alert-title">Sin oportunidades de valor</div>
                            <div class="alert-message">No se encontraron apuestas con valor positivo en este momento.</div>
                        </div>
                    </div>
                `}
            </div>

            <div class="card">
                <div class="card-header">
                    <h3 class="card-title">Explicación de Value Betting</h3>
                </div>
                <div style="padding: var(--spacing-md); background-color: var(--bg-tertiary); border-radius: 8px;">
                    <p style="margin-bottom: var(--spacing-md);">
                        El value betting consiste en encontrar apuestas donde la probabilidad real de un evento
                        es mayor que la probabilidad implícita en las cuotas ofrecidas.
                    </p>
                    <p>
                        <strong>Fórmula:</strong> Valor % = Probabilidad Real - Probabilidad Implícita<br>
                        <strong>Probabilidad Implícita:</strong> (1 / Cuota) × 100
                    </p>
                </div>
            </div>
        `;

        container.innerHTML = html;
    }

    /**
     * Renderizar análisis de goles
     */
    renderGoalsAnalysis(analysis) {
        const container = document.getElementById('goalsAnalysisContent');
        if (!container) return;

        const html = `
            <div class="cards-grid">
                <div class="stat-card">
                    <div class="stat-label">Goles Esperados</div>
                    <div class="stat-value">${analysis.expectedGoals}</div>
                    <div class="stat-change">Total del partido</div>
                </div>

                <div class="stat-card">
                    <div class="stat-label">Over 2.5</div>
                    <div class="stat-value ${analysis.over25 > 50 ? 'text-success' : ''}">${analysis.over25}%</div>
                    <div class="stat-change">Probabilidad</div>
                </div>

                <div class="stat-card">
                    <div class="stat-label">Under 2.5</div>
                    <div class="stat-value ${analysis.under25 > 50 ? 'text-success' : ''}">${analysis.under25}%</div>
                    <div class="stat-change">Probabilidad</div>
                </div>

                <div class="stat-card">
                    <div class="stat-label">BTTS</div>
                    <div class="stat-value ${analysis.btts > 50 ? 'text-success' : ''}">${analysis.btts}%</div>
                    <div class="stat-change">Ambos marcan</div>
                </div>
            </div>

            <div class="card">
                <div class="card-header">
                    <h3 class="card-title">Promedio de Goles por Equipo</h3>
                </div>
                <div class="probability-indicator">
                    <span class="prob-label">${this.selectedHomeTeam.name}</span>
                    <div class="prob-bar">
                        <div class="prob-fill" style="width: ${(analysis.homeAvgGoals / 3) * 100}%">${analysis.homeAvgGoals} goles/partido</div>
                    </div>
                </div>
                <div class="probability-indicator">
                    <span class="prob-label">${this.selectedAwayTeam.name}</span>
                    <div class="prob-bar">
                        <div class="prob-fill" style="width: ${(analysis.awayAvgGoals / 3) * 100}%">${analysis.awayAvgGoals} goles/partido</div>
                    </div>
                </div>
            </div>
        `;

        container.innerHTML = html;
    }

    /**
     * Renderizar análisis marginales
     */
    renderMarginals(analysis) {
        const container = document.getElementById('marginalsContent');
        if (!container) return;

        const html = `
            <div class="cards-grid">
                <div class="stat-card">
                    <div class="stat-label">Goles Primer Tiempo</div>
                    <div class="stat-value">${analysis.firstHalfGoals}</div>
                    <div class="stat-change">Estimación</div>
                </div>

                <div class="stat-card">
                    <div class="stat-label">Goles Segundo Tiempo</div>
                    <div class="stat-value">${analysis.secondHalfGoals}</div>
                    <div class="stat-change">Estimación</div>
                </div>

                <div class="stat-card">
                    <div class="stat-label">Índice de Riesgo</div>
                    <div class="stat-value ${analysis.riskIndex > 2 ? 'text-warning' : 'text-success'}">${analysis.riskIndex}</div>
                    <div class="stat-change">Volatilidad</div>
                </div>
            </div>

            <div class="card">
                <div class="card-header">
                    <h3 class="card-title">Estimación de Posesión</h3>
                </div>
                <div class="probability-indicator">
                    <span class="prob-label">${this.selectedHomeTeam.name}</span>
                    <div class="prob-bar">
                        <div class="prob-fill" style="width: ${analysis.homePossession}%">${analysis.homePossession}%</div>
                    </div>
                </div>
                <div class="probability-indicator">
                    <span class="prob-label">${this.selectedAwayTeam.name}</span>
                    <div class="prob-bar">
                        <div class="prob-fill" style="width: ${analysis.awayPossession}%">${analysis.awayPossession}%</div>
                    </div>
                </div>
            </div>

            <div class="card">
                <div class="card-header">
                    <h3 class="card-title">Tipología de Equipos</h3>
                </div>
                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: var(--spacing-lg);">
                    <div style="padding: var(--spacing-lg); background-color: var(--bg-tertiary); border-radius: 8px;">
                        <h4>${this.selectedHomeTeam.name}</h4>
                        <p style="margin-top: var(--spacing-md); color: var(--accent-primary); font-weight: 700;">
                            ${analysis.homeTypology}
                        </p>
                    </div>
                    <div style="padding: var(--spacing-lg); background-color: var(--bg-tertiary); border-radius: 8px;">
                        <h4>${this.selectedAwayTeam.name}</h4>
                        <p style="margin-top: var(--spacing-md); color: var(--accent-primary); font-weight: 700;">
                            ${analysis.awayTypology}
                        </p>
                    </div>
                </div>
            </div>
        `;

        container.innerHTML = html;
    }

    /**
     * Renderizar sugerencias de parlays
     */
    renderParlays(odds, prediction) {
        const container = document.getElementById('parlaysContent');
        if (!container) return;

        // Generar algunas selecciones de ejemplo
        const selections = [
            { match: `${this.selectedHomeTeam.name} vs ${this.selectedAwayTeam.name}`, type: 'Victoria Local', odds: odds.homeWin, probability: prediction.homeWin },
            { match: `${this.selectedHomeTeam.name} vs ${this.selectedAwayTeam.name}`, type: 'Over 2.5', odds: odds.over25, probability: 55 },
            { match: `${this.selectedHomeTeam.name} vs ${this.selectedAwayTeam.name}`, type: 'BTTS', odds: odds.btts, probability: 60 }
        ];

        const parlays = BettingCalculations.generateParlays(selections, 3);

        const html = `
            <div class="card">
                <div class="card-header">
                    <h3 class="card-title">Parlays Recomendados</h3>
                    <span class="badge-info card-badge">${parlays.length} sugerencias</span>
                </div>
                ${parlays.length > 0 ? `
                    <div class="cards-grid">
                        ${parlays.map((parlay, index) => `
                            <div class="stat-card">
                                <div class="stat-label">Parlay ${index + 1} (${parlay.size} selecciones)</div>
                                <div class="stat-value">${parlay.totalOdds}x</div>
                                <div class="stat-change ${parlay.ev > 0 ? 'positive' : 'negative'}">
                                    EV: ${parlay.ev > 0 ? '+' : ''}${parlay.ev}%
                                </div>
                                <div class="mt-2" style="font-size: 0.875rem;">
                                    <div>Probabilidad: ${parlay.totalProbability}%</div>
                                    <div>Riesgo/Recompensa: ${parlay.riskReward}:1</div>
                                    <div>Retorno potencial: $${parlay.potentialReturn}</div>
                                </div>
                            </div>
                        `).join('')}
                    </div>
                ` : `
                    <div class="alert alert-info">
                        <div class="alert-icon">ℹ️</div>
                        <div class="alert-content">
                            <div class="alert-title">No hay parlays disponibles</div>
                            <div class="alert-message">Se necesitan más partidos para generar parlays.</div>
                        </div>
                    </div>
                `}
            </div>
        `;

        container.innerHTML = html;
    }

    /**
     * Renderizar dashboard de riesgo (Kelly Criterion)
     */
    renderRiskDashboard(prediction, odds) {
        const container = document.getElementById('riskDashboardContent');
        if (!container) return;

        const bankroll = CONFIG.BETTING.DEFAULT_BANKROLL;
        const calculations = [
            { name: 'Victoria Local', ...BettingCalculations.kellyCalculator(prediction.homeWin, odds.homeWin, bankroll, 1), fraction: 'Full Kelly' },
            { name: 'Victoria Local', ...BettingCalculations.kellyCalculator(prediction.homeWin, odds.homeWin, bankroll, 0.5), fraction: '1/2 Kelly' },
            { name: 'Victoria Local', ...BettingCalculations.kellyCalculator(prediction.homeWin, odds.homeWin, bankroll, 0.25), fraction: '1/4 Kelly' },
        ];

        const performance = BettingCalculations.calculatePerformanceMetrics([], this.historicalResults);

        const html = `
            <div class="card">
                <div class="card-header">
                    <h3 class="card-title">Calculadora Kelly Criterion</h3>
                    <span class="badge-info card-badge">Bankroll: $${bankroll}</span>
                </div>
                <div class="table-container">
                    <table>
                        <thead>
                            <tr>
                                <th>Apuesta</th>
                                <th>Estrategia</th>
                                <th>Kelly %</th>
                                <th>Cantidad</th>
                                <th>Retorno Potencial</th>
                                <th>Ganancia Potencial</th>
                                <th>Nivel de Riesgo</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${calculations.map(calc => `
                                <tr>
                                    <td><strong>${calc.name}</strong></td>
                                    <td>${calc.fraction}</td>
                                    <td>${calc.kellyPercentage}%</td>
                                    <td>$${calc.recommendedStake}</td>
                                    <td>$${calc.potentialReturn}</td>
                                    <td class="text-success">+$${calc.potentialProfit}</td>
                                    <td><span class="badge-${calc.riskLevel.includes('Alto') ? 'warning' : 'success'} card-badge">${calc.riskLevel}</span></td>
                                </tr>
                            `).join('')}
                        </tbody>
                    </table>
                </div>
            </div>

            <div class="cards-grid">
                <div class="stat-card">
                    <div class="stat-label">Precisión Histórica</div>
                    <div class="stat-value">${performance.accuracy}%</div>
                    <div class="stat-change">Predicciones correctas</div>
                </div>

                <div class="stat-card">
                    <div class="stat-label">ROI</div>
                    <div class="stat-value ${performance.roi > 0 ? 'text-success' : 'text-danger'}">${performance.roi > 0 ? '+' : ''}${performance.roi}%</div>
                    <div class="stat-change">Retorno sobre inversión</div>
                </div>

                <div class="stat-card">
                    <div class="stat-label">Sharpe Ratio</div>
                    <div class="stat-value">${performance.sharpeRatio}</div>
                    <div class="stat-change">Riesgo ajustado</div>
                </div>

                <div class="stat-card">
                    <div class="stat-label">Max Drawdown</div>
                    <div class="stat-value text-danger">${performance.maxDrawdown}%</div>
                    <div class="stat-change">Pérdida máxima</div>
                </div>
            </div>
        `;

        container.innerHTML = html;
    }

    /**
     * Renderizar alertas
     */
    renderAlerts(alerts) {
        const container = document.getElementById('alertsContent');
        if (!container) return;

        const html = `
            <div class="card">
                <div class="card-header">
                    <h3 class="card-title">Centro de Alertas</h3>
                    <span class="badge-${alerts.length > 0 ? 'warning' : 'success'} card-badge">${alerts.length} alertas</span>
                </div>
                ${alerts.length > 0 ? alerts.map(alert => `
                    <div class="alert alert-${alert.severity.toLowerCase()}">
                        <div class="alert-icon">
                            ${alert.severity === 'Critical' ? '🚨' : alert.severity === 'Warning' ? '⚠️' : 'ℹ️'}
                        </div>
                        <div class="alert-content">
                            <div class="alert-title">${alert.type}</div>
                            <div class="alert-message">${alert.message}</div>
                            <div style="margin-top: var(--spacing-sm); font-weight: 600;">
                                Acción recomendada: ${alert.action}
                            </div>
                            <div style="margin-top: var(--spacing-sm); font-size: 0.75rem; color: var(--text-muted);">
                                ${new Date(alert.timestamp).toLocaleString('es-ES')}
                            </div>
                        </div>
                    </div>
                `).join('') : `
                    <div class="alert alert-success">
                        <div class="alert-icon">✅</div>
                        <div class="alert-content">
                            <div class="alert-title">Sin alertas</div>
                            <div class="alert-message">No hay anomalías detectadas en este momento.</div>
                        </div>
                    </div>
                `}
            </div>
        `;

        container.innerHTML = html;
    }

    /**
     * Cambiar de pestaña
     */
    switchTab(tabId) {
        // Actualizar enlaces de navegación
        document.querySelectorAll('.nav-link').forEach(link => {
            link.classList.remove('active');
        });
        document.querySelector(`[data-tab="${tabId}"]`)?.classList.add('active');

        // Actualizar contenido
        document.querySelectorAll('.tab-content').forEach(content => {
            content.classList.remove('active');
        });
        document.getElementById(tabId)?.classList.add('active');

        this.currentTab = tabId;
    }

    /**
     * Toggle auto-update
     */
    toggleAutoUpdate(enabled) {
        this.autoUpdateEnabled = enabled;

        if (enabled) {
            apiService.startAutoUpdate(this.currentLeague, {
                onStandingsUpdate: (data) => {
                    this.standings = data;
                    this.renderStandingsTable();
                    this.populateTeamSelectors();
                },
                onFixturesUpdate: (data) => {
                    this.fixtures = data;
                    this.renderFixturesTable();
                },
                onLiveScoresUpdate: (data) => {
                    this.liveScores = data;
                    this.updateLiveScores();
                }
            });
            console.log('✅ Actualización automática activada');
        } else {
            apiService.stopAutoUpdate();
            console.log('❌ Actualización automática desactivada');
        }
    }

    /**
     * Actualizar marcadores en vivo
     */
    updateLiveScores() {
        const indicator = document.querySelector('.live-indicator span:last-child');
        if (indicator && this.liveScores.length > 0) {
            indicator.textContent = `${this.liveScores.length} partidos en vivo`;
        }
    }

    /**
     * Descargar CSV de clasificación
     */
    downloadStandingsCSV() {
        const headers = ['Posición', 'Equipo', 'PJ', 'G', 'E', 'P', 'GF', 'GC', 'DG', 'Puntos', 'Promedio'];
        const rows = this.standings.map(team => [
            team.position,
            team.name,
            team.played,
            team.won,
            team.draw,
            team.lost,
            team.goalsFor,
            team.goalsAgainst,
            team.goalDifference,
            team.points,
            team.pointsAvg
        ]);

        const csv = [headers, ...rows].map(row => row.join(',')).join('\n');
        const blob = new Blob([csv], { type: 'text/csv' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `clasificacion_${new Date().toISOString().split('T')[0]}.csv`;
        a.click();
        URL.revokeObjectURL(url);
    }

    /**
     * Cargar resultados históricos
     */
    loadHistoricalResults() {
        // En producción, esto cargaría desde localStorage o API
        return [];
    }

    /**
     * Mostrar loading
     */
    showLoading() {
        const loading = document.getElementById('loading');
        if (loading) loading.classList.remove('hidden');
    }

    /**
     * Ocultar loading
     */
    hideLoading() {
        const loading = document.getElementById('loading');
        if (loading) loading.classList.add('hidden');
    }

    /**
     * Mostrar error
     */
    showError(message) {
        console.error(message);
        // Podría mostrar un toast o alerta
    }

    /**
     * Renderizar dashboard principal
     */
    renderDashboard() {
        // El dashboard ya se renderiza con loadInitialData
        console.log('Dashboard renderizado correctamente');
    }
}

// Inicializar aplicación cuando el DOM esté listo
let app;
document.addEventListener('DOMContentLoaded', () => {
    app = new DashboardApp();
    console.log('🚀 Promiedos Dashboard Pro iniciado');
});
