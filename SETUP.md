# 🚀 Guía de Configuración - Promiedos Dashboard Pro

## Instalación y Configuración

### Opción 1: Uso Local (Sin servidor)

1. **Abre el archivo directamente en tu navegador:**
   ```bash
   # Navega al directorio del proyecto
   cd promiedos-dashboard

   # Abre index.html en tu navegador
   # En Linux/Mac:
   open index.html
   # En Windows:
   start index.html
   ```

2. **El dashboard funcionará inmediatamente con:**
   - ✅ Datos simulados realistas
   - ✅ Todas las funcionalidades de análisis
   - ✅ Algoritmos ELO y MINIMAX
   - ✅ Calculadora de Kelly Criterion
   - ✅ Value Betting y análisis completo

### Opción 2: Servidor Local (Recomendado)

Para aprovechar al máximo las actualizaciones en tiempo real y evitar problemas de CORS:

#### Usando Python:
```bash
# Python 3
python -m http.server 8000

# Python 2
python -m SimpleHTTPServer 8000
```

#### Usando Node.js:
```bash
# Instalar http-server globalmente
npm install -g http-server

# Ejecutar servidor
http-server -p 8000
```

#### Usando PHP:
```bash
php -S localhost:8000
```

Luego abre tu navegador en: **http://localhost:8000**

## Configuración de API en Tiempo Real

### TheSportsDB (Gratuita - Ya Configurada)

El dashboard viene preconfigurado con TheSportsDB, que proporciona:
- ✅ Clasificaciones de ligas
- ✅ Próximos partidos
- ✅ Información de equipos
- ✅ Sin necesidad de registro

**No requiere configuración adicional.**

### API-Football (Datos Premium - Opcional)

Para datos más completos y actualizados:

1. **Regístrate en API-Football:**
   - Visita: https://www.api-football.com/
   - Crea una cuenta gratuita (incluye 100 llamadas/día)

2. **Obtén tu API Key:**
   - Ve a tu dashboard
   - Copia tu API Key

3. **Configura tu API Key:**
   Edita el archivo `js/config.js`:
   ```javascript
   API_FOOTBALL: {
       API_KEY: 'TU_API_KEY_AQUI', // Pega tu API key aquí
       BASE_URL: 'https://v3.football.api-sports.io',
       // ...
   }
   ```

4. **Reinicia el dashboard**

## Configuración Personalizada

### Cambiar Bankroll Predeterminado

Edita `js/config.js`:
```javascript
BETTING: {
    DEFAULT_BANKROLL: 1000,  // Cambia esto a tu bankroll
    // ...
}
```

### Modificar Intervalos de Actualización

```javascript
UPDATE_INTERVALS: {
    LIVE_SCORES: 30000,      // 30 segundos
    STANDINGS: 300000,        // 5 minutos
    FIXTURES: 600000,         // 10 minutos
    PREDICTIONS: 900000       // 15 minutos
}
```

### Cambiar Liga Predeterminada

```javascript
// IDs de ligas disponibles en TheSportsDB
DEFAULT_LEAGUES: {
    PREMIER_LEAGUE: '4328',    // Premier League
    LA_LIGA: '4335',           // La Liga
    BUNDESLIGA: '4331',        // Bundesliga
    SERIE_A: '4332',           // Serie A
    LIGUE_1: '4334',           // Ligue 1
    CHAMPIONS_LEAGUE: '4480'   // Champions League
}
```

## Características y Uso

### 1. Selección de Equipos
- Usa los desplegables en la parte superior para seleccionar equipos
- El análisis se actualiza automáticamente al seleccionar ambos equipos

### 2. Actualización Automática
- Activa "Actualización automática" en la barra lateral
- Los datos se actualizarán periódicamente según los intervalos configurados

### 3. Navegación por Pestañas
- **Dashboard:** Vista general y clasificación
- **Predicción:** Algoritmos ELO y MINIMAX
- **Tendencias:** Forma y estadísticas
- **Recomendaciones:** Mejores apuestas
- **Value Betting:** Oportunidades de valor
- **Análisis de Goles:** Over/Under 2.5, BTTS
- **Marginales:** Análisis detallado del partido
- **Parlays:** Apuestas combinadas sugeridas
- **Dashboard de Riesgo:** Kelly Criterion
- **Alertas:** Anomalías y advertencias
- **Próximos Partidos:** Calendario de fixtures
- **Ayuda:** Documentación completa

