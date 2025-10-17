# 🏆 Promiedos Dashboard Pro

A comprehensive sports betting analysis and prediction dashboard designed for data-driven decision making. This tool combines advanced algorithms with real-time risk management to help bettors identify value opportunities and optimize their bankroll strategy.

## 🎯 Overview

Promiedos Dashboard Pro is a professional-grade platform that analyzes football matches using multiple predictive algorithms, calculates optimal bet sizing through the Kelly Criterion, and provides comprehensive anomaly alerts. The dashboard processes team statistics, historical performance data, and market movements to generate actionable betting recommendations.

## ✨ Key Features

### 1. **Predictive Algorithms**
- **ELO Algorithm**: Chess-inspired rating system adapted for football, calculating win probabilities based on historical average points
- **MINIMAX Algorithm**: Conservative approach that weighs recent performance more heavily than historical averages
- Confidence scoring for prediction reliability

### 2. **Value Betting Indicator**
- Identifies mispriced bets where implied probability < actual probability
- Calculates expected value (EV) for each betting option
- Highlights betting opportunities with positive expected return

### 3. **Advanced Analytics**
- **Goals Analysis**: Over/Under 2.5 predictions with historical correlations
- **Marginal Analysis**: First half/second half goals, possession estimates, volatility metrics
- **Team Typology**: Classifications (Symmetric/Balanced, Defensive/Offensive, etc.)
- **Risk Meter**: Volatility and consistency measurements for each team

### 4. **Parlay Suggester**
- Generates optimal multi-bet combinations
- Calculates cumulative probabilities and total odds
- Risk/Reward ratio analysis for each parlay
- Expected Value scoring for ranking suggestions

### 5. **Kelly Criterion Calculator**
- Determines optimal bankroll percentage per bet
- Supports full Kelly and fractional Kelly strategies (1/2 Kelly, 1/4 Kelly)
- Prevents overbetting and catastrophic losses
- Bankroll management recommendations

### 6. **Anomaly Alerts Center**
- **Quota Changes**: Detects drastic odds movements indicating market information
- **Injury Reports**: Monitors key player injuries and their impact
- **Formation Changes**: Identifies tactical adjustments that may affect predictions
- **Unexpected Results**: Flags prediction misses for model recalibration

### 7. **Performance Dashboard**
- Prediction history with accuracy tracking
- Model calibration metrics (Sharpe ratio, ROI, max drawdown)
- Bankroll performance analysis
- Win rate calculations

### 8. **Upcoming Matches**
- Interactive fixture calendar from TheSportsDB
- Real-time filtering by league, team, and status
- One-click analysis for any match
- Quick summary for selected matches

## 📊 Dashboard Sections

### Dashboard Tab
- Current league standings with comprehensive statistics
- Quick stats cards (leader, total goals, match comparison)
- Real-time team selector for analysis

### Prediction Tab
- Side-by-side comparison of ELO and MINIMAX predictions
- Win/draw/loss probability distribution
- Confidence scoring for each algorithm

### Trends Tab
- Team form analysis (improving/stable/declining)
- Recent winning streaks
- Average goals per match
- Last 5 matches points

### Recommendations Tab
- Best bet of the day with detailed reasoning
- Complete betting options table
- Confidence scores and value calculations

### Value Betting Tab
- Identifies mispriced opportunities
- Value percentage above market probability
- Recommended betting options

### Goals Analysis Tab
- Over/Under 2.5 statistics per team
- Historical correlation table
- 10-match trend visualization
- Pair analysis for high-scoring matchups

### Marginales Tab
- First/second half goals predictions
- Possession percentage estimates
- Risk index and dispersal analysis
- Team profile classification

### Parlay Suggester Tab
- Top 6 recommended parlays ranked by EV
- Probability, odds, and reward calculations
- Risk/Reward ratio for each combination
- Detailed EV analysis

### Risk Dashboard Tab
- Kelly Criterion percentage calculations
- Bankroll management suggestions
- Optimal bet sizing table
- Historical prediction accuracy
- Performance metrics (ROI, Sharpe ratio, max drawdown)

