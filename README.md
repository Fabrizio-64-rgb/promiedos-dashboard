# 🏆 Promiedos Dashboard Pro

Un panel de control integral para análisis y predicción de apuestas deportivas diseñado para la toma de decisiones basada en datos. Esta herramienta combina algoritmos avanzados con gestión de riesgos en tiempo real para ayudar a apostadores a identificar oportunidades de valor y optimizar su estrategia de bankroll.

## 🎯 Descripción General

Promiedos Dashboard Pro es una plataforma de nivel profesional que analiza partidos de fútbol utilizando múltiples algoritmos predictivos, calcula el dimensionamiento óptimo de apuestas mediante el Criterio de Kelly, y proporciona alertas inteligentes de anomalías. El dashboard procesa estadísticas de equipos, datos de rendimiento histórico y movimientos de mercado para generar recomendaciones de apuestas accionables.

## ✨ Características Principales

### 1. **Algoritmos Predictivos**
- **Algoritmo ELO**: Sistema de calificación inspirado en el ajedrez, adaptado al fútbol, que calcula probabilidades de victoria basándose en promedios históricos de puntos
- **Algoritmo MINIMAX**: Enfoque conservador que pondera más el rendimiento reciente que los promedios históricos
- Puntuación de confianza para la fiabilidad de las predicciones

### 2. **Indicador de Value Betting**
- Identifica apuestas mal valoradas donde la probabilidad implícita < probabilidad real
- Calcula el valor esperado (EV) para cada opción de apuesta
- Destaca oportunidades de apuestas con rendimiento esperado positivo

### 3. **Análisis Avanzados**
- **Análisis de Goles**: Predicciones Over/Under 2.5 con correlaciones históricas
- **Análisis Marginal**: Goles primer tiempo/segundo tiempo, estimaciones de posesión, métricas de volatilidad
- **Tipología de Equipos**: Clasificaciones (Asimétrico/Equilibrado, Defensivo/Ofensivo, etc.)
- **Medidor de Riesgo**: Mediciones de volatilidad y consistencia para cada equipo

### 4. **Sugeridor de Parlays**
- Genera combinaciones de apuestas múltiples óptimas
- Calcula probabilidades acumulativas y cuotas totales
- Análisis de relación Riesgo/Recompensa para cada parlay
- Puntuación de Valor Esperado para clasificar sugerencias

### 5. **Calculadora de Kelly Criterion**
- Determina el porcentaje óptimo de bankroll por apuesta
- Soporta estrategias Kelly completo y Kelly fraccionado (1/2 Kelly, 1/4 Kelly)
- Previene sobreapuestas y pérdidas catastróficas
- Recomendaciones de gestión de bankroll

### 6. **Centro de Alertas de Anomalías**
- **Cambios de Cuotas**: Detecta movimientos drásticos de cuotas que indican información de mercado
- **Reportes de Lesiones**: Monitorea lesiones de jugadores clave y su impacto
- **Cambios de Formación**: Identifica ajustes tácticos que pueden afectar predicciones
- **Resultados Inesperados**: Señala errores de predicción para recalibración del modelo

### 7. **Panel de Rendimiento**
- Historial de predicciones con seguimiento de precisión
- Métricas de calibración del modelo (ratio de Sharpe, ROI, drawdown máximo)
- Análisis de rendimiento del bankroll
- Cálculos de tasa de ganancia

### 8. **Próximos Partidos**
- Calendario de fixtures interactivo desde TheSportsDB
- Filtrado en tiempo real por liga, equipo y estado
- Análisis de un clic para cualquier partido
- Resumen rápido para partidos seleccionados

## 📊 Secciones del Dashboard

### Pestaña Dashboard
- Clasificación actual de la liga con estadísticas completas
- Tarjetas de estadísticas rápidas (líder, goles totales, comparativa de partidos)
- Selector de equipos en tiempo real para análisis