### 4. Exportar Datos
- Haz clic en "Descargar CSV" para exportar la clasificación actual

## Solución de Problemas

### El dashboard no carga datos

**Problema:** Error de CORS al cargar datos de API

**Solución:**
1. Usa un servidor local (ver Opción 2 arriba)
2. O abre el navegador con CORS deshabilitado (solo para desarrollo):
   ```bash
   # Chrome (solo para desarrollo)
   google-chrome --disable-web-security --user-data-dir=/tmp/chrome
   ```

### Los datos no se actualizan

**Problema:** Actualización automática no funciona

**Solución:**
1. Verifica que "Actualización automática" esté activada
2. Abre la consola del navegador (F12) para ver errores
3. Verifica tu conexión a internet
4. Comprueba que no haya bloqueadores de anuncios interfiriendo

### Las predicciones parecen incorrectas

**Problema:** Resultados inesperados

**Solución:**
1. Recuerda que son probabilidades, no certezas
2. Los datos simulados son para demostración
3. Para datos reales, configura API-Football
4. Verifica las alertas por anomalías

## Estructura del Proyecto

```
promiedos-dashboard/
├── index.html              # Archivo principal
├── css/
│   └── styles.css          # Estilos del dashboard
├── js/
│   ├── config.js           # Configuración
│   ├── api-service.js      # Servicio de API
│   ├── algorithms.js       # Algoritmos predictivos
│   └── app.js              # Lógica principal
├── assets/                 # Recursos (imágenes, etc.)
├── README.md               # Documentación principal
└── SETUP.md                # Esta guía

```

## Mejores Prácticas

### Para Análisis
1. ✅ Compara siempre ambos algoritmos (ELO y MINIMAX)
2. ✅ Revisa las alertas antes de realizar apuestas
3. ✅ Usa el análisis de tendencias para contexto
4. ✅ Verifica la confianza de las predicciones

### Para Apuestas
1. ✅ Usa Kelly Criterion para dimensionamiento
2. ✅ Prefiere 1/2 Kelly o 1/4 Kelly para ser conservador
3. ✅ Solo apuesta con valor esperado positivo
4. ✅ Nunca apuestes más del 5% del bankroll en una sola apuesta

### Para Gestión de Riesgo
1. ✅ Define un bankroll dedicado
2. ✅ Lleva registro de tus apuestas
3. ✅ Revisa el ROI y Sharpe Ratio regularmente
4. ✅ Ajusta la estrategia según resultados

## Seguridad y Privacidad

- ✅ Todo el procesamiento es local en tu navegador
- ✅ No se envían datos a servidores externos (excepto APIs configuradas)
- ✅ Sin cookies de rastreo
- ✅ Sin almacenamiento de información personal

## Próximas Funcionalidades

Las siguientes características están en desarrollo:

- [ ] Integración con más APIs de cuotas
- [ ] Machine Learning para predicciones mejoradas
- [ ] Soporte para múltiples ligas simultáneas
- [ ] Análisis de jugadores individuales
- [ ] Notificaciones push de alertas
- [ ] Modo offline completo
- [ ] Exportación de reportes PDF
- [ ] Aplicación móvil

## Soporte

Si encuentras problemas:

1. Revisa la consola del navegador (F12 → Console)
2. Verifica que estés usando un navegador moderno
3. Asegúrate de tener JavaScript habilitado
4. Consulta la pestaña "Ayuda" dentro del dashboard

## Licencia

Este proyecto es de código abierto para propósitos educativos y analíticos.

**Descargo de responsabilidad:** Este dashboard es una herramienta educativa. Las apuestas deportivas conllevan riesgos financieros. Apuesta de manera responsable.

---

**Versión:** 1.0.0
**Última actualización:** 2025
**Compatibilidad:** Chrome 90+, Firefox 88+, Safari 14+, Edge 90+