### Alerts Tab
- Critical/Warning/Info severity levels
- Quota movement alerts
- Injury reports
- Formation change notifications
- Result anomalies
- Recommended actions per alert

## 🚀 How to Use

### Quick Start
1. Open the HTML file in a modern web browser
2. Select home team (LOCAL) and away team (VISITANTE)
3. Browse through tabs to analyze the match
4. Review the best bet recommendation
5. Check Kelly Criterion for optimal bet sizing
6. Verify anomaly alerts before placing bets

### Workflow Example
1. **Dashboard** → Review standings and team stats
2. **Prediction** → Compare ELO vs MINIMAX algorithms
3. **Value Betting** → Find mispriced opportunities
4. **Kelly Criterion** → Determine optimal bet amount
5. **Alerts** → Check for injuries, formation changes, news
6. **Parlay Suggester** → Consider multi-bet combinations
7. **Place Bet** → Use recommendations wisely

### Key Controls
- **Team Dropdowns**: Select local and away teams
- **Navigation Buttons**: Switch between analysis tabs
- **Download CSV**: Export standings data
- **Auto-Refresh**: Enable/disable automatic updates (every 5 minutes)
- **Fixture Table**: Click any match to load full analysis

## 📈 Understanding Key Concepts

### Kelly Criterion
Formula: `f* = (b × p - q) / b`
- **f*** = optimal fraction of bankroll to bet
- **p** = probability of winning
- **q** = 1 - p (probability of losing)
- **b** = odds - 1

**Example**: With 60% win probability and 2.0 odds:
- Kelly = (1 × 0.60 - 0.40) / 1 = 0.20 (20%)
- Bet 20% of bankroll for maximum growth
- Use 1/2 Kelly (10%) for more conservative approach

### Expected Value (EV)
`EV = (Probability × Profit) - ((1 - Probability) × Loss)`
- Positive EV = long-term profitability expected
- Only bet when EV > 0
- Larger positive EV = better opportunity

### Over/Under 2.5
- **Over 2.5**: Match ends with 3+ goals
- **Under 2.5**: Match ends with 0, 1, or 2 goals
- Key metric for high/low-scoring predictions

### Parlay (Acumulador)
- Multiple bets where profit from one funds the next
- Higher odds but requires all predictions correct
- Risk/Reward: 2:1 means $2 profit per $1 risked

## 🛠️ Technologies Used

- **Frontend**: HTML5, CSS3, JavaScript (Vanilla)
- **Charting**: Chart.js 3.9.1
- **Data**: Simulated realistic football statistics
- **Algorithms**: ELO, MINIMAX, Kelly Criterion
- **UI Framework**: Custom dark-themed component system
- **Data Source**: TheSportsDB API integration ready

## 💻 System Requirements

- Modern web browser (Chrome 90+, Firefox 88+, Safari 14+, Edge 90+)
- JavaScript enabled
- No backend server required (runs locally)
- ~2MB disk space for HTML file

## 📁 File Structure

```
promiedos_dark_dashboard4.html
├── HEAD
│   ├── Meta tags
│   ├── Chart.js library
│   └── CSS styling
├── BODY
│   ├── Sidebar navigation
│   ├── Navbar with title
│   ├── Control panel
│   ├── Content tabs
│   │   ├── Dashboard
│   │   ├── Prediction
│   │   ├── Trends
│   │   ├── Recommendations
│   │   ├── Value Betting
│   │   ├── Goals Analysis
│   │   ├── Marginales
│   │   ├── Parlay Suggester
│   │   ├── Risk Dashboard
│   │   ├── Alerts
│   │   ├── Help
│   │   └── Upcoming Matches
│   └── JavaScript logic
```

## ⚙️ Configuration

### Data Customization
Edit the `standings` array in the JavaScript section to update:
- Team rankings
- Points per match (ptos_prom)
- Goals for/against
- Win/draw/loss records