### Pestaña Predicción
- Comparación lado a lado de predicciones ELO y MINIMAX
- Distribución de probabilidades victoria/empate/derrota
- Puntuación de confianza para cada algoritmo

### Pestaña Tendencias
- Análisis de forma del equipo (mejorando/estable/empeorando)
- Rachas ganadoras recientes
- Promedio de goles por partido
- Puntos en últimos 5 partidos

### Pestaña Recomendaciones
- Mejor apuesta del día con razonamiento detallado
- Tabla completa de opciones de apuestas
- Puntuaciones de confianza y cálculos de valor

### Pestaña Value Betting
- Identifica oportunidades mal valoradas
- Porcentaje de valor por encima de la probabilidad de mercado
- Opciones de apuestas recomendadas

### Pestaña Análisis de Goles
- Estadísticas Over/Under 2.5 por equipo
- Tabla de correlaciones históricas
- Visualización de tendencias de 10 partidos
- Análisis de parejas para enfrentamientos con muchos goles

### Pestaña Marginales
- Predicciones de goles primer/segundo tiempo
- Estimaciones de porcentaje de posesión
- Análisis de índice de riesgo y dispersión
- Clasificación del perfil del equipo

### Pestaña Sugeridor de Parlays
- Top 6 parlays recomendados clasificados por EV
- Cálculos de probabilidad, cuotas y recompensa
- Ratio Riesgo/Recompensa para cada combinación
- Análisis detallado de EV

### Pestaña Dashboard de Riesgo
- Cálculos de porcentaje de Kelly Criterion
- Sugerencias de gestión de bankroll
- Tabla de dimensionamiento óptimo de apuestas
- Precisión de predicciones histórica
- Métricas de rendimiento (ROI, ratio de Sharpe, drawdown máximo)

### Pestaña Alertas
- Niveles de severidad Crítico/Advertencia/Información
- Alertas de movimiento de cuotas
- Reportes de lesiones
- Notificaciones de cambios de formación
- Anomalías de resultados
- Acciones recomendadas por alerta

## 🚀 Cómo Usar

### Inicio Rápido

#### Opción 1: Abrir Directamente
```bash
# Simplemente abre index.html en tu navegador
open index.html  # Mac/Linux
start index.html # Windows
```

#### Opción 2: Servidor Local (Recomendado)
```bash
# Con Python
python -m http.server 8000

# Con Node.js
npx http-server -p 8000

# Luego abre: http://localhost:8000
```

### Uso del Dashboard
1. Abre el dashboard en un navegador web moderno
2. Selecciona equipo local (LOCAL) y equipo visitante (VISITANTE)
3. Haz clic en "Analizar Partido" para generar predicciones
4. Navega por las pestañas para ver diferentes análisis
5. Revisa la recomendación de mejor apuesta
6. Verifica el Kelly Criterion para dimensionamiento óptimo
7. Comprueba alertas de anomalías antes de apostar
8. Activa "Actualización automática" para datos en tiempo real

📖 **Para más detalles, consulta [SETUP.md](SETUP.md)**

### Flujo de Trabajo Ejemplo
1. **Dashboard** → Revisa clasificación y estadísticas de equipos
2. **Predicción** → Compara algoritmos ELO vs MINIMAX
3. **Value Betting** → Encuentra oportunidades mal valoradas
4. **Kelly Criterion** → Determina cantidad óptima de apuesta
5. **Alertas** → Verifica lesiones, cambios de formación, noticias
6. **Sugeridor de Parlays** → Considera combinaciones de apuestas múltiples
7. **Realizar Apuesta** → Usa recomendaciones con prudencia

### Controles Principales
- **Desplegables de Equipos**: Selecciona equipos local y visitante
- **Botones de Navegación**: Cambia entre pestañas de análisis
- **Descargar CSV**: Exporta datos de clasificación
- **Auto-Actualización**: Habilita/deshabilita actualizaciones automáticas (cada 5 minutos)
- **Tabla de Fixtures**: Haz clic en cualquier partido para cargar análisis completo

## 📈 Entendiendo Conceptos Clave

### Kelly Criterion
Fórmula: `f* = (b × p - q) / b`
- **f\*** = fracción óptima del bankroll a apostar
- **p** = probabilidad de ganar
- **q** = 1 - p (probabilidad de perder)
- **b** = cuota - 1

**Ejemplo**: Con probabilidad del 60% y cuota de 2.0:
- Kelly = (1 × 0.60 - 0.40) / 1 = 0.20 (20%)
- Apuesta 20% del bankroll para crecimiento máximo
- Usa 1/2 Kelly (10%) para enfoque más conservador

### Valor Esperado (EV)
`EV = (Probabilidad × Ganancia) - ((1 - Probabilidad) × Pérdida)`
- EV positivo = rentabilidad esperada a largo plazo
- Apuesta solo cuando EV > 0
- Mayor EV positivo = mejor oportunidad

### Over/Under 2.5
- **Over 2.5**: Partido termina con 3+ goles
- **Under 2.5**: Partido termina con 0, 1 o 2 goles
- Métrica clave para predicciones de muchos/pocos goles

### Parlay (Acumulador)
- Múltiples apuestas donde la ganancia de una financia la siguiente
- Cuotas más altas pero requiere que todas las predicciones sean correctas
- Riesgo/Recompensa: 2:1 significa $2 de ganancia por $1 apostado

## 🛠️ Tecnologías Utilizadas

- **Frontend**: HTML5, CSS3, JavaScript (Vanilla ES6+)
- **Gráficos**: Chart.js 3.9.1
- **APIs de Datos**:
  - TheSportsDB (gratuita, preconfigurada)
  - API-Football (opcional, requiere registro)
- **Algoritmos**: ELO, MINIMAX, Kelly Criterion
- **Framework UI**: Sistema de componentes personalizado con tema oscuro
- **Actualización**: Sistema de polling automático para datos en tiempo real
- **Arquitectura**: Modular con separación de responsabilidades

## 📡 Actualización en Tiempo Real

El dashboard incluye un sistema completo de actualización automática:

### Características
- ⚡ **Marcadores en vivo**: Actualización cada 30 segundos
- 📊 **Clasificaciones**: Actualización cada 5 minutos
- 📅 **Fixtures**: Actualización cada 10 minutos
- 🎯 **Predicciones**: Recálculo cada 15 minutos

### Configuración
Activa la opción "Actualización automática" en la barra lateral para:
- Mantener datos actualizados sin refrescar la página
- Recibir alertas de cambios importantes
- Actualizar cuotas y probabilidades automáticamente

### APIs Soportadas
1. **TheSportsDB** (Gratuita)
   - ✅ Ya configurada
   - ✅ Sin límites estrictos
   - ℹ️ Datos básicos de ligas principales

2. **API-Football** (Premium)
   - 🔑 Requiere API key (100 llamadas/día gratis)
   - ✅ Datos más completos y actualizados
   - ✅ Cuotas de apuestas en tiempo real
   - ✅ Estadísticas avanzadas

Ver [SETUP.md](SETUP.md) para configurar APIs adicionales.

## 💻 Requisitos del Sistema

- Navegador web moderno (Chrome 90+, Firefox 88+, Safari 14+, Edge 90+)
- JavaScript habilitado
- No requiere servidor backend (se ejecuta localmente)
- Aproximadamente 2MB de espacio en disco para la aplicación

## 📁 Estructura del Proyecto

```
promiedos-dashboard/
├── index.html                  # Aplicación principal (SPA)
├── README.md                   # Documentación principal
├── SETUP.md                    # Guía de configuración detallada
├── .gitignore                  # Archivos ignorados por Git
├── css/
│   └── styles.css              # Estilos completos del dashboard
├── js/
│   ├── config.js               # Configuración y constantes
│   ├── api-service.js          # Servicio de APIs de fútbol
│   ├── algorithms.js           # Algoritmos ELO, MINIMAX, Kelly
│   └── app.js                  # Lógica principal de la aplicación
└── assets/                     # Recursos adicionales (opcional)

```