### Match History
Modify the `matchHistory` object to include:
- Historical performance data
- Over/Under patterns
- Team-specific statistics

### Bankroll Settings
Default bankroll: $1,000 (easily modified in `updateRiskDashboard()`)

## 📊 Algorithm Details

### ELO Calculation
- Normalizes team strength by points average
- Weights strength proportionally
- Generates 85% confidence baseline
- Adapts for home advantage considerations

### MINIMAX Ranking
- Win rate percentage: 40% weight
- Points average: 60% weight
- Home team multiplier: 1.15x
- Away team multiplier: 0.85x
- More conservative than ELO

## ⚠️ Important Disclaimers

1. **Educational Purpose**: Use this tool for learning about betting analytics, not guarantee of profits
2. **Accuracy**: Predictions are probabilistic estimates, not certainties
3. **Risk Management**: Always use Kelly Criterion or fraction thereof
4. **Bankroll Protection**: Never bet more than you can afford to lose
5. **Model Limitations**: Based on historical data; doesn't account for unpredictable events
6. **Verification**: Cross-reference alerts with official sources before betting

## 💡 Best Practices

✅ **Do:**
- Use 1/2 Kelly for safer bankroll management
- Verify anomaly alerts against official sources
- Track your predictions vs. actual results
- Diversify across multiple betting options
- Review the Help section regularly

❌ **Don't:**
- Bet on every prediction
- Use full Kelly without experience
- Ignore injury/formation alerts
- Chase losses with larger bets
- Rely solely on one algorithm

## 🎓 Learning Resources

- **Help Tab**: Comprehensive explanations of all features
- **Tooltips**: Hover over (?) icons for quick definitions
- **Example Sections**: Each tab includes sample data and calculations
- **Formula Display**: Mathematical models shown for transparency

## 🔄 Updates & Maintenance

- **Auto-Refresh**: Toggle in sidebar for 5-minute updates
- **Data Import**: Ready for TheSportsDB API integration
- **CSV Export**: Download standings for external analysis
- **Browser Cache**: Data persists during session

## 👨‍💻 Developer Notes

- **Code Structure**: Modular JavaScript functions per feature
- **Styling**: CSS variables for easy theme customization
- **Responsive**: Mobile adaptation included (hides sidebar on <768px)
- **Performance**: Optimized for real-time calculations
- **Extensibility**: Ready for database and API integration

## 🔐 Privacy & Data

- All processing happens locally in your browser
- No data sent to external servers
- No cookies or tracking
- Simulated data for demonstration
- Ready for integration with real APIs

## 🚀 Future Enhancements

- [ ] Real-time odds integration with betting APIs
- [ ] Live score tracking
- [ ] Automated alert notifications
- [ ] Machine learning model training
- [ ] Multi-league support
- [ ] Player-level analysis
- [ ] Historical database
- [ ] Mobile app version
- [ ] Multi-language support
- [ ] Advanced charting

## 📄 License

This project is provided as-is for educational and analytical purposes. Use at your own discretion.

## 🤝 Support

For feature requests or bug reports, document the issue with:
- Dashboard section affected
- Expected vs. actual behavior
- Browser and version used
- Steps to reproduce

---

**Version**: 4.0 (Dark Dashboard Pro)  
**Last Updated**: 2024  
**Status**: Active Development  
**Compatibility**: All modern browsers

---

## Quick Reference

| Feature | Purpose | Key Metric |
|---------|---------|-----------|
| ELO Algorithm | Baseline prediction | Confidence % |
| Kelly Criterion | Optimal bet sizing | % of bankroll |
| Value Betting | Find mispriced odds | EV % |
| Parlay Suggester | Multi-bet combinations | Risk/Reward ratio |
| Alerts | Anomaly detection | Severity level |
| Goals Analysis | Over/Under prediction | % probability |
| Marginales | Match profile | Team typology |
| Bankroll Manager | Risk control | Max loss limit |

---

**Happy analyzing! Bet responsibly. 🎯**