### Arquitectura de Componentes

**index.html**: Estructura y navegación
- ✅ 12 pestañas funcionales
- ✅ Barra lateral con navegación
- ✅ Panel de control de equipos
- ✅ Sistema de tabs dinámico

**css/styles.css**: Sistema de diseño
- ✅ Tema oscuro profesional
- ✅ Variables CSS personalizables
- ✅ Diseño responsive
- ✅ Animaciones y transiciones

**js/config.js**: Configuración central
- ✅ APIs configurables
- ✅ Intervalos de actualización
- ✅ Parámetros de algoritmos
- ✅ Configuración de bankroll

**js/api-service.js**: Servicio de datos
- ✅ Integración con TheSportsDB
- ✅ Soporte para API-Football
- ✅ Sistema de caché inteligente
- ✅ Actualización automática

**js/algorithms.js**: Lógica predictiva
- ✅ Algoritmo ELO adaptado
- ✅ Algoritmo MINIMAX conservador
- ✅ Kelly Criterion
- ✅ Value Betting
- ✅ Análisis de goles y marginales
- ✅ Generador de parlays
- ✅ Sistema de alertas

**js/app.js**: Aplicación principal
- ✅ Gestión de estado
- ✅ Renderizado dinámico
- ✅ Event handlers
- ✅ Actualización en tiempo real

## ⚙️ Configuración

### Personalización de Datos
Edita el array `standings` en la sección JavaScript para actualizar:
- Clasificación de equipos
- Puntos por partido (ptos_prom)
- Goles a favor/en contra
- Récords victoria/empate/derrota

### Historial de Partidos
Modifica el objeto `matchHistory` para incluir:
- Datos de rendimiento histórico
- Patrones Over/Under
- Estadísticas específicas por equipo

### Configuración de Bankroll
Bankroll predeterminado: $1,000 (fácilmente modificable en `updateRiskDashboard()`)

## 📊 Detalles de Algoritmos

### Cálculo de ELO
- Normaliza la fortaleza del equipo por promedio de puntos
- Pondera la fortaleza proporcionalmente
- Genera línea de base de confianza del 85%
- Adapta consideraciones de ventaja de local

### Clasificación MINIMAX
- Porcentaje de tasa de victoria: peso del 40%
- Promedio de puntos: peso del 60%
- Multiplicador de local: 1.15x
- Multiplicador de visitante: 0.85x
- Más conservador que ELO

## ⚠️ Avisos Importantes

1. **Propósito Educativo**: Usa esta herramienta para aprender sobre análisis de apuestas, no es garantía de ganancias
2. **Precisión**: Las predicciones son estimaciones probabilísticas, no certezas
3. **Gestión de Riesgos**: Siempre usa Kelly Criterion o una fracción del mismo
4. **Protección de Bankroll**: Nunca apuestes más de lo que puedas permitirte perder
5. **Limitaciones del Modelo**: Basado en datos históricos; no cuenta eventos impredecibles
6. **Verificación**: Contrasta alertas con fuentes oficiales antes de apostar

## 💡 Mejores Prácticas

✅ **Haz:**
- Usa 1/2 Kelly para gestión de bankroll más segura
- Verifica alertas de anomalías contra fuentes oficiales
- Realiza seguimiento de tus predicciones vs resultados reales
- Diversifica entre múltiples opciones de apuestas
- Revisa la sección Ayuda regularmente

❌ **No Hagas:**
- Apuesta en todas las predicciones
- Usa Kelly completo sin experiencia
- Ignores alertas de lesiones/formación
- Persigan pérdidas con apuestas más grandes
- Confíes solo en un algoritmo

## 🎓 Recursos de Aprendizaje

- **Pestaña Ayuda**: Explicaciones comprensivas de todas las características
- **Tooltips**: Coloca el cursor sobre iconos (?) para definiciones rápidas
- **Secciones de Ejemplo**: Cada pestaña incluye datos de muestra y cálculos
- **Visualización de Fórmulas**: Modelos matemáticos mostrados para transparencia

## 🔄 Actualizaciones y Mantenimiento

- **Auto-Actualización**: Alterna en barra lateral para actualizaciones cada 5 minutos
- **Importación de Datos**: Lista para integración con API de TheSportsDB
- **Exportación CSV**: Descarga clasificaciones para análisis externo
- **Caché del Navegador**: Los datos persisten durante la sesión

## 👨‍💻 Notas de Desarrollador

- **Estructura de Código**: Funciones JavaScript modulares por característica
- **Estilos**: Variables CSS para fácil personalización de tema
- **Responsivo**: Adaptación móvil incluida (oculta barra lateral en <768px)
- **Rendimiento**: Optimizado para cálculos en tiempo real
- **Extensibilidad**: Listo para integración de base de datos y API

## 🔐 Privacidad y Datos

- Todo el procesamiento ocurre localmente en tu navegador
- No se envían datos a servidores externos
- Sin cookies ni rastreo
- Datos simulados para demostración
- Listo para integración con APIs reales

## 🚀 Mejoras Futuras

- [ ] Integración de cuotas en tiempo real con APIs de apuestas
- [ ] Seguimiento de puntuaciones en vivo
- [ ] Notificaciones de alertas automatizadas
- [ ] Entrenamiento de modelos de aprendizaje automático
- [ ] Soporte para múltiples ligas
- [ ] Análisis a nivel de jugador
- [ ] Base de datos histórica
- [ ] Versión de aplicación móvil
- [ ] Soporte multiidioma
- [ ] Gráficos avanzados

## 📄 Licencia

Este proyecto se proporciona tal cual para propósitos educativos y analíticos. Úsalo bajo tu propio criterio.

## 🤝 Soporte

Para solicitudes de características o reportes de errores, documenta el problema con:
- Sección del dashboard afectada
- Comportamiento esperado vs actual
- Navegador y versión utilizada
- Pasos para reproducir

---

**Versión**: 4.0 (Dashboard Pro Oscuro)  
**Última Actualización**: 2024  
**Estado**: Desarrollo Activo  
**Compatibilidad**: Todos los navegadores modernos

---

## Referencia Rápida

| Característica | Propósito | Métrica Clave |
|---|---|---|
| Algoritmo ELO | Predicción base | Confianza % |
| Kelly Criterion | Dimensionamiento óptimo de apuesta | % del bankroll |
| Value Betting | Encuentra cuotas mal valoradas | EV % |
| Sugeridor de Parlays | Combinaciones de apuestas múltiples | Ratio Riesgo/Recompensa |
| Alertas | Detección de anomalías | Nivel de severidad |
| Análisis de Goles | Predicción Over/Under | Probabilidad % |
| Marginales | Perfil del partido | Tipología del equipo |
| Gestor de Bankroll | Control de riesgos | Límite de pérdida máxima |

---

## Glosario de Términos

- **Bankroll**: Capital total disponible para apostar
- **EV (Expected Value)**: Valor esperado a largo plazo de una apuesta
- **Kelly Criterion**: Fórmula para dimensionamiento óptimo de apuestas
- **Over/Under**: Apuestas sobre cantidad total de goles
- **Parlay**: Apuesta acumulada donde ganancias se reinvierten
- **Value**: Oportunidad de apuesta con EV positivo
- **Cuota**: Retorno potencial de una apuesta
- **Drawdown**: Pérdida máxima del bankroll desde un máximo
- **ROI**: Retorno sobre la inversión
- **Sharpe Ratio**: Métrica de riesgo-rendimiento

---

**¡Feliz análisis! Apuesta responsablemente. 🎯**
